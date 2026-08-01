"use client";

import { useActionState } from "react";

import {
  completeOrganizationOnboardingAction,
  type OrganizationOnboardingActionState,
} from "@/features/organizations/actions";
import { FieldError } from "@/features/auth/components/field-error";
import { SubmitButton } from "@/features/auth/components/submit-button";
import {
  FULL_NAME_MAX_LENGTH,
  ORGANIZATION_DESCRIPTION_MAX_LENGTH,
  ORGANIZATION_NAME_MAX_LENGTH,
} from "@/features/organizations/schemas";

const inputClassName =
  "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-300";

export function OrganizationOnboardingForm({
  defaultFullName,
}: {
  defaultFullName?: string;
}) {
  const initialState: OrganizationOnboardingActionState = {
    status: "idle",
    values: { fullName: defaultFullName },
  };
  const [state, action] = useActionState(
    completeOrganizationOnboardingAction,
    initialState,
  );

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.message ? (
        <p
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm leading-6 text-rose-900"
        >
          {state.message}
        </p>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="fullName" className="block text-sm font-medium text-slate-800">
          Full name <span className="text-rose-700" aria-hidden="true">*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          autoComplete="name"
          required
          maxLength={FULL_NAME_MAX_LENGTH}
          defaultValue={state.values?.fullName}
          aria-invalid={Boolean(state.fieldErrors?.fullName)}
          aria-describedby={state.fieldErrors?.fullName ? "full-name-error" : undefined}
          className={inputClassName}
        />
        <FieldError id="full-name-error" errors={state.fieldErrors?.fullName} />
      </div>

      <div className="space-y-2">
        <label htmlFor="organizationName" className="block text-sm font-medium text-slate-800">
          Organization name <span className="text-rose-700" aria-hidden="true">*</span>
        </label>
        <input
          id="organizationName"
          name="organizationName"
          autoComplete="organization"
          required
          maxLength={ORGANIZATION_NAME_MAX_LENGTH}
          defaultValue={state.values?.organizationName}
          aria-invalid={Boolean(state.fieldErrors?.organizationName)}
          aria-describedby={state.fieldErrors?.organizationName ? "organization-name-error" : undefined}
          className={inputClassName}
        />
        <FieldError id="organization-name-error" errors={state.fieldErrors?.organizationName} />
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="description" className="block text-sm font-medium text-slate-800">
            Organization description
          </label>
          <span className="text-xs text-slate-500">Optional</span>
        </div>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={ORGANIZATION_DESCRIPTION_MAX_LENGTH}
          defaultValue={state.values?.description}
          aria-invalid={Boolean(state.fieldErrors?.description)}
          aria-describedby={state.fieldErrors?.description ? "description-error" : "description-help"}
          className={`${inputClassName} resize-y`}
        />
        <p id="description-help" className="text-sm text-slate-600">
          Briefly describe the workspace this organization will use.
        </p>
        <FieldError id="description-error" errors={state.fieldErrors?.description} />
      </div>

      <p className="text-xs leading-5 text-slate-500">Fields marked * are required.</p>
      <SubmitButton idleLabel="Create workspace" pendingLabel="Creating workspace…" />
    </form>
  );
}
