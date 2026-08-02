export function getSafeDecisionError(error: { code?: string }) {
  if (error.code === "42501") return "You do not have permission to manage this decision.";
  if (error.code === "22023" || error.code === "23514") return "Review the decision details and try again.";
  return "The decision could not be saved. Try again.";
}
