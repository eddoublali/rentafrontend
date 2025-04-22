import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useClient } from "../../../context/ClientContext";
import {
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  MoreVertical,
  Filter,
} from "lucide-react";
import ConfirmModal from "../../../components/ConfirmModal";
import LoadingSpiner from "../../../components/LodingSpiner";
import { t } from "i18next";

export default function AllClients() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { clients, fetchClients, deleteClient } = useClient();
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchCIN, setSearchCIN] = useState("");
  const [searchLicense, setSearchLicense] = useState("");
  const role = user?.role;
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const lowerCaseName = client.name?.toLowerCase() || "";
    const lowerCaseCIN = client.cin?.toLowerCase() || "";
    const lowerCaseLicense = client.license?.toLowerCase() || "";

    return (
      lowerCaseName.includes(searchName.toLowerCase()) &&
      lowerCaseCIN.includes(searchCIN.toLowerCase()) &&
      lowerCaseLicense.includes(searchLicense.toLowerCase())
    );
  });

  const handleView = (id) => navigate(`/clients/view/${id}`);
  const handleEdit = (id) => navigate(`/clients/edit/${id}`);
  const handleDelete = (id) => {
    setSelectedClientId(id);
    document.getElementById("confirm_delete_modal").showModal();
  };
  const confirmDelete = () => deleteClient(selectedClientId);

  if (loading) return <LoadingSpiner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("client.allClients")}</h2>
        {role === "ADMIN" && (
          <button
            onClick={() => navigate("/clients/add")}
            className="btn bg-sky-600 text-white"
          >
            <UserPlus size={16} />
            {t("client.addNewClient")}
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
        } mb-4 flex space-x-4  md:flex md:flex-row md:justify-between`}
      >
        <input
          type="text"
          placeholder={t("client.name")}
          className="input input-bordered w-1/3"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder={t("client.searchByCIN")}
          className="input input-bordered w-1/3"
          value={searchCIN}
          onChange={(e) => setSearchCIN(e.target.value)}
        />
        <input
          type="text"
          placeholder={t("client.searchByLicense")}
          className="input input-bordered w-1/3"
          value={searchLicense}
          onChange={(e) => setSearchLicense(e.target.value)}
        />
      </div>
      <div className=" rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>{t("client.name")}</th>
              <th>{t("client.email")}</th>
              <th>{t("client.phone")}</th>
              <th className="text-right">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-500">
                  <p className="text-lg">{t("client.noClients")}</p>
                  <p className="mt-2">{t("client.addFirstClient")}</p>
                </td>
              </tr>
            ) : (
              filteredClients?.map((client, index) => (
                <tr key={index}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
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
                            onClick={() => handleView(client.id)}
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
                                onClick={() => handleEdit(client.id)}
                                className="flex items-center gap-2"
                              >
                                <Pencil size={16} />
                                {t("common.edit")}
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleDelete(client.id)}
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
        title={t("clients.deleteTitle")}
        message={t("clients.deleteMessage")}
        onConfirm={confirmDelete}
        confirmText={t("common.confirm")}
        cancelText={t("common.cancel")}
      />
    </div>
  );
}
