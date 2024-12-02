import { ResetPasswordForm } from "@/components/forms/auth/reset-password-form";
import Link from "next/link";

const ResetPasswordPage = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <p className="text-3xl md:text-4xl font-bold">Reset Password</p>

        <div className="flex flex-col gap-0.5 text-sm md:text-base text-muted-foreground">
          <p>
            Réinitialisez votre mot de passe en saisissant votre nouveau mot de
            passe.
          </p>

          <Link href="/auth/sign-in" className="underline">
            Log In
          </Link>
        </div>
      </div>

      {/* Form */}
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
