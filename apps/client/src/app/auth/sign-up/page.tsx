import { SignUpForm } from "@/components/forms/auth/sign-up-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <p className="text-3xl md:text-4xl font-bold">Sign Up</p>

        <p className="text-sm md:text-base text-muted-foreground">
          Log in to stay on top of your averages and reach your goals.{" "}
          <Link href="/auth/sign-in" className="underline">
            I already have an account
          </Link>
        </p>
      </div>

      {/* Form */}
      <SignUpForm />
    </div>
  );
}
