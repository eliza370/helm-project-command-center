import type { AuthActionState } from "@/features/auth/actions";

export function FormMessage({ state }: { state: AuthActionState }) {
  if (!state.message) return null;

  return (
    <p
      role={state.status === "error" ? "alert" : "status"}
      className={`rounded-lg border px-3 py-2.5 text-sm leading-6 ${
        state.status === "error"
          ? "border-rose-200 bg-rose-50 text-rose-900"
          : "border-emerald-200 bg-emerald-50 text-emerald-900"
      }`}
    >
      {state.message}
    </p>
  );
}
