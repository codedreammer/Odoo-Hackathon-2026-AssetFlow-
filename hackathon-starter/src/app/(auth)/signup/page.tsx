import { Container } from "@/components/layout";
import { SignupForm } from "@/features/auth";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center bg-zinc-50 py-16 dark:bg-zinc-950">
      <Container size="sm" className="flex justify-center">
        <SignupForm />
      </Container>
    </main>
  );
}
