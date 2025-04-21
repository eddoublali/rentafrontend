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
  // Accept these props from parent component (for edit mode)
  handleFileChange: externalHandleFileChange,
  clearFile: externalClearFile,
  imagePreview: externalImagePreview,
  docPreviews: externalDocPreviews
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [formErrors, setFormErrors] = useState({});
  
  // Use external values if provided, otherwise initialize locally
  const [imagePreview, setImagePreview] = useState(externalImagePreview || null);
  const [docPreviews, setDocPreviews] = useState(externalDocPreviews || {});

  // Update local state when external values change
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

  // Clean up object URLs to prevent memory leaks
  // Only clean up locally created URLs (not external ones)
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

  // Handle file input changes - use external handler if provided
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

      // Create a preview URL for the file
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

  // Clear file input - use external handler if provided
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

  // Validate the current step
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

  // Validate the entire form on submission
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
    // Prepare data for the current step
    const stepData = {};
    Object.keys(stepSchemas[currentStep - 1].shape).forEach((field) => {
      stepData[field] = formData[field];
    });

    // Convert data types for validation
    const convertedStepData = convertFormData(stepData);

    // Validate the current step
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
      setFormErrors({}); // Clear errors when going back
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmitForm = (e) => {
    e.preventDefault();
  
    // Convert all form data for validation and submission
    const convertedData = convertFormData(formData);
  
    // Prepare FormData object for file uploads
    const formDataToSubmit = new FormData();
  
    // Append non-file data to FormData
    Object.keys(convertedData).forEach((key) => {
      // Skip file fields
      if (convertedData[key] !== null && !(convertedData[key] instanceof File)) {
        // Use the converted values (numbers, dates) from convertedData
        formDataToSubmit.append(key, convertedData[key]);
      }
    });
  
    // Append files to FormData
    Object.keys(formData).forEach((key) => {
      if (formData[key] instanceof File) {
        formDataToSubmit.append(key, formData[key]);
      }
    });
  
    // Validate the entire form
    if (validateForm(convertedData)) {
      // Submit the form data
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
          className="btn btn-ghost"
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

      {/* Key fix: Change the form's onSubmit to prevent automatic submission */}
      <form onSubmit={(e) => { 
        // Only allow form submission on the final step
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