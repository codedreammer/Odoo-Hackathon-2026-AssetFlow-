import { Container } from "@/components/layout";
import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <main className="bg-zinc-50 dark:bg-zinc-950">
      <Container size="full" className="flex min-h-screen items-center justify-center py-16">
        <LoginForm />
      </Container>
    </main>
  );
}
