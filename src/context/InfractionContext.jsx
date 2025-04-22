import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const InfractionContext = createContext();

export const InfractionProvider = ({ children }) => {
  const [infractions, setInfractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInfractions = async () => {
    setLoading(true);
    try {
      const response = await api.get("/infraction");

      setInfractions(response.data.infractions || []);
    } catch (err) {
      console.error("Error fetching infractions:", err);
      setError("Failed to fetch infractions");
      setInfractions([]);
    } finally {
      setLoading(false);
    }
  };

  const getOneInfraction = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/infraction/${id}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (err) {
      console.error("Error fetching infraction:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to fetch infraction",
        error: err,
      };
    } finally {
      setLoading(false);
    }
  };

  const createInfraction = async (infractionData) => {
    try {
      const response = await api.post("/infraction", infractionData);
      console.log("Create infraction response:", response);
      console.log("Response data:", response.data);
      setInfractions((prevInfractions) => [
        ...prevInfractions,
        response.data.infraction,
      ]);
      return {
        success: true,
        message: "Infraction created successfully",
        data: response.data,
      };
    } catch (err) {
      console.error("Error creating infraction:", err);
      console.error("Error response:", err.response?.data || err.message);
      setError("Failed to create infraction");

      return {
        success: false,
        message: err.response?.data?.message || "Failed to create infraction",
        error: err,
      };
    }
  };

  const updateInfraction = async (id, updatedData) => {
    try {
      const response = await api.put(`/infraction/${id}`, updatedData);

      console.log("Update response:", response);

      setInfractions((prevInfractions) =>
        prevInfractions.map((infraction) =>
          infraction.id === id ? response.data.data : infraction
        )
      );

      return {
        success: true,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (err) {
      console.error(err);
      console.error(err.response?.data || err.message);
      setError("Failed to update infraction");

      return {
        success: false,
        message: err.response?.data?.message || "Failed to update infraction",
        error: err,
      };
    }
  };

  const deleteInfraction = async (id) => {
    try {
      await api.delete(`/infraction/${id}`);
      setInfractions((prevInfractions) =>
        prevInfractions.filter((infraction) => infraction.id !== id)
      );
    } catch (err) {
      setError("Failed to delete infraction");
    }
  };

  const deleteAllInfractions = async () => {
    try {
      await api.delete("/infraction");
      setInfractions([]);
    } catch (err) {
      setError("Failed to delete all infractions");
    }
  };

  useEffect(() => {
    fetchInfractions();
  }, []);

  return (
    <InfractionContext.Provider
      value={{
        infractions,
        loading,
        error,
        fetchInfractions,
        createInfraction,
        updateInfraction,
        deleteInfraction,
        deleteAllInfractions,
        getOneInfraction,
      }}
    >
      {children}
    </InfractionContext.Provider>
  );
};

export const useInfraction = () => {
  return useContext(InfractionContext);
};
