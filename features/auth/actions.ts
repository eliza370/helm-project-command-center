"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSafeRedirectPath } from "@/features/auth/redirects";
import { signInSchema, signUpSchema } from "@/features/auth/schemas";
import { createClient } from "@/lib/supabase/server";

type FieldErrors = Record<string, string[] | undefined>;

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: FieldErrors;
  values?: {
    email?: string;
    fullName?: string;
  };
};

function stringValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function validationState(
  fieldErrors: FieldErrors,
  values: AuthActionState["values"],
): AuthActionState {
  return {
    status: "error",
    message: "Review the highlighted fields and try again.",
    fieldErrors,
    values,
  };
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = stringValue(formData, "email");
  const result = signInSchema.safeParse({
    email,
    password: stringValue(formData, "password"),
  });

  if (!result.success) {
    return validationState(result.error.flatten().fieldErrors, { email });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) {
    return {
      status: "error",
      message: "Email or password is incorrect.",
      values: { email: result.data.email },
    };
  }

  redirect(getSafeRedirectPath(stringValue(formData, "next")));
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = stringValue(formData, "email");
  const fullName = stringValue(formData, "fullName");
  const result = signUpSchema.safeParse({
    fullName,
    email,
    password: stringValue(formData, "password"),
    confirmPassword: stringValue(formData, "confirmPassword"),
  });

  if (!result.success) {
    return validationState(result.error.flatten().fieldErrors, {
      email,
      fullName,
    });
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? "http://127.0.0.1:3000";
  const confirmationUrl = new URL("/auth/confirm", origin);
  confirmationUrl.searchParams.set("next", "/projects");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: { full_name: result.data.fullName },
      emailRedirectTo: confirmationUrl.toString(),
    },
  });

  if (error) {
    return {
      status: "error",
      message: "We could not create your account. Check your details and try again.",
      values: { email: result.data.email, fullName: result.data.fullName },
    };
  }

  if (data.session) redirect("/projects");

  return {
    status: "success",
    message: "Check your email to confirm your account, then return to sign in.",
    values: { email: result.data.email, fullName: result.data.fullName },
  };
}
