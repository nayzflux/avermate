import Link from "next/link";

export default function Logo() {
  return (
    <Link className="flex gap-4 items-center " href={"/"}>
      <img className="size-8 rounded-lg" src="/logo.svg" alt="Logo" />
      Avermate
    </Link>
  );
}
