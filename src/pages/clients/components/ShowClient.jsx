import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClient } from "../../../context/ClientContext";
import LoadingSpiner from "../../../components/LodingSpiner";
import { ArrowLeft, CreditCard,  IdCard } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import InfractionTable from "../../infraction/components/InfractionTable";
import { t } from "i18next";

export default function ShowClient() {
  const { fetchClientById } = useClient();
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const role = user?.role;
  const [showCinImage, setShowCinImage] = useState(false); // State for CIN image visibility
  const [showLicenseImage, setShowLicenseImage] = useState(false); // State for License image visibility

  useEffect(() => {
    const loadClient = async () => {
      setLoading(true);
      setError("");
      try {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
          throw new Error("Invalid client ID");
        }

        const response = await fetchClientById(numericId);
        if (!response || !response.success || !response.data) {
          throw new Error("Client not found");
        }

        setClient(response.data.client);
      } catch (err) {
        console.error("Error fetching client:", err);
        setError(err.message || "Failed to load client data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadClient();
    }
  }, [id]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    return new Date(isoDate).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `http://localhost:3000${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };



  const toggleImageVisibility = (imageType) => {
    if (imageType === "cin") {
      setShowCinImage(!showCinImage);
    } else {
      setShowLicenseImage(!showLicenseImage);
    }
  };

  if (loading) {
    return <LoadingSpiner />;
  }

  if (error || !client) {
    return (
      <>
        <div className="text-center py-10 text-gray-500 items-center">
          <h1 className="text-xl font-semibold text-error">{t("clients.clientNotFound")}</h1>
          <p className="mt-2"> {t("clients.notFoundmessage")}</p>
          <p className="mt-2">
            <button
              onClick={() => navigate("/clients")}
              className="mt-4 btn bg-sky-600 text-white  "
            >
              <ArrowLeft size={16} /> {t("clients.return")}
            </button>
          </p>
        </div>
      </>
    );
  }


return (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-7xl mx-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
          <h3 className="text-lg font-semibold text-sky-600">{t("reservation.reservationList")}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2 ">{client.reservations.reduce((acc) => acc + 1, 0)}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
          <h3 className="text-lg font-semibold text-sky-600">{t("infraction.infractions")}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2 ">{client.infractions.reduce((acc) => acc + 1, 0)}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
          <h3 className="text-lg font-semibold text-sky-600">{t("client.accidents")}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2 ">0</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
          <h3 className="text-lg font-semibold text-sky-600">{t("client.revenues")}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2 ">{ client.reservations.reduce((acc, res) => acc + res.totalAmount, 0)} MAD</p>
        </div>
      </div>

      {/* Client Details */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
            <p className="block text-lg  font-medium text-gray-500">{t("client.name")}</p>
            <p className="text-lg text-gray-900 ">{client.name || t("common.na")}</p>
          </div>
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
            <p className="block text-lg font-medium text-gray-500">{t("client.email")}</p>
            <p className="text-lg text-gray-900 ">{client.email || t("common.na")}</p>
          </div>
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
            <p className="block text-lg font-medium text-gray-500">{t("client.phone")}</p>
            <p className="text-lg text-gray-900 ">{client.phone || t("common.na")}</p>
          </div>
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
            <p className="block text-lg font-medium text-gray-500">{t("client.gender")}</p>
            <p className="text-lg text-gray-900 ">{client.gender || t("common.na")}</p>
          </div>
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
            <p className="block text-lg font-medium text-gray-500">{t("client.nationality")}</p>
            <p className="text-lg text-gray-900 ">{client.nationality || t("common.na")}</p>
          </div>
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
            <p className="block text-lg font-medium text-gray-500">{t("client.birthDate")}</p>
            <p className="text-lg text-gray-900 ">{formatDate(client.birthDate)}</p>
          </div>
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
            <p className="block text-lg font-medium text-gray-500">{t("client.address")}</p>
            <p className="text-lg text-gray-900 ">{client.address || t("common.na")}</p>
          </div>
        </div>

        {/* Identification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
            <p className="block text-lg font-medium text-gray-500">{t("client.cin")}</p>
            <p className="text-lg text-gray-900 ">{client.cin || t("common.na")}</p>
          </div>
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
            <p className="block text-lg font-medium text-gray-500">{t("client.cinExpiry")}</p>
            <p className="text-lg text-gray-900 ">{formatDate(client.cinExpiry)}</p>
          </div>
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
            <p className="block text-lg font-medium text-gray-500">{t("client.license")}</p>
            <p className="text-lg text-gray-900 ">{client.license || t("common.na")}</p>
          </div>
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
            <p className="block text-lg font-medium text-gray-500">{t("client.licenseExpiry")}</p>
            <p className="text-lg text-gray-900 ">{formatDate(client.licenseExpiry)}</p>
          </div>
          {client.nationality !== t("nationalities.moroccan") && (
            <>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
                <p className="block text-lg font-medium text-gray-500">{t("client.passportNumber")}</p>
                <p className="text-lg text-gray-900 ">{client.passportNumber || t("common.na")}</p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
                <p className="block text-lg font-medium text-gray-500">{t("client.passportExpiry")}</p>
                <p className="text-lg text-gray-900 ">{formatDate(client.passportExpiry)}</p>
              </div>
            </>
          )}
        </div>

        {/* Client Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
            <p className="block text-lg font-medium text-gray-500">{t("client.clientType")}</p>
            <p className="text-lg text-gray-900 ">{client.clientType || t("common.na")}</p>
          </div>
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
            <p className="block text-lg font-medium text-gray-500">{t("client.blacklistClient")}</p>
            <div className="text-lg ">
              {client.blacklisted ? (
                <p className="inline-block bg-red-100 text-red-800 text-lg font-medium px-2.5 py-0.5 rounded">{t("common.yes")}</p>
              ) : (
                <p className="inline-block bg-green-100 text-green-800 text-lg font-medium px-2.5 py-0.5 rounded">{t("common.no")}</p>
              )}
            </div>
          </div>
        </div>

        {/* Company Information (if Enterprise) */}
        {client.clientType === "ENTERPRISE" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
              <p className="block text-lg font-medium text-gray-500">{t("client.companyName")}</p>
              <p className="text-lg text-gray-900 ">{client.companyName || t("common.na")}</p>
            </div>
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
              <p className="block text-lg font-medium text-gray-500">{t("client.registrationNumber")}</p>
              <p className="text-lg text-gray-900 ">{client.registrationNumber || t("common.na")}</p>
            </div>
          </div>
        )}

        {/* Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {client.cinimage ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleImageVisibility("cin")}
                  className="flex items-center gap-2 bg-sky-600 text-white rounded-lg px-4 py-2 hover:bg-sky-700 transition"
                >
                  <IdCard size={20} />
                  <span>{showCinImage ? t("client.hideCin") : t("client.showCin")}</span>
                </button>
              </div>
            ) : (
              <p className="text-gray-500">{t("client.noCinImage")}</p>
            )}
            {client.cinimage && showCinImage && (
              <div className="mt-4">
                <img
                  src={getImageUrl(client.cinimage)}
                  alt={t("client.cin")}
                  className="w-full max-w-xs rounded-lg shadow-sm"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              </div>
            )}
          </div>
          <div>
            {client.licenseimage ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleImageVisibility("license")}
                  className="flex items-center gap-2 bg-sky-600 text-white rounded-lg px-4 py-2 hover:bg-sky-700 transition"
                >
                  <CreditCard size={20} />
                  <span>{showLicenseImage ? t("client.hideLicense") : t("client.showLicense")}</span>
                </button>
              </div>
            ) : (
              <p className="text-gray-500">{t("client.noLicenseImage")}</p>
            )}
            {client.licenseimage && showLicenseImage && (
              <div className="mt-4">
                <img
                  src={getImageUrl(client.licenseimage)}
                  alt={t("client.license")}
                  className="w-full max-w-xs rounded-lg shadow-sm"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              </div>
            )}
          </div>
        </div>

        {/* Infraction and Contract Lists */}
        <div>
          <div className="mt-8">
            <h1 className="text-xl font-bold my-4">{t("infraction.infractionList")}</h1>
            <InfractionTable infractions={client.infractions} />
          </div>
          <div className="mt-8">
            <h1 className="text-xl font-bold my-4">{t("contract.contractList")}</h1>
            {/* Placeholder for contract list - you can add a similar table component here */}
            <p className="text-gray-500">{t("contract.toBeImplemented")}</p>
          </div>
          <div className="mt-8">
            <h1 className="text-xl font-bold my-4">{t("client.accidentList")}</h1>
            {/* Placeholder for contract list - you can add a similar table component here */}
            <p className="text-gray-500">{t("client.toBeImplemented")}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}