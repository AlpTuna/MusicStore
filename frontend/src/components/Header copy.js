import React, {useContext} from 'react'
import { Link,Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
  let {user, logoutUser} = useContext(AuthContext)
  return (
    <div>
        <Link to="/">Home</Link>
        <span> | </span>
        {user ? (<Link to={"/profile/"+user.name}>Profile</Link>) : (<Link to="/signup">Sign Up</Link>)}
        <span> | </span>
        {user ? (<Link to="/create-music">Upload Music</Link>) : null}
        <span> | </span>
        {user ? (<Link onClick={logoutUser}>Logout</Link>) : (<Link to="/login">Login</Link>)}
        <span> | </span>
        <Link to={"/profile/User2"}>User2</Link>
        <span> | </span>
        <Link to={"/cart"}>Cart</Link>
        <span> | </span>
        <Link to={"/messages"}>Messages</Link>
      
    </div>
  )
}

export default Header