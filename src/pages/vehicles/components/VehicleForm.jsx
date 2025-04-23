import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stepSchemas, vehicleSchema } from './vehicleValidation';
import StepNavigation from './components/StepNavigation';
import BasicInfoStep from './components/BasicInfoStep';
import TechnicalDetailsStep from './components/TechnicalDetailsStep';
import PricingStep from './components/PricingStep';
import ImageUploadStep from './components/ImageUploadStep';
import MaintenanceStep from './components/MaintenanceStep';
import DocumentsStep from './components/DocumentsStep';
import FormNavigationButtons from './components/FormNavigationButtons';

const VehicleForm = ({ 
  formData, 
  onChange, 
  onSubmit, 
  isSaving, 
  error, 
  title,
  handleFileChange: externalHandleFileChange,
  clearFile: externalClearFile,
  imagePreview: externalImagePreview,
  docPreviews: externalDocPreviews
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [formErrors, setFormErrors] = useState({});
  
 
  const [imagePreview, setImagePreview] = useState(externalImagePreview || null);
  const [docPreviews, setDocPreviews] = useState(externalDocPreviews || {});

  
  useEffect(() => {
    if (externalImagePreview !== undefined) {
      setImagePreview(externalImagePreview);
    }
  }, [externalImagePreview]);

  useEffect(() => {
    if (externalDocPreviews !== undefined) {
      setDocPreviews(externalDocPreviews);
    }
  }, [externalDocPreviews]);

  
  useEffect(() => {
    return () => {
      if (imagePreview && !externalImagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      
      if (!externalDocPreviews) {
        Object.values(docPreviews).forEach((url) => {
          if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      }
    };
  }, [imagePreview, docPreviews, externalImagePreview, externalDocPreviews]);

  const handleFileChange = (e) => {
    if (externalHandleFileChange) {
      externalHandleFileChange(e);
      return;
    }
    
    const { name, files } = e.target;
   
    if (files && files[0]) {
      const file = files[0];
      onChange({
        target: {
          name,
          value: file,
        },
      });

    
      const previewUrl = URL.createObjectURL(file);
      if (name === 'image') {
        setImagePreview(previewUrl);
      } else {
        setDocPreviews((prev) => ({
          ...prev,
          [name]: previewUrl,
        }));
      }
    }
  };

  const clearFile = (name) => {
    if (externalClearFile) {
      externalClearFile(name);
      return;
    }
    
    onChange({
      target: {
        name,
        value: null,
      },
    });
    
    if (name === 'image') {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
    } else {
      if (docPreviews[name] && docPreviews[name].startsWith('blob:')) {
        URL.revokeObjectURL(docPreviews[name]);
      }
      setDocPreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[name];
        return newPreviews;
      });
    }
  };

  const convertFormData = (data) => {
    const converted = { ...data };
    
    const numericFields = [
      'year', 'doors', 'mileage', 'dailyPrice', 
      'purchasePrice', 'advancePayment', 'monthlyPayment', 
      'remainingMonths', 'paymentDay'
    ];
    
    numericFields.forEach((field) => {
      if (converted[field]) {
        converted[field] = parseFloat(converted[field]);
      }
    });
    
    const dateFields = ['oilChange', 'timingBelt', 'purchaseDate'];
    
    dateFields.forEach((field) => {
      if (converted[field]) {
        const date = new Date(converted[field] + 'T12:00:00Z');
        converted[field] = date.toISOString();
      } else {
        converted[field] = undefined;
      }
    });
    
    return converted;
  };


  const validateStep = (stepData, stepIndex) => {
    try {
      stepSchemas[stepIndex].parse(stepData);
      return true;
    } catch (err) {
      const errors = {};
      err.errors.forEach((error) => {
        errors[error.path[0]] = error.message;
      });
      setFormErrors(errors);
      return false;
    }
  };

  
  const validateForm = (data) => {
    try {
      vehicleSchema.parse(data);
      return true;
    } catch (err) {
      const errors = {};
      err.errors.forEach((error) => {
        errors[error.path[0]] = error.message;
      });
      setFormErrors(errors);
      return false;
    }
  };

  const goToNextStep = (e) => {
    if (e) e.preventDefault();

    const stepData = {};
    Object.keys(stepSchemas[currentStep - 1].shape).forEach((field) => {
      stepData[field] = formData[field];
    });


    const convertedStepData = convertFormData(stepData);


    if (validateStep(convertedStepData, currentStep - 1)) {
      setFormErrors({}); 
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setFormErrors({}); 
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmitForm = (e) => {
    e.preventDefault();
  
    const convertedData = convertFormData(formData);
  
    const formDataToSubmit = new FormData();
  
    Object.keys(convertedData).forEach((key) => {
      if (convertedData[key] !== null && !(convertedData[key] instanceof File)) {
        formDataToSubmit.append(key, convertedData[key]);
      }
    });
  
    Object.keys(formData).forEach((key) => {
      if (formData[key] instanceof File) {
        formDataToSubmit.append(key, formData[key]);
      }
    });
  
    if (validateForm(convertedData)) {
      onSubmit(e, formDataToSubmit);
      setFormErrors({});
      navigate('/vehicles')

    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep 
            formData={formData}
            onChange={onChange}
            formErrors={formErrors}
          />
        );
      case 2:
        return (
          <TechnicalDetailsStep 
            formData={formData}
            onChange={onChange}
            formErrors={formErrors}
          />
        );
      case 3:
        return (
          <PricingStep 
            formData={formData}
            onChange={onChange}
            formErrors={formErrors}
          />
        );
      case 4:
        return (
          <ImageUploadStep 
            formData={formData}
            handleFileChange={handleFileChange}
            clearFile={clearFile}
            imagePreview={imagePreview}
            formErrors={formErrors}
          />
        );
      case 5:
        return (
          <MaintenanceStep 
            formData={formData}
            onChange={onChange}
            formErrors={formErrors}
          />
        );
      case 6:
        return (
          <DocumentsStep 
            formData={formData}
            handleFileChange={handleFileChange}
            clearFile={clearFile}
            docPreviews={docPreviews}
            formErrors={formErrors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full mx-auto p-8 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button
          type="button"
          onClick={() => navigate('/vehicles')}
          className="btn btn-soft "
        >
          Cancel
        </button>
      </div>

      <StepNavigation 
        currentStep={currentStep}
        totalSteps={totalSteps}
        setCurrentStep={setCurrentStep}
      />

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

    
      <form onSubmit={(e) => { 
        if (currentStep === totalSteps) {
          handleSubmitForm(e);
        } else {
          e.preventDefault();
        }
      }} className="space-y-6">
        {renderStepContent()}

        <FormNavigationButtons 
          currentStep={currentStep}
          totalSteps={totalSteps}
          goToPreviousStep={goToPreviousStep}
          goToNextStep={goToNextStep}
          handleSubmitForm={handleSubmitForm}
          isSaving={isSaving}
        />
      </form>
    </div>
  );
};

export default VehicleForm;