import React, { useState } from "react";
import { useClient } from "../../../context/ClientContext";
import { useNavigate } from "react-router-dom";
import clientSchema from "./ClientValidation";

export default function CreateClient({
  title = "Create Client",
  isSaving = false,
}) {
  const navigate = useNavigate();
  const { createClient } = useClient();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    cin: "",
    cinExpiry: "",
    license: "",
    licenseExpiry: "",
    address: "",
    nationality: "Moroccan",
    passportNumber: "",
    passportExpiry: "",
    birthDate: "",
    companyName: "",
    registrationNumber: "",
    gender: "Male",
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    if (uploadedFiles.length > 0) {
      setFiles((prev) => ({ ...prev, [name]: uploadedFiles[0] }));
      setFormData((prev) => ({ ...prev, [name]: uploadedFiles[0].name }));

      if (errors[name]) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: Boolean(checked) });
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
      if (validationData.nationality === "Moroccan") {
        delete validationData.passportNumber;
        delete validationData.passportExpiry;
      }

      // Run schema validation
      clientSchema.parse(validationData);

      // Custom validation for required files
      const newErrors = {};
      if (!files.cinimage) {
        newErrors.cinimage = "CIN image is required";
      }
      if (!files.licenseimage) {
        newErrors.licenseimage = "License image is required";
      }

      // Custom validation for non-Moroccan clients
      if (validationData.nationality !== "Moroccan") {
        if (
          !validationData.passportNumber ||
          validationData.passportNumber.trim() === ""
        ) {
          newErrors.passportNumber =
            "Passport number is required for non-Moroccan clients";
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
      }

      setErrors({});
      return true;
    } catch (validationError) {
      console.error("Validation error:", validationError);
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   try {
  //     if (!validateForm()) {
  //       setIsSubmitting(false);
  //       return;
  //     }

  //     const formattedData = { ...formData };

  //     // Format date fields
  //     const dateFields = ["cinExpiry", "licenseExpiry", "passportExpiry", "birthDate"];
  //     dateFields.forEach((field) => {
  //       if (formattedData[field] && formattedData[field] !== "") {
  //         try {
  //           const date = new Date(formattedData[field] + "T12:00:00Z");
  //           formattedData[field] = date.toISOString();
  //         } catch (error) {
  //           console.error(`Error formatting date for ${field}:`, error);
  //         }
  //       } else {
  //         formattedData[field] = undefined;
  //       }
  //     });

  //     // Remove passport fields for Moroccan clients
  //     if (formattedData.nationality === "Moroccan") {
  //       delete formattedData.passportNumber;
  //       delete formattedData.passportExpiry;
  //     }

  //     // Remove file names from data
  //     delete formattedData.cinimage;
  //     delete formattedData.licenseimage;

  //     // Create FormData object
  //     const formDataToSend = new FormData();
  //     Object.entries(formattedData).forEach(([key, value]) => {
  //       if (value !== null && value !== undefined && value !== "") {
  //         formDataToSend.append(key, typeof value === "boolean" ? value.toString() : value);
  //       }
  //     });

  //     if (files.cinimage) {
  //       formDataToSend.append("cinimage", files.cinimage);
  //     }
  //     if (files.licenseimage) {
  //       formDataToSend.append("licenseimage", files.licenseimage);
  //     }

  //     console.log("Submitting client data...", Object.fromEntries(formDataToSend));

  //     const response = await createClient(formDataToSend);
  //     if (!response) {
  //       throw new Error("No response received from server");
  //     }

  //     if (!response.success) {
  //       if (response.error && response.error.includes("email")) {
  //         setErrors((prev) => ({ ...prev, email: "Email already exists" }));
  //       } else {
  //         setErrors((prev) => ({ ...prev, general: response.error || "Unknown error occurred" }));
  //       }
  //       console.error("API Error:", response.error);
  //       return;
  //     }

  //     console.log("Client created successfully!");
  //     navigate('/clients');
  //   } catch (error) {
  //     console.error("Error creating client:", error);
  //     setErrors((prev) => ({
  //       ...prev,
  //       general: `Error: ${error.message || "Unknown error occurred"}`,
  //     }));
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      const formattedData = { ...formData };

      // Format date fields
      const dateFields = [
        "cinExpiry",
        "licenseExpiry",
        "passportExpiry",
        "birthDate",
      ];
      dateFields.forEach((field) => {
        if (formattedData[field] && formattedData[field] !== "") {
          try {
            const date = new Date(formattedData[field] + "T12:00:00Z");
            formattedData[field] = date.toISOString();
          } catch (error) {
            console.error(`Error formatting date for ${field}:`, error);
          }
        } else {
          formattedData[field] = undefined;
        }
      });

      // Remove passport fields for Moroccan clients
      if (formattedData.nationality === "Moroccan") {
        delete formattedData.passportNumber;
        delete formattedData.passportExpiry;
      }

      // Remove file names from data
      delete formattedData.cinimage;
      delete formattedData.licenseimage;

      // Create FormData object
      const formDataToSend = new FormData();
      Object.entries(formattedData).forEach(([key, value]) => {
        // if (key === "blacklisted" && formattedData.clientType !== "ENTERPRISE") {
        //   return;
        // }
        if (value !== null && value !== undefined && value !== "") {
          formDataToSend.append(
            key,
            typeof value === "boolean" ? value.toString() : value
          );
        }
      });

      if (files.cinimage) {
        formDataToSend.append("cinimage", files.cinimage);
      }
      if (files.licenseimage) {
        formDataToSend.append("licenseimage", files.licenseimage);
      }

      console.log(
        "Submitting client data...",
        Object.fromEntries(formDataToSend)
      );

      const response = await createClient(formDataToSend);
      if (!response) {
        throw new Error("No response received from server");
      }

      if (!response.success) {
        if (response.error && response.error.includes("email")) {
          setErrors((prev) => ({ ...prev, email: "Email already exists" }));
        } else {
          setErrors((prev) => ({
            ...prev,
            general: response.error || "Unknown error occurred",
          }));
        }
        console.error("API Error:", response.error);
        return;
      }

      console.log("Client created successfully!");
      navigate("/clients");
    } catch (error) {
      console.error("Error creating client:", error);
      setErrors((prev) => ({
        ...prev,
        general: `Error: ${error.message || "Unknown error occurred"}`,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  const getInputClassName = (fieldName) => {
    return `input input-bordered w-full ${
      errors[fieldName] ? "input-error" : ""
    }`;
  };

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
       
        <div className="flex justify-between items-center ">
        <h1 className="card-title text-xl">{title}</h1>
          <button
            type="button"
            onClick={() => navigate("/clients")}
            className="btn btn-ghost"
          >
            Cancel
          </button>
        </div>

        {errors.general && (
          <div className="alert alert-error">
            <span>{errors.general}</span>
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
              Personal Information
            </h2>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Name:</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
              <span className="label-text">Phone:</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={getInputClassName("phone")}
            />
            {errors.phone && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.phone}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email:</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={getInputClassName("email")}
            />
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.email}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">CIN:</span>
            </label>
            <input
              type="text"
              name="cin"
              value={formData.cin}
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
              <span className="label-text">CIN Expiry:</span>
            </label>
            <input
              type="date"
              name="cinExpiry"
              value={formData.cinExpiry}
              onChange={handleChange}
              className={getInputClassName("cinExpiry")}
            />
            {errors.cinExpiry && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.cinExpiry}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">License:</span>
            </label>
            <input
              type="text"
              name="license"
              value={formData.license}
              onChange={handleChange}
              className={getInputClassName("license")}
            />
            {errors.license && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.license}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">License Expiry:</span>
            </label>
            <input
              type="date"
              name="licenseExpiry"
              value={formData.licenseExpiry}
              onChange={handleChange}
              className={getInputClassName("licenseExpiry")}
            />
            {errors.licenseExpiry && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.licenseExpiry}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Address:</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={getInputClassName("address")}
            />
            {errors.address && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.address}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Nationality:</span>
            </label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="Moroccan">Moroccan</option>
              <option value="Algerian">Algerian</option>
              <option value="Tunisian">Tunisian</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
              <option value="Italian">Italian</option>
              <option value="German">German</option>
              <option value="American">American</option>
              <option value="British">British</option>
              <option value="Canadian">Canadian</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Gender:</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Client Type:</span>
            </label>
            <select
              name="clientType"
              value={formData.clientType}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="PERSONAL">Personal</option>
              <option value="ENTERPRISE">Enterprise</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Birth Date:</span>
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={getInputClassName("birthDate")}
            />
            {errors.birthDate && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.birthDate}
                </span>
              </label>
            )}
          </div>

          {formData.nationality !== "Moroccan" && (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Passport Number:</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  className={getInputClassName("passportNumber")}
                />
                {errors.passportNumber && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.passportNumber}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Passport Expiry:</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  type="date"
                  name="passportExpiry"
                  value={formData.passportExpiry}
                  onChange={handleChange}
                  className={getInputClassName("passportExpiry")}
                />
                {errors.passportExpiry && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.passportExpiry}
                    </span>
                  </label>
                )}
              </div>
            </>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text">CIN Image:</span>
              <span className="label-text-alt text-error">*</span>
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
                <span className="label-text-alt text-error">
                  {errors.cinimage}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">License Image:</span>
              <span className="label-text-alt text-error">*</span>
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
                <span className="label-text-alt text-error">
                  {errors.licenseimage}
                </span>
              </label>
            )}
          </div>
          <div className="form-control">
            <label className="label cursor-pointer mt-6">
              <input
                type="checkbox"
                name="blacklisted"
                onChange={handleCheckboxChange}
                className="checkbox"
              />
              <span className="label-text">Blacklist this client</span>
            </label>
          </div>

          {formData.clientType === "ENTERPRISE" && (
            <>
              <div className="md:col-span-3">
                <h2 className="font-semibold text-lg divider">
                  Company Information
                </h2>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Company Name:</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={getInputClassName("companyName")}
                />
                {errors.companyName && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.companyName}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Registration Number:</span>
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className={getInputClassName("registrationNumber")}
                />
                {errors.registrationNumber && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.registrationNumber}
                    </span>
                  </label>
                )}
              </div>
            </>
          )}

          <div className="md:col-span-3 mt-6">
            <button
              type="submit"
              className={`btn bg-sky-600 text-white ${
                isSubmitting ? "loading" : ""
              }`}
              disabled={isSubmitting || isSaving}
            >
              {isSubmitting || isSaving ? "Saving..." : "Create Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
