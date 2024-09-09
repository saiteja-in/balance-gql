import React from "react";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router-dom";
import Header from "./pages/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TransactionPage from "./pages/TransactionPage";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";
import { useQuery } from "@apollo/client";
import {Toaster} from "react-hot-toast"

const App = () => {
  const {loading,data,error}=useQuery(GET_AUTHENTICATED_USER)
  console.log(data)
  const authUser = true;
  return (
    <>
    {/* {authUser && <Header />} */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/transaction/:id" element={<TransactionPage/>}/> 
        {/* <Route path="/*" element={<NotFound/>}/> */}
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
