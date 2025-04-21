// FormNavigationButtons.jsx
import { t } from 'i18next';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

const FormNavigationButtons = ({ 
  currentStep, 
  totalSteps, 
  goToPreviousStep, 
  goToNextStep, 
  handleSubmitForm, 
  isSaving 
}) => {
  return (
    <div className="flex justify-between mt-8 pt-5 border-t">
      <button
        type="button"
        onClick={goToPreviousStep}
        disabled={currentStep === 1}
        className="btn "
      >
        <ChevronLeft />
        {t('vehicle.Previous')}
      </button>

      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={goToNextStep}
          className="btn bg-sky-600 text-white"
        >
          {t('vehicle.Next')}
          <ChevronRight />
        </button>
      ) : (
        <button
          type="submit"
          disabled={isSaving}
          className="btn bg-sky-600 text-white"
        >
          {isSaving ? (
            <>
              <span className="loading loading-spinner"></span>
              {t('vehicle.Saving')}
            </>
          ) : (
            <>
            <Check />
            {t('vehicle.SaveVehicle')}
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default FormNavigationButtons;