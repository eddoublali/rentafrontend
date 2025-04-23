import { createContext, useContext, useState } from 'react';
import api from '../services/api';  

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); 



const createUser = async (userData) => {
  try {
    setLoading(true);
    const { data } = await api.post('/auth/signup', userData);
    setUsers((prevUsers) => [...prevUsers, data.user]); // Add the new user to the state
    return { success: true, user: data.user };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to create user';
    console.error('User creation error:', errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};
  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/user');
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

const fetchUserById = async (id) => {
  try {
    setLoading(true);
    const { data } = await api.get(`/user/${id}`);
    setUser(data.user); 
    return data.user;
  } catch (error) {
    console.error(`Failed to fetch user with ID ${id}:`, error);
    return null;
  } finally {
    setLoading(false);
  }
};

const updateUser = async (id, updatedData) => {
  try {
    setLoading(true);
    const { data } = await api.put(`/user/${id}`, updatedData);
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === id ? data.user : user))
    );
    return { success: true, user: data.user };
  } catch (error) {
    console.error(`Failed to update user with ID ${id}:`, error);
    
    if (error.response?.status === 400 && error.response?.data?.message === "Email already exists") {
      return { 
        success: false, 
        error: "Email already exists",
        field: "email" 
      };
    }
    
    return { 
      success: false, 
      error: error.response?.data?.message || `Failed to update user with ID ${id}`
    };
  } finally {
    setLoading(false);
  }
};
  // Delete user by ID
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/user/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error(`Failed to delete user with ID ${id}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ 
      users, 
      user, 
      loading, 
      fetchUsers, 
      fetchUserById, // Expose the fetchUserById function 
      updateUser, 
      deleteUser, 
      createUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
