import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserForm from './UserForm';
import { useUser } from '../../../context/UserContext';


export default function EditUser() {
  const { id } = useParams();
  const { user, fetchUserById, updateUser} = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Fetch the user when the component mounts
  useEffect(() => {
    fetchUserById(Number(id));
  }, [id]);

  const handleSubmit = async (userData) => {
    const response = await updateUser(user.id, userData);
    
    if (response && response.success) {
      navigate('/users');  // Redirect after successful update
      return { success: true };
    } else {
      // Return the error information to the form
      return response;
    }
  };
  
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <>
      <UserForm user={user} onSubmit={handleSubmit} />
    </>
  );
}