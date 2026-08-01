"use client";

import { useActionState } from "react";

import { signUpAction, type AuthActionState } from "@/features/auth/actions";
import { FieldError } from "@/features/auth/components/field-error";
import { FormMessage } from "@/features/auth/components/form-message";
import { SubmitButton } from "@/features/auth/components/submit-button";

const inputClassName =
  "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-300";

export function SignUpForm() {
  const initialState: AuthActionState = { status: "idle" };
  const [state, action] = useActionState(
    signUpAction,
    initialState,
  );

  return (
    <form action={action} className="space-y-5" noValidate>
      <FormMessage state={state} />

      <div className="space-y-2">
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-slate-800"
        >
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          maxLength={200}
          defaultValue={state.values?.fullName}
          aria-invalid={Boolean(state.fieldErrors?.fullName)}
          aria-describedby={
            state.fieldErrors?.fullName ? "full-name-error" : undefined
          }
          className={inputClassName}
        />
        <FieldError id="full-name-error" errors={state.fieldErrors?.fullName} />
      </div>

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
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
          className={inputClassName}
        />
        <FieldError id="email-error" errors={state.fieldErrors?.email} />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="new-password"
          className="block text-sm font-medium text-slate-800"
        >
          Password
        </label>
        <input
          id="new-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={128}
          aria-invalid={Boolean(state.fieldErrors?.password)}
          aria-describedby={
            state.fieldErrors?.password ? "new-password-error" : "password-help"
          }
          className={inputClassName}
        />
        <p id="password-help" className="text-sm text-slate-600">
          Use at least 8 characters.
        </p>
        <FieldError
          id="new-password-error"
          errors={state.fieldErrors?.password}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-slate-800"
        >
          Confirm password
        </label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
          aria-describedby={
            state.fieldErrors?.confirmPassword
              ? "confirm-password-error"
              : undefined
          }
          className={inputClassName}
        />
        <FieldError
          id="confirm-password-error"
          errors={state.fieldErrors?.confirmPassword}
        />
      </div>

      <SubmitButton idleLabel="Create account" pendingLabel="Creating account…" />
    </form>
  );
}
