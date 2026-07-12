import { Container } from "@/components/layout";
import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center bg-zinc-50 py-16 dark:bg-zinc-950">
      <Container size="sm" className="flex justify-center">
        <LoginForm />
      </Container>
    </main>
  );
}
