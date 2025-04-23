import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; 

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

export const useContract = () => useContext(ContractContext);
