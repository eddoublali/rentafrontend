import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  PlusCircle,
  MoreVertical,
  Filter,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useReservation } from "../../../context/ReservationContext";
import LoadingSpiner from "../../../components/LodingSpiner";
import ConfirmModal from "../../../components/ConfirmModal";
import { t } from "i18next";

export default function AllReservation() {
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const { reservations, fetchReservations, deleteReservation, loading } =
    useReservation();
  const [clientFilter, setClientFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const role = user?.role;

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = (id) => {
    setSelectedId(id);
    document.getElementById("confirm_delete_modal").showModal();
  };

  const confirmDelete = () => {
    deleteReservation(selectedId);
  };

  const filteredReservations = reservations.filter(
    (res) =>
      (clientFilter
        ? res.client.name.toLowerCase().includes(clientFilter.toLowerCase())
        : true) &&
      (brandFilter
        ? res.vehicle.brand.toLowerCase().includes(brandFilter.toLowerCase())
        : true)
  );

  if (loading) return <LoadingSpiner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {t("reservation.reservationList")}
        </h2>
        {role === "ADMIN" && (
          <button
            onClick={() => navigate("/reservations/add")}
            className="btn bg-sky-600 text-white"
          >
            <PlusCircle size={16} className="mr-2" />
            {t("reservation.addReservation")}
          </button>
        )}
      </div>
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

      {/* Filters */}
      <div
        className={`${
          showFilters ? "flex" : "hidden"
        } mb-4 flex space-x-4  md:flex md:flex-row md:justify-between`}
      >
        <input
          type="text"
          placeholder={t("reservation.serchbyclient")}
          className="input input-bordered w-1/2"
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
        />

        <input
          type="text"
          placeholder={t("reservation.serchbyBrand")}
          className="input input-bordered w-1/2"
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
        />
      </div>
      <div className="rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>{t("client.name")}</th>
              <th>{t("vehicle.brand")}</th>
              <th>{t("reservation.startDate")}</th>
              <th>{t("reservation.endDate")}</th>
              <th className="text-right">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-500">
                  <p className="text-lg">{t("reservation.noResults")}</p>
                  <p className="mt-2">
                    {t("reservation.addreservationmessage")}
                  </p>
                </td>
              </tr>
            ) : (
              filteredReservations.map((res, index) => (
                <tr key={index}>
                  <td>{res.client?.name}</td>
                  <td>{res.vehicle?.brand}</td>
                  <td>{new Date(res.startDate).toLocaleDateString()}</td>
                  <td>{new Date(res.endDate).toLocaleDateString()}</td>
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
                            onClick={() =>
                              navigate(`/reservations/view/${res.id}`)
                            }
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
                                onClick={() =>
                                  navigate(`/reservations/edit/${res.id}`)
                                }
                                className="flex items-center gap-2"
                              >
                                <Pencil size={16} />
                                {t("vehicle.edit")}
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleDelete(res.id)}
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
        title={t("reservation.deleteTitle")}
        message={t("reservation.deleteMessage")}
        onConfirm={confirmDelete}
        confirmText={t("common.confirm")}
        cancelText={t("common.cancel")}
      />
    </div>
  );
}
