import React from 'react';
import { t } from 'i18next';
import Input from '../../../../components/Input';

const BasicInfoStep = ({ formData, onChange, formErrors }) => {
  const brands = [
    "TOYOTA", "HONDA", "FORD", "MERCEDES", "BMW", "AUDI", "VOLKSWAGEN", 
    "HYUNDAI", "KIA", "NISSAN", "PEUGEOT", "RENAULT", "FIAT", "VOLVO", 
    "MAZDA", "JEEP", "TESLA", "SUZUKI", "SKODA"
  ]
  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="font-semibold text-xl text-primary border-b pb-2">{t('vehicle.basicInformation')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
       
         <div>
          <label className="label">
            <span className="label-text">{t('vehicle.brand')}</span>
          </label>
          <select
            name="brand"
            value={formData.brand}
            onChange={onChange}
            className={`select w-full ${formErrors.brand ? 'select-error' : ''}`}
            
          >
            <option value="">{t('vehicle.selectBrand')}</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          {formErrors.brand && <p className="text-error text-sm mt-1">{formErrors.brand}</p>}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('vehicle.model')}</span>
          </label>
          <Input
            type="text"
            name="model"
            value={formData.model || ''}
            onChange={onChange}
            placeholder={t('vehicle.modelPlaceholder')}
            required
            className={formErrors.model ? 'input-error' : ''}
          />
          {formErrors.model && <p className="text-error text-sm mt-1">{formErrors.model}</p>}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('vehicle.year')}</span>
          </label>
          <Input
            type="number"
            name="year"
            value={formData.year || ''}
            onChange={onChange}
            placeholder={t('vehicle.yearPlaceholder')}
            required
            min="1900"
            max={new Date().getFullYear() + 1}
            className={formErrors.year ? 'input-error' : ''}
          />
          {formErrors.year && <p className="text-error text-sm mt-1">{formErrors.year}</p>}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('vehicle.category')}</span>
          </label>
          <select
            name="category"
            value={formData.category || ''}
            onChange={onChange}
            className={`select select-bordered w-full ${formErrors.category ? 'select-error' : ''}`}
            required
          >
            <option value="">{t('vehicle.selectCategory')}</option>
            <option value="CITADINE">{t('vehicle.Citadine')}</option>
            <option value="BERLINE">{t('vehicle.Berline')}</option>
            <option value="SUV">{t('vehicle.suv')}</option>
            <option value="UTILITAIRE">{t('vehicle.Utilitaire')}</option>
          </select>
          {formErrors.category && <p className="text-error text-sm mt-1">{formErrors.category}</p>}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
