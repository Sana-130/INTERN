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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState , useEffect} from "react"

interface User{
    email?: string;
    user_id: number;
    active: boolean;
    first_name: string;
    last_name:string;
    createdat:Date;
    github_userid?:string;
}
export const UserInfo = () => {
    const [idinput, setidtInput] = useState<string>("");
    const [input, setInput] = useState<string>("");
    const [search, setSearch ] =  useState<User[]>([]);
    const [isEmp, setIsEmp] = useState(false);

    const handleNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue: string = event.target.value;
        setInput(inputValue);
      }


    const handleIdInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue: string = event.target.value;
        setidtInput(inputValue);
        
    };

    const searchByName = async() => {
      try {
        const response = await fetch(`http://localhost:5000/admin/search/${isEmp?"emp":"student"}?input=${input}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }else{
          const data = await response.json();
          setSearch(data);
        }
      } catch (error) {
        console.error('Error searching by name:', error);
      }    
    }

    const searchById = async() => {
        try {
            const response = await fetch(`http://localhost:5000/admin/search/${isEmp?"emp":"student"}/id`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id : idinput
              }),
            });
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }else{
              const data = await response.json();
              setSearch(data);
            }
          } catch (error) {
            console.error('Error searching by ID:', error);
          }
    }

    return (
        <>
        <div className="flex flex-row h-5 gap-6 m-4">
        <Button variant="link" onClick={() => setIsEmp(false)}> View Student</Button>
        <Separator orientation="vertical"/>
        <Button variant="link" onClick={() => setIsEmp(true)}> View Employer</Button>
        </div>
       
        <div className="flex flex-row gap-6">
         <div className="flex w-full max-w-sm items-center space-x-2 m-4">
          <Input 
            type="text" 
            placeholder="search by name" 
            value={input} 
            onChange={handleNameInput}
          />
          <Button variant="outline" onClick={searchByName}>Search</Button>
        </div>
        <div className="flex w-full max-w-sm items-center space-x-2 m-4">
          <Input 
            type="number" 
            placeholder="search by ID" 
            value={idinput} 
            onChange={handleIdInput}
          />
        <Button variant="outline" onClick={searchById}>Search</Button>
        </div>
        </div>
        
        <div className="m-2">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-2 ml-4">Viewing {isEmp?'Employer':'Student'}</h4>
        <Separator className="mb-2 w-48"/>
        <Table>
      <TableCaption>A list of registered users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email/githubId</TableHead>
          <TableHead className="text-right">Joined date</TableHead>
          <TableHead className="text-right">Active</TableHead>
        </TableRow>
      </TableHeader>
      {search.length > 0 ? (
      <TableBody>
         
        {search.map((user) => (
          <TableRow key={user.user_id}>
            <TableCell className="font-medium">{user.user_id}</TableCell>
            <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
            <TableCell>{(user.email?(user.email):(user.github_userid))}</TableCell>
            <TableCell>{new Date(user.createdat).toLocaleDateString()}</TableCell>
            <TableCell>{(user.active || user.github_userid) ? "Yes" : "No"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      ) :( <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>No user found</TableCell>
        </TableRow>
      </TableFooter>)}
      </Table>
      </div>
        </>
    )
}