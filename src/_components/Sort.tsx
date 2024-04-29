import { useEffect, useState } from "react";
import { TableCont } from "./TableCont";
import { Button } from "@/components/ui/button"

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
    languages: { id: number; name: string; isLang: boolean; }[];
    frameworks: { id: number; name: string; isLang: boolean; }[];
  }

export const Sort: React.FC<AppliedDetailsProps> = ({ id, languages, frameworks}) => {
    const [appliedDetails, setAppliedDetails] = useState<AppliedDetails[]>([]);
    const [checkedLanguageIds, setCheckedLanguageIds] = useState<number[]>([]);

    const handleCheckboxChange = (languageId: number) => {
        if (checkedLanguageIds.includes(languageId)) {
          setCheckedLanguageIds(prevState => prevState.filter(id => id !== languageId));
        } else {
          setCheckedLanguageIds(prevState => [...prevState, languageId]);
        }
      };
    
      const handleSubmit = async() => {
        try {
          const jwtToken = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/internship/sort', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              internship_id: id,
              skill_ids: checkedLanguageIds
            })
          });
    
          if (!response.ok) {
            throw new Error('Failed to submit data');
          }else{
            const data = await response.json();
            setAppliedDetails(data);
          }
        } catch (error) {
          console.error('Error submitting data:', error);
        }
      }

      return(
        <>
        <p className='text-md'>Applications</p>

            <div className='flex flex-row gap-40 m-4'>
            <div>
                <h2>Languages</h2>
                <div className='flex flex-row '>
                {languages.map(language => (
                <div key={language.id} className='flex items-center'>
                <input 
                    type='checkbox' 
                    id={`language-${language.id}`} 
                    checked={checkedLanguageIds.includes(language.id)} 
                    onChange={() => handleCheckboxChange(language.id)} 
                />
                <label htmlFor={`language-${language.id}`} className='ml-2'>{language.name}</label>
                </div>
            ))}
                </div>
            </div>

            <div>
            <h2>Frameworks</h2>
            <div className='flex flex-row '>
            {frameworks.map(framework => (
                <div key={framework.id} className='flex items-center'>
                <input 
                    type='checkbox' 
                    id={`framework-${framework.id}`} 
                    checked={checkedLanguageIds.includes(framework.id)} 
                    onChange={() => handleCheckboxChange(framework.id)} 
                />
                <label htmlFor={`framework-${framework.id}`} className='ml-2'>{framework.name}</label>
                </div>
            ))}
            </div>
            </div>

            <div className='flex'><Button onClick={handleSubmit}>Sort</Button></div>

            </div>
            <div>
            </div>
        <TableCont id={id} appliedDetails={appliedDetails}/>
        </>
      )
    
}