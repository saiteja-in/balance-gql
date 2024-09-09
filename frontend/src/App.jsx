import React from "react";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router-dom";
import Header from "./pages/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TransactionPage from "./pages/TransactionPage";

const App = () => {
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
    </>
  );
};

export default App;
