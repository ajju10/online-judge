export default function ZodErrors({ error }: { readonly error: string[] }) {
  if (!error) return null;
  return error.map((err, index) => (
    <div key={index} className="mt-1 py-2 text-xs italic text-amber-400">
      {err}
    </div>
  ));
}
