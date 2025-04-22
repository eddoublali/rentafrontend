import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, PlusCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useInfraction } from "../../../context/InfractionContext";
import LoadingSpiner from "../../../components/LodingSpiner";
import ConfirmModal from "../../../components/ConfirmModal";
import InfractionTable from "./InfractionTable";
import { t } from "i18next";
const INFRACTION_TYPES = [
  'SPEEDING',
  'PARKING',
  'RED_LIGHT',
  'NO_INSURANCE',
  'DRIVING_LICENSE',
  'OTHER'
];

export default function AllInfraction() {
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const { infractions, deleteInfraction, loading, fetchInfractions } = useInfraction();
  const [clientNameFilter, setClientNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const role = user?.role;

  useEffect(() => {
    fetchInfractions();
  }, []);

  const handleDelete = (id) => {
    setSelectedId(id);
    document.getElementById("confirm_delete_modal").showModal();
  };

  const confirmDelete = () => {
    deleteInfraction(selectedId);
  };

  const filteredInfractions = infractions?.filter((infraction) => {
    const clientNameMatch = !clientNameFilter || 
      (infraction.client && 
       infraction.client.name && 
       infraction.client.name.toLowerCase().includes(clientNameFilter.toLowerCase()));
    
    const typeMatch = !typeFilter || infraction.type === typeFilter;
    
    const statusMatch = !statusFilter || 
      (infraction.status && 
       infraction.status.toLowerCase() === statusFilter.toLowerCase());
    
    return clientNameMatch && typeMatch && statusMatch;
  });

  if (loading) return <LoadingSpiner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("infraction.infractionList")}</h2>
        {role === "ADMIN" && (
          <button
            onClick={() => navigate("/infractions/add")}
            className="btn bg-sky-600 text-white"
          >
            <PlusCircle size={16} className="mr-2" />
            {t("infraction.addInfraction")}
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

  
      <div className={`${
          showFilters ? "flex" : "hidden"
        } mb-4 md:flex flex-col md:flex-row gap-4 md:gap-4`}>
        <input
          type="text"
          placeholder={t("reservation.serchbyclient")}
          className="input input-bordered w-full md:w-1/3"
          value={clientNameFilter}
          onChange={(e) => setClientNameFilter(e.target.value)}
        />
      
        <select
          className="select select-bordered w-full md:w-1/3 cursor-pointer"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">{t("common.all")}</option>
          {INFRACTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`infraction.types.${type.toLowerCase()}`)}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered w-full md:w-1/3 cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">{t("common.all")}</option>
          <option value="pending">{t("status.pending")}</option>
          <option value="paid">{t("status.paid")}</option>
          <option value="unpaid">{t("status.unpaid")}</option>
        </select>
    
      </div>

      <InfractionTable 
        infractions={filteredInfractions} 
        handleDelete={handleDelete} 
        userRole={role}
      />

      <ConfirmModal
        id="confirm_delete_modal"
        title={t("infraction.deleteTitle")}
        message={t("infraction.deleteMessage")}
        onConfirm={confirmDelete}
        confirmText={t("common.confirm")}
        cancelText={t("common.cancel")}
      />
    </div>
  );
}