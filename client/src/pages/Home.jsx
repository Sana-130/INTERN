import { Link } from "react-router-dom";
import { Header } from '../components'

export default function Index(){
    return (
    <div>
        <Header />
        <div>
        <h1 className="content">
            Welcome to INTERN!<br /> 
            where opportunities are boundless.
        </h1>
        </div>
    </div>
    )
}