import { useEffect, useState } from "react";
import { TableCont } from "./TableCont";
interface AppliedDetailsProps {
    id : number;
    filter:string;
}

interface AppliedDetails{
    user_id:number;
    first_name: string;
    last_name: string;
    contact_mail: string;
    apply_date: Date;
    status:string;
  }

export const Filter: React.FC<AppliedDetailsProps> = ({ id , filter}) => {
    const [appliedDetails, setAppliedDetails] = useState<AppliedDetails[]>([]);

    let url = `http://localhost:5000/internship/${id}/filter?filter=${filter}`;

    useEffect(() => {
        const fetchAppliedDetails = async () => {
            if(filter=='a'){
                url = `http://localhost:5000/internship/applied/${id}`;
            }
            try {
                const jwtToken = localStorage.getItem('token');
                const response = await fetch(url, {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json' // Optionally, include Content-Type header if needed
                  }
                });
                if (!response.ok) {
                  throw new Error('Failed to fetch data');
                }
                const data: AppliedDetails[] = await response.json();
                setAppliedDetails(data);
              } catch (error) {
                console.error('Error fetching data:', error);
              }
        };
    
        fetchAppliedDetails();
      }, [id, filter]);

    return (
        <>
        <TableCont id={id} appliedDetails={appliedDetails}/>
        </>
    )

}