import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppliedDetails from '@/_components/AppliedDetails';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from 'react-router-dom';
import InternshipForm from '@/_components/InternshipForm';
import { Toaster } from "@/components/ui/sonner"
import { toast } from 'sonner';

interface InternshipData {
  id: number;
  title: string;
  description: string;
  company_name: string;
  user_id: number;
  location: string;
  last_date: string;
  min_salary: string;
  max_salary: string;
  is_active: boolean;
  createdat: string;
  skills: {
    id: number;
    name: string;
    isLang: boolean;
  }[];
}

const Internship: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [internshipData, setInternshipData] = useState<InternshipData | null>(null);
  const [showApplications, setShowApplications] = useState<boolean>(false);
  const [edit , setEdit ] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/internship/retrieve/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: InternshipData = await response.json();
        setInternshipData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const getApplications = () => {
    setShowApplications(true);
  };
  
  const handleApply = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/internship/apply', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }), // Send the internship ID in the request body
      });
      if (response.ok) {
        toast.info("You have successfully applied");
      } else {
        toast.error("Oops something went wrong");
      }
      const result = await response.json();
      console.log("result", result); // Log the result
    } catch (error) {
      console.error('Error applying:', error);
    }
  };

  let languages: { id: number; name: string; isLang: boolean; }[] = [];
  let frameworks: { id: number; name: string; isLang: boolean; }[] = [];
  if (internshipData) {
    languages = internshipData.skills.filter(skill => skill.isLang);
    frameworks = internshipData.skills.filter(skill => !skill.isLang);
  }

 
    const handleDelete = async (id:number) => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage// Replace 'your-internship-id' with the actual internship ID
    
        const response = await fetch(`http://localhost:5000/internship/delete/${id}`, {
          method: 'GET', // Use the DELETE method for deletion
          headers: {
            Authorization: `Bearer ${token}`
          } 
        });
    
        if (!response.ok) {
          throw new Error('Failed to delete internship');
        }
    
        // Handle success
        toast.info("You have successfully deleted this internship");
      } catch (error) {
        // Handle error
        toast.error("Oops something went wrong");
        console.error('Error deleting internship:', error);
      }
    };
  

  return (
    <>
    {!edit ? (
      <div className='m-4'>
    {/* Render internship details */}
    {!showApplications && internshipData && (
      <div className='flex flex-col mt-32'>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Internship Details</h2>
        <p className='leading-7 [&:not(:first-child)]:mt-6'>Title: {internshipData.title}</p>
        <p className='leading-7 [&:not(:first-child)]:mt-6'>Description: {internshipData.description}</p>
        <p className='leading-7 [&:not(:first-child)]:mt-6'>Posted By: {internshipData.company_name} {internshipData.location}</p>
        <p className='leading-7 [&:not(:first-child)]:mt-6'>Last Date: {new Date(internshipData.last_date).toLocaleDateString()}</p>
        <p className='leading-7 [&:not(:first-child)]:mt-6'>Salary Range: {parseFloat(internshipData.min_salary).toFixed(2)} - {parseFloat(internshipData.max_salary).toFixed(2)}</p>
        <p className='leading-7 [&:not(:first-child)]:mt-6 border-b pb-2'>Posted at: {new Date(internshipData.createdat).toLocaleDateString()}</p>
        <div className='m-2 '>
        <p className='leading-7 [&:not(:first-child)]:mt-6'> Skill Requirements</p>
          {languages.length > 0 && (
            <div>
              <h2>Languages</h2>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              {languages.map(skill => (
                <li key={skill.id}>{skill.name}</li>
              ))}
            </ul>
            </div>
          )}
           {frameworks.length > 0 && (
          <div>
          <h2 className='mt-4'>Frameworks</h2>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            {frameworks.map(skill => (
              <li key={skill.id}>{skill.name}</li>
            ))}
          </ul>
          </div>)}
        </div>
        {user?.id === internshipData?.user_id && (
          <div className='flex flex-row gap-4 m-2'>
            <Button variant="destructive" className='w-28' onClick={() => {handleDelete(internshipData?.id)}}>Delete</Button>
          <Button variant="outline" className='w-30' onClick={getApplications}>See Applications</Button>
          <Button variant="outline" className='w-28' onClick={() => setEdit(true)}>Edit</Button>
          </div>
        )}
        {user?.id !== internshipData?.user_id && (
          <div>
          <Button className='w-28' onClick={handleApply}>Apply</Button>
          </div>
        )}
      </div>
    )}
    {/* Render the AppliedDetails component if showApplications is true */}
    {showApplications && internshipData && (
      <AppliedDetails id={internshipData.id} title={internshipData.title} languages={languages} frameworks={frameworks} />
    )}
  </div>

    ) : ( <>
      {internshipData && (
        <InternshipForm 
        id={internshipData.id} // Convert id to string
        title={internshipData?.title}
        createdat={internshipData?.createdat}
        user_id = {internshipData?.user_id}
        company_name={internshipData?.company_name}
        description={internshipData?.description}
        last_date={internshipData?.last_date}
        min_salary={internshipData?.min_salary}
        max_salary={internshipData?.max_salary}
        is_active={internshipData?.is_active} />
      )}
    </>
     )}

     <Toaster />
    </>
  );
};

export default Internship;
