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
import { signUpAction } from "../actions/signup";
import { signupSchema, type SignupFormValues } from "../schemas/signup-schema";

interface FieldErrorProps {
  message?: string;
}

function FieldError({ message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-600 dark:text-red-400">{message}</p>;
}

export function SignupForm() {
  const router = useRouter();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmissionError(null);
    clearErrors();

    const result = await signUpAction(values);

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [fieldName, messages] of Object.entries(
          result.fieldErrors,
        ) as Array<[keyof SignupFormValues, string[] | undefined]>) {
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
        result.error?.message ?? "Unable to create your account. Please try again.",
      );
      return;
    }

    router.push(result.data?.redirectTo ?? "/login");
    router.refresh();
  });

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-2">
        <CardTitle>Create your AssetFlow account</CardTitle>
        <CardDescription>
          Sign up as an employee to request, book, and manage assigned assets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" noValidate onSubmit={onSubmit}>
          {submissionError ? (
            <Alert variant="destructive">
              <AlertTitle>Signup failed</AlertTitle>
              <AlertDescription>{submissionError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <Input
              id="fullName"
              autoComplete="name"
              placeholder="Enter your full name"
              aria-invalid={errors.fullName ? "true" : "false"}
              disabled={isSubmitting}
              {...register("fullName")}
            />
            <FieldError message={errors.fullName?.message} />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
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
              className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              aria-invalid={errors.password ? "true" : "false"}
              disabled={isSubmitting}
              {...register("password")}
            />
            <FieldError message={errors.password?.message} />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              disabled={isSubmitting}
              {...register("confirmPassword")}
            />
            <FieldError message={errors.confirmPassword?.message} />
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner label="Creating account" size="sm" /> : null}
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
          >
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
