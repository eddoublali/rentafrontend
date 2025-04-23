import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; 


const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

    const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/vehicle');
      setVehicles(data.vehicles);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

 
  const getVehicleById = async (id) => {
    try {
      const { data } = await api.get(`/vehicle/${id}`);
      setSelectedVehicle(data.vehicle);
      return data;
    } catch (error) {
      console.error('Failed to fetch vehicle by ID:', error);
      return null;
    }
  };


  const addVehicle = async (formData) => {
    try {
      
      if (formData instanceof FormData) {
        const numericFields = [
          'year', 'doors', 'mileage', 'dailyPrice',
          'purchasePrice', 'advancePayment', 'monthlyPayment',
          'remainingMonths', 'paymentDay'
        ];

        numericFields.forEach(field => {
          if (formData.has(field)) {
            const value = formData.get(field);
            if (value !== '') {
              formData.set(field, String(parseFloat(value))); // must be string to go into FormData
            }
          }
        });
      }

     
      const { data } = await api.post('/vehicle', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

    
      setVehicles(prev => [...prev, data]);

      return data;
    } catch (error) {
      console.error('Failed to add vehicle:', error);
      throw error;
    }
  };


const updateVehicle = async (id, updates) => {
  try {
    const { data } = await api.put(`/vehicle/${id}`, updates);
    
    
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? data : v))
    );
    
    if (selectedVehicle?.id === id) {
      setSelectedVehicle(data);
    }
    
    
    return data;
  } catch (error) {
    console.error('Failed to update vehicle:', error);
   
    return false;
    
  }
};

  const removeVehicle = async (id) => {
    try {
      await api.delete(`/vehicle/${id}`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      if (selectedVehicle?.id === id) {
        setSelectedVehicle(null);
      }
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [error, setError] = useState(null);

  
  const fetchAvailableVehicles = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/vehicle/available', {
        params: { startDate, endDate },
      });
      setAvailableVehicles(data.vehicles);
      return { success: true, data: data.vehicles };
    } catch (error) {
      console.error('Failed to fetch available vehicles:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch available vehicles';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
};

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        loading,
        selectedVehicle,
        setSelectedVehicle,
        fetchVehicles,
        getVehicleById, 
        addVehicle,
        updateVehicle,
        removeVehicle,
        availableVehicles, 
        error, 
        fetchAvailableVehicles, 
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => useContext(VehicleContext);