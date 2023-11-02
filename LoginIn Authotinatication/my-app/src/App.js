
import React, { useEffect } from 'react'

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import SignIn from './Component/Sign';
import WelcomePage from  './Component/page1/welcomePage';

function App() {
  
  return (
  
   <div className="App">
    <BrowserRouter>
    <Routes>
   

     <Route path="/" element={<SignIn/>} />
     {
     <Route path="/welcomePage" element={<WelcomePage/>}/>
     }


    </Routes>
    </BrowserRouter>
    
    
    </div>

  )
}

export default App