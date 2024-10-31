import Link from "next/link";

export default function Consent() {
  return (
    <div className="flex items-center justify-center">
      <p className="text-center text-sm text-muted-foreground py-8 max-w-[400px]">
        By continuing, you agree to Avermate&apos;s{" "}
        <Link href="/legal/terms-of-service" className="underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy-policy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
