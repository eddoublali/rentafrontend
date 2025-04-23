import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVehicle } from "../../../context/VehicleContext";
import LoadingSpiner from "../../../components/LodingSpiner";
import ConfirmModal from "../../../components/ConfirmModal";
import { useAuth } from "../../../context/AuthContext";
import { CarFront, Eye, Pencil, Trash2, MoreVertical, Filter } from "lucide-react";
import { t } from "i18next";


const VehicleStatus = {
  AVAILABLE: "AVAILABLE",
  RENTED: "RENTED",
  MAINTENANCE: "MAINTENANCE",
};

const FuelType = {
  GASOLINE: "GASOLINE",
  DIESEL: "DIESEL",
  ELECTRIC: "ELECTRIC",
  HYBRID: "HYBRID",
};

export default function AllVehicles() {
  const { user } = useAuth();
  const { vehicles, loading, fetchVehicles, removeVehicle } = useVehicle();
  const navigate = useNavigate();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [brandFilter, setBrandFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const role = user?.role;
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleView = (id) => navigate(`/vehicles/view/${id}`);
  const handleEdit = (id) => navigate(`/vehicles/edit/${id}`);
  const handleDelete = (id) => {
    setSelectedVehicleId(id);
    document.getElementById("confirm_delete_modal").showModal();
  };

  const confirmDelete = () => {
    removeVehicle(selectedVehicleId);
  };


  const getStatusDisplayName = (status) => {
    return VehicleStatus[status] || status;
  };


  const uniqueBrands = [...new Set(vehicles.map((vehicle) => vehicle.brand))];


  const filteredVehicles = vehicles.filter((vehicle) => {
    return (
      (brandFilter ? vehicle.brand === brandFilter : true) &&
      (statusFilter ? vehicle.status === statusFilter : true) &&
      (fuelFilter ? (vehicle.fuelType || "GASOLINE") === fuelFilter : true)
    );
  });

  if (loading) return <LoadingSpiner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("vehicle.vehicleList")}</h2>
        {role === "ADMIN" && (
          <div className="tooltip" data-tip="Ajouter une nouvelle voiture">
            <button
              onClick={() => navigate("/vehicles/add")}
              className="btn bg-sky-600 text-white"
            >
              <CarFront className="mr-2" size={16} />
              {t("vehicle.addVehicle")}
            </button>
          </div>
        )}
      </div>

     

<div className="">
      {/* Toggle Filter Icon on Small Screens */}
      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-sm flex items-center gap-1"
        >
          <Filter size={16} />
          {showFilters ? t("vehicle.hideFilters") : t("vehicle.showFilters")}
        </button>
      </div>

      {/* Filter Dropdowns */}
      <div
        className={`${
          showFilters ? "flex" : "hidden"
        } flex-col md:flex md:flex-row gap-3 mb-6 items-center md:justify-between`}
      >
        <label className="select">
          <span className="label">{t("vehicle.brand")}</span>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="">{t("vehicle.all")}</option>
            {uniqueBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>

        <label className="select">
          <span className="label">{t("vehicle.status")}</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="">{t("vehicle.all")}</option>
            {Object.entries(VehicleStatus).map(([key, value]) => (
              <option key={key} value={key}>
                {t(`vehicle.${value}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="select">
          <span className="label">{t("vehicle.fuelType")}</span>
          <select
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="">{t("vehicle.all")}</option>
            {Object.entries(FuelType).map(([key, value]) => (
              <option key={key} value={key}>
                {t(`vehicle.${value}`)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
    <div className="rounded-box border border-base-content/5 bg-base-100 ">
          <table className="table">
            <thead>
              <tr className="bg-sky-100">
                <th >{t("vehicle.brand")}</th>
                <th>{t("vehicle.model")}</th>
                <th  className="hidden md:table-cell">{t("vehicle.plateNumber")}</th>
                <th>{t("vehicle.dailyPrice")}</th>
                <th>{t("vehicle.status")}</th>
                <th className="text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody >

      {filteredVehicles.length === 0 ? (
        <tr>
        <td colSpan={6} className="text-center py-10 text-gray-500 ">
          <p className="text-lg">{t("vehicle.noVehicles")}</p>
          <p className="mt-2">{t("vehicle.addFirstVehicle")}</p>
        </td>
        </tr>
      ) : (      
              filteredVehicles.map((vehicle, index) => (
                <tr key={vehicle.id ?? `vehicle-${index}`}>
                  <td>{vehicle.brand ?? "N/A"}</td>
                  <td>{vehicle.model ?? "N/A"}</td>
                  <td  className="hidden md:table-cell">{vehicle.plateNumber ?? "N/A"}</td>
                  <td >${vehicle.dailyPrice?.toFixed(2) ?? "N/A"}</td>
                  <td>
                  <span
                      className={`badge  ${
                        vehicle.status === "AVAILABLE"
                          ? 'bg-green-100 text-green-600'
                          : vehicle.status === "RENTED"
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      } gap-1 p-3`}
                    >
                      {t(`vehicle.${vehicle.status}`)}
                    </span>
                  </td>
                  <td className={`text-${t("dropdown")}`}>
                    <div className="dropdown dropdown-end">
                      <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-xs btn-ghost"
                      >
                        <MoreVertical size={16} />
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52"
                      >
                        <li>
                          <button
                            onClick={() => handleView(vehicle.id)}
                            className="flex items-center gap-2"
                          >
                            <Eye size={16} />
                            {t("vehicle.viewDetails")}
                          </button>
                        </li>
                        {role === "ADMIN" && (
                          <>
                            <li>
                              <button
                                onClick={() => handleEdit(vehicle.id)}
                                className="flex items-center gap-2"
                              >
                                <Pencil size={16} />
                                {t("vehicle.edit")}
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleDelete(vehicle.id)}
                                className="flex items-center gap-2 text-error"
                              >
                                <Trash2 size={16} />
                                {t("vehicle.delete")}
                              </button>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      

      <ConfirmModal
        id="confirm_delete_modal"
        title={t("vehicle.deleteTitle")}
        message={t("vehicle.deleteMessage")} // "Êtes-vous sûr de vouloir supprimer cette voiture ?"
        onConfirm={confirmDelete}
        confirmText={t("common.confirm")} //"Oui, Supprimer"
        cancelText={t("common.cancel")}
      />
    </div>
  );
}
