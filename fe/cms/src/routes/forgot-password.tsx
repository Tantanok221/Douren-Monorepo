import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { useAuthContext } from "@/components/AuthContext/useAuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/forgot-password")({
  component: () => <Page />,
});

function Page() {
  const authClient = useAuthContext();
  const [sentEmail, setSentEmail] = useState<string | null>(null);

  const handleForgotPassword = async (data: { email: string }) => {
    await authClient.requestPasswordReset(
      {
        email: data.email,
        redirectTo: `${window.location.origin}/reset-password`,
      },
      {
        onSuccess: () => {
          setSentEmail(data.email);
        },
        onError: (ctx) => {
          console.error("Password reset request failed:", ctx.error);
          throw new Error(ctx.error.message || "請求失敗");
        },
      },
    );
  };

  if (sentEmail) {
    return (
      <div className="flex w-full justify-center p-3 md:p-6">
        <div className="w-full max-w-[80%]">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">請檢查您的電子郵件</CardTitle>
              <CardDescription>
                若此信箱存在，我們已寄出重設連結
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <p className="font-medium">重設連結已寄出！</p>
                <p className="mt-1">
                  我們已將重設連結寄送至{" "}
                  <span className="font-semibold">{sentEmail}</span>
                </p>
                <p className="mt-2">請檢查您的收件匣或垃圾郵件資料夾。</p>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                已經重設完成？{" "}
                <Link to="/login" className="underline underline-offset-4">
                  前往登入
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center p-3 md:p-6">
      <div className="w-full max-w-[80%]">
        <ForgotPasswordForm onSubmit={handleForgotPassword} />
      </div>
    </div>
  );
}
