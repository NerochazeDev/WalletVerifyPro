import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    id: number;
    title: string;
    icon: string;
  }>;
  className?: string;
}

export function ProgressIndicator({ currentStep, totalSteps, steps, className }: ProgressIndicatorProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">
          {Math.round(progressPercentage)}%
        </span>
      </div>
      
      <div className="w-full bg-slate rounded-full h-2 mb-4">
        <div 
          className="h-2 rounded-full transition-all duration-500 ease-out gradient-primary"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="flex justify-between">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={cn(
              "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300",
              step.id <= currentStep
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted bg-muted text-muted-foreground"
            )}>
              {step.id}
            </div>
            <span className="text-xs text-muted-foreground mt-2 text-center">
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
