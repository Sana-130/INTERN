import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const SkillAdd: React.FC = () => {
  //lang
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
    console.log(selectedSkill);
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
        console.log(data);
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

  return (
    <>
      <form className='mb-4'>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input 
            type="text" 
            placeholder="input" 
            value={input} 
            onChange={handleInputChange}
          />
        </div>
      </form>
     
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
        <Button type="submit">Add Skill</Button>
    
    </>
  );
};