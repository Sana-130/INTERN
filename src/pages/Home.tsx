import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';
import Listing from '@/_components/Listing';

interface Internship {
  id: number;
  title: string;
  createdat: string;
  name: string;
  company_name: string;
  location: string;
  min_salary: number;
  max_salary: number;
}

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const internshipsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const jwtToken = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/internship/retrieve', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: Internship[] = await response.json();
        console.log(data);
        setInternships(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (user?.role !== 'admin') {
      fetchData();
    }
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
    <div className="container mt-2 pt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious  onClick={() => paginate(currentPage - 1)} className={currentPage === 1 ? 'text-muted-foreground' : ''} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext  onClick={() => paginate(currentPage + 1)} className={currentInternships.length < internshipsPerPage ? 'text-muted-foreground' : ''} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {(user?.role === 'student' || user?.role === 'employer') && (
        <div className="main-content flex">
          <div className="card-container flex-grow p-4">
            <Listing internships={currentInternships} view={false} />
            {/* Repeat the Card component for other cards */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
