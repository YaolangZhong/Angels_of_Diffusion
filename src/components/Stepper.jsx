import { Check } from 'lucide-react';
import { WORKFLOW_STEPS, EMOJI_WORKFLOW_STEPS } from '../config/workflowData';
import { useWorkflow } from '../context/WorkflowContext';

const Stepper = () => {
  const { currentStep, selectedFunction } = useWorkflow();
  
  // 根据选择的功能使用不同的步骤标签
  const steps = selectedFunction === 'wechat_emoji' ? EMOJI_WORKFLOW_STEPS : WORKFLOW_STEPS;

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-500
                    ${isCompleted 
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30' 
                      : isCurrent 
                        ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-500/30 animate-pulse-glow' 
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }
                  `}
                >
                  {isCompleted ? <Check size={18} strokeWidth={3} /> : step.id}
                </div>
                <div className="mt-2 text-center hidden sm:block">
                  <p className={`text-xs font-medium ${isCurrent ? 'text-pink-500' : isCompleted ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {step.title}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-2">
                  <div className={`
                    h-0.5 transition-all duration-500
                    ${isCompleted 
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500' 
                      : 'bg-gray-200'
                    }
                  `} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
