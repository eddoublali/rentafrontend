// PricingStep.jsx
import React from 'react';
import Input from '../../../../components/Input';
import { t } from 'i18next';

const PricingStep = ({ formData, onChange, formErrors }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="font-semibold text-xl text-primary border-b pb-2">{t("vehicle.RegistrationPricing")}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="label">
            <span className="label-text">{t("vehicle.mileage")} (km)</span>
          </label>
          <Input
            type="number"
            name="mileage"
            value={formData.mileage || ''}
            onChange={onChange}
            placeholder="e.g. 50000"
            required
            min="0"
            className={formErrors.mileage ? 'input-error' : ''}
          />
          {formErrors.mileage && <p className="text-error text-sm mt-1">{formErrors.mileage}</p>}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t("vehicle.plateNumber")}</span>
          </label>
          <Input
            type="text"
            name="plateNumber"
            value={formData.plateNumber || ''}
            onChange={onChange}
            placeholder="e.g. ABC-1234"
            required
            className={formErrors.plateNumber ? 'input-error' : ''}
          />
          {formErrors.plateNumber && <p className="text-error text-sm mt-1">{formErrors.plateNumber}</p>}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t("vehicle.dailyPrice")}  {t("vehicle.dh")}</span>
          </label>
          <Input
            type="number"
            name="dailyPrice"
            value={formData.dailyPrice || ''}
            onChange={onChange}
            placeholder="e.g. 75.00"
            required
            min="0"
            step="0.01"
            className={formErrors.dailyPrice ? 'input-error' : ''}
          />
          {formErrors.dailyPrice && <p className="text-error text-sm mt-1">{formErrors.dailyPrice}</p>}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t("vehicle.status")}</span>
          </label>
          <select
            name="status"
            value={formData.status || 'AVAILABLE'}
            onChange={onChange}
            className={`select select-bordered w-full ${formErrors.status ? 'select-error' : ''}`}
            required
          >
            <option value="AVAILABLE">{t("vehicle.AVAILABLE")}</option>
            <option value="RENTED">{t("vehicle.RENTED")}</option>
            <option value="MAINTENANCE">{t("vehicle.MAINTENANCE")}</option>
          </select>
          {formErrors.status && <p className="text-error text-sm mt-1">{formErrors.status}</p>}
        </div>
      </div>
    </div>
  );
};

export default PricingStep;