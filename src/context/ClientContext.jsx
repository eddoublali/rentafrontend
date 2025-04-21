import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState(null);

  // Fetch all clients
  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await api.get('/client');
      setClients(response.data.clients);
      return { success: true, data: response.data.clients };
    } catch (error) {
      console.error('Error fetching clients:', error);
      return { success: false, error: error.response?.data?.message || "Failed to fetch clients" };
    } finally {
      setLoading(false);
    }
  };

  // Fetch single client by ID
  const fetchClientById = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/client/${id}`);
      setClient(response.data.client);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching client:', error);
      const message = error.response?.data?.message || "Failed to fetch client";
      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };

  // Create new client
  const createClient = async (data) => {
    try {
      const response = await api.post('/client', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setClients((prev) => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating client:', error);
      const message = error.response?.data?.message || "Something went wrong";
      return {
        success: false,
        error: message,
      };
    }
  };

  // Update client by ID - Fixed this function
  const updateClient = async (formData) => {
    try {
      const id = formData.get("id");
      if (!id) {
        throw new Error("Client ID is missing");
      }
  
      const response = await api.put(`/client/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setClients((prev) =>
        prev.map((c) => (c.id === parseInt(id, 10) ? response.data : c))
      );
  
      return { success: true, data: response.data };
    } catch (error) {
      console.log("Error updating client:", JSON.stringify(error, null, 2));
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update client";
      return {
        success: false,
        error: message,
      };
    }
  };
  // Delete client by ID
  const deleteClient = async (id) => {
    try {
      await api.delete(`/client/${id}`);
      setClients((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting client:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to delete client" 
      };
    }
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        loading,
        client,
        fetchClients,
        fetchClientById,
        createClient,
        updateClient,
        deleteClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);