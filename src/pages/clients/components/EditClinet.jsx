import React, { useState, useEffect } from "react";
import { useClient } from "../../../context/ClientContext";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpiner from "../../../components/LodingSpiner";
import clientSchema from "./ClientValidation";
import { ArrowLeft } from "lucide-react";
import { t } from "i18next";

export default function EditClient({ title = t("client.editClient"), isSaving = false }) {
  const { fetchClientById, updateClient } = useClient();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [clientExists, setClientExists] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    cin: "",
    cinExpiry: "",
    license: "",
    licenseExpiry: "",
    address: "",
    nationality: t("nationalities.moroccan"),
    passportNumber: "",
    passportExpiry: "",
    birthDate: "",
    companyName: "",
    registrationNumber: "",
    gender: t("client.genderMale"),
    clientType: "PERSONAL",
    blacklisted: false,
    cinimage: "",
    licenseimage: "",
  });

  const [files, setFiles] = useState({
    cinimage: null,
    licenseimage: null,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSavingData, setIsSavingData] = useState(false);

  useEffect(() => {
    const getClientData = async () => {
      setLoading(true);
      try {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
          setClientExists(false);
          setLoading(false);
          return;
        }

        const response = await fetchClientById(numericId);
        console.log("Fetch response:", response);

        if (!response || !response.success || !response.data) {
          setClientExists(false);
          setLoading(false);
          return;
        }

        const client = response.data.client;
        const formattedClient = { ...client };
        const dateFields = [
          "cinExpiry",
          "licenseExpiry",
          "passportExpiry",
          "birthDate",
        ];

        dateFields.forEach((field) => {
          if (formattedClient[field]) {
            const date = new Date(formattedClient[field]);
            formattedClient[field] = date.toISOString().split("T")[0];
          }
        });

        // Explicitly convert blacklisted to boolean
        formattedClient.blacklisted = Boolean(formattedClient.blacklisted);
        
        // Log the blacklisted value after conversion
        console.log("Initial blacklisted value:", formattedClient.blacklisted);
        
        formattedClient.passportNumber = formattedClient.passportNumber || "";
        formattedClient.passportExpiry = formattedClient.passportExpiry || "";
        formattedClient.companyName = formattedClient.companyName || "";
        formattedClient.registrationNumber =
          formattedClient.registrationNumber || "";

        setFormData(formattedClient);
        setClientExists(true);
      } catch (error) {
        console.log("Error fetching client:", JSON.stringify(error, null, 2));
        setClientExists(false);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getClientData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    if (uploadedFiles.length > 0) {
      setFiles((prev) => ({ ...prev, [name]: uploadedFiles[0] }));
      setFormData((prev) => ({ ...prev, [name]: uploadedFiles[0].name }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    console.log(`Checkbox ${name} changed to:`, checked);
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked
    }));
  };

  const validateForm = () => {
    try {
      // Create a copy of form data for validation
      const validationData = { ...formData };

      // Convert empty date strings to undefined
      const dateFields = [
        "cinExpiry",
        "licenseExpiry",
        "passportExpiry",
        "birthDate",
      ];
      dateFields.forEach((field) => {
        if (validationData[field] === "") {
          validationData[field] = undefined;
        }
      });

      // Remove passport fields for Moroccan clients
      if (validationData.nationality === t("nationalities.moroccan")) {
        delete validationData.passportNumber;
        delete validationData.passportExpiry;
      }

      clientSchema.parse(validationData);
      setErrors({});
      return true;
    } catch (validationError) {
      if (validationError.errors || validationError.issues) {
        const issues = validationError.errors || validationError.issues;
        const newErrors = {};
        issues.forEach((issue) => {
          const path = issue.path.join(".");
          newErrors[path] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called");
    console.log("Form data at submission:", formData);
    console.log("Blacklisted status before submission:", formData.blacklisted);

    setServerError("");
    setErrors({});

    if (validateForm()) {
      console.log("Form validated, preparing data");
      const dateFields = [
        "cinExpiry",
        "licenseExpiry",
        "passportExpiry",
        "birthDate",
      ];
      const formattedData = { ...formData };

      dateFields.forEach((field) => {
        if (formattedData[field]) {
          const date = new Date(formattedData[field] + "T12:00:00Z");
          formattedData[field] = date.toISOString();
        }
      });

      if (formattedData.nationality === t("nationalities.moroccan")) {
        delete formattedData.passportNumber;
        delete formattedData.passportExpiry;
      }

      try {
        setIsSavingData(true);
        const formDataToSend = new FormData();
        formDataToSend.append("id", parseInt(id, 10));

        // Log the actual boolean value before conversion
        console.log("Blacklisted value to send:", formattedData.blacklisted);
        
        // Explicitly append blacklisted as string "true" or "false"
        // formDataToSend.append("blacklisted", formattedData.blacklisted ? "true" : "false");
        formDataToSend.append("blacklisted", formattedData.blacklisted ? "1" : "0");
        // Handle all other fields
        Object.entries(formattedData).forEach(([key, value]) => {
          if (key !== "blacklisted" && value !== null && value !== undefined && value !== "") {
            formDataToSend.append(key, value.toString());
          }
        });
        
        if (files.cinimage) {
          formDataToSend.append("cinimage", files.cinimage);
        }
        if (files.licenseimage) {
          formDataToSend.append("licenseimage", files.licenseimage);
        }

        console.log("Sending formData:", [...formDataToSend.entries()]);

        const response = await updateClient(formDataToSend);
        console.log("Update response:", response);

        if (!response.success) {
          console.log("Update failed:", response.error);
          if (response.error.toLowerCase().includes("email")) {
            setErrors({ email: response.error });
          } else {
            setServerError(response.error || t("client.errorNoResponse"));
          }
          return;
        }

        console.log("Client updated successfully:", response.data);
        navigate("/clients");
      } catch (error) {
        console.log("Error in handleSubmit:", JSON.stringify(error, null, 2));
        setServerError(
          error.response?.data?.message ||
            error.message ||
            t("client.errorNoResponse")
        );
      } finally {
        setIsSavingData(false);
      }
    } else {
      console.log("Form validation failed:", errors);
    }
  };

  const getInputClassName = (fieldName) => {
    return `input input-bordered w-full ${
      errors[fieldName] ? "input-error" : ""
    }`;
  };

  if (loading) {
    return <LoadingSpiner />;
  }

  if (!clientExists) {
    return (
      <>
        <div className="text-center py-10 text-gray-500 items-center">
          <h1 className="text-xl font-semibold text-error">{t("clients.clientNotFound")}</h1>
          <p className="mt-2">{t("clients.notFoundmessage")}</p>
          <p className="mt-2">
            <button
              onClick={() => navigate("/clients")}
              className="mt-4 btn bg-sky-600 text-white"
            >
              <ArrowLeft size={16} /> {t("clients.return")}
            </button>
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h1 className="card-title text-xl">{title}</h1>
          <button
            type="button"
            onClick={() => navigate("/clients")}
            className="btn btn-ghost"
          >
            {t("common.cancel")}
          </button>
        </div>

        {serverError && (
          <div className="alert alert-error mb-4">
            <span>{serverError}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          encType="multipart/form-data"
        >
          {/* Personal Information */}
          <div className="md:col-span-3">
            <h2 className="font-semibold text-lg divider">
              {t("client.personalInformation")}
            </h2>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">{t("client.name")}:</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className={getInputClassName("name")}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.name}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">{t("client.phone")}:</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className={getInputClassName("phone")}
            />
            {errors.phone && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.phone}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">{t("client.email")}:</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className={getInputClassName("email")}
            />
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.email}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">{t("client.cin")}:</span>
            </label>
            <input
              type="text"
              name="cin"
              value={formData.cin || ""}
              onChange={handleChange}
              className={getInputClassName("cin")}
            />
            {errors.cin && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.cin}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">{t("client.cinExpiry")}:</span>
            </label>
            <input
              type="date"
              name="cinExpiry"
              value={formData.cinExpiry || ""}
              onChange={handleChange}
              className={getInputClassName("cinExpiry")}
            />
            {errors.cinExpiry && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.cinExpiry}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">{t("client.license")}:</span>
            </label>
            <input
              type="text"
              name="license"
              value={formData.license || ""}
              onChange={handleChange}
              className={getInputClassName("license")}
            />
            {errors.license && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.license}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">{t("client.licenseExpiry")}:</span>
            </label>
            <input
              type="date"
              name="licenseExpiry"
              value={formData.licenseExpiry || ""}
              onChange={handleChange}
              className={getInputClassName("licenseExpiry")}
            />
            {errors.licenseExpiry && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.licenseExpiry}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">{t("client.address")}:</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className={getInputClassName("address")}
            />
            {errors.address && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.address}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">{t("client.nationality")}:</span>
            </label>
            <select
              name="nationality"
              value={formData.nationality || t("nationalities.moroccan")}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value={t("nationalities.moroccan")}>{t("nationalities.moroccan")}</option>
              <option value={t("nationalities.algerian")}>{t("nationalities.algerian")}</option>
              <option value={t("nationalities.tunisian")}>{t("nationalities.tunisian")}</option>
              <option value={t("nationalities.french")}>{t("nationalities.french")}</option>
              <option value={t("nationalities.spanish")}>{t("nationalities.spanish")}</option>
              <option value={t("nationalities.italian")}>{t("nationalities.italian")}</option>
              <option value={t("nationalities.german")}>{t("nationalities.german")}</option>
              <option value={t("nationalities.american")}>{t("nationalities.american")}</option>
              <option value={t("nationalities.british")}>{t("nationalities.british")}</option>
              <option value={t("nationalities.canadian")}>{t("nationalities.canadian")}</option>
            </select>
            {errors.nationality && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.nationality}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">{t("client.gender")}:</span>
            </label>
            <select
              name="gender"
              value={formData.gender || t("client.genderMale")}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value={t("client.genderMale")}>{t("client.genderMale")}</option>
              <option value={t("client.genderFemale")}>{t("client.genderFemale")}</option>
            </select>
            {errors.gender && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.gender}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">{t("client.clientType")}:</span>
            </label>
            <select
              name="clientType"
              value={formData.clientType || "PERSONAL"}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="PERSONAL">{t("client.typePersonal")}</option>
              <option value="ENTERPRISE">{t("client.typeEnterprise")}</option>
            </select>
            {errors.clientType && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.clientType}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">{t("client.birthDate")}:</span>
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate || ""}
              onChange={handleChange}
              className={getInputClassName("birthDate")}
            />
            {errors.birthDate && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.birthDate}</span>
              </label>
            )}
          </div>

          {formData.nationality !== t("nationalities.moroccan") && (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("client.passportNumber")}:</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber || ""}
                  onChange={handleChange}
                  className={getInputClassName("passportNumber")}
                />
                {errors.passportNumber && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.passportNumber}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("client.passportExpiry")}:</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  type="date"
                  name="passportExpiry"
                  value={formData.passportExpiry || ""}
                  onChange={handleChange}
                  className={getInputClassName("passportExpiry")}
                />
                {errors.passportExpiry && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.passportExpiry}</span>
                  </label>
                )}
              </div>
            </>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text">
                {t("client.cinImage")}:
                {formData.cinimage && (
                  <span className="text-success text-xs ml-2">
                    (File already uploaded)
                  </span>
                )}
              </span>
            </label>
            <input
              type="file"
              name="cinimage"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />
            {errors.cinimage && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.cinimage}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">
                {t("client.licenseImage")}:
                {formData.licenseimage && (
                  <span className="text-success text-xs ml-2">
                    (File already uploaded)
                  </span>
                )}
              </span>
            </label>
            <input
              type="file"
              name="licenseimage"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />
            {errors.licenseimage && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.licenseimage}</span>
              </label>
            )}
          </div>

          {formData.clientType === "ENTERPRISE" && (
            <>
              <div className="md:col-span-3">
                <h2 className="font-semibold text-lg divider">
                  {t("client.companyInformation")}
                </h2>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("client.companyName")}:</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ""}
                  onChange={handleChange}
                  className={getInputClassName("companyName")}
                />
                {errors.companyName && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.companyName}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("client.registrationNumber")}:</span>
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber || ""}
                  onChange={handleChange}
                  className={getInputClassName("registrationNumber")}
                />
                {errors.registrationNumber && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.registrationNumber}</span>
                  </label>
                )}
              </div>
            </>
          )}

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">{t("client.blacklistClient")}</span>
              <input
                type="checkbox"
                name="blacklisted"
                checked={Boolean(formData.blacklisted)} 
                onChange={handleCheckboxChange}
                className="checkbox"
              />
            </label>
            {/* Debug info */}
            <span className="text-xs text-base-content/50">
              Current value: {formData.blacklisted ? "true" : "false"}
            </span>
          </div>

          <div className="md:col-span-3 mt-6">
            <button
              type="submit"
              className={`btn bg-sky-600 text-white ${isSavingData ? "loading" : ""}`}
              disabled={isSavingData || isSaving}
            >
              {isSavingData ? t("common.saving") : t("client.updateClient")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}