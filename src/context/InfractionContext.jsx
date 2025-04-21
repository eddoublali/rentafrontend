import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context for Infraction
const InfractionContext = createContext();


// Create a provider component
export const InfractionProvider = ({ children }) => {
  const [infractions, setInfractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all infractions
  const fetchInfractions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/infraction');
    //   console.log('API Response:', response.data.infractions);
      // Correctly access the infractions array from the response
      setInfractions(response.data.infractions || []);
    } catch (err) {
      console.error('Error fetching infractions:', err);
      setError('Failed to fetch infractions');
      setInfractions([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a new infraction
  const createInfraction = async (infractionData) => {
    try {
      const response = await axios.post('/infraction', infractionData);
      setInfractions((prevInfractions) => [...prevInfractions, response.infractions]);
    } catch (err) {
      setError('Failed to create infraction');
    }
  };

  // Update an existing infraction
  const updateInfraction = async (id, updatedData) => {
    try {
      const response = await axios.put(`/infraction/${id}`, updatedData);
      setInfractions((prevInfractions) =>
        prevInfractions.map((infraction) =>
          infraction.id === id ? response.infractions : infraction
        )
      );
    } catch (err) {
      setError('Failed to update infraction');
    }
  };

  // Delete an infraction
  const deleteInfraction = async (id) => {
    try {
      await axios.delete(`/infraction/${id}`);
      setInfractions((prevInfractions) =>
        prevInfractions.filter((infraction) => infraction.id !== id)
      );
    } catch (err) {
      setError('Failed to delete infraction');
    }
  };

  // Delete all infractions
  const deleteAllInfractions = async () => {
    try {
      await axios.delete('/infraction');
      setInfractions([]);
    } catch (err) {
      setError('Failed to delete all infractions');
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
        createInfraction,
        updateInfraction,
        deleteInfraction,
        deleteAllInfractions,
      }}
    >
      {children}
    </InfractionContext.Provider>
  );
};

// Create a custom hook to use the InfractionContext
export const useInfraction = () => {
    return useContext(InfractionContext);
  };
  
