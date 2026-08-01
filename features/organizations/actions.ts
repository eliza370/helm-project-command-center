"use server";

import { redirect } from "next/navigation";

import { getSafeOnboardingError } from "@/features/organizations/errors";
import { getActiveOrganizationMembership } from "@/features/organizations/queries";
import { organizationOnboardingSchema } from "@/features/organizations/schemas";
import { createClient } from "@/lib/supabase/server";

type FieldErrors = Record<string, string[] | undefined>;

export type OrganizationOnboardingActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: FieldErrors;
  values?: {
    fullName?: string;
    organizationName?: string;
    description?: string;
  };
};

function stringValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function completeOrganizationOnboardingAction(
  _previousState: OrganizationOnboardingActionState,
  formData: FormData,
): Promise<OrganizationOnboardingActionState> {
  const values = {
    fullName: stringValue(formData, "fullName"),
    organizationName: stringValue(formData, "organizationName"),
    description: stringValue(formData, "description"),
  };
  const result = organizationOnboardingSchema.safeParse(values);

  if (!result.success) {
    return {
      status: "error",
      message: "Review the highlighted fields and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
      values,
    };
  }

  const supabase = await createClient();
  const { data, error: authenticationError } = await supabase.auth.getUser();

  if (authenticationError || !data.user) {
    return {
      status: "error",
      message: "Your session could not be verified. Sign in again and retry.",
      values: result.data,
    };
  }

  const membership = await getActiveOrganizationMembership(
    supabase,
    data.user.id,
  );

  if (membership.status === "found") redirect("/projects");
  if (membership.status === "error") {
    return {
      status: "error",
      message: "We could not verify your workspace access. Try again.",
      values: result.data,
    };
  }

  const { error } = await supabase.rpc("complete_onboarding", {
    p_full_name: result.data.fullName,
    p_organization_name: result.data.organizationName,
    p_description: result.data.description,
  });

  if (error) {
    return {
      status: "error",
      message: getSafeOnboardingError(error),
      values: result.data,
    };
  }

  redirect("/projects");
}
