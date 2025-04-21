// TechnicalDetailsStep.jsx
import React from "react";
import Input from "../../../../components/Input";
import { t } from "i18next";

const TechnicalDetailsStep = ({ formData, onChange, formErrors }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="font-semibold text-xl text-primary border-b pb-2">
      {t("vehicle.TechnicalDetails")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="label">
            <span className="label-text">{ t("vehicle.color")}</span>
          </label>
          <select
            name="color"
            value={formData.color || ""}
            onChange={onChange}
            className={`select select-bordered w-full ${
              formErrors.color ? "select-error" : ""
            }`}
            required
          >
            <option value="">{ t("vehicle.SelectColor")}</option>
            {[
              t("vehicle.black"),
              t("vehicle.white"),
              t("vehicle.grey"),
              t("vehicle.blue"),
              t("vehicle.red"),
              t("vehicle.green"),
              t("vehicle.yellow"),
              t("vehicle.gold"),
            ].map((color) => (
              <option key={color.toUpperCase()} value={color.toUpperCase()}>
                {color}
              </option>
            ))}
          </select>
          {formErrors.color && (
            <p className="text-error text-sm mt-1">{formErrors.color}</p>
          )}
        </div>

        {/*
         <div>
          <label className="label">
            <span className="label-text">Type</span>
          </label>
          <select
            name="type"
            value={formData.type || "CAR"}
            onChange={onChange}
            className={`select select-bordered w-full ${
              formErrors.type ? "select-error" : ""
            }`}
            required
          >
            <option value="CAR">Car</option>
            <option value="MOTORCYCLE">Motorcycle</option>
            <option value="TRUCK">Truck</option>
            <option value="OTHER">Other</option>
          </select>
          {formErrors.type && (
            <p className="text-error text-sm mt-1">{formErrors.type}</p>
          )}
        </div> */}

        <div>
          <label className="label">
            <span className="label-text">{t("vehicle.doors")}</span>
          </label>
          <Input
            type="number"
            name="doors"
            value={formData.doors || ""}
            onChange={onChange}
            placeholder="e.g. 4"
            required
            min="0"
            className={formErrors.doors ? "input-error" : ""}
          />
          {formErrors.doors && (
            <p className="text-error text-sm mt-1">{formErrors.doors}</p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t("vehicle.fuelType")}</span>
          </label>
          <select
            name="fuelType"
            value={formData.fuelType || ""}
            onChange={onChange}
            className={`select select-bordered w-full ${
              formErrors.fuelType ? "select-error" : ""
            }`}
            required
          >
            <option value="" disabled={true}>
            {t("vehicle.SelectFuelType")}
            </option>
            <option value="GASOLINE">{t("vehicle.GASOLINE")}</option>
            <option value="DIESEL">{t("vehicle.DIESEL")}</option>
            <option value="ELECTRIC">{t("vehicle.ELECTRIC")}</option>
            <option value="HYBRID">{t("vehicle.HYBRID")}</option>
          </select>
          {formErrors.fuelType && (
            <p className="text-error text-sm mt-1">{formErrors.fuelType}</p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t("vehicle.chassisNumber")}</span>
          </label>
          <Input
            type="text"
            name="chassisNumber"
            value={formData.chassisNumber || ""}
            onChange={onChange}
            placeholder="e.g. JH4KA7650MC012345"
            required
            className={formErrors.chassisNumber ? "input-error" : ""}
          />
          {formErrors.chassisNumber && (
            <p className="text-error text-sm mt-1">
              {formErrors.chassisNumber}
            </p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t("vehicle.gearbox")}</span>
          </label>
          <select
            name="gearbox"
            value={formData.gearbox|| ""}
            onChange={onChange}
            className={`select select-bordered w-full ${
              formErrors.gearbox ? "select-error" : ""
            }`}
            required
          >
            <option value="" disabled={true}>
            {t("vehicle.TypeGearbox")}
            </option>
            <option value="MANUAL">{t("vehicle.Manual")}</option>
            <option value="AUTOMATIC">{t("vehicle.Automatic")}</option>
          </select>
          {formErrors.gearbox && (
            <p className="text-error text-sm mt-1">{formErrors.gearbox}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalDetailsStep;
