type DatabaseError = { code?: string | null };

export function getSafeOnboardingError(error: DatabaseError) {
  if (error.code === "23505") {
    return "Your workspace has already been created. Refresh to continue to projects.";
  }

  if (error.code === "42501") {
    return "Your session could not be verified. Sign in again and retry.";
  }

  return "We could not create your workspace. Your details are safe; try again.";
}
