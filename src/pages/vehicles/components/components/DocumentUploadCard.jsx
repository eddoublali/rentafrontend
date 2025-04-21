// // DocumentUploadCard.jsx
// import React from 'react';
// import { FileText } from 'lucide-react';

// const DocumentUploadCard = ({ title, name, formData, handleFileChange, clearFile, docPreviews, formErrors }) => {
//   // Function to determine the image source
//   const getDocumentSource = () => {
//     // Check if we have a preview from parent component
//     if (docPreviews && docPreviews[name]) {
//       return docPreviews[name];
//     }
    
//     // Check if we have a URL from the server (stored in formData[`${name}Url`])
//     const urlField = `${name}Url`;
//     if (formData[urlField]) {
//       return formData[urlField].startsWith('http')
//         ? formData[urlField]
//         : `http://localhost:3000${formData[urlField]}`;
//     }
    
//     // If formData[name] is a string, it might be a path
//     if (typeof formData[name] === 'string') {
//       return formData[name].startsWith('http')
//         ? formData[name]
//         : `http://localhost:3000${formData[name]}`;
//     }
    
//     return null;
//   };

//   const hasDocument = getDocumentSource() || (formData[name] instanceof File);

//   return (
//     <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
//       <div className="card-body">
//         <h4 className="card-title text-sm flex justify-between">
//           {title}
//           {formData[name] && (
//             <button
//               type="button"
//               onClick={() => clearFile(name)}
//               className="btn btn-xs btn-circle btn-ghost"
//             >
//               ✕
//             </button>
//           )}
//         </h4>
//         {hasDocument ? (
//           <div className="mt-2">
//             <img
//               src={getDocumentSource()}
//               alt={title}
//               className="h-32 w-full object-cover rounded shadow-sm"
//             />
//           </div>
//         ) : (
//           <div className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center ${formErrors[name] ? 'border-error' : 'border-base-300'}`}>
//             <FileText size={24} className="text-base-300 mb-2" />
//             <label className="btn btn-sm bg-sky-600 w-full cursor-pointer">
//               Upload {title}
//               <input
//                 type="file"
//                 name={name}
//                 onChange={handleFileChange}
//                 className="hidden"
//                 accept="image/*,application/pdf"
//               />
//             </label>
//           </div>
//         )}
//         {formErrors[name] && <p className="text-error text-sm mt-2">{formErrors[name]}</p>}
//       </div>
//     </div>
//   );
// };

// export default DocumentUploadCard;


// DocumentUploadCard.jsx
import React from 'react';
import { FileText } from 'lucide-react';
import { t } from 'i18next';

const DocumentUploadCard = ({ title, name, formData, handleFileChange, clearFile, docPreviews, formErrors }) => {
  // Function to determine the image source
  const getDocumentSource = () => {
    // Check if we have a preview from parent component
    if (docPreviews && docPreviews[name]) {
      return docPreviews[name];
    }
    
    // Check if we have a URL from the server (stored in formData[`${name}Url`])
    const urlField = `${name}Url`;
    if (formData[urlField]) {
      return formData[urlField].startsWith('http')
        ? formData[urlField]
        : `http://localhost:3000${formData[urlField]}`;
    }
    
    // If formData[name] is a string, it might be a path
    if (typeof formData[name] === 'string') {
      return formData[name].startsWith('http')
        ? formData[name]
        : `http://localhost:3000${formData[name]}`;
    }
    
    return null;
  };

  // Better check to determine if we have a document to display
  const hasDocument = (
    (docPreviews && docPreviews[name]) || 
    (formData[`${name}Url`] && formData[`${name}Url`] !== null) || 
    (typeof formData[name] === 'string' && formData[name] !== null) ||
    (formData[name] instanceof File)
  );

  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body">
        <h4 className="card-title text-sm flex justify-between">
          {title}
          {hasDocument && (
            <button
              type="button"
              onClick={() => clearFile(name)}
              className="btn btn-xs btn-circle btn-ghost"
            >
              ✕
            </button>
          )}
        </h4>
        {hasDocument ? (
          <div className="mt-2">
            <img
              src={getDocumentSource()}
              alt={title}
              className="h-32 w-full object-cover rounded shadow-sm"
            />
          </div>
        ) : (
          <div className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center ${formErrors[name] ? 'border-error' : 'border-primary'}`}>
            <FileText size={24} className=" mb-2 text-primary" />
            <label className="btn btn-sm bg-sky-600 w-full cursor-pointer text-white">
              { t('vehicle.Upload')} {title}
              <input
                type="file"
                name={name}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf"
              />
            </label>
          </div>
        )}
        {formErrors[name] && <p className="text-error text-sm mt-2">{formErrors[name]}</p>}
      </div>
    </div>
  );
};

export default DocumentUploadCard;