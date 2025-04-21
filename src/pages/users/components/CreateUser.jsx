import React, { useState } from 'react';
import { useUser } from '../../../context/UserContext';
import UserForm from './UserForm';

export default function CreateUser() {
  const { createUser } = useUser();
 
  // Handle the submission of the form
  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData);
      return { success: true };
    } catch (error) {
      // Pass the error back to the form
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create user'
      };
    }
  };

  return (
    <>
      <UserForm onSubmit={handleCreateUser} />
    </>
  );
}