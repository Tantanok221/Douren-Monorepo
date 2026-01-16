import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RegisterForm } from "@/components/register-form.tsx";
import { useAuthContext } from "@/components/AuthContext/useAuthContext.ts";

export const Route = createFileRoute("/register")({
  component: () => <Page />,
});

function Page() {
  const authClient = useAuthContext();
  const navigate = useNavigate();

  const handleRegister = async (data: { email: string; password: string }) => {
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.email,
      },
      {
        onSuccess: async (_ctx) => {
          await authClient.signIn.email(
            {
              email: data.email,
              password: data.password,
              callbackURL: "/",
            },
            {
              onSuccess: (_loginCtx) => {
                navigate({ to: "/" });
              },
              onError: (_loginCtx) => {
                navigate({ to: "/login" });
              },
            },
          );
        },
        onError: (ctx) => {
          throw new Error(ctx.error.message || "Registration failed");
        },
      },
    );
  };

  return (
    <div className="flex w-full justify-center p-3 md:p-6">
      <div className="w-full max-w-[80%] ">
        <RegisterForm onSubmit={handleRegister} />
      </div>
    </div>
  );
}
