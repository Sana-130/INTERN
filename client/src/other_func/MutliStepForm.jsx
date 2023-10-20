import { useState } from "react"
const step_length = 2
function MultiStepForm(steps){
    const [currentStep, setCurrentStep] = useState(0);

    function next(){
        setCurrentStep((prev) => {
            if(prev >= step_length) return prev;
            return prev + 1;
        });
    }

    function back(){
        setCurrentStep((prev) => {
            if(prev >= step_length ) return 1 ;
            if(prev <= 0) return prev;
            return prev - 1;
        });
    }

    function goTo(index){
        setCurrentStep(index);
    }

    return {

        currentStep,
        step : steps[currentStep],
        steps,
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === steps.length - 1,
        goTo,
        next,
        back
    };
}

export default MultiStepForm