import { SignUpForm } from "@/components/forms/auth/sign-up-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <p className="text-3xl md:text-4xl font-bold">S'inscrire</p>

        <div className="flex flex-col gap-0.5 text-sm md:text-base text-muted-foreground">
          <p>
            Inscrivez pour rester au top de vos moyennes et atteindre vos
            objectifs.
          </p>

          <Link href="/auth/sign-in" className="underline">
            J'ai déjà un compte
          </Link>
        </div>
      </div>

      {/* Form */}
      <SignUpForm />
    </div>
  );
}
