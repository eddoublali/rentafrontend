import React from 'react';

export default function Input({ 
  type = "text", 
  placeholder = "Type here", 
  value, 
  onChange, 
  name, 
  className = "", 
  ...props 
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input input-bordered w-full ${className}`}
      {...props}
    />
  );
}
