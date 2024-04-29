import { useEffect , useState} from "react";
import { useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface Skill {
    score: number;
    skill_name: string;
}
  
interface Project {
    repo_id: number;
    skills: Skill[];
    repo_name: string;
}

export const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:5000/user/projects/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const data = await response.json();
                setProjects(data); // Log the fetched projects
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    const deletePro = async(id: number) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/skills/projects/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const result = await response.json();
                const updatedProjects = projects.filter(project => project.repo_id !== id);
                setProjects(updatedProjects);
                toast.warning('deleted project');
                console.log(result);
            } else {
                console.error("Failed to delete project");
            }
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    }

    return (
        <>
       <div className="container mx-auto px-4 py-8">
    {projects.length === 0 ? (
        <p className="text-center">No projects found.</p>
    ) : (
        <div className="grid gap-8">
            {projects.map((project, index) => (
                <div key={index} className="border border-gray-300 p-4 rounded-md">
                    <h2 className="text-lg font-semibold mb-4">{project.repo_name}</h2>
                    <div className="grid gap-2">
                        {project.skills.map((skill, skillIndex) => (
                            <div key={skillIndex} className="flex items-center">
                                <p className="mr-4">{skill.skill_name}</p>
                                <Progress value={skill.score * 10} className="w-64" />
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" onClick={() => deletePro(project.repo_id)} className="mt-4">Delete</Button>
                </div>
            ))}
        </div>
    )}
</div>
<Toaster />
        </>
    )
}
