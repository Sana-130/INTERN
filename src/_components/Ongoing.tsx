import { useRepo } from "@/context/Process"


export const Ongoing =() => {
    const { repo } = useRepo();
    const { name, branch, checked } = repo || {};

    console.log(name, checked, branch);

    return (
        <>
        
        </>
    )
}