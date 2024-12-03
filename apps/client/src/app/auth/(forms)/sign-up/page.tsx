import { SignUpForm } from "@/components/forms/auth/sign-up-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <p className="text-3xl md:text-4xl font-bold">Sign Up</p>

        <div className="flex flex-col gap-0.5 text-sm md:text-base text-muted-foreground">
          <p>Log in to stay on top of your averages and reach your goals.</p>

          <Link href="/auth/sign-in" className="underline">
            I already have an account
          </Link>
        </div>
      </div>

      {/* Form */}
      <SignUpForm />
    </div>
  );
}
