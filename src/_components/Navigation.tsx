import React from 'react';
import { NavLink } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

interface NavigationLinksProps {
  role?: string;
  id?:number;
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({ role, id }) => {
  return (
    <>
      {role === 'student' && (
        <div className="flex h-6 justify-center items-center mb-6 gap-4">
          <NavLink to="/matched" className="text-primary font-bold">
            Run Skill Match
          </NavLink>
          <Separator orientation="vertical" />
          <NavLink to="/applied" className="text-primary font-bold">
            Applied
          </NavLink>
          <Separator orientation="vertical" />
          <NavLink to="/repos" className="text-primary font-bold">
            Add project
          </NavLink>
          <Separator orientation="vertical" />
          <NavLink to={`/projects/${id}`} className="text-primary font-bold">
            Projects
          </NavLink>
        </div>
      )}

      {role === 'employer' && (
        <div className="flex h-6 justify-center items-center mb-6 gap-4">
          <NavLink to="/internship/create" className="text-primary font-bold">
            Add Internship
          </NavLink>
          <Separator orientation="vertical" />
          <NavLink to="/page/create" className="text-primary font-bold">
            Add Company Page
          </NavLink>
          <Separator orientation="vertical" />
          <NavLink to="/internship/view" className="text-primary font-bold">
            View Internships
          </NavLink>
          <Separator orientation="vertical" />
          <NavLink to="/pages" className="text-primary font-bold">
            View Pages
          </NavLink>
        </div>
      )}

      {role === 'admin' && (
        <div className="flex h-6 justify-center items-center mb-6 gap-4">
          <NavLink to="/add/skill" className="text-primary font-bold">
            Add skill
          </NavLink>
          <Separator orientation="vertical" />
          <NavLink to="/data" className="text-primary font-bold">
            View Data
          </NavLink>
          <Separator orientation="vertical" />
          <NavLink to="/users" className="text-primary font-bold">
            View User
          </NavLink>
        </div>
      )}
    </>
  );
};

export default NavigationLinks;
