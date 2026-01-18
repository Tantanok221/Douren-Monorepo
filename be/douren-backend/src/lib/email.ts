import { Resend } from "resend";
import type { ENV_BINDING } from "@pkg/env/constant";

export interface EmailOptions {
	to: string;
	subject: string;
	html: string;
}

export const createEmailService = (env: ENV_BINDING) => {
	const resend = new Resend(env.RESEND_API_KEY);
	const fromEmail = env.RESEND_FROM_EMAIL;

	return {
		async sendVerificationEmail(to: string, verificationUrl: string) {
			const { error } = await resend.emails.send({
				from: fromEmail,
				to,
				subject: "Verify your email address",
				html: `
					<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
						<h1 style="color: #333;">Verify your email</h1>
						<p>Please click the button below to verify your email address:</p>
						<a href="${verificationUrl}"
							style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
							Verify Email
						</a>
						<p style="color: #666; font-size: 14px;">
							If you didn't create an account, you can safely ignore this email.
						</p>
						<p style="color: #666; font-size: 14px;">
							Or copy and paste this link: ${verificationUrl}
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
				subject: "Reset your password",
				html: `
					<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
						<h1 style="color: #333;">Reset your password</h1>
						<p>You requested to reset your password. Click the button below to proceed:</p>
						<a href="${resetUrl}"
							style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
							Reset Password
						</a>
						<p style="color: #666; font-size: 14px;">
							If you didn't request a password reset, you can safely ignore this email.
						</p>
						<p style="color: #666; font-size: 14px;">
							Or copy and paste this link: ${resetUrl}
						</p>
					</div>
				`,
			});

			if (error) {
				console.error("Failed to send password reset email:", error);
				throw new Error(`Failed to send password reset email: ${error.message}`);
			}
		},
	};
};

export type EmailService = ReturnType<typeof createEmailService>;
