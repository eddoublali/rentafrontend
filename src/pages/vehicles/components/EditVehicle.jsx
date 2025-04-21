import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVehicle } from "../../../context/VehicleContext";
import VehicleForm from "./VehicleForm";
import LoadingSpiner from "../../../components/LodingSpiner";
import { t } from "i18next";
import { ArrowLeft } from "lucide-react";

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVehicleById, updateVehicle } = useVehicle();
  const [vehicleNotFound, setVehicleNotFound] = useState(false);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [docPreviews, setDocPreviews] = useState({});

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        let vehicle = await getVehicleById(parseInt(id, 10));
        vehicle = vehicle?.vehicle; // Adjust based on API response

        if (vehicle) {
          // Format dates for the form inputs
          const formattedVehicle = { ...vehicle };

          // Convert ISO dates to YYYY-MM-DD format for date inputs
          const dateFields = ["oilChange", "timingBelt", "purchaseDate"];
          dateFields.forEach((field) => {
            if (formattedVehicle[field]) {
              const date = new Date(formattedVehicle[field]);
              formattedVehicle[field] = date.toISOString().split("T")[0];
            }
          });

          setFormData(formattedVehicle);

          // Set image preview if available
          if (vehicle.imageUrl) {
            setImagePreview(vehicle.imageUrl);
          }

          // Set document previews if available
          const newDocPreviews = {};
          const documentFields = [
            "registrationDoc",
            "insuranceDoc",
            "purchaseDoc",
          ];
          documentFields.forEach((field) => {
            const fieldUrl = `${field}Url`;
            if (vehicle[fieldUrl]) {
              newDocPreviews[field] = vehicle[fieldUrl];
            }
          });
          setDocPreviews(newDocPreviews);
        } else {
          setError("Vehicle not found.");
          setVehicleNotFound(true);

        }
       
      } catch (err) {
        console.error("Error fetching vehicle:", err);
        setError("Failed to fetch vehicle data.");
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (files && files[0]) {
      const file = files[0];

      // For image validation debugging
      if (name === "image") {
        console.log("Selected image:", file.name, file.type, file.size);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Create a preview URL for the file
      const previewUrl = URL.createObjectURL(file);
      if (name === "image") {
        setImagePreview(previewUrl);
      } else {
        setDocPreviews((prev) => ({
          ...prev,
          [name]: previewUrl,
        }));
      }
    }
  };

  const clearFile = (name) => {
    // Clear both the file and its URL reference
    setFormData((prev) => {
      const newData = { ...prev };
      delete newData[name];
      delete newData[`${name}Url`];
      return newData;
    });

    if (name === "image") {
      // Only revoke if it's a Blob URL (not a server URL)
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null); // Always clear the preview
    } else {
      if (docPreviews[name] && docPreviews[name].startsWith("blob:")) {
        URL.revokeObjectURL(docPreviews[name]);
      }
      setDocPreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[name];
        return newPreviews;
      });
    }
  };

  const handleSubmit = async (e, convertedData) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // For debugging
      console.log("Starting form submission...");

      // Process the FormData
      const vehicleData = new FormData();

      // For debugging
      console.log("Original convertedData for update:", [
        ...convertedData.entries(),
      ]);

      // Add the ID to formData
      vehicleData.append("id", id);

      // Copy all entries from convertedData to vehicleData
      for (let [key, value] of convertedData.entries()) {
        vehicleData.append(key, value);
      }

      const respons = await updateVehicle(parseInt(id, 10), vehicleData);
      if (respons) {
        navigate("/vehicles");
      }
      console.log(respons);
    } catch (err) {
      console.error("Error updating vehicle:", err);
      setError(err.message || "Failed to update vehicle. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      Object.values(docPreviews).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreview, docPreviews]);
  if (vehicleNotFound) {
    return (
      <>
        <div className="text-center py-10 text-gray-500 items-center">
          <h1 className="text-xl font-semibold text-error">{t("vehicle.vehiclenotfund")}</h1>
          <p className="mt-2"> {t("vehicle.notFoundmessage")}</p>

          <p className="mt-2">
            <button
              onClick={() => navigate("/vehicles")}
              className="mt-4 btn bg-sky-600 text-white  "
            >
              <ArrowLeft size={16} /> {t("vehicle.return")}
            </button>
          </p>
        </div>
      </>
    );
  }


  if (loading) {
    return <LoadingSpiner />;
  }

  return (
    <div>
      <VehicleForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        error={error}
        title="Edit Vehicle"
        handleFileChange={handleFileChange}
        clearFile={clearFile}
        imagePreview={imagePreview}
        docPreviews={docPreviews}
      />
    </div>
  );
};

export default EditVehicle;
