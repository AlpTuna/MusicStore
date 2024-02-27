import { Route, Navigate} from 'react-router-dom'
import React,{useContext} from 'react'
import AuthContext from '../context/AuthContext';


const PrivateRoute = ({children, ...rest}) => {
    let {user} = useContext(AuthContext)
    
    React.useEffect(() => {
        // EXECUTE THE CODE ONLY ONCE WHEN COMPONENT IS MOUNTED
        console.log('Private route works!', user);
    }, []);
    
    return user ? (<>{children}</>) : (<Navigate to="/login"/>);
}

export default PrivateRoute