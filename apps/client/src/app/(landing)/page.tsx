import { Benefits } from "@/components/landing/benefits";
import { CTA } from "@/components/landing/cta";
import { FAQ } from "@/components/landing/faq";
import { Headline } from "@/components/landing/headline";
import { Picture } from "@/components/landing/picture";
import { Product } from "@/components/landing/product";
import { SocialProof } from "@/components/landing/social-proof";

export default function LandingPage() {
  return (
    <main>
      <Headline />
      <Picture />
      <SocialProof />
      <Benefits />
      <Product />
      <CTA />
      <FAQ />
    </main>
  );
}
