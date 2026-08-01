export function getSafeProjectError(error: { code?: string | null }) {
  if (error.code === "42501") return "You do not have permission to create a project in this organization.";
  if (error.code === "23505") return "This project request has already been completed.";
  if (error.code === "22023" || error.code === "23514") return "Review the project details and try again.";
  return "We could not create the project. Your details are safe; try again.";
}
