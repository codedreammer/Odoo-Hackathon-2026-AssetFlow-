import { Container } from "@/components/layout";
import { SignupForm } from "@/features/auth";

export default function SignupPage() {
  return (
    <main className="bg-zinc-50 dark:bg-zinc-950">
      <Container size="full" className="flex min-h-screen items-center justify-center py-16">
        <SignupForm />
      </Container>
    </main>
  );
}
