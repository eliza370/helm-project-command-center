export function FieldError({
  errors,
  id,
}: {
  errors?: string[];
  id: string;
}) {
  if (!errors?.length) return null;

  return (
    <p id={id} className="text-sm text-rose-700">
      {errors[0]}
    </p>
  );
}
