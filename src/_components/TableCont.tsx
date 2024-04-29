import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface AppliedDetails{
    user_id:number;
    first_name: string;
    last_name: string;
    contact_mail: string;
    apply_date: Date;
    status:string;
  }

  interface TableContProps {
    id: number;
    appliedDetails: AppliedDetails[];
  }

  interface UserStat {
    name: string;
    score: string;
    isLang: boolean;
  }

  
export const TableCont: React.FC<TableContProps> = ({ id , appliedDetails }) => {
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [userStats, setUserStats] = useState<UserStat[]>([]);

    const handleRowClick = async (userId: number) => {
        setSelectedUserId(userId);

        try {
            const token = localStorage.getItem('token'); // Get JWT token from local storage
            const response = await fetch(`http://localhost:5000/user/${userId}/stats`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token in the headers
            },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user stats');
            }
            const data = await response.json();
            console.log(data);
            setUserStats(data);
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
  };

    const handleShortlisted = async (userId: number) => {
        try {
          const jwtToken = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/internship/applicants/accept', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ internship_id: id, user_id: userId })
          });
          if (!response.ok) {
            throw new Error('Failed to shortlist applicant');
          }
          toast.info(`shortlisted candidate with ID ${userId}`);
          // Refresh the appliedDetails state or update UI as needed
        } catch (error) {
          console.error('Error shortlisting applicant:', error);
        }
      };
    
      const handleRejected = async (userId: number) => {
        try {
          const jwtToken = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/internship/applicants/reject', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({  internship_id: id, user_id: userId })
          });
          if (!response.ok) {
            throw new Error('Failed to reject applicant');
          }
          toast.info(`Rejected candidate with ID ${userId}`);
          // Refresh the appliedDetails state or update UI as needed
        } catch (error) {
          console.error('Error rejecting applicant:', error);
        }
      };

      const handlePending = async (userId: number) => {
        try {
          const jwtToken = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/internship/applicants/pending', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({  internship_id: id, user_id: userId })
          });
          if (!response.ok) {
            throw new Error('Failed to reject applicant');
          }
          toast.info(`changed state of candidate with ID ${userId} to pending`);
          // Refresh the appliedDetails state or update UI as needed
        } catch (error) {
          console.error('Error rejecting applicant:', error);
        }
      };
    
    const langStats = userStats.filter(stat => stat.isLang);
    const otherStats = userStats.filter(stat => !stat.isLang);

    return (
        <>
        <div className='flex flex-row'>
        <Table className='mt-2'>
      <TableCaption>All the applications</TableCaption>
      <TableHeader>
        <TableRow>
        <TableHead>Full Name</TableHead>
        <TableHead>Applied date</TableHead>
        <TableHead>Contact Mail</TableHead>
        <TableHead>Status</TableHead>
        </TableRow>
        </TableHeader>
        <TableBody>
        {appliedDetails.map((user) => (
            <TableRow key={user.user_id}>
            <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
            <TableCell>{new Date(user.apply_date).toLocaleDateString()}</TableCell>
            <TableCell >{user.contact_mail}</TableCell>
            <TableCell >{user.status}</TableCell>
            <TableCell><Button variant="link" onClick={() => handleRowClick(user.user_id)}>See Stats</Button></TableCell>
            <TableCell><Button variant="link" onClick={() => handleRejected(user.user_id)} disabled={user.status == 'Rejected'}><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></Button>
            <Button variant="link" onClick={() => handleShortlisted(user.user_id)} disabled={user.status == 'Shortlisted'}><svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></Button>
            <Button variant="link" onClick={() => handlePending(user.user_id)} disabled={user.status == 'Pending'}>
            </Button>Undo</TableCell>
        </TableRow>
      ))}
      </TableBody>
    </Table>
    <div>
    {selectedUserId && (
        <div>
          <div className="ml-4">
            <p className='text-sm'>langStats</p>
            {/* Render user stats here */}
            {/* Render user stats here */}
    {langStats.map((stat, index) => (
        <div className='m-2' key={index}>
            <p className="mb-2 text-muted-foreground">{stat.name} </p>
            {parseInt(stat.score)> 0 && <Progress value={parseInt(stat.score)} className="w-[60%]" />}
        </div>
    ))}
</div>

          <div>
          <p className='text-sm'>Other stats</p>
          {otherStats.map((stat, index) => (
                 <div className='m-2'><p className="mb-2 text-muted-foreground">{stat.name} </p><Progress value={parseInt(stat.score)} className="w-[60%]" /></div>
            ))}
          </div>
        </div>
          
        )}
      </div>
    </div>
    <Toaster />
        </>
    )
}