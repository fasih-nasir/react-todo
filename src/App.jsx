// REACT HOOK 
import { useState } from 'react'
// BOOTSTRAP 
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// EXTERNEL FILE CSS
import './App.css'
// ROUTER-DOM
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// FILES
import Login from './firebase/login';
import Create from './firebase/create';
import Dashboard from './firebase/dash';
import NotFound from './firebase/NotFound';
import ThemeProvider from './context/themecontext';
// FILES

function App() {


  return (
    <>
    <ThemeProvider>
    <BrowserRouter>
   <Routes>
    <Route path='/' element={<Login/>}></Route>
    <Route path='/Create' element={<Create/>}></Route>
    <Route path='/Todo' element={<Dashboard/>}></Route>
    <Route path='*' element={<NotFound/>}></Route>
   </Routes>
    </BrowserRouter>
    </ThemeProvider>
 {/* <Login/> */}
    </>
  )
}

export default App
