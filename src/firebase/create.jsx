import { useState } from 'react';
import { Link ,useNavigate } from 'react-router-dom';

// FIREBASE AUTH
import { getAuth, createUserWithEmailAndPassword,onAuthStateChanged , GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// FIRBASE FIRESOTRE
import { getStorage,getDownloadURL,uploadBytesResumable, ref, uploadBytes } from "firebase/storage";

import { getFirestore, collection, addDoc , doc, setDoc } from "firebase/firestore";
// IMPORT CONFIG
import { auth,db } from './config';

function Create() {
  // Use Navigate
var navigate=useNavigate()
// Use Navigate

  // State
  const [image, setImage] = useState(null);


  var [email, setEmail] = useState("");
  var [pass, setPass] = useState("");
  var [name, setName] = useState("");
 const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [profession, setProfession] = useState("");  
  const [nation, setNation] = useState("");  


  // State
  onAuthStateChanged(auth, (user) => {
    // console.log(user);


  })

  // FORM SUBMIT
  function createAcc(e) {
    e.preventDefault();
  // img
  
  const storage = getStorage();
  const storageRef = ref(storage, `images/${image.name}`);
  
  const uploadTask = uploadBytesResumable(storageRef, image);
  
 
  uploadTask.on('state_changed', 
    (snapshot) => {
   
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
     
    }, 
    (error) => {
      console.log(error);
      
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);

   
  // img
    createUserWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        alert(`${email} - Your Account Is Created`); // Corrected alert syntax
       // FIRESTORE
  const docRef =  addDoc(collection(db, "user"), {
    nameD: name,
    emailD:email ,
    ageD:age,
    dobD:dob,
    professionD:profession,
    country: nation,
profileimg:downloadURL
});
  });
  setName("");
  setEmail("");
  setPass("");
  setAge("");
  setDob("");
  setProfession("");
  setNation("");
  // FIRESTORE
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      alert(errorMessage);
      });

    }
  ); 
  }

  // FORM SUBMIT

  // GOOGLE
  function google() {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        setName(result.user.displayName)
        console.log(result.user.displayName);
        navigate("/todo")
      })
      .catch((error) => {
        // Handle Errors here.
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }
  // GOOGLE

  return (
    <>
      <div className="container-fluid d-flex justify-content-center align-items-center ">
      <div className="d-flex col-lg-4 col-10 flex-column box justify-content-center  align-items-center">
      <h1>Sign-uP</h1>
      <form onSubmit={createAcc} className="col-11">
     
        <div className="col-12">
      {/*  */}
        <input id="name" name="name"   className="col-12" placeholder="Enter Your Name" type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required  />
        {/*  */}
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); }}
            required
            className="col-12"
            placeholder="Enter Your Email"
          /> <br />
         {/*  */}
          <input
            type="password"
            value={pass}
            onChange={(e) => { setPass(e.target.value); }}
            required
            className="col-12"
            placeholder="Enter Your Password"
          />
          {/*  */}
          <div className="d-flex justify-content-between w-100">
  <input
    id="age"
    name="age"
    placeholder="Age"
    type="text"
    value={age}
    onChange={(e) => setAge(e.target.value)}
    autoComplete="age"
    required
    className="col-5"
    style={{ flexBasis: '48%' }}
  />
  
  <input
    id="dob"
    name="dob"
    type="date"
    placeholder='DOB'
    value={dob}
    onChange={(e) => setDob(e.target.value)}
    autoComplete="dob"
    required
    className="col-5"
    style={{ flexBasis: '48%' }}
  />
</div>
<div className="d-flex justify-content-between w-100">
  <select id="profession" name="profession"  style={{ flexBasis: '48%' }} value={profession} onChange={(e) => setProfession(e.target.value)} required className="col-5">
    <option value="">Profession</option>
    <option value="Student">Student</option>
    <option value="Doctor">Doctor</option>
    <option value="Teacher">Teacher</option>
    <option value="Professor">Professor</option>
  </select>
  
  <select id="nation" name="nation" style={{ flexBasis: '48%' }} value={nation} onChange={(e) => setNation(e.target.value)} required className="col-5">
    <option value="">Nationality</option>
    <option value="Pakistan">Pakistan</option>
    <option value="India">India</option>
    <option value="UK">UK</option>
    <option value="US">US</option>
  </select>
</div>

                       <div>
<input type="file" onChange={(e)=>{setImage(e.target.files[0])}} />
</div>  

        
          <div className="col-12 d-flex justify-content-center ">
          <button className='col-6 p-2'>Create Account</button>
          </div>
          <div className="col-12 d-flex flex-column justify-content-center align-items-center">
          <span className="col-7 hr mb-3"></span>
          <div><span className="spannot">Already Register</span>  <Link to="/login">Login <i className="fas fa-external-link-alt mx-2"></i></Link></div>
          </div>
       
        </div>
      </form>
      <div className='d-flex my-2'>
      <button onClick={google} className='googe'><i className="fa-brands fa-google"></i></button>
      </div>
      </div>
      </div>
    </>
  );
}

export default Create;
