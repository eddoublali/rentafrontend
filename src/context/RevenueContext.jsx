import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const RevenueContext = createContext();

export const RevenueProvider = ({ children }) => {
  const [revenues, setRevenues] = useState([]);
  const [selectedRevenue, setSelectedRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const getRevenueById = async (id) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/revenue/${id}`);
      setSelectedRevenue(data.data);
      return data;
    } catch (error) {
      console.error('Failed to fetch revenue by ID:', error);
      setError(error.response?.data?.message || 'Failed to fetch revenue');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createRevenue = async (revenueData) => {
    try {
      setLoading(true);
      const { data } = await api.post('/revenue', revenueData);
      setRevenues(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Failed to create revenue:', error);
      setError(error.response?.data?.message || 'Failed to create revenue');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateRevenue = async (id, updates) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/revenue/${id}`, updates);
      setRevenues(prev => prev.map(rev => rev.id === id ? data : rev));
      if (selectedRevenue?.id === id) {
        setSelectedRevenue(data);
      }
      return data;
    } catch (error) {
      console.error('Failed to update revenue:', error);
      setError(error.response?.data?.message || 'Failed to update revenue');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteRevenue = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/revenue/${id}`);
      setRevenues(prev => prev.filter(rev => rev.id !== id));
      if (selectedRevenue?.id === id) {
        setSelectedRevenue(null);
      }
    } catch (error) {
      console.error('Failed to delete revenue:', error);
      setError(error.response?.data?.message || 'Failed to delete revenue');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenues = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/revenue');
      setRevenues(data.data);
    } catch (error) {
      console.error('Failed to fetch revenues:', error);
      setError(error.response?.data?.message || 'Failed to fetch revenues');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyRevenue = async (year) => {
    try {
      setLoading(true);
      const targetYear = year || currentYear;
      const { data } = await api.get(`/revenue/monthly?year=${targetYear}`);
      setMonthlyRevenue(data.data);
      return data.data;
    } catch (error) {
      console.error('Failed to fetch monthly revenue:', error);
      setError(error.response?.data?.message || 'Failed to fetch monthly revenue');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenues();
    fetchMonthlyRevenue();
  }, []);

  return (
    <RevenueContext.Provider
      value={{
        revenues,
        loading,
        error,
        selectedRevenue,
        setSelectedRevenue,
        fetchRevenues,
        getRevenueById,
        createRevenue,
        updateRevenue,
        deleteRevenue,
        fetchMonthlyRevenue,
        monthlyRevenue
      }}
    >
      {children}
    </RevenueContext.Provider>
  );
};

export const useRevenue = () => useContext(RevenueContext);