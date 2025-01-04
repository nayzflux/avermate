import { ForgotPasswordForm } from "@/components/forms/auth/forgot-password-form";
import Link from "next/link";
import { useTranslations } from "next-intl";

const ForgotPasswordPage = () => {
  const t = useTranslations("Auth.Forgot");

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <p className="text-3xl md:text-4xl font-bold">{t("forgotPassword")}</p>

        <div className="flex flex-col gap-0.5 text-sm md:text-base text-muted-foreground">
          <p>{t("enterEmail")}</p>

          <Link href="/auth/sign-in" className="underline">
            {t("signIn")}
          </Link>
        </div>
      </div>

      {/* Form */}
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
