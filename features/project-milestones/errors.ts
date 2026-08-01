export function getSafeMilestoneError(error: { code?: string }) {
  if (error.code === "23505") return "That milestone already exists.";
  return "We could not save this milestone. Refresh and try again.";
}
