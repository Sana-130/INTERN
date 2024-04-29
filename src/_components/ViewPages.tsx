import React, { useState , useEffect } from 'react';
import { Link } from 'react-router-dom';
interface Page {
    id: number;
    name: string;
    location: string;
  }

  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

const ViewPages = () => {
 const [Pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/employer/pages', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        //const data = await response.json();
        const data: Page[] = await response.json();
        setPages(data);
        //console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4">
      {Pages.map(page => (
        <Link key={page.id} to={`/page/${page.id}`}>
          <div className="cursor-pointer">
            <Card>
              <CardHeader>
                <CardTitle>{page.name}</CardTitle>
                <CardDescription>{page.location}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ViewPages;
