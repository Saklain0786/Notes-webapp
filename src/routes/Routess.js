import React  from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Dashbaord from "../pages/Dasboard/Dashbaord";
import Group from "../pages/Group/Group"; 
import Profile from "../pages/profile/Profile";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Routess = () => {  
  return (
   <>
 
    <Navbar/> 

    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/groups/:slug" element={<Group />} />
    <Route path="/dashboard" element={<Dashbaord />} /> 
    <Route path="/profile" element={<Profile />} />
    </Routes>
    
    <Footer/>
  


   
   </>
  )
}

export default Routess