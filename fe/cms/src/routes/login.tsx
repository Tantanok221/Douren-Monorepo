import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LoginForm } from "@/components/login-form.tsx";
import { useAuthContext } from "@/components/AuthContext/useAuthContext.ts";

export const Route = createFileRoute('/login')({
  component: () => <Page/>,
})

function Page() {
  const authClient = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    const result = await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/", // Redirect to home after login
      },
      {
        onRequest: () => {
          console.log("Login request started...");
        },
        onSuccess: (ctx) => {
          console.log("Login successful:", ctx.data);
          navigate({ to: "/" });
        },
        onError: (ctx) => {
          console.error("Login failed:", ctx.error);
          throw new Error(ctx.error.message || "Login failed");
        },
      }
    );
  };

  return (
    <div className="flex w-full justify-center p-3 md:p-6">
      <div className="w-full max-w-[80%] ">
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  )
}
