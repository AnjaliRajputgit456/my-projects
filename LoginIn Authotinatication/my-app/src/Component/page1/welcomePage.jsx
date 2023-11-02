
import React from 'react'
import { useLocation } from 'react-router-dom';



function WelcomePage() {
 const location = useLocation();
   
    
 const userName = location.state && location.state.userName ? location.state.userName : "User";
 console.log(location.state)

 return (
    <>
    <h1 className='last'> Welcome on This Page</h1>
    <p className='first'> Hii {location.state.userName}</p>

    </>
  )
}

export default WelcomePage;