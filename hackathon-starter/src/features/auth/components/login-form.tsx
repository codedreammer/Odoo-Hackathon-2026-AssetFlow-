"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Spinner,
} from "@/components/ui";
import { loginAction } from "../actions/login";
import { loginSchema, type LoginFormValues } from "../schemas/login-schema";

interface FieldErrorProps {
  message?: string;
}

function FieldError({ message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-600 dark:text-red-400">{message}</p>;
}

export function LoginForm() {
  const router = useRouter();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmissionError(null);
    clearErrors();

    const result = await loginAction(values);

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [fieldName, messages] of Object.entries(
          result.fieldErrors,
        ) as Array<[keyof LoginFormValues, string[] | undefined]>) {
          const message = messages?.[0];

          if (!message) {
            continue;
          }

          setError(fieldName, {
            type: "server",
            message,
          });
        }
      }

      setSubmissionError(
        result.error?.message ?? "Unable to log you in right now. Please try again.",
      );
      return;
    }

    router.push(result.data?.redirectTo ?? "/dashboard");
    router.refresh();
  });

  return (
    <Card className="w-full max-w-[30rem]">
      <CardHeader className="space-y-2">
        <CardTitle>Welcome back to AssetFlow</CardTitle>
        <CardDescription>
          Log in to manage your assets, bookings, and allocation requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="w-full space-y-5" noValidate onSubmit={onSubmit}>
          {submissionError ? (
            <Alert variant="destructive">
              <AlertTitle>Login failed</AlertTitle>
              <AlertDescription>{submissionError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              aria-invalid={errors.email ? "true" : "false"}
              disabled={isSubmitting}
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={errors.password ? "true" : "false"}
              disabled={isSubmitting}
              {...register("password")}
            />
            <FieldError message={errors.password?.message} />
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner label="Logging in" size="sm" /> : null}
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <p>
          Need an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
