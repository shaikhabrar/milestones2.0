import React, { useState } from "react";
import "./signup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { API } = require("./config/" + process.env.NODE_ENV);


const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userNameErr, setUserNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);

  const handleSubmit = () => {
    if (username === "") {
      setUserNameErr(true);
    } else {
      setUserNameErr(false);
    }
    if (email === "") {
      setEmailErr(true);
    } else {
      setEmailErr(false);
    }
    if (password === "" || password.length < 8) {
      setPasswordErr(true);
    } else {
      setPasswordErr(false);
    }
    const validateEmail = (email) => {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    };
    const isValidEmail = validateEmail(email);

    if (
      username !== "" &&
      email !== "" &&
      isValidEmail &&
      password !== "" &&
      password.length >= 8
    ) {
      const signUpData = {
        username: username,
        email: email,
        password: password,
      };
      const Signup = () => {
        axios
          .post(API.SIGNUP, signUpData)
          .then((res) => {
            toast(res.data.message);
            if (res.data.message === "Signed up successfully") {
              
              setTimeout(() => {
                window.location.href = "/Login";
              }, 1000);
              
            }
          })
          .catch((error) => {
            console.error(error);
          });
      };
      Signup();
    }
  };

  return (
    <div className="signupContainer container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto grayBackground">
      <div className="card card0 border-0">
        <div className="row d-flex">
          <div className="col-lg-6">
            <div className="card1 pb-5">
              <div className="row px-3 justify-content-center mt-4 mb-5 border-line">
                <img src="https://i.imgur.com/uNGdWHi.png" alt="logo" className="image" />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card2 card border-0 px-4 py-5">
              <div className="row px-3">
                <label className="mb-1">
                  <h6 className="mb-0 text-sm">Create Username</h6>
                </label>
                <input
                  className="mb-4"
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {userNameErr && (
                  <span className="text-danger">Enter username</span>
                )}
              </div>
              <div className="row px-3">
                <label className="mb-1">
                  <h6 className="mb-0 text-sm">Enter Email</h6>
                </label>
                <input
                  className="mb-4"
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailErr && (
                  <span className="text-danger">Enter valid email address</span>
                )}
              </div>
              <div className="row px-3">
                <label className="mb-1">
                  <h6 className="mb-0 text-sm">Set Password</h6>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password (Min 8 digits)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordErr && (
                  <span className="text-danger">Enter 8 digits password</span>
                )}
              </div>
              <div className="row my-4 px-3">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn btn-primary text-center"
                >
                  Signup
                </button>
              </div>
              <div className="row mb-4 px-3">
                <small className="font-weight-bold">
                  Already have an account? <Link to="/Login">Login</Link>
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

export default Signup;
