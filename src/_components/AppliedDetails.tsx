import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { NavLink } from "react-router-dom";
import { Separator } from "@/components/ui/separator"
import { Sort } from './Sort';
import { Filter } from './Filter';

// Define the interface for the fetched data
interface AppliedDetails{
    user_id:number;
    first_name: string;
    last_name: string;
    contact_mail: string;
    apply_date: Date;
    status:string;
  }

  interface AppliedDetailsProps {
    id : number;
    title: string;
    languages: { id: number; name: string; isLang: boolean; }[];
    frameworks: { id: number; name: string; isLang: boolean; }[];

  }
  const AppliedDetails: React.FC<AppliedDetailsProps> = ({ id, title, languages, frameworks }) => {
  const [selectedOption, setSelectedOption] = useState<'shortlisted' | 'rejected' | 'pending' | 'all' | 'sort'>('all');

 
  const handleNavigationClick = (option: 'shortlisted' | 'rejected' | 'pending' | 'all' | 'sort') => {
    setSelectedOption(option);
  };

  return (
  <div>
       <NavLink to='/home'><div className='flex flex-row gap-2 m-2'><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>Back Home</div></NavLink>
      <p className='mt-4 ml-4'>Applications for {title}</p>
      <div className='flex flex-row h-4 gap-4 m-6'>
      <Button variant="link" onClick={() => handleNavigationClick('all')}>See All</Button>
      <Separator orientation="vertical" /> 
      <Button variant="link" onClick={() => handleNavigationClick('shortlisted')}>Shortlisted</Button>
      <Separator orientation="vertical" />
      <Button variant="link" onClick={() => handleNavigationClick('rejected')}>Rejected</Button>
      <Separator orientation="vertical" />
      <Button variant="link" onClick={() => handleNavigationClick('pending')}>Pending</Button> 
      <Separator orientation="vertical" />
      <Button variant="outline" onClick={() => handleNavigationClick('sort')}>Sort</Button>

      </div>
      {selectedOption === 'sort' && <Sort id={id} languages={languages} frameworks={frameworks} />}
      {selectedOption === 'shortlisted' && <Filter id={id} filter={'s'} />}
      {selectedOption === 'rejected' && <Filter id={id} filter={'r'} />}
      {selectedOption === 'pending' && <Filter id={id} filter={'p'} />}
      {selectedOption === 'all' && <Filter id={id} filter={'a'} />}
    </div>  
  );
}

export default AppliedDetails;
