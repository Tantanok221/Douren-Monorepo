import { Axiom } from "@axiomhq/js";
import type { MiddlewareHandler } from "hono";
import type { HonoEnv } from "@/index";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEvent {
	timestamp: string;
	level: LogLevel;
	message: string;
	requestId?: string;
	method?: string;
	path?: string;
	status?: number;
	duration?: number;
	userId?: string;
	error?: { name: string; message: string; stack?: string };
	meta?: Record<string, unknown>;
}

// Console color codes for pretty local logging
const colors = {
	debug: "\x1b[90m", // gray
	info: "\x1b[36m", // cyan
	warn: "\x1b[33m", // yellow
	error: "\x1b[31m", // red
	reset: "\x1b[0m",
};

/**
 * Logger class for structured logging
 * Logs to Axiom in production, console in development
 */
export class Logger {
	private axiom: Axiom | null;
	private dataset: string;
	private requestId: string;
	private useConsole: boolean;

	constructor(
		axiom: Axiom | null,
		dataset: string,
		requestId?: string,
		useConsole = false,
	) {
		this.axiom = axiom;
		this.dataset = dataset;
		this.requestId = requestId ?? crypto.randomUUID();
		this.useConsole = useConsole;
	}

	private formatConsoleLog(event: LogEvent): string {
		const color = colors[event.level];
		const timestamp = new Date().toISOString().slice(11, 23); // HH:mm:ss.SSS
		const prefix = `${color}[${event.level.toUpperCase()}]${colors.reset}`;
		const reqId = event.requestId?.slice(0, 8) ?? "";

		let msg = `${timestamp} ${prefix} [${reqId}] ${event.message}`;

		if (event.method && event.path) {
			msg += ` ${event.method} ${event.path}`;
		}
		if (event.status !== undefined) {
			msg += ` → ${event.status}`;
		}
		if (event.duration !== undefined) {
			msg += ` (${event.duration}ms)`;
		}
		if (event.meta && Object.keys(event.meta).length > 0) {
			msg += ` ${JSON.stringify(event.meta)}`;
		}
		if (event.error) {
			msg += `\n  ${colors.error}${event.error.name}: ${event.error.message}${colors.reset}`;
			if (event.error.stack) {
				msg += `\n${event.error.stack}`;
			}
		}

		return msg;
	}

	private log(
		level: LogLevel,
		message: string,
		meta?: Record<string, unknown>,
	) {
		const event: LogEvent = {
			timestamp: new Date().toISOString(),
			level,
			message,
			requestId: this.requestId,
			meta,
		};

		if (this.useConsole) {
			console.log(this.formatConsoleLog(event));
		}

		if (this.axiom) {
			this.axiom.ingest(this.dataset, [event]);
		}
	}

	debug(message: string, meta?: Record<string, unknown>) {
		this.log("debug", message, meta);
	}

	info(message: string, meta?: Record<string, unknown>) {
		this.log("info", message, meta);
	}

	warn(message: string, meta?: Record<string, unknown>) {
		this.log("warn", message, meta);
	}

	error(message: string, error?: Error, meta?: Record<string, unknown>) {
		const event: LogEvent = {
			timestamp: new Date().toISOString(),
			level: "error",
			message,
			requestId: this.requestId,
			error: error
				? {
						name: error.name,
						message: error.message,
						stack: error.stack,
					}
				: undefined,
			meta,
		};

		if (this.useConsole) {
			console.error(this.formatConsoleLog(event));
		}

		if (this.axiom) {
			this.axiom.ingest(this.dataset, [event]);
		}
	}

	flush(): Promise<void> {
		if (this.axiom) {
			return this.axiom.flush();
		}
		return Promise.resolve();
	}
}

/**
 * Logger middleware for Hono
 * - In production (AXIOM_TOKEN set): logs to Axiom
 * - In development (no AXIOM_TOKEN): logs to console with colors
 */
export const axiomLogger = (): MiddlewareHandler<HonoEnv> => {
	return async (c, next) => {
		const start = Date.now();
		const requestId = crypto.randomUUID();

		// Check if Axiom is configured
		const hasAxiom = Boolean(c.env.AXIOM_TOKEN && c.env.AXIOM_DATASET);
		const axiom = hasAxiom ? new Axiom({ token: c.env.AXIOM_TOKEN }) : null;
		const dataset = c.env.AXIOM_DATASET ?? "logs";

		// Use console logging when Axiom is not configured (local dev)
		const useConsole = !hasAxiom;

		const logger = new Logger(axiom, dataset, requestId, useConsole);

		c.set("logger", logger);
		c.set("requestId", requestId);

		logger.info("Request started", {
			method: c.req.method,
			path: c.req.path,
			userAgent: c.req.header("user-agent"),
			ip: c.req.header("cf-connecting-ip"),
		});

		try {
			await next();
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error("Request failed", error, {
				method: c.req.method,
				path: c.req.path,
			});
			throw err;
		} finally {
			const duration = Date.now() - start;

			const event: LogEvent = {
				timestamp: new Date().toISOString(),
				level: c.res.status >= 400 ? "warn" : "info",
				message: "Request completed",
				requestId,
				method: c.req.method,
				path: c.req.path,
				status: c.res.status,
				duration,
				userId: c.get("user")?.id,
			};

			if (useConsole) {
				console.log(
					`${new Date().toISOString().slice(11, 23)} ${colors.info}[INFO]${colors.reset} [${requestId.slice(0, 8)}] Request completed ${c.req.method} ${c.req.path} → ${c.res.status} (${duration}ms)`,
				);
			}

			if (axiom) {
				axiom.ingest(dataset, [event]);
				c.executionCtx.waitUntil(axiom.flush());
			}
		}
	};
};
