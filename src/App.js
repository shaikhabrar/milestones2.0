import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import Login from "./login";
import FileUploader from "./fileUploader";
import Signup from "./signup";
import "./FileUploader.css";
import Birthdays from "./birthdays";
import HomePage from "./HomePage";
import { ToastContainer } from "react-toastify";

const App = () => {
  const [isLoggedIn, setIsloggedIn] = useState(
    sessionStorage.getItem("loggedinUserData")?.length > 0
  );

  const PrivateRoute = ({ element: Component, ...props }) => {
    return isLoggedIn ? <Component {...props} /> : <Navigate to="/" />;
  };

  return (
    <>
      {isLoggedIn && (
        <button
          style={{ position: "fixed", right: 0 }}
          className="logout-btn btn btn-danger"
          onClick={() => {
            sessionStorage.clear();
            setIsloggedIn(false);
          }}
        >
          Logout
        </button>
      )}
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/signUp" element={<Signup />} />
          <Route
            path="/Fileuploader"
            element={<PrivateRoute element={FileUploader} />}
          />
          <Route
            path="/birthdays"
            element={<PrivateRoute element={Birthdays} />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
