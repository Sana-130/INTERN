import { NavLink } from "react-router-dom";

const Confirm = () => {
  return (
    <>
    <div>
    <h1>Thank you for signing up, please confirm your email..</h1>
    <NavLink to="/login">Go back to Login Page</NavLink>
    </div>
    </>
  )
}

export default Confirm;