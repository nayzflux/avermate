import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LandingSection } from "./landing-section";

const questions = [
  {
    q: "Comment mes données sont elles stockées ?",
    a: "Vos données sont stockées de façon sécurisée dans notre base de données.",
  },
  {
    q: "Qui d'autres peut voir mes notes ?",
    a: "Vous êtes le seul à avoir accès au vos notes.",
  },
  {
    q: "Pourquoi utilisé Avermate plutôt qu'Excel ?",
    a: "Contrairement à Excel, tout est déjà prêt : suivez vos moyennes automatiquement, visualisez vos progrès avec des graphiques clairs et gérez vos matières et coefficients facilement. Plus besoin de créer des formules ou des tableaux compliqués, on s'occupe de tout pour vous simplifier la vie !",
  },
  {
    q: "Combien coûte Avermate ?",
    a: "Notre service est entièrement gratuit. Profitez de toutes nos fonctionnalités sans aucun frais !",
  },
];

export const FAQ = () => {
  return (
    <LandingSection>
      <Accordion type="single" collapsible className="w-full">
        {questions.map(({ q, a }) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent>{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </LandingSection>
  );
};
