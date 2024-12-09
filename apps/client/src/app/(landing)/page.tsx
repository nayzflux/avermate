import { Benefits } from "@/components/landing/benefits";
import { CTA } from "@/components/landing/cta";
import { FAQ } from "@/components/landing/faq";
import { Headline } from "@/components/landing/headline";
import { Product } from "@/components/landing/product";
import { SocialProof } from "@/components/landing/social-proof";
import { Picture } from "@/components/landing/picture";

export default function LandingPage() {
  return (
    <div>
      {/* Headline */}
      {/* CTA */}
      <Headline />

      <Picture/>

      {/* Social Proof */}
      <SocialProof />

      {/* Problems & Solutions */}
      <Benefits />

      {/* Features */}
      <Product />

      {/* Demo */}

      {/* CTA */}
      <CTA />

      {/* FAQ */}
      <FAQ />
    </div>
  );
}
