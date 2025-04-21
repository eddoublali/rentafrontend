import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { t } from "i18next";
import { ArrowLeft } from "lucide-react";

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
      <>
        <div className=" py-10 text-gray-500 items-center text-center ">
          <h1 className="text-xl font-semibold text-error">
            {t("user.userNotfound")}
          </h1>
          <p className="mt-2"> {t("user.notFoundmessage")}</p>

          <p className="mt-2">
            <button
              onClick={() => navigate("/users")}
              className="mt-4 btn bg-sky-600 text-white  "
            >
              <ArrowLeft size={16} /> {t("user.Back")}
            </button>
          </p>
        </div>
      </>
    );

  }

  return (
    <div  className="  p-6 min-h-screen">
     
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {t("user.UserDetails")}
        </h1>
        <button className="btn " onClick={() => navigate("/users")}>
          {t("user.Back")}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 h-screen">
        {/* Personal Details */}
        <div className="grid grid-cols-1  gap-6 mb-8 place-items-center">
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between w-1/2 ">
            <p className="block text-lg  font-medium text-gray-500">
              {t("user.name")}
            </p>
            <p className="text-lg text-gray-900 ">{user.name||t("common.na")}</p>
          </div>
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between  w-1/2">
            <p className="block text-lg  font-medium text-gray-500">
              {t("user.email")}
            </p>
            <p className="text-lg text-gray-900 ">{user.email||t("common.na")}</p>
          </div>
          <div className="flex items-center gap-2 p-5 rounded bg-gray-50  justify-between  w-1/2">
            <p className="block text-lg  font-medium text-gray-500">
              {t("user.role")}
            </p>
            <p className="text-lg text-gray-900 ">{user.role ||t("common.na")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
