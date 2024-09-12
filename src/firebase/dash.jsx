import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {themeContext} from "../context/themecontext"
import { collection, getDocs } from "firebase/firestore";
import { auth,db } from './config';


function Dashboard() {
      // State
  var [email, setEmail] = useState("");
  var [pass, setPass] = useState("");
  var [name, setName] = useState("");
 const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [profession, setProfession] = useState("");  
  const [nation, setNation] = useState("");  


  // State
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
        //   console.log('User is signed in:', user);
        //   setName(user.displayName)
        setEmail(user.email)
        } else {

          console.log('No user is signed in');
        }
      });
    
const userhave=useContext(themeContext)

// get docs

async function getData() {
    try {
        // Ensure the user is authenticated
        const currentUser = auth.currentUser;

        if (!currentUser) {
            // console.log("No user is currently logged in.");
            return;
        }

        // Get the current user's email
        const currentUserEmail = currentUser.email?.trim().toLowerCase();
        
        if (!currentUserEmail) {
            console.log("User email is not available.");
            return;
        }

        // Fetch all documents from the "user" collection
        const querySnapshot = await getDocs(collection(db, "user"));

        let userFound = false; // Flag to check if user data is found

        // Iterate over the documents in the query snapshot
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const firestoreEmail = data.emailD?.trim().toLowerCase();

           

            // Check if the email in the document matches the current user's email
            if (currentUserEmail === firestoreEmail) {
                userFound = true;

                // Set state with the matching user's data
                setName(data.nameD);
                setEmail(data.emailD);
                setAge(data.ageD);
                setDob(data.dobD);
                setNation(data.country);
                setProfession(data.professionD);
            }
        });

        if (!userFound) {
            // console.log("No matching user data found.");
        }
    } catch (error) {
        // console.error("Error fetching data: ", error);
    }
}

// Call the function to fetch data
getData();

// state
const [userha,setuserha]=useState()

    
    const navigate = useNavigate();

    // Monitor the auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                // If no user is signed in, redirect to the homepage (or sign-in page)
                navigate("/");
            
                
            }
            else{
//  console.log(user.email.split("@")[0]);
      setuserha(user.email.split("@")[0])
                
            }
            
        });

      
        return () => unsubscribe();
    }, [auth, navigate]);

    // Logout function
    function handleSignOut() {
        signOut(auth).then(() => {
            console.log("User signed out");

            navigate("/");
        }).catch((error) => {
            console.log("Error during sign-out: ", error);
        });
    }

    return (
        <>
           <div className="container-fluid col-12">         
<div className="d-flex justify-content-between py-2   align-items-center col-12 div1">
<h5 className="px-2 mt-1">{userha}</h5>
<button
    className="btn btncan"
    type="button"
    data-bs-toggle="offcanvas"
    data-bs-target="#offcanvasRight"
    aria-controls="offcanvasRight"
  >
   
<i className="fa-solid fa-user"><i className="fa fa-caret-down" aria-hidden="true"></i></i>
  </button>
</div>
            {/* offcanvas start */}
           <>
  {/* <button
    className="btn btncan"
    type="button"
    data-bs-toggle="offcanvas"
    data-bs-target="#offcanvasRight"
    aria-controls="offcanvasRight"
  >
   
<i className="fa-solid fa-user"><i className="fa fa-caret-down" aria-hidden="true"></i></i>
  </button> */}
  <div
    className="offcanvas offcanvas-end"
    tabIndex={-1}
    id="offcanvasRight"
    aria-labelledby="offcanvasRightLabel"
  >
    <div className="offcanvas-header d-flex flex-row align-items-center">
      <div id="offcanvasRightLabel">
        <h4 className="pt-2">User Profile</h4></div>
      <button
        type="button"
        className=""
        id="closebtn"
        data-bs-dismiss="offcanvas"
        aria-label="Close"><i className="fa fa-window-close"></i></button>
    </div>
    <div className="offcanvas-body">
        <div className="d-flex flex-column ">
            <h4>name : {name}</h4>
            <h4>email : {email}</h4>
            <h4>age : {age}</h4>
            <h4>nationality : {nation}</h4>
            <h4>profession : {profession}</h4>
            <h4>DOB : {dob}</h4>

    <button onClick={handleSignOut} className="signbtn col-5">Logout <i className="fa fa-sign-out mx-2" aria-hidden="true"></i></button>
    </div>
    </div>
  </div>
</>
            {/* offcanvas end */}
<div className="">
    <h1>hi my name is fasihnasir</h1>
</div>

               {/* <button onClick={handleSignOut}>Logout</button> */}
           </div>

        </>
    );
}

export default Dashboard;
