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

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

type ResetPasswordFormProps = {
  className?: string;
  onSubmit?: (data: ResetPasswordFormData) => void | Promise<void>;
};

export function ResetPasswordForm({
  className,
  onSubmit,
}: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>();
  const [error, setError] = useState<string | null>(null);

  const onSubmitHandler = async (data: ResetPasswordFormData) => {
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
          <CardTitle className="text-2xl">重設密碼</CardTitle>
          <CardDescription>請輸入新的密碼</CardDescription>
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
                <Label htmlFor="password">新密碼</Label>
                <Input
                  id="password"
                  type="password"
                  disabled={isSubmitting}
                  {...register("password", {
                    required: "請輸入新密碼",
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
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">確認新密碼</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  disabled={isSubmitting}
                  {...register("confirmPassword", {
                    required: "請再次輸入新密碼",
                    validate: (value) =>
                      value === watch("password") || "兩次密碼輸入不一致",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "重設中..." : "重設密碼"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
