// src/context/ContractContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // Ensure this is your configured API instance

// Create the context
const ContractContext = createContext();

// Create the provider component
export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all contracts
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/contracts');
      setContracts(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch contracts:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new contract
  const createContract = async (contractData) => {
    setLoading(true);
    try {
      const response = await api.post('/contracts', contractData);
      setContracts((prevContracts) => [...prevContracts, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Failed to create contract:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing contract
  const updateContract = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await api.put(`/contracts/${id}`, updatedData);
      setContracts((prevContracts) =>
        prevContracts.map((contract) =>
          contract.id === id ? response.data : contract
        )
      );
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Failed to update contract:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a contract by ID
  const deleteContract = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/contracts/${id}`);
      setContracts((prevContracts) =>
        prevContracts.filter((contract) => contract.id !== id)
      );
      setError(null);
    } catch (err) {
      console.error('Failed to delete contract:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete all contracts
  const deleteAllContracts = async () => {
    setLoading(true);
    try {
      await api.delete('/contracts');
      setContracts([]);
      setError(null);
    } catch (err) {
      console.error('Failed to delete all contracts:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch contracts on component mount
  useEffect(() => {
    fetchContracts();
  }, []);

  return (
    <ContractContext.Provider
      value={{
        contracts,
        loading,
        error,
        fetchContracts,
        createContract,
        updateContract,
        deleteContract,
        deleteAllContracts,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

// Custom hook to use the ContractContext
export const useContract = () => useContext(ContractContext);
