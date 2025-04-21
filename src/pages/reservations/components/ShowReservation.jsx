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
          <h1 className="text-3xl font-bold">Reservation Details</h1>
          <button className="btn " onClick={() => navigate("/reservations")}>
            Back to Reservations
          </button>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            {/* Vehicle and Client Info */}
            <h2 className="card-title mb-4">Vehicle & Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between ">
                <p className="block text-sm font-medium text-gray-500 ">
                  Vehicle
                </p>
                <p className="text-lg text-gray-900 ">
                  {getVehicleName(reservation.vehicleId) || "N/A"}
                </p>
              </div>

              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  Primary Client
                </p>
                <p className="text-lg text-gray-900 ">
                  {getClientName(reservation.clientId) || "N/A"}{" "}
                </p>
              </div>

              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  Second Driver
                </p>
                <p className="text-lg text-gray-900 ">
                  {reservation.secondDriver && reservation.clientSeconId
                    ? getClientName(reservation.clientSeconId)
                    : "None"}
                </p>
              </div>
            </div>

            {/* Dates and Payment */}
            <h2 className="card-title mt-8 mb-4">Reservation Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  Start Date
                </p>
                <p className="text-lg text-gray-900 ">
                  {formatDate(reservation.startDate)}
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  End Date
                </p>
                <p className="text-lg text-gray-900 ">
                  {formatDate(reservation.endDate)}
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  Total Amount
                </p>
                <p className="text-lg text-gray-900 ">
                  {reservation.totalAmount?.toFixed(2) || "0.00"} DH
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  Additional Charge
                </p>
                <p className="text-lg text-gray-900 ">
                  {reservation.additionalCharge?.toFixed(2) || "0.00"} DH
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  Payment Method
                </p>
                <p className="text-lg text-gray-900 ">
                  {reservation.paymentMethod || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  Payment Status
                </p>
                <p className="text-lg text-gray-900 ">
                  {reservation.paymentStatus || "N/A"}
                </p>
              </div>
            </div>

            {/* Locations */}
            <h2 className="card-title mt-8 mb-4">Location Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  Delivery Location
                </p>
                <p className="text-lg text-gray-900 ">
                  {reservation.deliveryLocation || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  Return Location
                </p>
                <p className="text-lg text-gray-900 ">
                  {reservation.returnLocation || "N/A"}
                </p>
              </div>
            </div>

            {/* Vehicle Status */}
            <h2 className="card-title mt-8 mb-4">Vehicle Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  Fuel Level
                </p>
                <p className="text-lg text-gray-900 ">
                  {reservation.fuelLevel?.toFixed(2) || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  Departure Km
                </p>
                <p className="text-lg text-gray-900 ">
                  {reservation.departureKm?.toFixed(2) || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                  Status
                </p>
                <p className="text-lg text-gray-900 ">
                  {reservation.status || "N/A"}
                </p>
              </div>
            </div>

            {/* Accessories and Documents */}
            <h2 className="card-title mt-8 mb-4">Additional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between">
                <p className="block text-sm font-medium text-gray-500">
                Accessories
                </p>
                <div className="text-lg text-gray-900 ">
                  {reservation.accessories && reservation.accessories.length > 0 ? (
                    <ul className="list text-lg text-gray-900 ">
                      {reservation.accessories.map((doc, index) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  ) : (
                    "None"
                  )}
                </div>
              </div>
              {/* <div className="flex items-center gap-2 p-5 rounded bg-gray-50 ">
                <p className="block text-sm font-medium text-gray-500">
                  Accessories
                </p>
                <p className="text-lg text-gray-900 ">
                  {formatArray(reservation.accessories) || "N/A"}
                </p>
              </div> */}
              {/* <div className="flex items-center gap-2 p-5 rounded bg-gray-50">
                  <p className="block text-sm font-medium text-gray-500">Documents</p>
                <p className="text-lg text-gray-900 ">{formatArray(reservation.Documents)}</p>
              </div> */}
              <div className="flex items-center gap-2 p-5 rounded bg-gray-50">
                <p className="block text-sm font-medium text-gray-500">
                  Documents
                </p>
                <div className="text-lg text-gray-900 ">
                  {reservation.documents && reservation.documents.length > 0 ? (
                    <ul className="list text-lg text-gray-900  ">
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
            <h2 className="card-title mt-8 mb-4">Notes</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-5 rounded bg-gray-50">
                <p className="text-lg text-gray-900 text-center">
                  {reservation.note || "No notes available"}
                </p>
              </div>
            </div>

            {/* Back Button
            <div className="mt-8">
              <button
                className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-600 transition-colors duration-200"
                onClick={() => navigate("/reservations")}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Reservations
              </button> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
