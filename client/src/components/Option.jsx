const Option = ({updateFields}) =>{
    return (
    <div>
        <h2>Tell us more about you....</h2>
        <button type="button" onClick={() => updateFields('Student')}>Student</button>
        <button type="button" onClick={() => updateFields('Company')}>Company</button>
        <button type="button" onClick={() => updateFields('Institution')}>Institution</button>
    </div>
    )
}

export default Option