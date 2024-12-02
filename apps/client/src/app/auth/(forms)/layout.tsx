import SocialAuth from "@/components/buttons/auth/social-auth";
import Consent from "@/components/paragraphs/auth/consent";
import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";

const FormLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}

      <div className="grid grid-cols-3 items-center gap-4">
        <Separator className="col-span-1" />

        <p className="text-center text-sm text-muted-foreground">
          Or continue with
        </p>

        <Separator className="col-span-1" />
      </div>

      {/* Social Auth */}
      <SocialAuth />

      {/* Consent */}
      <Consent />
    </>
  );
};

export default FormLayout;
