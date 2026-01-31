import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginFormProps = {
  className?: string;
  onSubmit?: (data: LoginFormData) => void | Promise<void>;
};

export function LoginForm({ className, onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();
  const [error, setError] = useState<string | null>(null);

  const onSubmitHandler = async (data: LoginFormData) => {
    setError(null);
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">登入</CardTitle>
          <CardDescription>請輸入您的電子郵件以登入帳戶</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  disabled={isSubmitting}
                  {...register("email", {
                    required: "請輸入電子郵件",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "電子郵件格式不正確",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">密碼</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    忘記密碼？
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  disabled={isSubmitting}
                  {...register("password", {
                    required: "請輸入密碼",
                    minLength: {
                      value: 8,
                      message: "密碼長度至少需要 8 個字元",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "登入中..." : "登入"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              還沒有帳戶？{" "}
              <Link to="/register" className="underline underline-offset-4">
                註冊
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
