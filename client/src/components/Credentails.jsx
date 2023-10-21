function Credentails({ data, setData }){
    const { email, password, confirm_password } = data ;

    const handleChange =(e) => {
        const {name , value } = e.target ; 
        setData({
            ...data,
            [name]: value,
        });
    };

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
             onChange={handleChange}
             /><br /> <br /> 
    
            <label htmlFor="password">Password:</label>
            <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            value={password}
            onChange={handleChange}
            /><br /> <br /> 

            <label htmlFor="confirm_password">Password:</label>
            <input 
            type="password" 
            id="confirm_password" 
            name="confirm_password" 
            required 
            value={confirm_password}
            onChange={handleChange}
            /><br /> <br /> 
    
            <input type="submit" value="Next" />
        </form>
        </div>
  
    )}
export default Credentails