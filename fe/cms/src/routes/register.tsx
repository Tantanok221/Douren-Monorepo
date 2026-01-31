import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "@/components/register-form.tsx";
import { useAuthContext } from "@/components/AuthContext/useAuthContext.ts";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: () => <Page />,
});

function Page() {
  const authClient = useAuthContext();
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const handleRegister = async (data: {
    email: string;
    password: string;
    inviteCode: string;
  }) => {
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.email,
        inviteCode: data.inviteCode,
        callbackURL: window.location.origin,
      },
      {
        onSuccess: async () => {
          setRegisteredEmail(data.email);
        },
        onError: (ctx) => {
          const raw = ctx.error.message || "Registration failed";
          // better-auth may return generic English messages; map to our desired UX
          if (/user already exists/i.test(raw)) {
            throw new Error("使用者已存在");
          }
          throw new Error(raw);
        },
      },
    );
  };

  if (registeredEmail) {
    return (
      <div className="flex w-full justify-center p-3 md:p-6">
        <div className="w-full max-w-[80%]">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">驗證您的電子郵件</CardTitle>
              <CardDescription>我們已經發送驗證郵件到您的信箱</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <p className="font-medium">驗證郵件已發送！</p>
                <p className="mt-1">
                  我們已經發送驗證連結到{" "}
                  <span className="font-semibold">{registeredEmail}</span>
                </p>
                <p className="mt-2">
                  請檢查您的收件匣並點擊驗證連結以完成註冊。
                </p>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                已經驗證了？{" "}
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
      <div className="w-full max-w-[80%] ">
        <RegisterForm onSubmit={handleRegister} />
      </div>
    </div>
  );
}
