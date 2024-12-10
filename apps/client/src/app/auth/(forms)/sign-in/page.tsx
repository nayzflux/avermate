import { SignInForm } from "@/components/forms/auth/sign-in-form";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <p className="text-3xl md:text-4xl font-bold">Se connecter</p>

        <div className="flex flex-col gap-0.5 text-sm md:text-base text-muted-foreground">
          <p>
            Connectez vous pour rester au top de vos moyennes et atteindre vos
            objectifs.
          </p>

          <Link href="/auth/sign-up" className="underline">
            Je n&apos;ai pas de compte
          </Link>
        </div>
      </div>

      {/* Form */}
      <SignInForm />
    </div>
  );
};

export default SignInPage;
