import { CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StepperProps {
  steps: { title: string }[];
  currentStep: number;
  onStepChange: (stepIndex: number) => void;
}

export function Stepper({ steps, currentStep, onStepChange }: StepperProps) {
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="mb-6">
      <Progress value={progress} className="w-full" />
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <button
              onClick={() => onStepChange(index)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index < currentStep ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </button>
            <span className="text-xs mt-1 text-muted-foreground">
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
