import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Input } from "@/components/ui/input";

import { useState , useEffect} from "react"

interface Company {
    id: number;
    name: string;
    location: string;
    verified: boolean;
    first_name: string;
    last_name: string;
    email: string;
}


export const Companies = () => {
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [input, setInput] = useState<string>("");
    const [totalPage, setTotalPages ] = useState(0);
    const [records, setRecords ] =  useState<Company[]>([]);
    const [search, setSearch ] =  useState<Company[]>([]);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue: string = event.target.value;
      setInput(inputValue);
  
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
  
      const newTimeoutId: number = window.setTimeout(() => {
        if (inputValue.trim() !== '') { 
          searchComp(inputValue); 
        }
      }, 500); 
  
      setTimeoutId(newTimeoutId);
    };

    const searchComp = async (input: string) => {
      try {
        const response = await fetch(`http://localhost:5000/employer/company/search?input=${input}`);
        if (!response.ok) {
          console.log(response.statusText);
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSearch(data);
        console.log("API Response:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  

    useEffect(() => {
        // Fetch total number of records
        fetchTotalRecords();
      }, []);
    
      const fetchTotalRecords = async () => {
        try {
          const response = await fetch("http://localhost:5000/employer/company/length");
          if (!response.ok) {
            throw new Error("Failed to fetch total records");
          }
          const data = await response.json();
          setTotalRecords(data[0].total_records);
          setTotalPages(Math.ceil(data[0].total_records/ 10)); 
        } catch (error) {
          console.error("Error fetching total records:", error);
        }
      };

      useEffect(() => {
        // Fetch total number of records
        fetchCompanies();
      }, [page]);
    

      const fetchCompanies = async () => {
        try {
            console.log(page);
          const response = await fetch(`http://localhost:5000/employer/all/not-verified?page=${page}`);
          if (!response.ok) {
            throw new Error("Failed to fetch companies");
          }
          const data = await response.json();
          setRecords(data);
          // Process the response and set companies state
        } catch (error) {
          console.error("Error fetching companies:", error);
        }
      };

      const next = () => {
        if (page < totalPage) {
            setPage(page + 1);
          }
      }
      
      const prev = () => {
        if (page > 1) {
            setPage(page - 1);
        }
      }

    return (
        <>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious className={page === 1 ? 'text-muted-foreground' : ''} onClick={prev} />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext className={page === totalPage ? 'text-muted-foreground' : ''} onClick={next} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="flex w-full max-w-sm items-center space-x-2 m-4">
          <Input 
            type="text" 
            placeholder="search by name" 
            value={input} 
            onChange={handleInputChange}
          />
        </div>
        <div className="m-2">
    <Table>
        <TableCaption>A list of your recent companies.</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Email</TableHead>
            </TableRow>
        </TableHeader>

        <TableBody>
        {(search.length>0 && input!='') ? (
          // If search term is not empty, loop through filtered records
          search.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.id}</TableCell>
              <TableCell><Link to={`/page/${company.id}`}>{company.name}</Link></TableCell>
              <TableCell>{company.location}</TableCell>
              <TableCell>{company.verified ? 'Verified' : 'Not Verified'}</TableCell>
              <TableCell>{`${company.first_name} ${company.last_name}`}</TableCell>
              <TableCell>{company.email}</TableCell>
            </TableRow>
          ))
        ) : (
          // If search term is empty, loop through all records
          records.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.id}</TableCell>
              <TableCell><Link to={`/page/${company.id}`}>{company.name}</Link></TableCell>
              <TableCell>{company.location}</TableCell>
              <TableCell>{company.verified ? 'Verified' : 'Not Verified'}</TableCell>
              <TableCell>{`${company.first_name} ${company.last_name}`}</TableCell>
              <TableCell>{company.email}</TableCell>
            </TableRow>
          ))
        )}
        </TableBody>
    </Table>
</div>
        </>
    
      )
}