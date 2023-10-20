function Credentails({email , password, confirm_password, updateFields}){
    return (
        <div className="form">
        <form action="#" method="post">
            <label htmlFor="email">Email:</label>
            <input
            autoFocus
             type="email" 
             id="email"
             name="email" 
             required 
             value={email}
             onChange={(e) => updateFields({email : e.target.value})}
             /><br /> <br /> 
    
            <label htmlFor="password">Password:</label>
            <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            value={password}
            onChange={(e) => updateFields({password : e.target.value})}
            /><br /> <br /> 

            <label htmlFor="confirm_password">Password:</label>
            <input 
            type="password" 
            id="confirm_password" 
            name="confirm_password" 
            required 
            value={confirm_password}
            onChange={(e) => updateFields({confirm_password : e.target.value})}
            /><br /> <br /> 
    
            <input type="submit" value="Next" />
        </form>
        </div>
  
    )}
export default Credentails