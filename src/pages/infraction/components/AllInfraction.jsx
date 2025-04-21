import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useInfraction } from "../../../context/InfractionContext";
import LoadingSpiner from "../../../components/LodingSpiner";
import ConfirmModal from "../../../components/ConfirmModal";
import InfractionTable from "./InfractionTable";
import { t } from "i18next";

export default function AllInfraction() {
  const { user } = useAuth();
  const { infractions, deleteInfraction, loading } = useInfraction();
  const [licensePlateFilter, setLicensePlateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const role = user?.role;

  

  const handleDelete = (id) => {
    setSelectedId(id);
    document.getElementById("confirm_delete_modal").showModal();
  };

  const confirmDelete = () => {
    deleteInfraction(selectedId);
  };

  const filteredInfractions = infractions?.filter((infraction) =>
    (licensePlateFilter ? 
      infraction.vehicle?.licensePlate.toLowerCase().includes(licensePlateFilter.toLowerCase()) : 
      true) &&
    (typeFilter ? 
      infraction.type.toLowerCase().includes(typeFilter.toLowerCase()) : 
      true)
  );

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

      {/* Filters */}
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="License Plate"
          className="input input-bordered w-1/2"
          value={licensePlateFilter}
          onChange={(e) => setLicensePlateFilter(e.target.value)}
        />
      
        <input
          type="text"
          placeholder="Infraction Type"
          className="input input-bordered w-1/2"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        />
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