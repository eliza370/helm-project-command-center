"use client";

import { useActionState } from "react";

import { signInAction, type AuthActionState } from "@/features/auth/actions";
import { FieldError } from "@/features/auth/components/field-error";
import { FormMessage } from "@/features/auth/components/form-message";
import { SubmitButton } from "@/features/auth/components/submit-button";

const inputClassName =
  "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-300";

export function SignInForm({ next = "/projects" }: { next?: string }) {
  const initialState: AuthActionState = { status: "idle" };
  const [state, action] = useActionState(
    signInAction,
    initialState,
  );
  const emailErrors = state.fieldErrors?.email;
  const passwordErrors = state.fieldErrors?.password;

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />
      <FormMessage state={state} />

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-slate-800">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          defaultValue={state.values?.email}
          aria-invalid={Boolean(emailErrors)}
          aria-describedby={emailErrors ? "email-error" : undefined}
          className={inputClassName}
        />
        <FieldError id="email-error" errors={emailErrors} />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-800"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(passwordErrors)}
          aria-describedby={passwordErrors ? "password-error" : undefined}
          className={inputClassName}
        />
        <FieldError id="password-error" errors={passwordErrors} />
      </div>

      <SubmitButton idleLabel="Sign in" pendingLabel="Signing in…" />
    </form>
  );
}
