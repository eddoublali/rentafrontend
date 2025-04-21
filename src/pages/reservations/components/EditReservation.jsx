import React, { useState, useEffect, useRef } from "react";
import { useClient } from "../../../context/ClientContext";
import { useVehicle } from "../../../context/VehicleContext";
import { useReservation } from "../../../context/ReservationContext";
import { useNavigate, useParams } from "react-router-dom";
import { reservationSchema } from "./ReservationValidation";
import { t } from "i18next";
import { z } from "zod"; // Add this import for Zod
import { ArrowLeft } from "lucide-react";

export default function EditReservation({ title = "Edit Reservation" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { clients, fetchClients, loading: clientsLoading } = useClient();
  const {
    vehicles,
    fetchVehicles,
    fetchAvailableVehicles,
    availableVehicles,
    loading: vehiclesLoading,
    error: vehicleError,
  } = useVehicle();
  const {
    fetchReservationById,
    updateReservation,
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
    documents: [], // Lowercase for consistent access within component
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [accessoriesOpen, setAccessoriesOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const accessoriesRef = useRef(null);
  const documentsRef = useRef(null);

  // Use the actual values that the schema expects
  const ALLOWED_ACCESSORIES = [
    "Climatisation",
    "Gilet",
    "Triangle",
    "Roue de secours",
    "Post radio",
    "Siege bebe",
    "Extincteur",
  ];

  const ALLOWED_DOCUMENTS = [
    "Carte grise",
    "Assurance",
    "Vignette",
    "Visite technique",
    "Autorisation",
    "Contrat",
  ];

  // Translation map for display purposes
  const ACCESSORIES_TRANSLATION_KEYS = {
    "Climatisation": "accessories.climatisation",
    "Gilet": "accessories.vest",
    "Triangle": "accessories.triangle",
    "Roue de secours": "accessories.spareTire",
    "Post radio": "accessories.radio",
    "Siege bebe": "accessories.babySeat",
    "Extincteur": "accessories.fireExtinguisher",
  };

  const DOCUMENTS_TRANSLATION_KEYS = {
    "Carte grise": "documents.registrationCard",
    "Assurance": "documents.insurance",
    "Vignette": "documents.vignette",
    "Visite technique": "documents.technicalVisit",
    "Autorisation": "documents.authorization",
    "Contrat": "documents.contract",
  };

  // Fetch reservation and initialize form data
  useEffect(() => {
    const fetchData = async () => {
      if (!id || isNaN(id)) {
        setNotFound(true);
        return;
      }

      const response = await fetchReservationById(id);
      if (response.success && response.data) {
        const reservation = response.data;
        // Validate clientSeconId against clients
        const clientSeconExists = reservation.clientSeconId
          ? clients.some((c) => c.id === reservation.clientSeconId)
          : true;
        if (!clientSeconExists) {
          setErrors({ general: "Second driver client does not exist" });
        }
        
        // Handle the case where Documents may be capitalized in the API response
        const documentsList = reservation.Documents || reservation.documents || [];
        
        setFormData({
          vehicleId: reservation.vehicleId?.toString() || "",
          clientId: reservation.clientId?.toString() || "",
          startDate: reservation.startDate
            ? new Date(reservation.startDate).toISOString().split("T")[0]
            : "",
          endDate: reservation.endDate
            ? new Date(reservation.endDate).toISOString().split("T")[0]
            : "",
          totalAmount: reservation.totalAmount?.toString() || "",
          deliveryLocation: reservation.deliveryLocation || "",
          returnLocation: reservation.returnLocation || "",
          additionalCharge: reservation.additionalCharge?.toString() || "",
          fuelLevel: reservation.fuelLevel?.toString() || "",
          departureKm: reservation.departureKm?.toString() || "",
          secondDriver: reservation.secondDriver || false,
          clientSeconId: reservation.clientSeconId?.toString() || "",
          status: reservation.status || "PENDING",
          paymentMethod: reservation.paymentMethod || "CASH",
          paymentStatus: reservation.paymentStatus || "PENDING",
          note: reservation.note || "",
          accessories: reservation.accessories || [],
          documents: reservation.documents || [], // Use the normalized documents list
        });
        
        console.log("Loaded documents:", reservation.Documents); // Debug log to see what's being loaded
      } else {
        setNotFound(true);
      }
    };
    
    fetchClients();
    fetchVehicles();
    fetchData();
  }, [id]);

  // Fetch available vehicles
  useEffect(() => {
    if (formData.startDate && formData.endDate && id) {
      fetchAvailableVehicles(formData.startDate, formData.endDate, parseInt(id));
    }
  }, [formData.startDate, formData.endDate, id]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accessoriesRef.current && !accessoriesRef.current.contains(event.target)) {
        setAccessoriesOpen(false);
      }
      if (documentsRef.current && !documentsRef.current.contains(event.target)) {
        setDocumentsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate totalAmount
  useEffect(() => {
    if (formData.vehicleId && formData.startDate && formData.endDate) {
      const vehicle = vehicles.find((v) => v.id === parseInt(formData.vehicleId));
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
    }
  }, [
    formData.vehicleId,
    formData.startDate,
    formData.endDate,
    formData.additionalCharge,
    vehicles,
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
      }
      return { ...prev, [field]: [...current, item] };
    });
  };

  const validateForm = () => {
    try {
      reservationSchema.parse(formData);
      // Additional validation for clientSeconId
      if (formData.secondDriver && formData.clientSeconId) {
        const clientSeconExists = clients.some(
          (c) => c.id === parseInt(formData.clientSeconId)
        );
        if (!clientSeconExists) {
          throw new Error("Second driver client does not exist");
        }
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((issue) => {
          newErrors[issue.path[0]] = issue.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: error.message || "Validation failed" });
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const formattedData = {
        vehicleId: formData.vehicleId ? parseInt(formData.vehicleId) : undefined,
        clientId: formData.clientId ? parseInt(formData.clientId) : undefined,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : undefined,
        deliveryLocation: formData.deliveryLocation || undefined,
        returnLocation: formData.returnLocation || undefined,
        additionalCharge: formData.additionalCharge
          ? parseFloat(formData.additionalCharge)
          : undefined,
        fuelLevel: formData.fuelLevel ? parseFloat(formData.fuelLevel) : undefined,
        departureKm: formData.departureKm ? parseFloat(formData.departureKm) : undefined,
        secondDriver: formData.secondDriver,
        clientSeconId:
          formData.secondDriver && formData.clientSeconId && clients.some((c) => c.id === parseInt(formData.clientSeconId))
            ? parseInt(formData.clientSeconId)
            : undefined,
        status: formData.status || undefined,
        paymentMethod: formData.paymentMethod || undefined,
        paymentStatus: formData.paymentStatus || undefined,
        note: formData.note || undefined,
        accessories: formData.accessories.length > 0 ? formData.accessories : undefined,
        documents: formData.documents.length > 0 ? formData.documents : undefined, // Use capitalized "Documents" for backend
      };

      console.log("Sending to backend:", formattedData); // Debug
      const response = await updateReservation(id, formattedData);
      if (response.success) {
        navigate("/reservations");
      } else {
        setErrors({ general: response.error || "Failed to update reservation" });
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
      setErrors({
        general: error.response?.data?.message || "Something went wrong",
      });
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
  if (notFound) {
    return (
      <>
        <div className="text-center py-10 text-gray-500 items-center">
          <h1 className="text-xl font-semibold text-error">{t("common.reservationNotFound")}</h1>
          <p className="mt-2"> {t("reservation.notFoundmessage")}</p>

          <p className="mt-2">
            <button
              onClick={() => navigate("/reservations")}
              className="mt-4 btn bg-sky-600 text-white  "
            >
              <ArrowLeft size={16} /> {t("reservation.return")}
            </button>
          </p>
        </div>
      </>
    );
}

  

  // Combine available vehicles with the selected vehicle
  const reservationVehicle = vehicles.find((v) => v.id === parseInt(formData.vehicleId));
  const vehicleOptions = [
    ...(availableVehicles || []),
    ...(reservationVehicle && !availableVehicles?.some((v) => v.id === reservationVehicle.id)
      ? [reservationVehicle]
      : []),
  ];

  return (
    <div className="card bg-base-100 shadow-xl p-6">
     <div className="flex justify-between items-center mb-6">
     <h1 className="text-2xl font-bold mb-4">{title}</h1>
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">
            <span className="label-text">{t('reservation.client')}</span>
          </label>
          <select
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            className={getSelectClassName("clientId")}
            disabled={clientsLoading || reservationLoading}
          >
            <option value="">{t('common.selectClient')}</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.clientId && <span className="text-error text-xs mt-1">{errors.clientId}</span>}
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
            disabled={vehiclesLoading || reservationLoading}
          >
            <option value="">{t('common.selectVehicle')}</option>
            {vehicleOptions.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model}
              </option>
            ))}
          </select>
          {(errors.vehicleId || vehicleError) && (
            <span className="text-error text-xs mt-1">{errors.vehicleId || vehicleError}</span>
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
            disabled={reservationLoading}
          />
          {errors.startDate && <span className="text-error text-xs mt-1">{errors.startDate}</span>}
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
            disabled={reservationLoading}
          />
          {errors.endDate && <span className="text-error text-xs mt-1">{errors.endDate}</span>}
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
            disabled={reservationLoading}
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
            disabled={reservationLoading}
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
            disabled={reservationLoading}
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
            disabled={reservationLoading}
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
            disabled={reservationLoading}
          />
          {errors.fuelLevel && <span className="text-error text-xs mt-1">{errors.fuelLevel}</span>}
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
            disabled={reservationLoading}
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
              {ALLOWED_ACCESSORIES.map((accessory) => (
                <li key={accessory}>
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.accessories.includes(accessory)}
                      onChange={() => handleCheckboxChange(accessory, "accessories")}
                      className="checkbox"
                      disabled={reservationLoading}
                    />
                    <span className="label-text">
                      {ACCESSORIES_TRANSLATION_KEYS[accessory] 
                        ? t(ACCESSORIES_TRANSLATION_KEYS[accessory]) 
                        : accessory}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          {errors.accessories && (
            <span className="text-error text-xs mt-1">{errors.accessories}</span>
          )}
        </div>

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
              {ALLOWED_DOCUMENTS.map((document) => (
                <li key={document}>
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.documents.includes(document)}
                      onChange={() => handleCheckboxChange(document, "documents")}
                      className="checkbox"
                      disabled={reservationLoading}
                    />
                    <span className="label-text">
                      {DOCUMENTS_TRANSLATION_KEYS[document] 
                        ? t(DOCUMENTS_TRANSLATION_KEYS[document]) 
                        : document}
                    </span>
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
            rows={4}
            disabled={reservationLoading}
          />
          {errors.note && <span className="text-error text-xs mt-1">{errors.note}</span>}
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
              disabled={reservationLoading}
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
              disabled={clientsLoading || reservationLoading}
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
            disabled={reservationLoading}
          >
           <option value="PENDING">{t('status.pending')}</option>
            <option value="CONFIRMED">{t('status.confirmed')}</option>
            <option value="COMPLETED">{t('status.completed')}</option>
            <option value="CANCELED">{t('status.canceled')}</option>
          </select>
          {errors.status && <span className="text-error text-xs mt-1">{errors.status}</span>}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('reservation.paymentMethod')}</span>
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className={getSelectClassName("paymentMethod")}
            disabled={reservationLoading}
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
            disabled={reservationLoading}
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
            disabled={isSaving || clientsLoading || vehiclesLoading || reservationLoading}
          >
            {isSaving ? t('common.saving') : t('reservation.updateReservation')}
          </button>
        </div>
      </form>
    </div>
  );
}