import { createContext, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const themeContext=createContext()

function ThemeProvider({children}){
const [theme,SetTheme] = useState("")
// AUTH
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
   
    const uid = user.uid;
    SetTheme(user)

    
    // ...
  } else {
    // console.log(user);
    
    
  }
});
// AUTH

return(
        <>

        <themeContext.Provider value={{SetTheme,theme}}>
{children}
        </themeContext.Provider>
        </>
    )
}
export default ThemeProvider