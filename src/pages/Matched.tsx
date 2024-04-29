import Header from '@/_components/Header';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

const Matched: React.FC = () => {
  const [matchedInternships, setMatchedInternships] = useState<Internship[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const internshipsPerPage = 6;

  useEffect(() => {
    const fetchMatchedInternships = async () => {
      try {
        const jwtToken = localStorage.getItem('token');
        if (!jwtToken) {
          throw new Error('No JWT token found');
        }

        const response = await fetch('http://localhost:5000/internship/matched', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch matched internships');
        }

        const result = await response.json();
        setMatchedInternships(result);
      } catch (error) {
        console.error('Error fetching matched internships:', error);
      }
    };

    fetchMatchedInternships();
  }, []);

  // Get current internships
  const indexOfLastInternship = currentPage * internshipsPerPage;
  const indexOfFirstInternship = indexOfLastInternship - internshipsPerPage;
  const currentInternships = matchedInternships.slice(indexOfFirstInternship, indexOfLastInternship);

  // Change page
  const paginate = (pageNumber: number) => {
    const totalPages = Math.ceil(matchedInternships.length / internshipsPerPage);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <Header />
      <div className='mt-12'>
        <div>
        <Pagination>
        <PaginationContent>
        <div>
            {matchedInternships.length === 0 ? (
              <p>No matched internships</p>
            ) : (
              <h1>Matched Internships:</h1>
            )}
          </div>
          <PaginationItem>
            <PaginationPrevious onClick={() => paginate(currentPage - 1)} className={currentPage === 1 ? 'text-muted-foreground' : ''} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={() => paginate(currentPage + 1)} className={currentInternships.length < internshipsPerPage ? 'text-muted-foreground' : ''} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-2'>
          {currentInternships.map(internship => (
            <Link to={`/internship/${internship.id}`} key={internship.id}>
              <Card>
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
      </div>
     
    </>
  );
};

export default Matched;
