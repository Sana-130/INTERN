import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const LangAdd: React.FC = () => {
  const [input, setinput] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]); 
  const [checkedSkills, setCheckedSkills] = useState<{ [key: string]: boolean }>({});
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const handleinputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    /*(setinput(event.target.value);
    // Debounce API call
    setTimeout(() => {
      if (input.trim() !== '') { // Check if input is not empty
        searchSkills(input); // Call API function after debounce time
      }
    }, 500);*/ // Adjust debounce time as needed
    const inputValue: string = event.target.value;
    setinput(inputValue);

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
      const response = await fetch(`http://localhost:5000/skills/search/lang?input=${input}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSkills(data.allItem);
      console.log("API Response:", data.allItem);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log(checkedSkills);
        const response = await fetch('http://localhost:5000/skills/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({skillNames:checkedSkills}),
        });
    
        if (response.ok) {
            const data = await response.json();
            console.log(data);
        }else{
            
        }
    }catch(err){

    }
    //console.log(checkedSkills);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCheckedSkills(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  return (
    <>
    <form  className='mb-4'>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input 
          type="text" 
          placeholder="input" 
          value={input} 
          onChange={handleinputChange}
        />
      </div>
    </form>
    <form onSubmit={handleSubmit} className="space-y-8">
  <div className="mb-4">
    <p className="text-sm">Select the skills you want to include.</p>
  </div>
  {skills.map((item) => (
    <div key={item} className="flex items-center space-x-2 m-2">
      <input
        type="checkbox"
        id={item}
        name={item}
        value={item}
        onChange={handleCheckboxChange}
      />
      <label htmlFor={`${item}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {item}
      </label>
    </div>
  ))}
  <Button type="submit">Submit</Button>
</form>
</>
    
  );
};
