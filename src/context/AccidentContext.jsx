import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AccidentContext = createContext();

export const AccidentProvider = ({ children }) => {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accident, setAccident] = useState(null);

  // Fetch all accidents
  const fetchAccidents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/accidents');
      setAccidents(response.data.data);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error fetching accidents:', error);
      return { success: false, error: error.response?.data?.message || "Failed to fetch accidents" };
    } finally {
      setLoading(false);
    }
  };

  const fetchAccidentById = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/accidents/${id}`);
      setAccident(response.data.data);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error fetching accident:', error);
      const message = error.response?.data?.message || "Failed to fetch accident";
      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };

  const createAccident = async (data) => {
    try {
      const response = await api.post('/api/accidents', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAccidents((prev) => [...prev, response.data.data]);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error creating accident:', error);
      const message = error.response?.data?.message || "Something went wrong";
      return {
        success: false,
        error: message,
      };
    }
  };

  const updateAccident = async (formData) => {
    try {
      const id = formData.get("id");
      if (!id) {
        throw new Error("Accident ID is missing");
      }
  
      const response = await api.put(`/api/accidents/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setAccidents((prev) =>
        prev.map((a) => (a.id === parseInt(id, 10) ? response.data.data : a))
      );
  
      return { success: true, data: response.data.data };
    } catch (error) {
      console.log("Error updating accident:", JSON.stringify(error, null, 2));
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update accident";
      return {
        success: false,
        error: message,
      };
    }
  };

  const deleteAccident = async (id) => {
    try {
      await api.delete(`/api/accidents/${id}`);
      setAccidents((prev) => prev.filter((a) => a.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting accident:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to delete accident" 
      };
    }
  };

  return (
    <AccidentContext.Provider
      value={{
        accidents,
        loading,
        accident,
        fetchAccidents,
        fetchAccidentById,
        createAccident,
        updateAccident,
        deleteAccident,
      }}
    >
      {children}
    </AccidentContext.Provider>
  );
};

export const useAccident = () => useContext(AccidentContext);