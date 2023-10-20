import '../App.css'
import {Option, CompanyForm, Credentails, Header, InstitutionForm, StudentForm} from '../components'
import MultiStepForm from '../other_func/MutliStepForm';
import { useState , useEffect } from 'react';
import React from 'react';

const INITIAL_DATA ={
    email : "",
    password : "",
    confirm_password : "",
    role: ""
}

const Student_data = {
    name : "",
    Institution_name : "",
    Course: ""
}

const Company_data = {
    name : "",
    Location: ""
}

const Institution_data = {
    name: "",
    Departments: ""
}


function Register(){
    const [data, setData] = useState(INITIAL_DATA);
    const [formData, setformData] = useState(null);


    function updateForm(fields){
        setformData((prev) =>{
            return {
                ...prev,
                ...fields
            };
        });
    }


    function updateFields(fields){
        setData((prev) => {
            return {
                ...prev,
                ...fields
            };
        });
    }

    function buttonValue(value){
        setData((prev) => {
            return {
                ...prev,
                role : value
            }
            
        })
        console.log(value);
        switch(value){
            case 'Student':
                setformData(Student_data);
                goTo(2);
                break;
            
            case 'Institution':
                setformData(Institution_data);
                goTo(3);    
                break;

            case 'Company':
                setformData(Company_data);
                goTo(4);
                break; 

            default:
                return null
        }
         
    }

    

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
        React.createElement(Credentails , {...data, updateFields: updateFields }), 
        React.createElement(Option, {...data, updateFields: buttonValue}),
        React.createElement(StudentForm, { ...data, updateFields: updateForm }),
        React.createElement(InstitutionForm, { ...data, updateFields: updateForm }),
        React.createElement(CompanyForm, { ...data, updateFields: updateForm })
       // React.createElement(Option , {...data, updateFields: updateFields }),
       // React.createElement(CompanyForm , {...data, updateFields: updateFields })
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