import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReservation } from "../../../context/ReservationContext";
import { useVehicle } from "../../../context/VehicleContext";
import { useClient } from "../../../context/ClientContext";
import { ArrowLeft } from "lucide-react";
import LoadingSpiner from "../../../components/LodingSpiner";
import { t } from "i18next";

export default function ShowReservation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchReservationById } = useReservation();
  const { vehicles, fetchVehicles, loading: vehiclesLoading } = useVehicle();
  const { clients, fetchClients, loading: clientsLoading } = useClient();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  

  useEffect(() => {
    const loadReservation = async () => {
      setLoading(true);
      setError("");
      try {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
          throw new Error("Invalid reservation ID");
        }

        const response = await fetchReservationById(numericId);
        if (!response || !response.success || !response.data) {
          throw new Error("Reservation not found");
        }

        setReservation(response.data);

        // Fetch related data
        await fetchVehicles();
        await fetchClients();
      } catch (err) {
        console.log(
          "Error fetching reservation:",
          JSON.stringify(err, null, 2)
        );
        setError(err.message || "Failed to load reservation data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadReservation();
    }
  }, [id]);

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles?.find((v) => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : "Unknown Vehicle";
  };

  const getClientName = (clientId) => {
    const client = clients?.find((c) => c.id === clientId);
    return client ? client.name : "Unknown Client";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatArray = (arr) => {
    return arr && arr.length > 0 ? arr.join(", ") : "None";
  };

  if (loading || vehiclesLoading || clientsLoading) {
    return <LoadingSpiner />;
  }

  if (error || !reservation) {
    return (
      <>
        <div className=" py-10 text-gray-500 items-center">
          <h1 className="text-xl font-semibold text-error">
            {t("common.reservationNotFound")}
          </h1>
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

  return (
    <div className="  p-6 min-h-screen">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t("reservation.ReservationDetails")} </h1>
          <button className="btn " onClick={() => navigate("/reservations")}>
          {t("reservation.Back")}
          </button>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            {/* Vehicle and Client Info */}
            <h2 className="card-title mb-4">{t("reservation.VehicleClientInfo")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex w-full justify-between items-center p-5 rounded bg-gray-50">
                <p className="text-sm font-medium text-gray-500">
                {t("reservation.vehicle")}
                </p>
                <p className="text-lg text-gray-900  text-right">
                  {getVehicleName(reservation.vehicleId) || "N/A"}
                </p>
              </div>
   


              <div className="flex gap-2 p-5 rounded bg-gray-50 w-full  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                {t("reservation.PrimaryClient")}
                </p>
                <p className="text-lg text-gray-900  text-right">
                  {getClientName(reservation.clientId) || "N/A"}{" "}
                </p>
              </div>

              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                {t("reservation.secondDriver")}
                </p>
                <p className="text-lg text-gray-900  text-right">
                  {reservation.secondDriver && reservation.clientSeconId
                    ? getClientName(reservation.clientSeconId)
                    : "None"}
                </p>
              </div>
            </div>

            {/* Dates and Payment */}
            <h2 className="card-title mt-8 mb-4">{t("reservation.ReservationDetails")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                {t("reservation.startDate")}
                </p>
                <p className="text-lg text-gray-900  text-right">
                  {formatDate(reservation.startDate)}
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                {t("reservation.endDate")}
                </p>
                <p className="text-lg text-gray-900  text-right">
                  {formatDate(reservation.endDate)}
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                {t("reservation.totalAmount")}
                </p>
                <p className="text-lg text-gray-900  text-right">
                  {reservation.totalAmount?.toFixed(2) || "0.00"} {t("vehicle.dh")}
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                {t("reservation.additionalCharge")}

                </p>
                <p className="text-lg text-gray-900  text-right">
                  {reservation.additionalCharge?.toFixed(2) || "0.00"} {t("vehicle.dh")}
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                {t("reservation.paymentMethod")}
                </p>
                <p className="text-lg text-gray-900  text-right">
                  {reservation.paymentMethod || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                {t("reservation.paymentStatus")}
                </p>
                <p className="text-lg text-gray-900  text-right">
                  {reservation.paymentStatus || "N/A"}
                </p>
              </div>
            </div>

            {/* Locations */}
            <h2 className="card-title mt-8 mb-4">{t("reservation.LocationInformation")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  {t("reservation.deliveryLocation")}
                </p>
                <p className="text-lg text-gray-900  text-right">
                  {reservation.deliveryLocation || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                 {t("reservation.returnLocation")}
                </p>
                <p className="text-lg text-gray-900  text-right">
                  {reservation.returnLocation || "N/A"}
                </p>
              </div>
            </div>

            {/* Vehicle Status */}
            <h2 className="card-title mt-8 mb-4">{t("reservation.VehicleStatus")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  {t("reservation.fuelLevel")}
                </p>
                <p className="text-lg text-gray-900  text-right">
                  {reservation.fuelLevel?.toFixed(2) || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                    {t("reservation.departureKm")}
                </p>
                <p className="text-lg text-gray-900  text-right">
                  {reservation.departureKm?.toFixed(2) || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  {t("reservation.status")}
                </p>
                <p className="text-lg text-gray-900  text-right">
                  {reservation.status || "N/A"}
                </p>
              </div>
            </div>

            {/* Accessories and Documents */}
            <h2 className="card-title mt-8 mb-4">{t("reservation.AdditionalDetails")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                {t("reservation.accessories")}
                </p>
                <div className="text-lg text-gray-900  text-right">
                  {reservation.accessories && reservation.accessories.length > 0 ? (
                    <ul className="list text-lg text-gray-900  text-right">
                      {reservation.accessories.map((doc, index) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  ) : (
                    "None"
                  )}
                </div>
              </div>
          
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50">
                <p className="block text-sm font-medium text-gray-500">
                {t("reservation.documents")}
                </p>
                <div className="text-lg text-gray-900  text-right">
                  {reservation.documents && reservation.documents.length > 0 ? (
                    <ul className="list text-lg text-gray-900  text-right ">
                      {reservation.documents.map((doc, index) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  ) : (
                    "None"
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <h2 className="card-title mt-8 mb-4">{t("reservation.Notes")}</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-5 rounded bg-gray-50">
                <p className="text-lg text-gray-900  text-center">
                  {reservation.note || "No notes available"}
                </p>
              </div>
            </div>

          
          </div>
        </div>
      </div>
    </div>
  );
}
