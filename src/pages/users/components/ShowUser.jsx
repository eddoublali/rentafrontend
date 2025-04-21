import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';

// Simple DaisyUI spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-40">
    <span className="loading loading-spinner loading-lg text-neutral"></span>
  </div>
);

export default function ShowUser() {
  const { fetchUserById } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const fetchedUser = await fetchUserById(id);
      setUser(fetchedUser);
      setLoading(false);
    };

    loadUser();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="text-center text-red-500 mt-10">
        User not found
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 shadow-md bg-base-100 rounded-box border border-base-content/10">
      <h2 className="text-2xl font-bold mb-4 text-center">User Details</h2>
      <div className="card g-base-100 ">
        <div className="card-body">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Name:</p>
              <p>{user.name || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Email:</p>
              <p>{user.email || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Role:</p>
              <p>{user.role || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm">
          ← Back
        </button>
      </div>
    </div>
  );
}
