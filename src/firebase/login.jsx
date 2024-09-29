import { Link ,useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import {themeContext} from "../context/themecontext"

// FIREBASE
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// FIREBASE
function Login(){
// Context 
const themeObj=useContext(themeContext)
// console.log(themeObj);

// Context 

    // State
var [email,setEmail]=useState("")
var [pass,setPass]=useState("")
// State

// Use Navigate
var navigate=useNavigate()
// Use Navigate


    const auth = getAuth();
// Funtion loginwithemail
function loginwithemail(e){
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      // Signed in 
      navigate("/")
      const user = userCredential.user;
    //   console.log(user);
      
      
      // ...
    })
    .catch((error) => {
        // console.log(error);
        
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(error)
    });
}
    return(
        <>
        <div className="container-fluid d-flex justify-content-center align-items-center ">
        <div className="d-flex col-lg-4 col-10 flex-column box justify-content-center  align-items-center">
        <h1>Sign-in</h1>
        <form onSubmit={loginwithemail}className="col-11" >
            <div className="col-12">
            <input className="col-12" type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} required placeholder="Enter Your Email"/> <br />
            <input className="col-12" type="password" value={pass} onChange={(e)=>{setPass(e.target.value)}} required placeholder="Enter Your Password"/>
            <br />
            <div className="col-12 d-flex justify-content-center ">
            <button className="col-4">Login</button>
            </div>
            <div className="col-12 d-flex flex-column justify-content-center align-items-center">
<span className="col-7 hr mb-3"></span>
<div><span className="spannot">Not Register Yet ?</span> <Link to="/Create">Register Now<i className="fas fa-external-link-alt mx-2"></i></Link> </div> 

</div>
        </div>
        </form>
        </div>
        </div>
        </>
    )
}
export default Login
