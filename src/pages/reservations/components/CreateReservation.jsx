import React, { useState, useEffect, useRef } from "react";
import { useClient } from "../../../context/ClientContext";
import { useVehicle } from "../../../context/VehicleContext";
import { useReservation } from "../../../context/ReservationContext";
import { useNavigate } from "react-router-dom";
import { reservationSchema } from "./ReservationValidation";
import { useTranslation } from "react-i18next"; 

export default function CreateReservation() {
  const navigate = useNavigate();
  const { t } = useTranslation(); 
  const { clients, fetchClients, loading: clientsLoading } = useClient();
  const {
    fetchVehicles,
    fetchAvailableVehicles,
    availableVehicles,
    loading: vehiclesLoading,
    error: vehicleError,
    vehicles,
  } = useVehicle();
  const {
    createReservation,
    loading: reservationLoading,
    error: reservationError,
  } = useReservation();

  const [formData, setFormData] = useState({
    vehicleId: "",
    clientId: "",
    startDate: "",
    endDate: "",
    totalAmount: "",
    deliveryLocation: "",
    returnLocation: "",
    additionalCharge: "",
    fuelLevel: "",
    departureKm: "",
    secondDriver: false,
    clientSeconId: "",
    status: "PENDING",
    paymentMethod: "CASH",
    paymentStatus: "PENDING",
    note: "",
    accessories: [],
    documents: [],
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [accessoriesOpen, setAccessoriesOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const accessoriesRef = useRef(null);
  const documentsRef = useRef(null);

 
  const ALLOWED_ACCESSORIES = [
    "accessories.climatisation", 
    "accessories.vest",
    "accessories.triangle",
    "accessories.spareTire",
    "accessories.radio",
    "accessories.babySeat",
    "accessories.fireExtinguisher",
  ];

  const ALLOWED_DOCUMENTS = [
    "documents.registrationCard",
    "documents.insurance",
    "documents.vignette",
    "documents.technicalVisit",
    "documents.authorization",
    "documents.contract",
  ];

  useEffect(() => {
    fetchClients();
    fetchVehicles();
  }, []);

  useEffect(() => {
    const checkAvailability = async () => {
      if (formData.startDate && formData.endDate) {
        const result = await fetchAvailableVehicles(
          formData.startDate,
          formData.endDate
        );
        if (!result.success) {
          setErrors((prev) => ({ ...prev, general: result.error }));
        }
      }
    };
    checkAvailability();
  }, [formData.startDate, formData.endDate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (accessoriesRef.current && !accessoriesRef.current.contains(event.target)) {
        setAccessoriesOpen(false);
      }
      if (documentsRef.current && !documentsRef.current.contains(event.target)) {
        setDocumentsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (
      formData.vehicleId &&
      !availableVehicles.some((v) => v.id === parseInt(formData.vehicleId))
    ) {
      setFormData((prev) => ({ ...prev, vehicleId: "" }));
    }
  }, [formData.vehicleId]);

  useEffect(() => {
    if (formData.vehicleId && formData.startDate && formData.endDate) {
      const vehicle = availableVehicles.find(
        (v) => v.id === parseInt(formData.vehicleId)
      );
      if (vehicle) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
        const additional = parseFloat(formData.additionalCharge) || 0;
        const total = vehicle.dailyPrice * days + additional;
        setFormData((prev) => ({
          ...prev,
          totalAmount: total.toFixed(2),
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, totalAmount: "" }));
    }
  }, [
    formData.vehicleId,
    formData.startDate,
    formData.endDate,
    formData.additionalCharge,
    availableVehicles,
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (item, field) => {
    setFormData((prev) => {
      const current = [...prev[field]];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter((i) => i !== item) };
      } else {
        return { ...prev, [field]: [...current, item] };
      }
    });
  };

  const validateForm = () => {
    try {
      reservationSchema.parse(formData);
      setErrors({});
      return true;
    } catch (validationError) {
      const issues = validationError.errors || validationError.issues;
      const newErrors = {};
      issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const translatedAccessories = formData.accessories.map(key => t(key));
      const translatedDocuments = formData.documents.map(key => t(key));
      
      const formattedData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        clientSeconId: formData.secondDriver ? formData.clientSeconId : undefined,
        accessories: translatedAccessories.length > 0 ? translatedAccessories : undefined,
        documents: translatedDocuments.length > 0 ? translatedDocuments : undefined,
      };

      const response = await createReservation(formattedData);
      if (response.success) {
        navigate("/reservations");
      } else {
        setErrors({
          general: response.error || "Failed to create reservation",
        });
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      setErrors({ general: "Something went wrong" });
    } finally {
      setIsSaving(false);
    }
  };

  const getInputClassName = (fieldName) => {
    return `input input-bordered w-full ${errors[fieldName] ? "input-error" : ""}`;
  };
  const getSelectClassName = (fieldName) => {
    return `select-neutral select w-full cursor-pointer ${errors[fieldName] ? "select-error" : ""}`;
  };

  return (
    <div className="  p-6">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold ">{t("reservation.createReservation")}</h2>
        <button
          type="button"
          onClick={() => navigate('/reservations')}
          className="btn btn-ghost"
        >
          {t('common.cancel')}
        </button>
      </div>
      {(errors.general || vehicleError || reservationError) && (
        <div className="alert alert-error mb-4">
          {errors.general || vehicleError || reservationError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div>
          <label className="label">
            <span className="label-text">{t('reservation.client')}</span>
          </label>
          <select
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            className={getSelectClassName("clientId")}
            disabled={clientsLoading}
          >
            <option value="">{t('common.selectClient')}</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <span className="text-error text-xs mt-1">{errors.clientId}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('reservation.vehicle')}</span>
          </label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            className={getSelectClassName("vehicleId")}
          >
            {availableVehicles?.length === 0 ? (
              <option value="">{t('reservation.noVehicleAvailable')}</option>
            ) : (
              <>
                <option value="">{t('common.selectVehicle')}</option>
                {availableVehicles?.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model}
                  </option>
                ))}
              </>
            )}
          </select>
          {(errors.vehicleId || vehicleError) && (
            <span className="text-error text-xs mt-1">
              {errors.vehicleId || vehicleError}
            </span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('reservation.startDate')}</span>
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={getInputClassName("startDate")}
          />
          {errors.startDate && (
            <span className="text-error text-xs mt-1">{errors.startDate}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('reservation.endDate')}</span>
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={getInputClassName("endDate")}
          />
          {errors.endDate && (
            <span className="text-error text-xs mt-1">{errors.endDate}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('reservation.totalAmount')}</span>
          </label>
          <input
            type="number"
            name="totalAmount"
            value={formData.totalAmount}
            readOnly
            className={getInputClassName("totalAmount")}
          />
          {errors.totalAmount && (
            <span className="text-error text-xs mt-1">{errors.totalAmount}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('reservation.deliveryLocation')}</span>
          </label>
          <input
            type="text"
            name="deliveryLocation"
            value={formData.deliveryLocation}
            onChange={handleChange}
            className={getInputClassName("deliveryLocation")}
          />
          {errors.deliveryLocation && (
            <span className="text-error text-xs mt-1">{errors.deliveryLocation}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('reservation.returnLocation')}</span>
          </label>
          <input
            type="text"
            name="returnLocation"
            value={formData.returnLocation}
            onChange={handleChange}
            className={getInputClassName("returnLocation")}
          />
          {errors.returnLocation && (
            <span className="text-error text-xs mt-1">{errors.returnLocation}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('reservation.additionalCharge')}</span>
          </label>
          <input
            type="number"
            name="additionalCharge"
            value={formData.additionalCharge}
            onChange={handleChange}
            className={getInputClassName("additionalCharge")}
            min={0}
          />
          {errors.additionalCharge && (
            <span className="text-error text-xs mt-1">{errors.additionalCharge}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('reservation.fuelLevel')}</span>
          </label>
          <input
            type="number"
            name="fuelLevel"
            value={formData.fuelLevel}
            onChange={handleChange}
            className={getInputClassName("fuelLevel")}
          />
          {errors.fuelLevel && (
            <span className="text-error text-xs mt-1">{errors.fuelLevel}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('reservation.departureKm')}</span>
          </label>
          <input
            type="number"
            name="departureKm"
            value={formData.departureKm}
            onChange={handleChange}
            className={getInputClassName("departureKm")}
          />
          {errors.departureKm && (
            <span className="text-error text-xs mt-1">{errors.departureKm}</span>
          )}
        </div>

        <div className="dropdown" ref={accessoriesRef}>
          <label className="label">
            <span className="label-text">{t('reservation.accessories')}</span>
          </label>
          <div
            tabIndex={0}
            className={`input input-bordered w-full flex items-center justify-between cursor-pointer ${
              errors.accessories ? "input-error" : ""
            }`}
            onClick={() => setAccessoriesOpen(!accessoriesOpen)}
          >
            <div className="truncate">
              {formData.accessories.length
                ? `${t('common.selected')} (${formData.accessories.length})`
                : t('reservation.selectAccessories')}
            </div>
            <div className="ml-2">▼</div>
          </div>
          {accessoriesOpen && (
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto"
            >
              {ALLOWED_ACCESSORIES.map((accessoryKey) => (
                <li key={accessoryKey}>
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.accessories.includes(accessoryKey)}
                      onChange={() => handleCheckboxChange(accessoryKey, "accessories")}
                      className="checkbox"
                    />
                    <span className="label-text">{t(accessoryKey)}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          {errors.accessories && (
            <span className="text-error text-xs mt-1">{errors.accessories}</span>
          )}
        </div>

        {/* Documents - DaisyUI Dropdown */}
        <div className="dropdown" ref={documentsRef}>
          <label className="label">
            <span className="label-text">{t('reservation.documents')}</span>
          </label>
          <div
            tabIndex={0}
            className={`input input-bordered w-full flex items-center justify-between cursor-pointer ${
              errors.documents ? "input-error" : ""
            }`}
            onClick={() => setDocumentsOpen(!documentsOpen)}
          >
            <div className="truncate">
              {formData.documents.length
                ? `${t('common.selected')} (${formData.documents.length})`
                : t('reservation.selectDocuments')}
            </div>
            <div className="ml-2">▼</div>
          </div>
          {documentsOpen && (
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto"
            >
              {ALLOWED_DOCUMENTS.map((documentKey) => (
                <li key={documentKey}>
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.documents.includes(documentKey)}
                      onChange={() => handleCheckboxChange(documentKey, "documents")}
                      className="checkbox"
                    />
                    <span className="label-text">{t(documentKey)}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          {errors.documents && (
            <span className="text-error text-xs mt-1">{errors.documents}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('reservation.note')}</span>
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            className={`textarea textarea-bordered w-full ${
              errors.note ? "textarea-error" : ""
            }`}
            rows="4"
          />
          {errors.note && (
            <span className="text-error text-xs mt-1">{errors.note}</span>
          )}
        </div>

        <div>
          <label className="label cursor-pointer">
            <span className="label-text">{t('reservation.secondDriver')}</span>
            <input
              type="checkbox"
              name="secondDriver"
              checked={formData.secondDriver}
              onChange={handleChange}
              className="checkbox"
            />
          </label>
          {errors.secondDriver && (
            <span className="text-error text-xs mt-1">{errors.secondDriver}</span>
          )}
        </div>

        {formData.secondDriver && (
          <div>
            <label className="label">
              <span className="label-text">{t('reservation.secondDriverClient')}</span>
            </label>
            <select
              name="clientSeconId"
              value={formData.clientSeconId}
              onChange={handleChange}
              className={getSelectClassName("clientSeconId")}
              disabled={clientsLoading}
            >
              <option value="">{t('reservation.selectSecondDriver')}</option>
              {clients
                .filter((client) => client.id !== parseInt(formData.clientId))
                .map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
            </select>
            {errors.clientSeconId && (
              <span className="text-error text-xs mt-1">{errors.clientSeconId}</span>
            )}
          </div>
        )}

        <div>
          <label className="label">
            <span className="label-text">{t('reservation.status')}</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={getSelectClassName("status")}
          >
            <option value="PENDING">{t('status.pending')}</option>
            <option value="CONFIRMED">{t('status.confirmed')}</option>
            <option value="COMPLETED">{t('status.completed')}</option>
            <option value="CANCELED">{t('status.canceled')}</option>
          </select>
          {errors.status && (
            <span className="text-error text-xs mt-1">{errors.status}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('reservation.paymentMethod')}</span>
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className= {getSelectClassName("paymentMethod")}
          >
            <option value="CASH">{t('payment.cash')}</option>
            <option value="CREDIT_CARD">{t('payment.creditCard')}</option>
            <option value="BANK_TRANSFER">{t('payment.bankTransfer')}</option>
          </select>
          {errors.paymentMethod && (
            <span className="text-error text-xs mt-1">{errors.paymentMethod}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('reservation.paymentStatus')}</span>
          </label>
          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            className={getSelectClassName("paymentStatus")}
          >
            <option value="PENDING">{t('status.pending')}</option>
            <option value="PAID">{t('payment.paid')}</option>
            <option value="FAILED">{t('payment.failed')}</option>
          </select>
          {errors.paymentStatus && (
            <span className="text-error text-xs mt-1">{errors.paymentStatus}</span>
          )}
        </div>

        <div className="col-span-1 md:col-span-3">
          <button
            type="submit"
            className="btn bg-sky-600 text-white w-full"
            disabled={isSaving || clientsLoading || vehiclesLoading}
          >
            {isSaving ? t('common.saving') : t('reservation.createReservation')}
          </button>
        </div>
      </form>
    </div>
  );
}