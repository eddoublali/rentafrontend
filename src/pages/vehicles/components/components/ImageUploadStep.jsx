// ImageUploadStep.jsx - Fixed
import React, { useEffect } from 'react';
import { Upload } from 'lucide-react';
import { t } from 'i18next';

const ImageUploadStep = ({ formData, handleFileChange, clearFile, imagePreview, formErrors }) => {
  // For debugging - log props on every render
  useEffect(() => {
    console.log('ImageUploadStep - formData:', formData);
    console.log('ImageUploadStep - imagePreview:', imagePreview);
  }, [formData, imagePreview]);

  // Determine the image source - prioritize imagePreview (from parent), then imageUrl, then formData.image
  const getImageSource = () => {
    // If we have an imagePreview from the parent, use that
    if (imagePreview) {
      return imagePreview;
    } 
    
    // If we have an imageUrl in formData, use that
    if (formData.imageUrl) {
      return formData.imageUrl.startsWith('http') 
        ? formData.imageUrl 
        : `http://localhost:3000${formData.imageUrl}`;
    } 
    
    // If formData.image is a string (path), use that
    if (typeof formData.image === 'string' && formData.image) {
      return formData.image.startsWith('http') 
        ? formData.image 
        : `http://localhost:3000${formData.image}`;
    }
    
    // No valid image source found
    return null;
  };

  // Check if we have a valid image to display
  const imageSource = getImageSource();
  const hasImage = imageSource !== null || (formData.image instanceof File);

  // For debugging
  console.log('ImageUploadStep - imageSource:', imageSource);
  console.log('ImageUploadStep - hasImage:', hasImage);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="font-semibold text-xl text-primary border-b pb-2">{t('vehicle.image')}</h3>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-base-100 border border-base-300 rounded-lg p-8">
          <div className="flex flex-col items-center">
            {hasImage ? (
              <div className="relative w-full max-w-md mb-4">
                <img
                  src={imageSource}
                  alt="Vehicle"
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    console.log('Clear button clicked');
                    clearFile('image');
                  }}
                  className="btn btn-circle btn-sm btn-error absolute top-2 right-2"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className={`border-2 border-dashed rounded-lg p-12 mb-4 w-full max-w-md flex flex-col items-center justify-center ${formErrors.image ? 'border-error' : 'border-base-300'}`}>
                <Upload size={48} className="text-base-300 mb-4" />
                <h4 className="text-lg font-medium mb-2">{t("vehicle.UploadImage")}</h4>
                <p className="text-sm text-base-content/70 mb-4 text-center">
                {t("vehicle.drop")}
                </p>
                <input
                  type="file"
                  name="image"
                  onChange={(e) => {
                    console.log('File input changed');
                    handleFileChange(e);
                  }}
                  className={`file-input file-input-bordered w-full max-w-xs ${formErrors.image ? 'file-input-error' : 'file-input'}`}
                  accept="image/*"
                />
              </div>
            )}
            <div className="text-sm text-base-content/70 mt-2">
              <p>• {t("vehicle.Recommended")}</p>
              <p>• {t("vehicle.Maximum")}</p>
              <p>• {t("vehicle.Supported")}</p>
            </div>
            {formErrors.image && <p className="text-error text-sm mt-2">{formErrors.image}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadStep;