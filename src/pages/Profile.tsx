import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/profile_avatar"
import React, { useEffect , useState} from 'react';
import { useParams } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { NavLink } from "react-router-dom"
import { SkillAdd } from "@/_components/SkillAdd"
import { LangAdd } from "@/_components/LangAdd"
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Skill {
  name: string;
  isLang:boolean;
  score: string;
}

interface ProfileData {
  user_id:number;
  about?: string;
  institution_name?: string;
  graduation_year?: number;
  course_name?: string;
  site_link?: string;
  location?: string;
  contact_mail?: string;
  linkedin_profile_link?: string;
  skills:Skill[];
}

interface RepoDetails {
  name: string;
  html_url: string;
  languages: string[];
}



const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [repoDetails, setRepoDetails] =  useState<RepoDetails[]>([]);
  const [languages, setLanguages] = useState<Skill[]>([]);
  const [other, setOther] = useState<Skill[]>([]);
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const showNow = () =>{
    setShowAll(true);
  }

  async function fetchRepoDetails(repoIds: string[]) {
    try {
      const details = [];
      for (const repoId of repoIds) {
        const response = await fetch(`https://api.github.com/repositories/${repoId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch repository details');
        }
        const repoData = await response.json();
        const { name, html_url, languages_url} = repoData;
        const languagesResponse = await fetch(languages_url);
        if (!languagesResponse.ok) {
          throw new Error('Failed to fetch repository languages');
        }
        const languagesData = await languagesResponse.json();
        const languages = Object.keys(languagesData);
        details.push({ name, html_url, languages });
       
      }
      console.log(details);
      setRepoDetails(details);
    } catch (error) {
      console.error('Error fetching repo details:', error);
    }
  }

    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const jwtToken = localStorage.getItem('token');
          if (!jwtToken) {
            throw new Error('No JWT token found');
          }
  
          const response = await fetch(`http://localhost:5000/user/profile/${id}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            const { skills, ...profileWithoutSkills } = data.profileData[0];
            setProfile(profileWithoutSkills);
            setLanguages(skills.filter((skill: Skill)=> skill.isLang));
            setOther(skills.filter((skill: Skill) => !skill.isLang));
            //setOwner(user?.id === profile?.user_id);
            if(data.profileData[0].repo_ids.length!==0){
              fetchRepoDetails(data.profileData[0].repo_ids);
            }
            console.log(user?.githubId);
          }else{
            console.log("error");
          }
  
          //const result = await response.json();
          //console.log(result);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
  
      fetchUserProfile();
    }, []);
  
    const addProject = () => {
      console.log("some");
      navigate('/repos');
    }


    return(
        <>
        <NavLink to="/home">Go Home</NavLink>
        <div className="flex flex-col gap-8 md:flex-row m-6">
            <div className="flex flex-col">
                    <Avatar>
                    <AvatarImage src={user?.imageLink} />
                    <AvatarFallback>
                      {user && user.first_name && user.last_name && (
                      <>
                        {user.first_name.charAt(0).toUpperCase()}
                        {user.last_name.charAt(0).toUpperCase()}
                      </>
                    )}
                    </AvatarFallback>
                    </Avatar>        
                <div>
                { user?.id === profile?.user_id && <NavLink to="/profile/edit">Edit</NavLink>}
                <div>
  {user && (
    <>
      <h3 className="scroll-m-20 text-2xl font-semibold m-3">{user.first_name} {user.last_name}</h3>
      <NavLink to="/"><div> {user.username} </div></NavLink>
    </>
  )}

  {profile && (
    <>
      {profile.about && <div>{profile.about}</div>}
      {profile.contact_mail && (
        <div className="flex flex-row mt-2">
         <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 2C0.447715 2 0 2.44772 0 3V12C0 12.5523 0.447715 13 1 13H14C14.5523 13 15 12.5523 15 12V3C15 2.44772 14.5523 2 14 2H1ZM1 3L14 3V3.92494C13.9174 3.92486 13.8338 3.94751 13.7589 3.99505L7.5 7.96703L1.24112 3.99505C1.16621 3.94751 1.0826 3.92486 1 3.92494V3ZM1 4.90797V12H14V4.90797L7.74112 8.87995C7.59394 8.97335 7.40606 8.97335 7.25888 8.87995L1 4.90797Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
          <p className="ml-2">{profile.contact_mail}</p>
        </div>
      )}
      {profile.course_name && profile.institution_name && profile.graduation_year && (
        <div className="mb-2 mt-2">doing {profile.course_name} at {profile.institution_name} {profile.graduation_year && (<p> - exp grad year {profile.graduation_year}</p>)}</div>
      )}
      
      {profile.location && <div>{profile.location}</div>}
      {/* Add more profile fields as needed */}
    </>
  )}
</div>
                </div>
            </div>
            <div className="m-4">
            <Separator orientation="vertical" />
            </div>   

            <div className="flex flex-col flex-grow m-4 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 ">
                    <div><div className="flex flex-row"><h3 className="scroll-m-20 text-2xl font-semibold mb-4 pb-2 mr-2">Language Stats</h3>    
                    
                   </div>
                   {showAll ? ( 
                   <div>
                    {languages.map((skill, index) => (
                     
                     
                      <div key={index}>
                        <p className="mb-2 text-muted-foreground">{skill.name}:</p>
                        <Progress value={parseInt(skill.score)} className="w-[60%]" />
                        <br />
                      </div>
                     
                    ))}
                  </div>  
                  ) : ( 
                  <div>{languages.slice(0, 3).map((skill, index) => (
                    <>
                    {parseInt(skill.score) > 0 &&(
                      <div key={index}>   
                      <p className="mb-2 text-muted-foreground">{skill.name}:</p>
                      <Progress value={parseInt(skill.score)} className="w-[60%]" />   
                      <br />
                    </div>
                    )}
                     </>
                    ))}
                  </div>
                  )
                  
                  }
                    </div>
                    <div>                   
                    <div className="flex flex-row"><h3 className="scroll-m-20 text-2xl font-semibold mb-4 pb-2 mr-2">Libraries/Frameworks</h3>
                    <Dialog>
                              <NavLink to="/skills/edit"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></NavLink>
                          
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="m-2">Add Library, Framework or Package </DialogTitle>
                                <SkillAdd />
                              </DialogHeader>
                              <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                    </div>
                    
                    <div>
                    {((other.length < 1)) && (<p>Nothing added yet to this section</p>)}
                    {!showAll ? (<div>
                      {other.map((skill, index) => (
    
                      <div key={index} className="flex-1">
                        <p className="mb-2 text-muted-foreground">{skill.name}:</p>
                        <Progress value={parseInt(skill.score)*10} className="w-[60%]" />
                      </div>
                      
                    ))}
                    </div>): (<div>
                      {other.slice(0, 3).map((skill, index) => (
                      <div key={index}>
                        <p className="mb-2 text-muted-foreground">{skill.name}:</p>
                        <Progress value={parseInt(skill.score)*10} className="w-[60%]" />
                        <br />
                      </div>
                    ))}
                    </div>)}
                  </div>         
                    </div>
                </div>
                {(languages.length>3 || other.length>3) &&  <div className="flex justify-center mr-28 mb-2">
                  <Button variant="outline" onClick={showNow}><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></Button>
                </div>}
               
                
                <Separator />
                {user?.githubId && (<div>
                <div className="flex flex-row space-x-4 mt-4 mb-4"><h3 className="scroll-m-20 text-2xl font-semibold">Projects</h3>
                <Button variant="outline" onClick={addProject}>Add</Button>  <Button variant="link" onClick={() => navigate(`/projects/${user?.id}`)}>See All</Button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {repoDetails.length === 0 ? (
        <p>No projects found</p>
      ) : (
        repoDetails.map((repo, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{repo.name}</CardTitle>
              <CardDescription>
                {repo.languages.join(', ')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href={repo.html_url} className="text-sky-600" target="_blank" rel="noopener noreferrer">Learn more</a>
            </CardContent>
          </Card>
        ))
      )}          
                </div>
           
            </div>
            )}
            </div>
        </div>
        </>
    )
}

export default Profile