import React, { createContext, useContext, useState, ReactNode , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number; //changed string to number
  first_name?: string;
  last_name?:string;
  role: string;
  githubId:string;
  imageLink?:string;
  profileLink?:string;
  username?:string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const getInfo = async (id:string) => {
  try{
    const response = await fetch(`https://api.github.com/user/${id}`, {
      method: 'GET',
    });
    if (response.ok) {
      const data = await response.json();
      const [first_name, last_name] = data.name.split(' ');
      return ({ imageLink : data.avatar_url, profileLink: data.url, username:data.login, first_name, last_name})
    }else{
      return undefined;
    }
    
  }catch(err){
    console.log(err);

  }
 
  
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/test', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log(userData);
        setUser(userData);

      /*  if (userData.githubId) {
          const info = await getInfo(userData.githubId);
          if (info) {
            setUser(prevUser => ({
              ...prevUser!,
              imageLink: info.imageLink,
              profileLink: info.profileLink,
              first_name:info.first_name,
              last_name:info.last_name,
              username:info.username
            }));
          }
        }*/
        navigate('/home');
      } else {
        setUser(null);
        //navigate('/login'); // Clear user if unauthorized or error response
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null); // Clear user if error occurs
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); 

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
