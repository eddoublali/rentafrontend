// MaintenanceStep.jsx
import React from 'react';
import Input from '../../../../components/Input';
import { t } from 'i18next';

const MaintenanceStep = ({ formData, onChange, formErrors }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="font-semibold text-xl text-primary border-b pb-2">Maintenance</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="label">
            <span className="label-text">Last Oil Change Date</span>
          </label>
          <Input
            type="date"
            name="oilChange"
            value={formData.oilChange}
            onChange={onChange}
            className={formErrors.oilChange ? 'input-error' : ''}
          />
          {formErrors.oilChange && <p className="text-error text-sm mt-1">{formErrors.oilChange}</p>}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t("vehicle.TimingBelt")}</span>
          </label>
          <Input
            type="date"
            name="timingBelt"
            value={formData.timingBelt}
            onChange={onChange}
            className={formErrors.timingBelt ? 'input-error' : ''}
          />
          {formErrors.timingBelt && <p className="text-error text-sm mt-1">{formErrors.timingBelt}</p>}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-medium text-lg">{t("vehicle.PurchaseInformation")}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="label">
              <span className="label-text">{t("vehicle.purchaseDate")}</span>
            </label>
            <Input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate }
              onChange={onChange}
              className={formErrors.purchaseDate ? 'input-error' : ''}
            />
            {formErrors.purchaseDate && <p className="text-error text-sm mt-1">{formErrors.purchaseDate}</p>}
          </div>

          <div>
            <label className="label">
              <span className="label-text">{t("vehicle.purchasePrice")} {t("vehicle.dh")}</span>
            </label>
            <Input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice || ''}
              onChange={onChange}
              placeholder="e.g. 25000.00"
              min="0"
              step="0.01"
              className={formErrors.purchasePrice ? 'input-error' : ''}
            />
            {formErrors.purchasePrice && <p className="text-error text-sm mt-1">{formErrors.purchasePrice}</p>}
          </div>

          <div>
            <label className="label">
              <span className="label-text">{t("vehicle.advancePayment")} {t("vehicle.dh")}</span>
            </label>
            <Input
              type="number"
              name="advancePayment"
              value={formData.advancePayment || ''}
              onChange={onChange}
              placeholder="e.g. 5000.00"
              min="0"
              step="0.01"
              className={formErrors.advancePayment ? 'input-error' : ''}
            />
            {formErrors.advancePayment && <p className="text-error text-sm mt-1">{formErrors.advancePayment}</p>}
          </div>

          <div>
            <label className="label">
              <span className="label-text">{t("vehicle.monthlyPayment")} {t("vehicle.dh")}</span>
            </label>
            <Input
              type="number"
              name="monthlyPayment"
              value={formData.monthlyPayment || ''}
              onChange={onChange}
              placeholder="e.g. 450.00"
              min="0"
              step="0.01"
              className={formErrors.monthlyPayment ? 'input-error' : ''}
            />
            {formErrors.monthlyPayment && <p className="text-error text-sm mt-1">{formErrors.monthlyPayment}</p>}
          </div>

          <div>
            <label className="label">
              <span className="label-text">{t("vehicle.remainingMonths")}</span>
            </label>
            <Input
              type="number"
              name="remainingMonths"
              value={formData.remainingMonths || ''}
              onChange={onChange}
              placeholder="e.g. 12"
              min="0"
              className={formErrors.remainingMonths ? 'input-error' : ''}
            />
            {formErrors.remainingMonths && <p className="text-error text-sm mt-1">{formErrors.remainingMonths}</p>}
          </div>

          <div>
            <label className="label">
              <span className="label-text">{t("vehicle.paymentDay")}</span>
            </label>
            <Input
              type="number"
              name="paymentDay"
              value={formData.paymentDay || ''}
              onChange={onChange}
              placeholder="e.g. 15"
              min="1"
              max="31"
              className={formErrors.paymentDay ? 'input-error' : ''}
            />
            {formErrors.paymentDay && <p className="text-error text-sm mt-1">{formErrors.paymentDay}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceStep;