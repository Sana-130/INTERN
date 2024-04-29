import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface Skill {
    name:string,
    id:number,
    islang:boolean
} 

export const InSkill = ({ id }: { id: number }) => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/internship/skills/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json(); // Log the fetched data
          setSkills(data); // Update the skills state with fetched data
        } else {
          console.error("Failed to fetch skills");
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, [id]);

  const remove = async(skill_id:number) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/internship/delete/${id}/${skill_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skill_id));
          console.log(data); // Log the fetched data
          toast.info("removed skill");
        } else {
          console.error("Failed to fetch skills");
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
  }


  return (
    <>
      <Table>
        <TableCaption>A list skills added to internship</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Language</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.map((skill) => (
            <TableRow >
              <TableCell className="font-medium">{skill.name}</TableCell>
              <TableCell>{skill.islang ? 'Yes' : 'No'}</TableCell>
              <TableCell><Button variant="outline" onClick={() => remove(skill.id)}>Remove</Button></TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Toaster />
    </>
  );
};
