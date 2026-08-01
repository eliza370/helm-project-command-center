const fallbackRedirect = "/projects";

export function getSafeRedirectPath(
  candidate: string | null | undefined,
  fallback = fallbackRedirect,
) {
  if (
    !candidate ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(candidate)
  ) {
    return fallback;
  }

  try {
    const base = new URL("https://helm.local");
    const target = new URL(candidate, base);

    if (target.origin !== base.origin) return fallback;

    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return fallback;
  }
}
