"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
  Card,
} from "@/components/ui/card";
import AddSubjectButton from "@/components/buttons/dashboard/add-subject-button";
import AddGradeDialog from "@/components/dialogs/add-grade-dialog";
import AddSubjectDialog from "@/components/dialogs/add-subject-dialog";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function Onboarding() {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Bienvenue sur Avermate 👋 !
          <p className="text-sm text-muted-foreground">
            Commençons par quelques étapes pour vous aider à démarrer !
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <CardDescription>
            <p className="text-foreground">
              Avermate est un outil de gestion de notes pour les étudiants. Vous
              pouvez ajouter des matières, des notes et des périodes pour suivre
              votre progression.
            </p>
          </CardDescription>
        )}
        {step === 2 && (
          <CardDescription>
            <p className="text-foreground">
              Étape 2: Ajoutez votre première matière en utilisant le bouton
              ci-dessous.
            </p>
            <AddSubjectButton />
          </CardDescription>
        )}
        {step === 3 && (
          <CardDescription>
            <p className="text-foreground">
              Étape 3: Ajoutez vos premières notes en utilisant le dialogue
              ci-dessous.
            </p>
            <AddGradeDialog>
              <Button>
                <PlusCircleIcon className="size-4 mr-2" />
                Ajouter une note
              </Button>
            </AddGradeDialog>
          </CardDescription>
        )}
        {/* Add more steps as needed */}
      </CardContent>
      <CardFooter>
        <Button onClick={nextStep}>Suivant</Button>
      </CardFooter>
    </Card>
  );
}
