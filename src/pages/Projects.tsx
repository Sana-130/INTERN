import  { useState, useEffect } from 'react';

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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { useRepo } from "@/context/Process"
import { useNavigate } from "react-router-dom";
import Header from '@/_components/Header';

interface Item {
    id: number;
    name: string;
    created_at: string;
    language: string;
    default_branch:string;
}

export const Project = () => {
    const [items, setItems] = useState<Item[] | null>(null); 
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [lang, setLang] = useState<string[]>([]);
    const [checkedSkills, setCheckedSkills] = useState<{ [key: string]: boolean }>({});
    const { setRepo } = useRepo();
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchItems();
    }, []);

    const onItemClick = (item: Item) => {
        setSelectedItem(item);
        fetchLang(item.name);
      };

    const fetchLang = async(repo:string)=>{
      try{
        const response = await fetch(`https://api.github.com/repos/Sana-130/${repo}/languages`,{
          method:'GET'
        });
        if(response.ok){
          const data = await response.json();
          setLang(Object.keys(data));
        }else{
          console.log("something went wrong");
        }
      }catch(err){
        console.log(err);
      }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setRepo({id: selectedItem && selectedItem.id, name : selectedItem && selectedItem.name, branch: selectedItem && selectedItem.default_branch, checked: checkedSkills })
      navigate('/processing');
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event.target;
      setCheckedSkills(prevState => ({
        ...prevState,
        [name]: checked
      }));
    };
  
    const fetchItems = async () => {
        try {
            const jwtToken = localStorage.getItem('token');
      
            const response = await fetch('http://localhost:5000/project/repo', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }); 
      
      
            if (response.ok) {
              // If the request was successful, handle the response data
              const repoData = await response.json();
              setItems(repoData.repoNames);
              console.log('Profile data:', repoData);
            } else {
              // If the request failed, handle the error
              console.error('Failed to fetch profile:');
            }
          } catch (error) {
            // If an error occurred during the fetch request, log it
            console.error('Error fetching profile:', error);
          }
    };
  
    return (
        <>
        <div className='flex flex-row mt-32'>
          
          <div className='flex-1'>
        <Table>
      <TableCaption>All your Github repo.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Repo</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Language</TableHead>
          <TableHead className="text-right">Branch</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items && items.map((item) => (
          <TableRow key={item.id} onClick={() => onItemClick(item)} >
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{new Date(item.created_at).getFullYear()}</TableCell>
            <TableCell>{item.language}</TableCell>
            <TableCell className="text-right">{item.default_branch}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>
      </div>
      <div>
            <Separator orientation="vertical"/>
            </div> 
      <div>
            <h1 className='m-4 text-sm'>select the dependency languages of <br></br>{selectedItem && selectedItem.name}<br></br> so we can exclude it </h1>
           
            <form onSubmit={handleSubmit} className="space-y-8">
            <div className='flex flex-col space-y-4'>
            {lang.map((item) => (
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
             </div>
             <Button type="submit" className='m-4'>Exclude</Button>
          </form>
       
          </div>
          </div>
        </>
    )
}