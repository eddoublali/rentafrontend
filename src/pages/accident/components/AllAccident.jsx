import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useAccident } from "../../../context/AccidentContext";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  MoreVertical,
  Filter,
} from "lucide-react";
import ConfirmModal from "../../../components/ConfirmModal";
import LoadingSpiner from "../../../components/LodingSpiner";
import { t } from "i18next";

export default function AllAccident() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { accidents, fetchAccidents, deleteAccident, loading: accidentLoading } = useAccident();
  const [selectedAccidentId, setSelectedAccidentId] = useState(null);
  const [searchVehicle, setSearchVehicle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const role = user?.role;
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAccidents();
  }, []);

  const filteredAccidents = accidents.filter((accident) => {
    const vehicleInfo = accident.vehicle?.plate_number?.toLowerCase() || "";
    const locationInfo = accident.location?.toLowerCase() || "";
    const dateInfo = accident.date || "";

    return (
      vehicleInfo.includes(searchVehicle.toLowerCase()) &&
      locationInfo.includes(searchLocation.toLowerCase()) &&
      dateInfo.includes(searchDate)
    );
  });

  const handleView = (id) => navigate(`/accidents/view/${id}`);
  const handleEdit = (id) => navigate(`/accidents/edit/${id}`);
  const handleDelete = (id) => {
    setSelectedAccidentId(id);
    document.getElementById("confirm_delete_modal").showModal();
  };
  const confirmDelete = () => deleteAccident(selectedAccidentId);

  const loading = authLoading || accidentLoading;
  if (loading) return <LoadingSpiner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("accident.allAccidents")}</h2>
        {role === "ADMIN" && (
          <button
            onClick={() => navigate("/accidents/add")}
            className="btn bg-sky-600 text-white"
          >
            <Plus size={16} />
            {t("accident.reportNewAccident")}
          </button>
        )}
      </div>

      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-sm flex items-center gap-1"
        >
          <Filter size={16} />
          {showFilters ? t("vehicle.hideFilters") : t("vehicle.showFilters")}
        </button>
      </div>

      <div
        className={`${
          showFilters ? "flex" : "hidden"
        } mb-4 flex-col md:flex md:flex-row md:justify-between gap-3 w-full items-center`}
      >
        <input
          type="text"
          placeholder={t("accident.searchByVehicle")}
          className="input input-bordered md:w-1/3"
          value={searchVehicle}
          onChange={(e) => setSearchVehicle(e.target.value)}
        />
        <input
          type="text"
          placeholder={t("accident.searchByLocation")}
          className="input input-bordered md:w-1/3"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <input
          type="date"
          placeholder={t("accident.searchByDate")}
          className="input input-bordered md:w-1/3"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>
      <div className="rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr className="bg-sky-100">
              <th>{t("accident.date")}</th>
              <th>{t("accident.vehicle")}</th>
              <th>{t("accident.location")}</th>
              <th>{t("accident.status")}</th>
              <th className="text-right">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccidents.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  <p className="text-lg">{t("accident.noAccidents")}</p>
                  <p className="mt-2">{t("accident.reportFirstAccident")}</p>
                </td>
              </tr>
            ) : (
              filteredAccidents?.map((accident, index) => (
                <tr key={index}>
                  <td>{new Date(accident.date).toLocaleDateString()}</td>
                  <td>{accident.vehicle?.plate_number || "N/A"}</td>
                  <td>{accident.location}</td>
                  <td>
                    <span className={`badge ${accident.status === "Resolved" ? "badge-success" : "badge-warning"}`}>
                      {accident.status}
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
                            onClick={() => handleView(accident.id)}
                            className="flex items-center gap-2"
                          >
                            <Eye size={16} />
                            {t("common.view")}
                          </button>
                        </li>
                        {role === "ADMIN" && (
                          <>
                            <li>
                              <button
                                onClick={() => handleEdit(accident.id)}
                                className="flex items-center gap-2"
                              >
                                <Pencil size={16} />
                                {t("common.edit")}
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleDelete(accident.id)}
                                className="flex items-center gap-2 text-error"
                              >
                                <Trash2 size={16} />
                                {t("common.delete")}
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
        title={t("accident.deleteTitle")}
        message={t("accident.deleteMessage")}
        onConfirm={confirmDelete}
        confirmText={t("common.confirm")}
        cancelText={t("common.cancel")}
      />
    </div>
  );
}