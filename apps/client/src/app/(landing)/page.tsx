import { Benefits } from "@/components/landing/benefits";
import { CTA } from "@/components/landing/cta";
import { FAQ } from "@/components/landing/faq";
import { Headline } from "@/components/landing/headline";
import { Picture } from "@/components/landing/picture";
import { Product } from "@/components/landing/product";

export default function LandingPage() {
  return (
    <div>
      {/* Headline */}
      {/* CTA */}
      <Headline />

      <Picture />

      {/* Social Proof */}
      {/* <SocialProof /> */}

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
