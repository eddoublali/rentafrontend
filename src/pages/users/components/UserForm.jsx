import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // 👈 Import eye icons
import { useUser } from '../../../context/UserContext'; // Import UserContext
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';

// Create Zod schema for validation
const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'ACCOUNTANT', 'ADMINISTRATEUR'], 'Invalid role'),
});

export default function UserForm({ user, onSubmit }) {
  const { createUser, updateUser } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user?.role || 'ADMIN');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // 👈 Password toggle state

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'name') setName(value);
    if (id === 'email') setEmail(value);
    if (id === 'password') setPassword(value);
    if (id === 'role') setRole(value);
  };

  const togglePassword = () => setShowPassword((prev) => !prev); // 👈 Toggle password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const result = userSchema.safeParse({ name, email, password, role });
  
    if (result.success) {
      const userData = { name, email, password, role };
      
      try {
        if (user) {
          // Update existing user
          const response = await updateUser(user.id, userData);
          
          if (response && !response.success) {
            // Handle update errors
            if (response.error === "Email already exists") {
              setErrors(prev => ({ ...prev, email: t("user.Emailexists") }));
            } else {
              setErrors(prev => ({ ...prev, general: response.error || "Failed to update user" }));
            }
            return;
          }
          
          // Successful update
          navigate('/users');
        } else {
          // Create new user
          const response = await createUser(userData);
          
          if (response && !response.success) {
            // Handle creation errors
            if (response.error === "Email already exists") {
              setErrors(prev => ({ ...prev, email: "Email already exists" }));
            } else {
              setErrors(prev => ({ ...prev, general: response.error || "Failed to create user" }));
            }
            return;
          }
          
          // Successful creation - reset form and navigate
          setName('');
          setEmail('');
          setPassword('');
          setRole('ADMIN');
          setErrors({});
          navigate('/users');
        }
      } catch (error) {
        // Handle any unexpected errors
        setErrors(prev => ({ 
          ...prev, 
          general: "An unexpected error occurred. Please try again." 
        }));
        console.error("Form submission error:", error);
      }
    } else {
      // Handle validation errors from Zod
      const newErrors = result.error.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
      setErrors(newErrors);
    }
  };
  return (
   
    <div className="max-w-xl mx-auto p-10 my-5  rounded">
    

    <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-semibold mb-4">{user ? t("user.createUser") : t("user.createUser") }</h2>
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="btn btn-soft"
        >
          {t("common.cancel")}
        </button>
    </div>

    
    {errors.general && (
      <div className="alert alert-error mt-4">
        <span>{errors.general}</span>
      </div>
    )}
    <form onSubmit={handleSubmit}>
      {/* Name Input */}
      <div className="form-control mb-4">
        <label className="label" htmlFor="name">
          <span className="label-text">{t("user.name") }</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleChange}
          className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
        />
        {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
      </div>
  
      {/* Email Input */}
      <div className="form-control mb-4">
        <label className="label" htmlFor="email">
          <span className="label-text">{t("user.email") }</span>
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleChange}
          className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
        />
        {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
      </div>
  
      {/* Password Input with toggle */}
      <div className="form-control mb-4 relative">
        <label className="label" htmlFor="password">
          <span className="label-text">{t("user.password") }</span>
        </label>
    
         <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          value={password}
          onChange={handleChange}
          className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
        />

        <span
          onClick={togglePassword}
          className="absolute right-3 top-9 cursor-pointer text-gray-600"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
        {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
      </div>
  
      {/* Role Select Dropdown */}
      <div className="form-control mb-4">
        <label className="label" htmlFor="role">
          <span className="label-text">{t("user.role") }</span>
        </label>
        <select
          id="role"
          value={role}
          onChange={handleChange}
          className={`select select-bordered w-full cursor-pointer${errors.role ? 'select-error' : ''}`}
        >
          <option value="ADMIN">{t("user.Admin") }</option>
          <option value="ACCOUNTANT">{t("user.Accountant") }</option>
          <option value="ADMINISTRATEUR">{t("user.Administrator") }</option>
        </select>
        {errors.role && <p className="text-error text-xs mt-1">{errors.role}</p>}
      </div>
  
      {/* Submit Button */}
      <button
        type="submit"
        className="btn bg-sky-600 text-white w-full mt-2"
      >
        {user ? t("user.UpdateUser") : t("user.CreateUser") }
      </button>
    </form>
  </div>
  
  );
}
