import { Resend } from "resend";
import type { ENV_BINDING } from "@pkg/env/constant";

export interface EmailOptions {
	to: string;
	subject: string;
	html: string;
}

const getEnvPrefix = (devEnv: string | undefined): string => {
	if (!devEnv || devEnv === "production") return "";
	if (devEnv === "staging") return "[測試環境] ";
	if (devEnv === "dev") return "[開發環境] ";
	return `[${devEnv}] `;
};

export const createEmailService = (env: ENV_BINDING) => {
	const resend = new Resend(env.RESEND_API_KEY);
	const fromEmail = env.RESEND_FROM_EMAIL;
	const envPrefix = getEnvPrefix(env.DEV_ENV);

	return {
		async sendVerificationEmail(to: string, verificationUrl: string) {
			const { error } = await resend.emails.send({
				from: fromEmail,
				to,
				subject: `${envPrefix}請驗證您的電子郵件地址`,
				html: `
					<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
						<h1 style="color: #333;">驗證您的電子郵件</h1>
						<p>請點擊下方按鈕來驗證您的電子郵件地址：</p>
						<a href="${verificationUrl}"
							style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
							驗證電子郵件
						</a>
						<p style="color: #666; font-size: 14px;">
							如果您沒有建立帳號，可以安全地忽略此郵件。
						</p>
						<p style="color: #666; font-size: 14px;">
							或複製並貼上此連結：${verificationUrl}
						</p>
					</div>
				`,
			});

			if (error) {
				console.error("Failed to send verification email:", error);
				throw new Error(`Failed to send verification email: ${error.message}`);
			}
		},

		async sendPasswordResetEmail(to: string, resetUrl: string) {
			const { error } = await resend.emails.send({
				from: fromEmail,
				to,
				subject: `${envPrefix}重設您的密碼`,
				html: `
					<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
						<h1 style="color: #333;">重設您的密碼</h1>
						<p>您已要求重設密碼。請點擊下方按鈕繼續：</p>
						<a href="${resetUrl}"
							style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
							重設密碼
						</a>
						<p style="color: #666; font-size: 14px;">
							如果您沒有要求重設密碼，可以安全地忽略此郵件。
						</p>
						<p style="color: #666; font-size: 14px;">
							或複製並貼上此連結：${resetUrl}
						</p>
					</div>
				`,
			});

			if (error) {
				console.error("Failed to send password reset email:", error);
				throw new Error(
					`Failed to send password reset email: ${error.message}`,
				);
			}
		},
	};
};

export type EmailService = ReturnType<typeof createEmailService>;
