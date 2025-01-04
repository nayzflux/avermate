import { SignInForm } from "@/components/forms/auth/sign-in-form";
import Link from "next/link";
import { useTranslations } from "next-intl";

const SignInPage = () => {
  const t = useTranslations("Auth.SignIn");

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <p className="text-3xl md:text-4xl font-bold">{t("signIn")}</p>

        <div className="flex flex-col gap-0.5 text-sm md:text-base text-muted-foreground">
          <p>{t("signInDescription")}</p>

          <Link href="/auth/sign-up" className="underline">
            {t("noAccount")}
          </Link>
        </div>
      </div>

      {/* Form */}
      <SignInForm />
    </div>
  );
};

export default SignInPage;
