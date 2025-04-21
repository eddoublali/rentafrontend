import React from 'react';
import { Car, FireExtinguisher, Receipt, Camera, FileText } from 'lucide-react';
import { t } from 'i18next';

const StepNavigation = ({ currentStep, setCurrentStep }) => {
  const steps = [
    { title: t("vehicle.BasicInfo"), icon: <Car size={18} /> },
    { title:  t("vehicle.Technical"), icon: <FireExtinguisher size={18} /> },
    { title:  t("vehicle.Pricing"), icon: <Receipt size={18} /> },
    { title:  t("vehicle.Image"), icon: <Camera size={18} /> },
    { title:  t("vehicle.Maintenance"), icon: <FireExtinguisher size={18} /> },
    { title:  t("vehicle.Documents"), icon: <FileText size={18} /> },
  ];

  return (
    <div className="w-full mb-8 px-4">
      <div className="relative">
        {/* Progress track */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-sky-500 transition-all duration-300 ease-out"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep - 1;
            const isActive = index === currentStep - 1;
            const stepNumber = index + 1;

            return (
              <button
                key={index}
                onClick={() => setCurrentStep(stepNumber)}
                className="flex flex-col items-center group focus:outline-none"
              >
                {/* Step indicator */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-sky-500 text-white shadow-sm'
                    : isActive
                    ? 'bg-white border-2 border-sky-600 text-sky-600 shadow-md'
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Step label
                <span className={`mt-3 text-sm font-medium transition-colors duration-300 ${
                  isCompleted || isActive 
                    ? 'text-sky-600' 
                    : 'text-gray-400 group-hover:text-gray-600'
                }`}>
                  {step.title}
                </span> */}

                {/* Step number (hidden on small screens) */}
                <span className="hidden sm:block mt-1 text-xs text-gray-500">
               { t("vehicle.Step")} {stepNumber}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;