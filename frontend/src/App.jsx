import React from "react";
import SignUp from "./pages/SignUp";
import { Navigate, Route, Routes } from "react-router-dom";
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
  if(loading) return null;
  return (
    <>
    {data?.authUser && <Header />}
      <Routes>
        <Route path="/" element={data?.authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!data?.authUser ? <LoginPage />: <Navigate to="/" />} />
        <Route path="/signup" element={!data?.authUser ? <SignUp/>: <Navigate to="/" />}/>
        <Route path="/transaction/:id" element={data?.authUser ? <TransactionPage/>:<Navigate to="/login" />}/> 
        {/* <Route path="/*" element={<NotFound/>}/> */}
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
