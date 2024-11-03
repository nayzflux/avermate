export default function GradeBadge() {
  return (
    <span className="flex items-center justify-center text-center align-middle px-2 py-0.5 border bg-muted font-semibold rounded-full text-sm">
      <p className="text-center align-middle">
        {(Math.random() * 20).toFixed(2)}
      </p>
    </span>
  );
}
