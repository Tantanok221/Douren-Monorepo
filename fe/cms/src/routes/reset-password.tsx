import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ResetPasswordForm } from "@/components/reset-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/reset-password")({
  component: () => <Page />,
});

function Page() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { search } = useLocation();

  const { token, error, apiBase } = useMemo(() => {
    const params = new URLSearchParams(search);
    return {
      token: params.get("token"),
      error: params.get("error"),
      apiBase: params.get("apiBase"),
    };
  }, [search]);

  useEffect(() => {
    setIsSuccess(false);
  }, [token, error]);

  const handleResetPassword = async (data: { password: string }) => {
    if (!token) {
      throw new Error("連結已失效或不存在");
    }
    const resolvedBaseUrl = resolveAuthBaseUrl(apiBase);
    const response = await fetch(
      `${resolvedBaseUrl}/reset-password?token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ newPassword: data.password, token }),
      },
    );

    if (!response.ok) {
      const payload = await response
        .json()
        .catch(() => ({ message: "重設失敗" }));
      console.error("Password reset failed:", payload);
      throw new Error(payload.message || "重設失敗");
    }

    setIsSuccess(true);
  };

  if (error || !token) {
    return (
      <div className="flex w-full justify-center p-3 md:p-6">
        <div className="w-full max-w-[80%]">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">連結已失效</CardTitle>
              <CardDescription>
                連結已失效或不存在，請重新申請重設
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="text-center text-sm text-muted-foreground">
                <Link
                  to="/forgot-password"
                  className="underline underline-offset-4"
                >
                  重新申請重設密碼
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex w-full justify-center p-3 md:p-6">
        <div className="w-full max-w-[80%]">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">密碼已更新</CardTitle>
              <CardDescription>您的密碼已成功重設</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="text-center text-sm text-muted-foreground">
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
        <ResetPasswordForm
          onSubmit={async (data) =>
            handleResetPassword({ password: data.password })
          }
        />
      </div>
    </div>
  );
}

const resolveAuthBaseUrl = (apiBase: string | null): string => {
  if (apiBase) return apiBase.replace(/\/+$/, "");
  const fallbackBaseUrl =
    import.meta.env.VITE_API_URL || "http://localhost:2000";
  try {
    const parsed = new URL(fallbackBaseUrl);
    if (parsed.pathname && parsed.pathname !== "/") {
      return fallbackBaseUrl.replace(/\/+$/, "");
    }
  } catch {
    return "http://localhost:2000/api/auth";
  }
  return `${fallbackBaseUrl.replace(/\/+$/, "")}/api/auth`;
};
