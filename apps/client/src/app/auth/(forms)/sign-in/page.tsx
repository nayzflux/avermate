import { SignInForm } from "@/components/forms/auth/sign-in-form";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <p className="text-3xl md:text-4xl font-bold">Sign In</p>

        <div className="flex flex-col gap-0.5 text-sm md:text-base text-muted-foreground">
          <p>Log in to stay on top of your averages and reach your goals.</p>

          <Link href="/auth/sign-up" className="underline">
            I don&apos;t have an account
          </Link>
        </div>
      </div>

      {/* Form */}
      <SignInForm />
    </div>
  );
};

export default SignInPage;
