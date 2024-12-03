import { Benefits } from "@/components/landing/benefits";
import { CTA } from "@/components/landing/cta";
import { Headline } from "@/components/landing/headline";
import { Product } from "@/components/landing/product";
import { SocialProof } from "@/components/landing/social-proof";

export default function LandingPage() {
  return (
    <div>
      {/* Headline */}
      {/* CTA */}
      <Headline />

      {/* Social Proof */}
      <SocialProof />

      {/* Problems & Solutions */}
      <Benefits />

      {/* Features */}
      <Product />

      {/* Demo */}

      {/* CTA */}
      <CTA />
    </div>
  );
}
