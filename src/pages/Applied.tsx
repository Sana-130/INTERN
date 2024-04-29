import Header from '@/_components/Header';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Listing from '@/_components/Listing';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Internship {
  id: number;
  title: string;
  description: string;
  last_date: string;
  min_salary: string;
  max_salary: string;
  createdat: string;
}

const Applied: React.FC = () => {
  const [appliedInternships, setAppliedInternships] = useState<Internship[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const internshipsPerPage = 6;

  useEffect(() => {
    const fetchAppliedInternships = async () => {
      try {
        const jwtToken = localStorage.getItem('token');
        if (!jwtToken) {
          throw new Error('No JWT token found');
        }

        const response = await fetch('http://localhost:5000/internship/applied', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch applied internships');
        }

        const result = await response.json();
        setAppliedInternships(result);
      } catch (error) {
        console.error('Error fetching applied internships:', error);
      }
    };

    fetchAppliedInternships();
  }, []);

  // Get current internships
  const indexOfLastInternship = currentPage * internshipsPerPage;
  const indexOfFirstInternship = indexOfLastInternship - internshipsPerPage;
  const currentInternships = appliedInternships.slice(indexOfFirstInternship, indexOfLastInternship);

const paginate = (pageNumber: number) => {
  const totalPages = Math.ceil(appliedInternships.length / internshipsPerPage);
  if (pageNumber > 0 && pageNumber <= totalPages) {
    setCurrentPage(pageNumber);
  }
};


  return (
    <>
      <Header />
      <div className='mt-12'>
        
        <Pagination>
          <PaginationContent>
          <h2 className='p-4'>Applied Internships:</h2>
            <PaginationItem>
              <PaginationPrevious onClick={() => paginate(currentPage - 1)} className={currentPage === 1 ? 'text-muted-foreground' : ''} />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={() => paginate(currentPage + 1)} className={currentInternships.length < internshipsPerPage ? 'text-muted-foreground' : ''} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          
          {currentInternships.map(internship => (
            <Link to={`/internship/${internship.id}`} key={internship.id}>
              <Card className='m-2'>
                <CardHeader>
                  <CardTitle>{internship.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{internship.description}</p>
                </CardContent>
                <CardFooter>
                  <p>Last Date: {new Date(internship.last_date).toLocaleDateString()}</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
       
      </div>
    </>
  );
};

export default Applied;
