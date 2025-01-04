import { ResetPasswordForm } from "@/components/forms/auth/reset-password-form";
import Link from "next/link";
import { useTranslations } from "next-intl";

const ResetPasswordPage = () => {
  const t = useTranslations("Auth.Reset");

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <p className="text-3xl md:text-4xl font-bold">{t("resetPassword")}</p>

        <div className="flex flex-col gap-0.5 text-sm md:text-base text-muted-foreground">
          <p>{t("resetPasswordDescription")}</p>

          <Link href="/auth/sign-in" className="underline">
            {t("signIn")}
          </Link>
        </div>
      </div>

      {/* Form */}
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
