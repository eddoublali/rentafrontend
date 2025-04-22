import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVehicle } from "../../../context/VehicleContext";
import LoadingSpiner from "../../../components/LodingSpiner";
import {
  FileText,
  Car,
  Edit,
  ArrowLeft,
  Eye,
  Calendar,
  DollarSign,
  Fuel,
  Tag,
  Shield,
  Hash,
  Palette,
} from "lucide-react";
import { t } from "i18next";
import { useAuth } from "../../../context/AuthContext";
const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, selectedVehicle: vehicle, getVehicleById } = useVehicle();
  const [activeImage, setActiveImage] = useState(null);
  const { user } = useAuth();
  const role = user?.role;

  useEffect(() => {
    if (id) {
      getVehicleById(id);
    }
  }, [id]);

  if (loading) {
    return <LoadingSpiner />;
  }

  if (!vehicle) {
    return (
      <>
        <div className="text-center py-10 text-gray-500 items-center">
          <h1 className="text-xl font-semibold text-error">
            {t("vehicle.vehiclenotfund")}
          </h1>
          <p className="mt-2"> {t("vehicle.notFoundmessage")}</p>

          <p className="mt-2">
            <button
              onClick={() => navigate("/vehicles")}
              className="mt-4 btn bg-sky-600 text-white  "
            >
              <ArrowLeft size={16} /> {t("vehicle.return")}
            </button>
          </p>
        </div>
      </>
    );
  }

  const renderDocumentImage = (url, alt) => {
    if (!url || url === "undefined") {
      return (
        <div className="flex flex-col items-center">
          <img
            src="/api/placeholder/150/150"
            alt={`${alt} placeholder`}
            className="w-24 h-24 object-cover rounded-md border border-base-200"
          />
          <span className="text-xs mt-1 text-center">{alt}</span>
        </div>
      );
    }

    // Handle PDF files
    if (url.endsWith(".pdf")) {
      return (
        <div className="flex flex-col items-center">
          <div
            className="w-24 h-24 flex flex-col items-center justify-center  rounded-md border border-base-300 cursor-pointer hover:bg-base-300 transition-colors"
            onClick={() => setActiveImage({ url, type: "pdf", title: alt })}
          >
            <FileText className="w-8 h-8 text-base-content opacity-70" />
            <span className="text-xs text-center mt-1">PDF</span>
          </div>
          <span className="text-xs mt-1 text-center">{alt}</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <img
          src={`http://localhost:3000${url}`}
          alt={alt}
          className="w-24 h-24 object-cover rounded-md border border-base-200 hover:scale-105 transition-transform cursor-pointer"
          onClick={() => setActiveImage({ url, type: "image", title: alt })}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/api/placeholder/150/150";
          }}
        />
        <span className="text-xs mt-1 text-center">{alt}</span>
      </div>
    );
  };

  return (
    <div className="card bg-base-100 p-6 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Car size={24} /> {vehicle.brand} {vehicle.model}
        </h2>
        <div className="space-x-2 flex">
        {role === "ADMIN" && (
          <>
          <button
            onClick={() => navigate(`/vehicles/edit/${id}`)}
            className="btn bg-sky-600 text-white  flex items-center gap-2 "
          >
            <Edit size={16} /> {t("vehicle.editvehicle")}
          </button>
          </>
        )}
          <button
            onClick={() => navigate("/vehicles")}
            className="btn btn-soft flex items-center gap-2 "
          >
            <ArrowLeft size={16} /> {t("vehicle.back")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Image */}
        <div className="card overflow-hidden border border-base-200 shadow-md h-64">
          {vehicle.image ? (
            <img
              src={`http://localhost:3000${vehicle.image}`}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/600/400";
              }}
            />
          ) : (
            <img
              src="/api/placeholder/600/400"
              alt="Vehicle placeholder"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Vehicle Information */}
        <div className="card  p-4 shadow-md">
          <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
            <Tag size={16} /> {t("vehicle.vehicleinfo")}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <span
                className={`badge ${
                  vehicle.status === "AVAILABLE"
                    ? "badge-success"
                    : vehicle.status === "RENTED"
                    ? "badge-warning"
                    : "badge-error"
                } gap-1 p-3`}
              >
                {t(`vehicle.${vehicle.status}`)}
              </span>
            </div>

            <p className="text-sm flex items-center gap-1">
              <span className="font-medium">{t("vehicle.dailyPrice")}:</span>
              {vehicle.dailyPrice?.toFixed(2)} {t("vehicle.dh")}
            </p>
            <p className="text-sm flex items-center gap-1">
              <span className="font-medium"> {t("vehicle.year")}:</span>{" "}
              {vehicle.year}
            </p>
            <p className="text-sm flex items-center gap-1">
              <span className="font-medium"> {t("vehicle.category")}:</span>{" "}
              {vehicle.category}
            </p>
            <p className="text-sm flex items-center gap-1">
              <span className="font-medium"> {t("vehicle.color")}:</span>{" "}
              {vehicle.color}
            </p>
            <p className="text-sm">
              <span className="font-medium"> {t("vehicle.doors")}:</span>{" "}
              {vehicle.doors}
            </p>
            <p className="text-sm flex items-center gap-1">
              <span className="font-medium"> {t("vehicle.fuelType")}:</span>{" "}
              {vehicle.fuelType}
            </p>
            <p className="text-sm">
              <span className="font-medium"> {t("vehicle.gearbox")}:</span>{" "}
              {vehicle.gearbox}
            </p>
            <p className="text-sm">
              <span className="font-medium"> {t("vehicle.mileage")}:</span>{" "}
              {vehicle.mileage?.toLocaleString()} km
            </p>
            <p className="text-sm">
              <span className="font-medium"> {t("vehicle.oilChange")}:</span>{" "}
              {vehicle.oilChange?.toLocaleString()
                ? new Date(vehicle.oilChange).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-sm flex items-center gap-1">
              <span className="font-medium">{t("vehicle.timingBelt")}:</span>{" "}
              {vehicle.timingBelt
                ? new Date(vehicle.timingBelt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Registration Details */}
        <div className="card  p-4 shadow-md">
          <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
            <FileText size={16} /> {t("vehicle.RegistrationDetails")}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {t("vehicle.plateNumber")}:
              </span>
              <span className="">{vehicle.plateNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {t("vehicle.chassisNumber")}:
              </span>
              <span className="">{vehicle.chassisNumber}</span>
            </div>

            <div className="divider my-2">{t("vehicle.Documents")}</div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
              {renderDocumentImage(
                vehicle.registrationCard,
                `${t("vehicle.registrationCard")}`
              )}
              {renderDocumentImage(
                vehicle.insurance,
                `${t("vehicle.insurance")}`
              )}
              {renderDocumentImage(
                vehicle.technicalVisit,
                `${t("vehicle.technicalVisit")}`
              )}
              {renderDocumentImage(
                vehicle.authorization,
                `${t("vehicle.authorization")}`
              )}
              {renderDocumentImage(
                vehicle.taxSticker,
                `${t("vehicle.taxSticker")}`
              )}
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="card  p-4 shadow-md">
          <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
            <DollarSign size={16} /> {t("vehicle.FinancialInformation")}
          </h3>

          <div className="overflow-x-auto">
            <table className="table table-zebra table-xs">
              <tbody>
                <tr>
                  <td className="font-medium text-sm">
                    {t("vehicle.purchasePrice")}
                  </td>
                  <td className="text-right text-sm">
                    ${vehicle.purchasePrice?.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium text-sm">
                    {t("vehicle.purchaseDate")}
                  </td>
                  <td className="text-right text-sm">
                    {vehicle.purchaseDate
                      ? new Date(vehicle.purchaseDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium text-sm">
                    {t("vehicle.monthlyPayment")}
                  </td>
                  <td className="text-right text-sm">
                    ${vehicle.monthlyPayment?.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium text-sm">
                    {t("vehicle.advancePayment")}
                  </td>
                  <td className="text-right text-sm">
                    ${vehicle.advancePayment?.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium text-sm">
                    {t("vehicle.paymentDay")}
                  </td>
                  <td className="text-right text-sm">
                    {vehicle.paymentDay || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium text-sm">
                    {t("vehicle.remainingMonths")}
                  </td>
                  <td className="text-right text-sm">
                    {vehicle.remainingMonths || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {activeImage && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-base-100 rounded-lg max-w-xl md:max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold">{activeImage.title}</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setActiveImage(null)}
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              {activeImage.type === "pdf" ? (
                <div className="text-center">
                  <FileText size={64} className="mx-auto mb-4 text-neutral" />
                  <p>{t("vehicle.PDFnotavailable")}</p>
                  <a
                    href={`http://localhost:3000${activeImage.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bg-sky-600 text-white mt-4"
                  >
                    <Eye size={16} className="mr-2" /> {t("vehicle.OpenPDF")}
                  </a>
                </div>
              ) : (
                <img
                  src={`http://localhost:3000${activeImage.url}`}
                  alt={activeImage.title}
                  className="max-w-full max-h-[70vh] object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/600/400";
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;
