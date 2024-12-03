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
    a: "",
  },
  {
    q: "Qui d'autres peut voir mes notes ?",
    a: "",
  },
  {
    q: "Pourquoi utilisé Avermate plutôt qu'Excel ?",
    a: "",
  },
  {
    q: "Combien coûte Avermate ?",
    a: "",
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
