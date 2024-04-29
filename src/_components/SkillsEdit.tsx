import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

interface Skill {
  skill_id: number;
  skill_name: string;
  score: string;
}

const SkillsEdit: React.FC = () => {
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [input, setInput] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]); 
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState('1');
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue: string = event.target.value;
    setInput(inputValue);

    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }

    const newTimeoutId: number = window.setTimeout(() => {
      if (inputValue.trim() !== '') { 
        searchSkills(inputValue); 
      }
    }, 500); 

    setTimeoutId(newTimeoutId);
  };

  const searchSkills = async (input: string) => {
    try {
      const response = await fetch(`http://localhost:5000/skills/search/lib?input=${input}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSkills(data.allItems);
      console.log("API Response:", data.allItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try{
      const rating = Number(selectedValue);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/skills/add/lib', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({skill: selectedSkill, rating}),
      })
      
      if(response.ok){
        const data = await response.json();
        setUserSkills(prevSkills => [...prevSkills, { skill_id: data.id, skill_name: data.name, score: rating.toString() }]);
        //console.log(data);
      }else{
        console.log("some error");
      }
    }catch(err){
      console.log(err);
    }
   // console.log("Selected skill:", selectedSkill);
   // console.log("Rating:", selectedValue);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSkill(event.target.value);
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };


  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        const jwtToken = localStorage.getItem('token');
        if (!jwtToken) {
          throw new Error('No JWT token found');
        }
        const response = await fetch('http://localhost:5000/user/skills/get', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserSkills(data);
        } else {
          console.error('Failed to fetch user skills');
        }
      } catch (error) {
        console.error('Error fetching user skills:', error);
      }
    };

    fetchUserSkills();
  }, []);

  const deleteSkill = async (id: number) => {
    try {
      const token = localStorage.getItem('token');

      await fetch(`http://localhost:5000/user/skill/delete/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // If successful, update the userSkills state to remove the deleted skill
      setUserSkills(prevUserSkills => prevUserSkills.filter(skill => skill.skill_id !== id));
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  return (
    <>
    <h3 className="scroll-m-20 text-2xl font-semibold mb-4 pb-2 mr-2 ml-4">Libraries/Frameworks</h3>
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Skill</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Skill</DialogTitle>
          <DialogDescription>
            Make changes to skill stats.
          </DialogDescription>
        </DialogHeader>
        <div>
      <form className='mb-4'>
        <div className="flex w-full max-w-sm items-center space-x-2 flex-row gap-4">
          <Input 
            type="text" 
            placeholder="input" 
            value={input} 
            onChange={handleInputChange}
          />
          <Button type="submit">Add Skill</Button>
        </div>
      </form>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mb-4">
          <p className="text-sm m-2">Select the skill you want to include.</p>
        </div>
        {skills.map((item) => (
          <div key={item} className="flex items-center space-x-2 m-2">
            <input
              type="radio"
              id={item}
              name="selectedSkill"
              value={item}
              checked={selectedSkill === item}
              onChange={handleRadioChange}
            />
            <label htmlFor={`${item}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {item}
            </label>
          </div>
        ))}
        <p className='text-sm ml-2'>rate your knowledge</p>
        <div className="flex items-center space-x-2 mr-2">
        <div>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className='m-2'>
              <input
                type="radio"
                name="rating"
                value={value}
                checked={selectedValue === String(value)}
                onChange={handleRatingChange}
                className='m-2'
              />
              {value}
            </label>
          ))}
        
    </div>     
        </div>
        
      </form>
      </div>
      </DialogContent>
    </Dialog>
    
    <div className="flex flex-col flex-grow m-4 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 ">
        {userSkills.map((skill, index) => (
          <div key={index} className="flex space-x-4">
            <div className="flex-1">
              <p className="mb-2 text-muted-foreground">{skill.skill_name}:</p>
              <Progress value={parseInt(skill.score) * 10} className="w-48" />
            </div>
            <Button variant="destructive" onClick={() => deleteSkill(skill.skill_id)} >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default SkillsEdit;
