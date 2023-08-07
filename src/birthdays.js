import React, { useEffect, useState } from "react";
import "react-tabs/style/react-tabs.css";
import axios from "axios";
import Tabspanel from "./tabs";
import "react-tabs/style/react-tabs.css";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CakeIcon from "@mui/icons-material/Cake";
import EventIcon from "@mui/icons-material/Event";
import { Link } from "react-router-dom";
import "./birthday.css";
const { API } = require("./config/" + process.env.NODE_ENV);


const Birthdays = () => {
  const [activeTab, setActiveTab] = useState("Birthdays");
  const [fileList, setFileList] = useState([]);
  const [currentActiveFile, setCurrentActiveFile] = useState("");
  const [currentFileData, setcurrentFileData] = useState([]);
  const sessionData = sessionStorage.getItem("loggedinUserData")

  const userData = sessionData?.length > 0 && JSON.parse(sessionData);
  const isAdmin = userData?.username === "admin";
  const username = "admin";



  const getFileList = async () => {
    const fileListResp = await axios.get(
      `${API.USERS}/${username}`
    );
    if (fileListResp) {
      setFileList(fileListResp.data);
      // console.log(fileListResp.data);
    }
    else {
      console.log("notttt")
    }

    // console.log(currentFileData);
  };

  useEffect(() => {
    getFileList();
  }, []);
  // console.log(fileList);


  const handleTabClick = (tab) => {
    setActiveTab(tab);

  };

  const fetchFileContent = async (fileId) => {
    try {
      const response = await axios.get(
        `${API.FILEUPLOADER}/${username}/${fileId}`
      );
      if (response?.data) {
        setcurrentFileData(response.data);
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  };

  return (
    <div className="birthdayContainer d-flex grayBackground mx-auto">
      <div className="side-menu sideBar">
        <List component="nav">
          <Link to="/fileUploader">
            <ListItem
              button
              selected={activeTab === "Birthdays"}
              onClick={() => handleTabClick("Birthdays")}
            >
              <ListItemIcon>
                {isAdmin && (
                  <CloudUploadIcon className="icon " />
                )}
              </ListItemIcon>
              {isAdmin && (<ListItemText  className="uploadText" primary="Upload New File" />)}
            </ListItem>
          </Link>

          <ListItem
            button
            selected={activeTab === "Birthdays"}
            onClick={() => handleTabClick("Birthdays")}
          >
            <ListItemIcon>
              <CakeIcon className="icon" />
            </ListItemIcon>
            <ListItemText primary="UPCOMING BIRTHDAYS" />
          </ListItem>
          <ListItem
            button
            selected={activeTab === "Anniversary"}
            onClick={() => handleTabClick("Anniversary")}
          >
            <ListItemIcon>
              <EventIcon className="icon" />
            </ListItemIcon>
            <ListItemText primary="UPCOMING ANNIVERSARY" />
          </ListItem>
        </List>
      </div>
      {fileList?.length > 0 ? (
        <>
          <div className="filelist" style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
            <table class="table table-striped">
              <thead>
                <tr className="tablehead">
                  <th scope="col">No</th>
                  <th scope="col">File Name</th>
                </tr>
              </thead>
              <tbody >
                {fileList?.map((file, key) => {
                  return (
                    <tr
                      className={
                        currentActiveFile === key ? "table-primary" : ""
                      }
                    >
                      <th scope="row">{key + 1}</th>
                      <td>
                        <button
                          onClick={() => {
                            setCurrentActiveFile(key);
                            fetchFileContent(file._id);
                          }}
                          className="btn btn-success"
                        >
                          {file.filename}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="tabContainer" style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
            <Tabspanel activeTab={activeTab} excelData={currentFileData} />
          </div>
        </>
      ) : (
        <>You do not have any files uploaded please upload new file</>
      )}
    </div>
  );
};

export default Birthdays;