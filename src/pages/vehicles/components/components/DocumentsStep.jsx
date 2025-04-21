// DocumentsStep.jsx
import React from 'react';
import DocumentUploadCard from './DocumentUploadCard';
import { t } from 'i18next';

const DocumentsStep = ({ formData, handleFileChange, clearFile, docPreviews, formErrors }) => {
  const documents = [
    { title: t('vehicle.registrationCard'), name: "registrationCard" },
    { title:  t('vehicle.insurance'), name: "insurance" },
    { title: t('vehicle.technicalVisit'), name: "technicalVisit" },
    { title: t('vehicle.authorization'),name: "authorization" },
    { title: t('vehicle.taxSticker'), name: "taxSticker" }
  ];
 
  
 
  

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="font-semibold text-xl text-primary border-b pb-2">{t('vehicle.Documents')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc, index) => (
          <DocumentUploadCard
            key={index}
            title={doc.title}
            name={doc.name}
            formData={formData}
            handleFileChange={handleFileChange}
            clearFile={clearFile}
            docPreviews={docPreviews}
            formErrors={formErrors}
          />
        ))}
      </div>
    </div>
  );
};

export default DocumentsStep;