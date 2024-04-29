import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Skill {
    name: string;
    islang: boolean;
}

export const AddSkill: React.FC = () => {
  //lang
  const [input, setInput] = useState<string>("");
  const [skills, setSkills] = useState<Skill[]>([]); 
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState('true');
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
      const response = await fetch(`http://localhost:5000/skills/search/db?input=${input}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSkills(data);
      console.log("API Response:", data.allItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try{
      const isLang = selectedValue;
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/skills/add/db', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name : input, isLang}),
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



  const handleSkillTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    console.log(event.target.value);
  };

  return (
    <>
      <form className='mb-4'>
        <div className="flex w-full max-w-sm items-center space-x-2 m-2">
          <Input 
            type="text" 
            placeholder="input" 
            value={input} 
            onChange={handleInputChange}
          />
        </div>
      </form>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mb-4">
          <p className="text-sm m-2">Enter the skill you want to include.</p>
        </div>
       
        {skills.length === 0 ? (
            <div className='m-2'>No skills found</div>
            ) : (
            skills.map((skill) => (
                <div className="flex items-center">
                    <p className="text-sm ml-2">{`${skill.name} - ${skill.islang?'Language':'Other'}`} </p>
                </div>
            ))
            )}
                    <div className="flex items-center space-x-4">
                    <input
                        type="radio"
                        id="language"
                        name="skillType"
                        value="true" 
                        checked={selectedValue === "true"}
                        onChange={handleSkillTypeChange}
                    />
                    <label htmlFor="language" className="text-sm font-medium leading-none">Language</label>
                    
                    <input
                        type="radio"
                        id="lib-framework-package"
                        name="skillType"
                        value="false"
                        checked={selectedValue === "false"}
                        onChange={handleSkillTypeChange}
                    />
                    <label htmlFor="lib-framework-package" className="text-sm font-medium leading-none">Library/Framework/Package</label>
                    </div>
        <Button className="m-2" type="submit">Add Skill</Button>
       
      </form>
    </>
  );
};