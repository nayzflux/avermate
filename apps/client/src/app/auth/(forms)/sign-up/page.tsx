import { SignUpForm } from "@/components/forms/auth/sign-up-form";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function SignUpPage() {
  const t = useTranslations("Auth.SignUp");

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <p className="text-3xl md:text-4xl font-bold">{t("signUp")}</p>

        <div className="flex flex-col gap-0.5 text-sm md:text-base text-muted-foreground">
          <p>{t("signUpDescription")}</p>

          <Link href="/auth/sign-in" className="underline">
            {t("alreadyHaveAccount")}
          </Link>
        </div>
      </div>

      {/* Form */}
      <SignUpForm />
    </div>
  );
}
