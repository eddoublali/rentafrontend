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
            <h3 className="text-lg font-semibold text-sky-600">Réservations</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2 ">{client.reservations.reduce((acc) => acc + 1, 0)}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <h3 className="text-lg font-semibold text-sky-600">Infractions</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2 ">{client.infractions.reduce((acc) => acc + 1, 0)}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <h3 className="text-lg font-semibold text-sky-600">Accidents</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2 ">0</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <h3 className="text-lg font-semibold text-sky-600">Revenus</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2 ">{ client.reservations.reduce((acc, res) => acc + res.totalAmount, 0)} MAD</p>
          </div>
        </div>

        {/* Client Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
              <p className="block text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-lg text-gray-900 ">{client.name || "N/A"}</p>
            </div>
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
              <p className="block text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg text-gray-900 ">{client.email || "N/A"}</p>
            </div>
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
              <p className="block text-sm font-medium text-gray-500">Phone</p>
              <p className="text-lg text-gray-900 ">{client.phone || "N/A"}</p>
            </div>
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
              <p className="block text-sm font-medium text-gray-500">Gender</p>
              <p className="text-lg text-gray-900 ">{client.gender || "N/A"}</p>
            </div>
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
              <p className="block text-sm font-medium text-gray-500">Nationality</p>
              <p className="text-lg text-gray-900 ">{client.nationality || "N/A"}</p>
            </div>
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
              <p className="block text-sm font-medium text-gray-500">Birth Date</p>
              <p className="text-lg text-gray-900 ">{formatDate(client.birthDate)}</p>
            </div>
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
              <p className="block text-sm font-medium text-gray-500">Address</p>
              <p className="text-lg text-gray-900 ">{client.address || "N/A"}</p>
            </div>
          </div>

          {/* Identification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
              <p className="block text-sm font-medium text-gray-500">CIN</p>
              <p className="text-lg text-gray-900 ">{client.cin || "N/A"}</p>
            </div>
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
              <p className="block text-sm font-medium text-gray-500">CIN Expiry</p>
              <p className="text-lg text-gray-900 ">{formatDate(client.cinExpiry)}</p>
            </div>
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
              <p className="block text-sm font-medium text-gray-500">License</p>
              <p className="text-lg text-gray-900 ">{client.license || "N/A"}</p>
            </div>
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
              <p className="block text-sm font-medium text-gray-500">License Expiry</p>
              <p className="text-lg text-gray-900 ">{formatDate(client.licenseExpiry)}</p>
            </div>
            {client.nationality !== "Moroccan" && (
              <>
                <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
                  <p className="block text-sm font-medium text-gray-500">Passport Number</p>
                  <p className="text-lg text-gray-900 ">{client.passportNumber || "N/A"}</p>
                </div>
                <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
                  <p className="block text-sm font-medium text-gray-500">Passport Expiry</p>
                  <p className="text-lg text-gray-900 ">{formatDate(client.passportExpiry)}</p>
                </div>
              </>
            )}
          </div>

          {/* Client Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
              <p className="block text-sm font-medium text-gray-500">Client Type</p>
              <p className="text-lg text-gray-900 ">{client.clientType || "N/A"}</p>
            </div>
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
              <p className="block text-sm font-medium text-gray-500">Blacklisted</p>
              <div className="text-lg ">
                {client.blacklisted ? (
                  <p className="inline-block bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">Yes</p>
                ) : (
                  <p className="inline-block bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">No</p>
                )}
              </div>
            </div>
          </div>

          {/* Company Information (if Enterprise) */}
          {client.clientType === "ENTERPRISE" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
                <p className="block text-sm font-medium text-gray-500">Company Name</p>
                <p className="text-lg text-gray-900 ">{client.companyName || "N/A"}</p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50 justify-between">
                <p className="block text-sm font-medium text-gray-500">Registration Number</p>
                <p className="text-lg text-gray-900 ">{client.registrationNumber || "N/A"}</p>
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
               
                    <span>{showCinImage ? "Masquer CIN" : "Voir CIN"}</span>
                  </button>
                  
                </div>
              ) : (
                <p className="text-gray-500">No CIN image available</p>
              )}
              {client.cinimage && showCinImage && (
                <div className="mt-4">
                  <img
                    src={getImageUrl(client.cinimage)}
                    alt="CIN"
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
                    <span>{showLicenseImage ? "Masquer Permis" : "Voir Permis"}</span>
                  </button>
                
                </div>
              ) : (
                <p className="text-gray-500">No license image available</p>
              )}
              {client.licenseimage && showLicenseImage && (
                <div className="mt-4">
                  <img
                    src={getImageUrl(client.licenseimage)}
                    alt="License"
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
              <h1 className="text-xl font-bold my-4">Liste des infractions</h1>
              <InfractionTable infractions={client.infractions} />
            </div>
            <div className="mt-8">
              <h1 className="text-xl font-bold my-4">Liste des contrats</h1>
              {/* Placeholder for contract list - you can add a similar table component here */}
              <p className="text-gray-500">Contract list to be implemented.</p>
            </div>
            <div className="mt-8">
              <h1 className="text-xl font-bold my-4">Lists des accidents</h1>
              {/* Placeholder for contract list - you can add a similar table component here */}
              <p className="text-gray-500">Contract list to be implemented.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}