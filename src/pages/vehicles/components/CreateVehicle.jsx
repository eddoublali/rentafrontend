// CreateVehicle.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicle } from '../../../context/VehicleContext';
import VehicleForm from './VehicleForm';


const CreateVehicle = () => {
  const navigate = useNavigate();
  const { addVehicle } = useVehicle();

  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);


  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' && value !== '' 
        ? parseFloat(value) 
        : value,
    }));
  };


  const handleSubmit = async (e, convertedData) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
  
    try {
      // Skip FormData completely and pass a regular JSON object
      const vehicleData = {};
      
      // For debugging - check what's coming in
      console.log("Original convertedData:", [...convertedData.entries()]);
      
      // Extract values and ensure numeric fields are parsed as numbers
      for (let [key, value] of convertedData.entries()) {
        const numericFields = [
          'year', 'doors', 'mileage', 'dailyPrice', 
          'purchasePrice', 'advancePayment', 'monthlyPayment', 
          'remainingMonths', 'paymentDay'
        ];
        
        if (numericFields.includes(key)) {
          vehicleData[key] = parseFloat(value);
        } else if (value instanceof File) {
          vehicleData[key] = value;
        } else {
          vehicleData[key] = value;
        }
      }
      
      // For debugging - check what's going out
      console.log("Processed vehicleData:", vehicleData);
      
      await addVehicle(vehicleData);
   
    } catch (err) {
      console.error('Error adding vehicle:', err);
      setError(err.message || 'Failed to add vehicle. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div>
      <VehicleForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        error={error}
        title="Create Vehicle"
      />
    </div>
  );
};

export default CreateVehicle;