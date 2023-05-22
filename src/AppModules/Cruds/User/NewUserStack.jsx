import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { CreatePage } from "./CreatePage";
import { FindUser } from "./FindUser";

const NewUserStack = () => {

  /*<---------- DISABLED BACK BUTTON ----------->*/
  const onBackButtonEvent = (e) => {
    e.preventDefault();
    window.history.pushState(null, null, window.location.pathname);
  };

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);
    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);
  /*<---------- DISABLED BACK BUTTON ----------->*/

  return (
    <Routes>
      <Route index element={<FindUser />} />
      <Route path="/find" element={<FindUser />} />
      <Route path="/createUser" element={<CreatePage />} />
    </Routes>
  );
};

export default NewUserStack;
