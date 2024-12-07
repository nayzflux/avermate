import { ForgotPasswordForm } from "@/components/forms/auth/forgot-password-form";
import Link from "next/link";

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <p className="text-3xl md:text-4xl font-bold">Mot de passe oublié</p>

        <div className="flex flex-col gap-0.5 text-sm md:text-base text-muted-foreground">
          <p>
            Saisissez votre e-mail pour recevoir un lien de réinitialisation.
          </p>

          <Link href="/auth/sign-in" className="underline">
            Se connecter
          </Link>
        </div>
      </div>

      {/* Form */}
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
