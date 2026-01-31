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

type ForgotPasswordFormData = {
  email: string;
};

type ForgotPasswordFormProps = {
  className?: string;
  onSubmit?: (data: ForgotPasswordFormData) => void | Promise<void>;
};

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function ForgotPasswordForm({
  className,
  onSubmit,
}: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>();
  const [error, setError] = useState<string | null>(null);

  const onSubmitHandler = async (data: ForgotPasswordFormData) => {
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
          <CardTitle className="text-2xl">忘記密碼</CardTitle>
          <CardDescription>輸入電子郵件以取得重設密碼連結</CardDescription>
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
                      value: EMAIL_REGEX,
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
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "寄送中..." : "寄送重設連結"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              已經想起密碼？{" "}
              <Link to="/login" className="underline underline-offset-4">
                返回登入
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
