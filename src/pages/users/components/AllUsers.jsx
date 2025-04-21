import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { Eye, Pencil, Trash2, UserPlus, MoreVertical } from "lucide-react";
import ConfirmModal from "../../../components/ConfirmModal";
import LoadingSpiner from "../../../components/LodingSpiner";
import { useAuth } from "../../../context/AuthContext";

export default function AllUsers() {
  const { user } = useAuth();
  const { users, loading, fetchUsers, deleteUser } = useUser();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const role = user?.role;

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = useCallback(
    (id) => {
      if (id) navigate(`/users/view/${id}`);
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id) => {
      if (id) navigate(`/users/edit/${id}`);
    },
    [navigate]
  );

  const handleDelete = useCallback((id) => {
    setSelectedUserId(id);
    const modal = document.getElementById("confirm_delete_modal");
    if (modal?.showModal) {
      modal.showModal();
    }
  }, []);

  const confirmDelete = useCallback(() => {
    if (selectedUserId) {
      deleteUser(selectedUserId);
      setSelectedUserId(null);
    }
  }, [deleteUser, selectedUserId]);

  const filteredUsers = Array.isArray(users) 
    ? users.filter((user) => 
        (nameFilter ? user?.name?.toLowerCase().includes(nameFilter.toLowerCase()) : true) &&
        (emailFilter ? user?.email?.toLowerCase().includes(emailFilter.toLowerCase()) : true) &&
        (roleFilter ? user?.role?.toLowerCase() === roleFilter.toLowerCase() : true)
      )
    : [];

  if (loading) return <LoadingSpiner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Users</h2>
        {role === "ADMIN" && (
        <button
          onClick={() => navigate("/users/add")}
          className="btn bg-sky-600 text-white"
          aria-label="Add new user"
          title="Add new user"
        >
          <UserPlus size={16} />
          Add New User
        </button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by name"
          className="input input-bordered flex-1"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        
        <input
          type="text"
          placeholder="Search by email"
          className="input input-bordered flex-1"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
        />
        
        <select
          className="select select-bordered flex-1"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg">No users match your search criteria.</p>
          <p className="mt-2">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="rounded-box border border-base-content/5 bg-base-100 mt-">
          <table className="table">
            <thead>
              <tr>
            
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user?.id ?? `user-${index}`}>
                
                  <td>{user?.name ?? "N/A"}</td>
                  <td>{user?.email ?? "N/A"}</td>
                  <td className="capitalize">{user?.role ?? "unknown"}</td>
                  <td className="text-right">
                    <div className="dropdown dropdown-end">
                      <div tabIndex={0} role="button" className="btn btn-xs btn-ghost">
                        <MoreVertical size={16} />
                      </div>
                      <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                          <button onClick={() => handleView(user?.id)} className="flex items-center gap-2">
                            <Eye size={16} />
                            View User
                          </button>
                        </li>
                        {role === "ADMIN" && ( <>
                        <li>
                          <button onClick={() => handleEdit(user?.id)} className="flex items-center gap-2">
                            <Pencil size={16} />
                            Edit User
                          </button>
                        </li>
                        <li>
                          <button onClick={() => handleDelete(user?.id)} className="flex items-center gap-2 text-error">
                            <Trash2 size={16} />
                            Delete User
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
        message="Are you sure you want to delete this user?"
        onConfirm={confirmDelete}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </div>
  );
}