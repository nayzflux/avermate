import Link from "next/link";

export default function Consent() {
  return (
    <div className="flex items-center justify-center">
      <p className="text-center text-sm text-muted-foreground py-8 max-w-[400px]">
      En continuant, vous acceptez les{" "}
      <Link href="/legal/terms-of-service" className="underline">
        Conditions d'utilisation
      </Link>{" "}
      d'Avermate et la{" "}
      <Link href="/legal/privacy-policy" className="underline">
        Politique de confidentialité
      </Link>
      .
      </p>
    </div>
  );
}
