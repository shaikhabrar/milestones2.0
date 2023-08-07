import React, { useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { API } = require("./config/" + process.env.NODE_ENV);

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    axios
      .post(API.LOGIN, { username, password })
      .then((res) => {
        if (res.data && res.data.user) {
          sessionStorage.setItem(
            "loggedinUserData",
            JSON.stringify(res.data.user)
          );
          toast(res.data.message);
          setTimeout(() => {
            window.location.href = "/fileUploader";
          }, 1000);
        } else {
          toast(res.data.message);
        }
      })
      .catch((err) => {
        console.log("Login failed");
      });
  };

  const checkIfValidLogin = () => {
    return !(username !== "" && password !== "" && password.length >= 8);
  };

  const handleKeyPress = (e) => {
    if (
      e.key === "Enter" &&
      username !== "" &&
      password !== "" &&
      password.length >= 8
    ) {
      handleLogin();
    }
  };

  return (
    <div className="loginContainer container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto mt-10 grayBackground">
      <div className="card card0 border-0">
        <div className="row d-flex">
          <div className="col-lg-6">
            <div className="card1 pb-5">
              <div className="row px-3 justify-content-center mt-4 mb-5 border-line">
                <img
                  src="https://i.imgur.com/uNGdWHi.png"
                  className="image"
                  alt="Logo"
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card2 card border-0 px-4 py-5">
              <div className="row px-3">
                <label className="mb-1">
                  <h6 className="mb-0 text-sm">Username</h6>
                </label>
                <input
                  className="mb-4"
                  type="text"
                  name="email"
                  placeholder="Enter valid username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="row px-3">
                <label className="mb-1">
                  <h6 className="mb-0 text-sm">Password</h6>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  onKeyPress={handleKeyPress}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="row my-4 px-3">
                <button
                  type="submit"
                  onClick={handleLogin}
                  className="btn btn-primary text-center"
                  disabled={checkIfValidLogin()}
                >
                  Login
                </button>
              </div>
              <div className="row mb-4 px-3">
                <small className="font-weight-bold">
                  Don't have an account? <Link to="/signUp">Sign Up</Link>
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue py-4">
          <div className="row px-3">
            <small className="ml-4 ml-sm-5 mb-2">
              Employee Excel Data Extraction
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
