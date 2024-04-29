import { useState , useEffect} from 'react';
import { useRepo } from "@/context/Process";
import { useAuth } from "@/context/AuthContext";
import io from 'socket.io-client';
import { Button  } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"
import { useNavigate } from "react-router-dom";

//const socket = io('http://localhost:4000'); // Replace with your server URL
export const socket = io('http://localhost:4000', {
    autoConnect: false
  });

  interface Data {
    cpScore: number;
    lang: string;
    lines: number;
}


const Processing = () => {
    const [clientId, setClientId] = useState(null);
    const [status, setStatus ] = useState('');
    const [done, SetDone] = useState(false);
    const [Data, setData] = useState<Data[]>([]);
    const [progress, SetProgress] = useState(0);
    const [error, setError] = useState('');
    const { repo } = useRepo();
    const { user } = useAuth();
    const navigate = useNavigate();
  

    const submitData = async(Data: Data[]) => {
        console.log(Data);
        const jwtToken = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/skills/add', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({data: Data, repoId:repo && repo.id})
              }); 
              if (response.ok) {
                SetProgress(100);
                console.log("submitted ok");
                navigate(`/profile/${user?.id}`);
              } else {
                setError('error updating records');
                // If the request failed, handle the error
                //console.error('Failed to fetch profile:', response.statusText);
              }
        
        }catch(err){
            console.error('Failed to fetch profile:', err);
        }
        
    }

    const sendTemperature = async (clientId: string | null | undefined) => {
        try {
            if (!clientId) {
                console.error('Client ID is null or undefined');
                return;
            }
            const response = await fetch('http://localhost:4000/temp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: clientId, owner:'Sana-130', repo: repo && repo.name, branch:repo && repo.branch, checked:repo && repo.checked }) // Pass clientId as id in the payload
            });
    
            if (response.ok) {
                const data = await response.json();
                setData(data);
                console.log(data);
                setStatus("updating records...");
                submitData(data);
                //submitData(data);
                console.log('Operation done successfully');
            } else {
                setError('server is busy, try again');
                console.error('Failed to send temperature data:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending temperature data:', error);
        }
    };

    useEffect(() => {
        // no-op if the socket is already connected
        socket.connect();

        socket.on("clientId", (data) => {
            setClientId(data);
          });

        socket.on("analysisStart", (data) => {
            console.log(data.message);
            setStatus(data.message);
            SetProgress(10);
        });

        socket.on("onDownload", (data) => {
            console.log(data.message);
            setStatus(data.message);
            SetProgress(30);
        });

        socket.on("onExtract", (data) => {
            console.log(data.message);
            setStatus(data.message);
            SetProgress(50);
        });

        socket.on("cpdetect", (data) => {
            console.log(data.message);
            setStatus(data.message);
            SetProgress(60);
        });

        socket.on("onCleanup", (data) => {
            console.log(data.message);
            setStatus(data.message);
            SetProgress(80);
        });

    
        return () => {
          socket.disconnect();
        };
      }, []);

      const handleClick = () => {
        if (clientId !== null) {
            console.log(clientId)
            sendTemperature(clientId); // Change 25 to the actual temperature value
        } else {
            console.error('Client ID is null');
        }
    };
    
      return (
        <>
        <div className="justify-center items-center m-60">
            <div>
            <h1 className='text-card-foreground mb-2'>{status}</h1>
            <Progress value={progress} className="w-[80%]" />
            <Button onClick={handleClick} className='mt-10'>Analyze {repo && repo.name}</Button>
            <p>{error}</p>
        </div>
      </div>
        </>
      )
};

export default Processing;
