import React, { useState, useEffect } from 'react';
import Listing from '@/_components/Listing';
import { useParams } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from 'sonner';
import CompanyEdit from '@/_components/CompanyEdit';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Define the interface for the fetched page
interface Page {
  id: number;
  name: string;
  bio: string;
  location: string;
  link: string;
  user_id: number;
}

interface Internship {
  id: number;
  title: string;
  createdat: string;
  description?: string;
  name: string;
  company_name: string;
  location: string;
  min_salary: number;
  max_salary: number;
}

interface ApiResponse {
  e: boolean;
}

const Page = () => {
  // Get the id parameter from the URL
  const { id } = useParams<{ id: string }>();
  const [edit, setEdit] = useState(false);
  const { user } = useAuth();

  // Define state to store the fetched page and internships
  const [employerPage, setEmployerPage] = useState<Page | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const jwtToken = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/employer/page/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setEmployerPage(data.data[0]);
        setInternships(data.internships);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPage();
  }, [id]);

  useEffect(() => {
    console.log(employerPage);
  }, [employerPage]);

  const verify = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/admin/company/verify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      } else {
        toast.success('My first toast');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }

  const deletePage = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/employer/company/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      } else {
        const data: ApiResponse = await response.json(); // Specify the type of data
        if (data) {
          toast.warning('There are active internships related to this company page');
        } else {
          toast.success('Company Page has been deleted');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Oops, some error occurred!');
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = internships.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div>
        <div>
          {!edit && (
            <div>
              {user?.id === employerPage?.user_id && (
                <div className="mb-4">
                  <Button variant="outline" onClick={deletePage} className="mr-2">Delete</Button>
                  <Button variant="outline" onClick={() => setEdit(true)}>Edit</Button>
                </div>
              )}
              {employerPage && (
                <div className="flex flex-col mb-4 justify-center items-center">
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {employerPage.name}
                  </h1>
                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    {employerPage.bio}
                  </p>
                  <p className="leading-7 [&:not(:first-child)]:mt-4 mb-4">{employerPage.location}</p>
                  <a href={employerPage.link} className="text-blue-500">Visit Us</a>
                </div>
              )}
            </div>
          )}
          {user?.role === 'admin' && (
            <Button onClick={verify} className="mb-4">Verify</Button>
          )}
          {!edit && (
            <div>
            
              <Pagination className='m-4'>
                <PaginationContent>
                <p>Browse Our Internships</p>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => paginate(currentPage - 1)} className={currentPage === 1 ? 'text-muted-foreground' : ''} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={() => paginate(currentPage + 1)} className={currentItems.length < itemsPerPage ? 'text-muted-foreground' : ''} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <Listing internships={currentItems} view={true} />
            </div>
          )}
        </div>
        {edit && employerPage && (
          <div className='w-1/2'>
            <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight mb-4 mt-4">
              Edit the Internship
            </h3>
            <CompanyEdit id={employerPage.id} name={employerPage.name} bio={employerPage.bio}
              location={employerPage.location} link={employerPage.link} user_id={employerPage.user_id} />
          </div>
        )}
        <Toaster />
      </div>
    </>
  );
}

export default Page;
