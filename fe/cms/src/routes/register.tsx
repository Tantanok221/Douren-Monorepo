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
    // First, register the user
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.email, // Use email as name by default
      },
      {
        onRequest: () => {
          console.log("Registration request started...");
        },
        onSuccess: async (ctx) => {
          console.log("Registration successful:", ctx.data);

          // Auto-login after successful registration
          await authClient.signIn.email(
            {
              email: data.email,
              password: data.password,
              callbackURL: "/",
            },
            {
              onRequest: () => {
                console.log("Auto-login started...");
              },
              onSuccess: (loginCtx) => {
                console.log("Auto-login successful:", loginCtx.data);
                navigate({ to: "/" });
              },
              onError: (loginCtx) => {
                console.error("Auto-login failed:", loginCtx.error);
                // If auto-login fails, redirect to login page
                navigate({ to: "/login" });
              },
            },
          );
        },
        onError: (ctx) => {
          console.error("Registration failed:", ctx.error);
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
