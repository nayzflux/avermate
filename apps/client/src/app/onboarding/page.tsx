"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Button } from "@/components/ui/button";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import WelcomeScreen from "./welcome-screen";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth";
import { Session, User } from "better-auth/types";
import { Stepper } from "./stepper";
import { Rocket } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ConfettiButton } from "@/components/ui/confetti";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

const stepIds = ["welcome", "periodes", "matieres", "notes"];
const steps = [
  { title: "welcome", component: WelcomeScreen, id: "welcome" },
  { title: "periodes", component: Step1, id: "periodes" },
  { title: "matieres", component: Step2, id: "matieres" },
  { title: "notes", component: Step3, id: "notes" },
];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Onboarding");

  const getStepIndexFromParams = useCallback(() => {
    const step = searchParams.get("step")?.toLowerCase() || "";
    const index = stepIds.indexOf(step);
    return index !== -1 ? index : 0;
  }, [searchParams]);

  const [currentStep, setCurrentStep] = useState(getStepIndexFromParams());
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state

  const { data: session } = authClient.useSession() as unknown as {
    data: { session: Session; user: User };
  };

  useEffect(() => {
    const stepId = steps[currentStep].id;
    const currentStepParam = searchParams.get("step")?.toLowerCase();

    if (currentStepParam !== stepId) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("step", stepId);
      router.replace(`?${newSearchParams.toString()}`);
    }
  }, [currentStep, router, searchParams]);

  useEffect(() => {
    const newStep = getStepIndexFromParams();
    setCurrentStep(newStep);
  }, [searchParams, getStepIndexFromParams]);

  const handleNext = () => {
    if (!isAnimating) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    if (!isAnimating) {
      setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  const handleOnboardingCompletion = () => {
    localStorage.setItem("isOnboardingCompleted", "true");
    router.push("/dashboard");
  };

  return (
    <div className="flex-1 flex flex-col max-w-[2000px] mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between p-6">
        <div className="flex flex-col mb-4 md:mb-0">
          <h1 className="md:text-3xl font-bold text-xl">
            {steps[currentStep].title === "welcome"
              ? t("welcomeTitle")
              : t(steps[currentStep].title)}
            {currentStep === 0 && (
              <>
                ,&nbsp;
                <span className="items-center">
                  {session?.user?.name ? (
                    session.user.name.split(" ")[0]
                  ) : (
                    <Skeleton className="w-20 h-6 inline-block align-middle mx-1" />
                  )}
                </span>
                &nbsp;👋
              </>
            )}
          </h1>
          <p className="text-muted-foreground text-sm">{t("setupMessage")}</p>
        </div>

        <div className="flex flex-row md:items-center md:space-y-0 md:space-x-4 justify-between w-full md:justify-end md:w-auto">
          {currentStep === 0 ? (
            <Button
              size="sm"
              variant="link"
              onClick={handleOnboardingCompletion}
            >
              {t("back")}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="link"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              {t("previous")}
            </Button>
          )}
          {currentStep === 0 ? (
            <Button
              className="animate-pulse hover:animate-none"
              onClick={handleNext}
              size="sm"
            >
              {t("startAdventure")}
              <Rocket className="w-6 h-6 ml-2" />
            </Button>
          ) : currentStep === steps.length - 1 ? (
            <Link href="/dashboard" onClick={handleOnboardingCompletion}>
              <ConfettiButton size="sm">{t("finish")} 🎉</ConfettiButton>
            </Link>
          ) : (
            <Button size="sm" onClick={handleNext}>
              {t("next")}
            </Button>
          )}
        </div>
      </div>
      <div className="px-6">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={(newStep) => setCurrentStep(newStep)}
        />
      </div>
      <div className="flex-1 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            onAnimationStart={() => setIsAnimating(true)} // Set animation state
            onAnimationComplete={() => setIsAnimating(false)} // Reset animation state
          >
            <CurrentStepComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div></div>}>
      <OnboardingContent />
    </Suspense>
  );
}
