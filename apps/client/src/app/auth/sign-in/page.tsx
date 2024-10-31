import { SignInForm } from "@/components/forms/auth/sign-in-form";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <p className="text-3xl md:text-4xl font-bold">Sign In</p>

        <p className="text-sm md:text-base text-muted-foreground">
          Log in to stay on top of your averages and reach your goals.{" "}
          <Link href="/auth/sign-up" className="underline">
            I don&apos;t have an account
          </Link>
        </p>
      </div>

      {/* Form */}
      <SignInForm />
    </div>
  );
};

export default SignInPage;
