import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import Header from './Header';
import { Separator } from '@/components/ui/separator';
import NavigationLinks from './Navigation';
import { NavLink } from 'react-router-dom';
// Import useAuth hook
// Assuming you have a User type defined

const PrivateRoute: React.FC = () => {
  const { user } = useAuth(); // Access user from the context

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
    <Header />    
      <div className="flex-1 p-4">
      <div className="container mt-20 pt-4">
      
  {user?.role === 'student' && (
    <div className="flex h-6 justify-center items-center mb-6 gap-4">
      <NavLink to="/home" className="text-primary font-bold">Home</NavLink>  
    <Separator orientation="vertical" />
      <NavLink to="/matched" className="text-primary font-bold">Run Skill Match</NavLink>  
      <Separator orientation="vertical" />
      <NavLink to="/applied" className="text-primary font-bold">Applied</NavLink>
      <Separator orientation="vertical" />
      <NavLink to="/repos" className="text-primary font-bold">Add project</NavLink>
      <Separator orientation="vertical" />
      <NavLink to={`/projects/${user?.id}`} className="text-primary font-bold">Projects</NavLink> 
    </div>
  )}

  {user?.role === 'employer' && (
    <div className="flex h-6 justify-center items-center mb-6 gap-4">
      <NavLink to="/home" className="text-primary font-bold">Home</NavLink>  
    <Separator orientation="vertical" />
      <NavLink to='/internship/create' className="text-primary font-bold">Add Internship</NavLink> 
      <Separator orientation="vertical" /> 
      <NavLink to='/page/create' className="text-primary font-bold">Add Company Page</NavLink>
      <Separator orientation="vertical" />
      <NavLink to='/internship/view' className="text-primary font-bold" >View Internships</NavLink>  
      <Separator orientation="vertical" />
      <NavLink to='/pages' className="text-primary font-bold">View Pages</NavLink>  
       
    </div>
  )}

  {user?.role === 'admin' && (
    <div className="flex h-6 justify-center items-center mb-6 gap-4">    
    <NavLink to="/home" className="text-primary font-bold">Home</NavLink>  
    <Separator orientation="vertical" />
      <NavLink to='/add/skill' className="text-primary font-bold">Add skill</NavLink>  
      <Separator orientation="vertical" />
      <NavLink to='/data' className="text-primary font-bold">View Data</NavLink>  
      <Separator orientation="vertical" />
      <NavLink to='/users' className="text-primary font-bold">View User</NavLink>  
    </div>
  )}
  </div>
        <div className='mt-4'>
          <Outlet />
        </div>
      </div>
    
    </>
 
  );
};

export default PrivateRoute;
