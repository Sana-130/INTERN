import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";

const GithubCont = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          localStorage.setItem('token', token);
        }

        // Call the backend route to fetch user data
        const response = await fetch('http://localhost:5000/test', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}` // Assuming your backend expects the token in the Authorization header
          }
        });
        
        if (!response.ok) {
          navigate('/login');
        }

        const userData = await response.json();
        
        // Assuming setUser is a function provided by useAuth to set the user data in context
        setUser(userData);
        navigate('/home');
      } catch (error) {
        console.error('Error:', error);
        // Handle error or redirect to an error page
        navigate('/login');
      }
    };

    fetchData();
  }, [token, navigate, setUser]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
};

export default GithubCont;
