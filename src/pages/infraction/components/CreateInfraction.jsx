import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInfraction } from '../../../context/InfractionContext';
import { useClient } from '../../../context/ClientContext';
import { useVehicle } from '../../../context/VehicleContext';
import { infractionSchema } from './IInfractionValidation';



export default function CreateInfraction() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createInfraction, error: infractionError } = useInfraction();
  
  const { clients, loading: clientsLoading, fetchClients } = useClient();
  const { vehicles, loading: vehiclesLoading, fetchVehicles } = useVehicle();
  
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    clientId: '',
    vehicleId: '',
    infractionType: '',
    fineAmount: 0,
    infractionDate: new Date().toISOString().split('T')[0],
    status: 'PENDING',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      await fetchClients();
      await fetchVehicles();
    };
    
    loadData();
  }, []);

  const getInputClassName = (fieldName) => {
    return `input input-bordered w-full ${errors[fieldName] ? 'input-error' : ''}`;
  };

  const getSelectClassName = (fieldName) => {
    return `select select-bordered w-full cursor-pointer ${errors[fieldName] ? 'select-error' : ''}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    try {
      infractionSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      const fieldErrors = {};
      err.errors.forEach((error) => {
        const path = error.path.join('.');
        fieldErrors[path] = error.message;
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formattedData = {
      ...formData,
      infractionDate: new Date(formData.infractionDate).toISOString()
    };
    
    setIsSaving(true);
    
    try {
      const response = await createInfraction(formattedData);
      
      console.log('Create infraction result:', response);
      
      if (!response.success) {
        console.error('Failed to create infraction:', response.message);
        setErrors({
          ...errors,
          general: response.message || t('errors.failedToCreateInfraction'),
        });
        return;
      }
      
      console.log('Infraction created successfully:', response.data);
      navigate('/infractions');
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrors({
        ...errors,
        general: t('errors.failedToCreateInfraction'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const INFRACTION_TYPES = [
    'SPEEDING',
    'PARKING',
    'RED_LIGHT',
    'NO_INSURANCE',
    'DRIVING_LICENSE',
    'OTHER'
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("infraction.createInfraction")}</h2>
        <button
          type="button"
          onClick={() => navigate('/infractions')}
          className="btn btn-ghost"
        >
          {t('common.cancel')}
        </button>
      </div>
      
      {(errors.general || infractionError) && (
        <div className="alert alert-error mb-4">
          {errors.general || infractionError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="label">
            <span className="label-text">{t('infraction.client')}</span>
          </label>
          <select
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            className={getSelectClassName("clientId")}
            disabled={clientsLoading}
          >
            <option value="">{t('common.selectClient')}</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <span className="text-error text-xs mt-1">{errors.clientId}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('infraction.vehicle')}</span>
          </label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            className={getSelectClassName("vehicleId")}
            disabled={vehiclesLoading}
          >
            <option value="">{t('common.selectVehicle')}</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} - {vehicle.model}
              </option>
            ))}
          </select>
          {errors.vehicleId && (
            <span className="text-error text-xs mt-1">{errors.vehicleId}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('infraction.infractionType')}</span>
          </label>
          <select
            name="infractionType"
            value={formData.infractionType}
            onChange={handleChange}
            className={getSelectClassName("infractionType")}
          >
            <option value="">{t('infraction.selectType')}</option>
            {INFRACTION_TYPES.map((type) => (
              <option key={type} value={t(`infraction.types.${type.toLowerCase()}`)}>
                {t(`infraction.types.${type.toLowerCase()}`)}
              </option>
            ))}
          </select>
          {errors.infractionType && (
            <span className="text-error text-xs mt-1">{errors.infractionType}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('infraction.fineAmount')}</span>
          </label>
          <input
            type="number"
            name="fineAmount"
            value={formData.fineAmount}
            onChange={handleChange}
            className={getInputClassName("fineAmount")}
            min="0"
            step="0.01"
          />
          {errors.fineAmount && (
            <span className="text-error text-xs mt-1">{errors.fineAmount}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('infraction.infractionDate')}</span>
          </label>
          <input
            type="date"
            name="infractionDate"
            value={formData.infractionDate}
            onChange={handleChange}
            className={getInputClassName("infractionDate")}
          />
          {errors.infractionDate && (
            <span className="text-error text-xs mt-1">{errors.infractionDate}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text">{t('infraction.status')}</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={getSelectClassName("status")}
          >
            <option value="PENDING">{t('status.pending')}</option>
            <option value="PAID">{t('status.paid')}</option>
            <option value="UNPAID">{t('status.unpaid')}</option>
          </select>
          {errors.status && (
            <span className="text-error text-xs mt-1">{errors.status}</span>
          )}
        </div>

        <div className="col-span-1 md:col-span-2 mt-10">
          <button
            type="submit"
            className="btn bg-sky-600 text-white w-full"
            disabled={isSaving || clientsLoading || vehiclesLoading}
          >
            {isSaving ? t('common.saving') : t('infraction.createInfraction')}
          </button>
        </div>
      </form>
    </div>
  );
}