import React from "react";
import "./HomePage.css"; 
import logoImage from "./LOGO.jpg";
import table from "./table.png";
import milestones from "./milestones.png"
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <div className="Milestones">
      <img src={milestones} className="milestone" alt="milestones monitor" width="auto" />
      </div>
      <div className="container ">
        <img src={logoImage} className="logo" alt="Logo" />
        <div className="d-flex logoContainer">
          <div className="logoContainer">
            <img src={table} className="logoImg" alt="Logo" width="auto" />
          </div>
          <div className="content">
            <div>
            <Link to="/Login">
              <button type="submit" className="button" >
                Sign In
              </button>
            </Link></div>
           <div> <Link to="/signup">
              <button type="submit" className="button">
                Sign Up
              </button>
            </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
      <p>Upload the excel file consists coloumns - Emp Name , Birth Date and Date of Joining as following next to each other.</p>
      </div>

      <div className="by">
      <p>BY ABRAR SHAIKH2023</p>
      </div>
    </>
  );
};

export default HomePage;
