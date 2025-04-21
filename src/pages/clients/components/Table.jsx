import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useClient } from "../../../context/ClientContext";
import { Eye, Pencil, Trash2, UserPlus, MoreVertical } from "lucide-react";
import ConfirmModal from "../../../components/ConfirmModal";
import LoadingSpiner from "../../../components/LodingSpiner";

export default function AllClients() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { clients, fetchClients, deleteClient } = useClient();
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchCIN, setSearchCIN] = useState('');
  const [searchLicense, setSearchLicense] = useState('');
  const role = user?.role;

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients based on search criteria
  const filteredClients = clients.filter(client => {
    const lowerCaseName = client.name?.toLowerCase() || ''; // Default to an empty string if undefined
    const lowerCaseCIN = client.cin?.toLowerCase() || '';  // Default to an empty string if undefined
    const lowerCaseLicense = client.license?.toLowerCase() || '';  // Default to an empty string if undefined
  
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
        <h2 className="text-2xl font-bold">All Clients</h2>
        {role === "ADMIN" && (
          <button onClick={() => navigate("/clients/add")} className="btn bg-sky-600 text-white">
            <UserPlus size={16} />
            Add New Client
          </button>
        )}
      </div>

      {/* Search Filters */}
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search by Name"
          className="input input-bordered w-1/3"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by CIN"
          className="input input-bordered w-1/3"
          value={searchCIN}
          onChange={(e) => setSearchCIN(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by License"
          className="input input-bordered w-1/3"
          value={searchLicense}
          onChange={(e) => setSearchLicense(e.target.value)}
        />
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg">No clients available.</p>
          <p className="mt-2">Add your first client to get started.</p>
        </div>
      ) : (
        <div className=" rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients?.map((client, index) => (
                <tr key={index}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td className="text-right">
                    <div className="dropdown dropdown-end">
                      <div tabIndex={0} role="button" className="btn btn-xs btn-ghost">
                        <MoreVertical size={16} />
                      </div>
                      <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                          <button onClick={() => handleView(client.id)} className="flex items-center gap-2">
                            <Eye size={16} />
                            View
                          </button>
                        </li>
                        {role === "ADMIN" && (
                          <>
                            <li>
                              <button onClick={() => handleEdit(client.id)} className="flex items-center gap-2">
                                <Pencil size={16} />
                                Edit
                              </button>
                            </li>
                            <li>
                              <button onClick={() => handleDelete(client.id)} className="flex items-center gap-2 text-error">
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        id="confirm_delete_modal"
        title="Delete Confirmation"
        message="Are you sure you want to delete this client?"
        onConfirm={confirmDelete}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </div>
  );
}