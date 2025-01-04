import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Consent() {
  const t = useTranslations("Auth");

  return (
    <div className="flex items-center justify-center">
      <p className="text-center text-sm text-muted-foreground py-8 max-w-[400px]">
        {t("consentText")}{" "}
        <Link href="/legal/terms-of-service" className="underline">
          {t("termsOfService")}
        </Link>{" "}
        {t("and")}{" "}
        <Link href="/legal/privacy-policy" className="underline">
          {t("privacyPolicy")}
        </Link>
        .
      </p>
    </div>
  );
}
