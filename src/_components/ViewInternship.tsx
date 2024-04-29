import React, { useState, useEffect } from 'react';
import Listing from './Listing';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface Internship {
  id: number;
  title: string;
  createdat:string;
  company_name: string;
  name:string;
  location: string;
  min_salary:number;
  max_salary:number;
  is_active:boolean;
}

const ViewInternship: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const internshipsPerPage = 5;

  useEffect(() => {
    const fetchInternshipData = async () => {
      try {
        const jwtToken = localStorage.getItem('token');
        if (!jwtToken) {
          throw new Error('No JWT token found');
        }

        const response = await fetch('http://localhost:5000/internship/view', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (response.ok) {
          const data: Internship[] = await response.json();
          console.log(data);
          setInternships(data);
        } else {
          throw new Error('Failed to fetch internship data');
        }
      } catch (error) {
        console.error('Error fetching internship data:', error);
      }
    };

    fetchInternshipData();
  }, []);

  // Pagination Logic
  const indexOfLastInternship = currentPage * internshipsPerPage;
  const indexOfFirstInternship = indexOfLastInternship - internshipsPerPage;
  const currentInternships = internships.slice(indexOfFirstInternship, indexOfLastInternship);

  const totalPages = Math.ceil(internships.length / internshipsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, pageNumber)));
  };

  return (
    <div className="container mb-4 pt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={() => paginate(currentPage - 1)} className={currentPage === 1 ? 'text-foreground' : ''} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" onClick={() => paginate(currentPage + 1)} className={currentInternships.length < internshipsPerPage ? 'text-foreground' : ''} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div>
        <Listing internships={currentInternships} view={true}/>
      </div>
    </div>
  );
};

export default ViewInternship;
