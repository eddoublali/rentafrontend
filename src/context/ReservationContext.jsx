import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/reservations');
      setReservations(response.data.reservations);
      return { success: true, data: response.data.reservations };
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError('Failed to fetch reservations');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Fetch reservation by ID
  const fetchReservationById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/reservations/${id}`);
      setReservation(response.data.reservation);
      return { success: true, data: response.data.reservation };
    } catch (error) {
      console.error('Error fetching reservation:', error);
      setError('Failed to fetch reservation');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Create reservation
  const createReservation = async (data) => {
    setError(null);
    try {
      const response = await api.post('/reservations', data);
      setReservations((prev) => [...prev, response.data.reservation]);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating reservation:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create reservation';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update reservation
  const updateReservation = async (id, data) => {
    setError(null);
    try {
      const response = await api.put(`/reservations/${id}`, data);
      setReservations((prev) =>
        prev.map((res) => (res.id === id ? response.data.reservation : res))
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating reservation:', error);
      setError('Failed to update reservation');
      return { success: false, error: error.message };
    }
  };

  // Delete reservation
  const deleteReservation = async (id) => {
    setError(null);
    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((res) => res.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting reservation:', error);
      setError('Failed to delete reservation');
      return { success: false, error: error.message };
    }
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        reservation,
        loading,
        error,
        fetchReservations,
        fetchReservationById,
        createReservation,
        updateReservation,
        deleteReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => useContext(ReservationContext);