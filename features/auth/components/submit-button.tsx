"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
};

export function SubmitButton({ idleLabel, pendingLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="flex min-h-11 w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-wait disabled:bg-slate-500"
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
