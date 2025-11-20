"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import type { AuthErrorResponse } from "@/types/auth";

const ROLE_REDIRECTS: Record<string, string> = {
  student: "/students",
  teacher: "/teachers",
  admin: "/admin",
};

const getErrorMessage = (error: AuthErrorResponse | null): string | null => {
  if (!error) {
    return null;
  }

  if ("errors" in error) {
    return Object.values(error.errors).flat().join(" ");
  }

  if ("error" in error) {
    return error.error;
  }

  return "An error has occurred. Please try again.";
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login, loading, error, clearError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const apiError = useMemo(() => getErrorMessage(error), [error]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

    try {
      const response = await login({ email, password });
      const normalizedRole = response.role?.toString().toLowerCase();
      const redirectPath =
        (normalizedRole && ROLE_REDIRECTS[normalizedRole]) || "/students";
      router.push(redirectPath);
    } catch {
      // error state has already been updated by useAuth
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>
            Enter your email and password to continue using the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {/* Removed Forget-password link as per instructions */}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
              </Field>
              {apiError && (
                <FieldDescription className="text-destructive">
                  {apiError}
                </FieldDescription>
              )}
              <Field className="space-y-2">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  Sign in with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup">Sign up now</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
