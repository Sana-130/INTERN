
import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Toaster } from "@/components/ui/sonner"

interface LangProp {
    id : number;
    isLang:boolean;
}

export const LangInt : React.FC<LangProp>= ({id, isLang}) => {
    const [input, setinput] = useState<string>("");
    const [skills, setSkills] = useState<string[]>([]);
    const [checkedSkill, setCheckedSkill] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<{ name: string; isLang: boolean }[]>([]);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
          const response = await fetch(`http://localhost:5000/skills/search/${isLang?"lang":"lib"}?input=${input}`);
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

      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (checkedSkill) {
          setSelectedItems(prevItems => [
              ...prevItems,
              { name: checkedSkill, isLang: isLang }
          ]);
      }
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedSkill(event.target.value);
    };

    const handleRemoveItem = (index: number) => {
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems.splice(index, 1);
      setSelectedItems(updatedSelectedItems);
  };

  const AddSkill = async () => {
    try {
        const jwtToken = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/skills/internship/add', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ skills: selectedItems, internship_id: id })
        });
        if (response.ok) {
            //setMessage("You have successfully added skills")
            //setSelectedItem(null);
            setSelectedItems([]);
            setCheckedSkill(null);
            toast.info("You have successfully added skills");

        } else {
            toast.error("Oops some error happend");
            console.log(response.statusText);
        }
    } catch (err) {
        console.log(err);
    }
}

    return (
        <>
        <div className="flex flex-row gap-20 m-6">
                        <div>
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
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="mb-4">
                                    <p className="text-sm">Select the skills you want to include.</p>
                                </div>
                                {skills?.map((item) => (
                                    <div key={item} className="flex items-center space-x-2 m-2">
                                        <input
                                            type="radio"
                                            id={item}
                                            name="selectedSkill"
                                            value={item}
                                            checked={checkedSkill === item}
                                            onChange={handleRadioChange}
                                        />
                                        <label htmlFor={`${item}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {item}
                                        </label>
                                    </div>
                                ))}
                                <Button type="submit">Add</Button>
                            </form>
                        </div>
                        <div className="ml-24">
                            <h1 className="m-2 text-md">Selected skill</h1>
                            {selectedItems.map((item, index) => (
                            <div key={index}>
                                <span className="m-4">{item.name}</span>
                                <Button onClick={() => handleRemoveItem(index)}>Remove</Button>
                            </div>
                        ))}
                        <Button disabled={selectedItems.length === 0} onClick={AddSkill}>Submit</Button>
                        </div>

                        {message !== '' && (
                            <div>
                                {message}
                            </div>
                        )}
                </div>
                <Toaster />
        </>
    )
}