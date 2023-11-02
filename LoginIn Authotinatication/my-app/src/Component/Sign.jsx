import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
 

import axios from 'axios';
import './Sign.css';

function Sign() {

  const [responseData, setResponseData] = useState(0);
  const navigate = useNavigate();

  const [formErrors , setFormErrors] = useState({})
  const [isSumbit , setIsSubmit] = useState(false)

  const [result , setResult] = useState({
      email: "",
      password: ""
  })

  const handleChange = (e) =>{
    const { name , value } = e.target
    
    setResult({ ...result,[name]: value})
   }

 const handleSubmit = async(event) =>{
   event.preventDefault();

  let email = event.target.email.value
  let password = event.target.password.value

  setFormErrors(validation(result));
    setIsSubmit(true)


 try {
const response= await axios.post('http://localhost:8001/signin', result)

if(response.status === 200) {
  let userId =  response.data.user.id
  let userName = response.data.user.name
  localStorage.setItem("userId", userId);

  navigate('/welcomePage', { state: { userId, userName } })
}
 } catch (err) {
console.log(err)
 }

};
    
useEffect(() => {
  if(Object.keys(formErrors).length === 0 && isSumbit){
    console.log("please entre valid email and password");
  }

 }, [formErrors , isSumbit])




  const validation = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

      if(!values.email ){
        errors.email = "Email is required";
      }  else if(!regex.test(values.email && values.email == "digimonk.in")) {
        errors.email = "This is not a valid Email";
      }
      

      if(!values.password){
        errors.password = "password is required";
      }
      else if(values.password.length < 8) {
        errors.password = "Password should be at least 8 characters long ";
      }
  return errors;

  };


  return (
    <>
    <div className='Card'>
  <form   className="heading" onSubmit={handleSubmit}>
    <h1 className='h1'>Sign In Page</h1>
 
      <input className='main'
        type="email"
        name="email"
        value={result.email}
      placeholder="Email"
      onChange={handleChange}
      /> 
            <br/>
      <p className='error'>{ formErrors.email }</p>

      <input className='main'
        type="password"
        name="password"
        value={result.password}
        placeholder="Password"
        onChange={handleChange}
      />
           <br/>
      <p className='error'>{ formErrors.password }</p>

      <button  className='btn'  type="signIn">SignIn</button>
    </form>
     

   </div>
     </>
  )
};

export default Sign;

