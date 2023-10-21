import '../App.css'
import {Credentails, Header , UserForm} from '../components'
import MultiStepForm from '../other_func/MutliStepForm';
import { useState } from 'react';


const INITIAL_DATA = {
    email : "",
    password : "",
    confirm_password : "",
    role: ""
}

const formFields = {
    fullName : "",
    status: "",
    collegeName : "",
    department : "",
    year : "",
    InstitutionName: ""
}


function Register(){
    const [credentials, setCredentials] = useState(INITIAL_DATA);
    const [formData, setformData] = useState(formFields);

    const { 
        steps, 
        currentStep, 
        step, 
        isFirstStep, 
        isLastStep, 
        back, 
        next,
        goTo
    } = MultiStepForm([
        <Credentails data={credentials} setData={setCredentials} />,
        <UserForm data={formData} setData={setformData} />
        //React.createElement(Credentails , {...data, updateFields: updateFields }), 
        //React.createElement(UserForm , {...formData, updateFields: updateForm })
    ])

    function onSubmit(e) {
        e.preventDefault();
        if(!isLastStep) return next();
        alert(`form submit ${INITIAL_DATA}`);
    }

    return (
       <div>
        < Header />
        <form onSubmit = {onSubmit}>
           <div>{step}</div>
        <div>
        {!isFirstStep && (
            <button type="button" onClick={back}>
              Back
            </button>
          )}
          <button type="submit">{isLastStep ? "Finish" : "Next"}</button>
        </div>
        </form>
       </div>
       
    )
}

export default Register