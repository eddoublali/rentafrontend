import { t } from 'i18next';
import { AlertTriangle, ClipboardList, ClipboardPenLine, FilePlus, FileSpreadsheet } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

export default function AllDocuments() {
    return (
        <div className="min-h-screen bg-base-200 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
              <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow text-center items-center">
                <div className="card-body flex items-center gap-4 ">
                  <ClipboardList className="w-9 h-9 text-primary cursor-pointer" />
                    <h2 className="card-title">{t('contract.Contract')}</h2>
                </div>
              </div>
              <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow text-center items-center">
                <div className="card-body flex items-center gap-4 ">
                  <FilePlus className="w-9 h-9 text-primary cursor-pointer" />
                    <h2 className="card-title">{t('contract.Invoice')}</h2>
                   
                </div>
              </div>
              <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow text-center items-center">
                <div className="card-body flex items-center gap-4 ">
                  <FileSpreadsheet className="w-9 h-9 text-primary cursor-pointer" />           
                    <h2 className="card-title">{t('contract.Devise')}</h2>      
                </div>
              </div>
              <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow text-center items-center">
                <div className="card-body flex items-center gap-4 ">
                <Link to='/infraction'>
                
                  <AlertTriangle className="w-9 h-9 text-primary cursor-pointer" /> 
                  </Link>          
                    <h2 className="card-title">{t('infraction.infractions')}</h2>      
                </div>
              </div>
     
            
            </div>
          </div>
        </div>
      );
}
