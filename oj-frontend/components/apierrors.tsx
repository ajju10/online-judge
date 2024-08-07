export default function ApiErrors({ error }: { readonly error: string }) {
  if (!error) return null;
  return <div className="text-md py-2 italic text-amber-400">{error}</div>;
}
