import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {themeContext} from "../context/themecontext"
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from './config';
import { getStorage, getDownloadURL, uploadBytesResumable, ref, uploadBytes } from "firebase/storage";
import { getApp } from "firebase/app";

// Added a placeholder image URL for missing profile pictures
const placeholderImg = "https://via.placeholder.com/150";

const firebaseApp = getApp();
const storage = getStorage(firebaseApp, "gs://my-custom-bucket");
const imagesRef = ref(storage, 'images');

function Dashboard({ chatList }) {
    const handleDivClick = (email) => {
        navigate(`/userchats/${email}`);
    };
    const [userimg, setuserimg] = useState([]);
    var [chatList, setChatList] = useState([]);
    const [users, setusers] = useState("");
    const [img, setimg] = useState("");
    const storage = getStorage();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [dob, setDob] = useState("");
    const [profession, setProfession] = useState("");  
    const [nation, setNation] = useState("");  
    const [image, setImage] = useState(null);
    const [userha, setuserha] = useState("");
    const navigate = useNavigate();
    const authInstance = getAuth();

    const userHave = useContext(themeContext);

    function uploadImg() {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${img.name}`);
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
            });
          }
        );
    }

    // Get user data
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
            if (user) {
                setEmail(user.email);
                setuserha(user.email.split("@")[0]);
                await getData(user.email);
            } else {
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [authInstance, navigate]);

    // Fetch user data from Firestore
    const getData = async (userEmail) => {
        try {
            const querySnapshot = await getDocs(collection(db, "user"));
            let userFound = false;

            querySnapshot.forEach(doc => {
                const data = doc.data();
                setuserimg(prev => [...prev, data.profileimg]);

                const firestoreEmail = data.emailD?.trim().toLowerCase();
                setChatList(prev => [...prev, data.nameD]);

                if (userEmail.trim().toLowerCase() === firestoreEmail) {
                    userFound = true;
                    setusers(data);
                    setName(data.nameD);
                    setAge(data.ageD);
                    setDob(data.dobD);
                    setNation(data.country);
                    setProfession(data.professionD);
                }
            });

            if (!userFound) {
                console.log("No matching user data found.");
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    // Logout function
    const handleSignOut = () => {
        signOut(authInstance).then(() => {
            console.log("User signed out");
            navigate("/login");
        }).catch((error) => {
            console.error("Error during sign-out: ", error);
        });
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0]; 
        if (file) {
            const imageRef = ref(storage, `images/${file.name}`);
            uploadBytes(imageRef, file).then(() => {
                console.log('Uploaded a blob or file!');
                setImage(URL.createObjectURL(file)); 
            }).catch((error) => {
                console.error("Error uploading image: ", error);
            });
        }
    };

    // Added fallback mechanism for profile images
    const handleImageError = (event) => {
        event.target.src = placeholderImg;
    };

    return (
        <div className="container-fluid col-12 d-flex flex-row maindiv">
            <div className="col-12 col-lg-4 col-md-12 col-sm-12 d-flex flex-column py-2">
                <div className="col-12 d-flex div1 flex-row justify-content-between">
                    <div className="d-flex flex-row align-items-center">
                        <img 
                            src={users.profileimg || placeholderImg} 
                            className="proimg1" 
                            alt="" 
                            onError={handleImageError} // Added fallback if image fails to load
                        />
                        <h5 className="px-2 mt-2 text-capitalize">{userha}</h5>
                    </div>
                    <button
                        className="btn btncan"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                    >
                        <i className="fa-solid fa-user">
                            <i className="fa fa-caret-down" aria-hidden="true"></i>
                        </i>
                    </button>
                </div>
                {/* Chat list */}
                <div className="userlist scroldiv">
                    {chatList.length > 0 ? (
                        chatList.map((email, index) => (
                            <div 
                                key={index} 
                                onClick={() => handleDivClick(email)} 
                                className="d-flex align-items-center col-11 px-2 div2"
                            >
                                <img 
                                    src={userimg[index] || placeholderImg} 
                                    className="proimg1 col-2" 
                                    alt="" 
                                    onError={handleImageError} 
                                />
                                <p className="text-col col-11">{email}</p>
                            </div>
                        ))
                    ) : (
                        <p>No users found</p>
                    )}
                </div>
            </div>

            {/* Other components */}
            <div className="col-8 py-2 d-none-1">
                <div className="col-11 align-items-center py-5 p-5 mt-5 d-flex justify-content-center align-items-center flex-column" style={{ height: "85vh" }}>
                    <div><i className="fa-brands fa-whatsapp"></i></div>
                    <h1 className="mt-4">Great People Meet Great People</h1>
                    <p className="text-center mt-1 py-3">
                        Your personal and professional network at your fingertips. Chat, collaborate, and build meaningful connections.
                    </p>
                </div>
            </div>

            {/* Offcanvas for user profile */}
            <div
                className="offcanvas offcanvas-end"
                tabIndex={-1}
                id="offcanvasRight"
                aria-labelledby="offcanvasRightLabel"
            >
                <div className="offcanvas-header d-flex flex-row align-items-center">
                    <div id="offcanvasRightLabel">
                        <h4 className="pt-2">User Profile</h4>
                    </div>
                    <button
                        type="button"
                        className=""
                        id="closebtn"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    >
                        <i className="fa fa-window-close"></i>
                    </button>
                </div>
                <div className="offcanvas-body">
                    <div className="d-flex flex-column">
                        <div>
                            <img 
                                src={users.profileimg || placeholderImg} 
                                className="proimg" 
                                alt="" 
                                onError={handleImageError} 
                            />
                        </div>
                        <h4>Name: {name}</h4>
                        <h4>Email: {email}</h4>
                        <h4>Age: {age}</h4>
                        <h4>Nationality: {nation}</h4>
                        <h4>Profession: {profession}</h4>
                        <h4>DOB: {dob}</h4>
                        <button onClick={handleSignOut} className="signbtn col-5">
                            Logout <i className="fa fa-sign-out mx-2" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
