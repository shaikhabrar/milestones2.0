import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import axios from "axios";
import "react-tabs/style/react-tabs.css";
import ReactModal from "react-modal";
import "./tabs.css"
const { API } = require("./config/" + process.env.NODE_ENV);



const Tabspanel = ({ activeTab, excelData }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(7);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [upcomingAnniversary, setUpcomingAnniversary] = useState([]);
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);

  const handleClick = (event, index) => {
    setSelectedRow(index);
    setShowModal(true);
  };



  const getUpcomingBirthdays = (birthDate, currentUptoLimit) => {
    const today = new Date();

    const birthDateObj = new Date(birthDate);

    birthDateObj.setFullYear(today.getFullYear()); // Set the birth year to the current year

    const uptoLimit = new Date(
      today.getTime() + currentUptoLimit * 24 * 60 * 60 * 1000
    );

    return birthDateObj >= today && birthDateObj <= uptoLimit;
  };

  const getUpcomingAnniversary = (joiningDate, currentUptoLimit) => {
    const today = new Date();

    const joiningDateObj = new Date(joiningDate);

    joiningDateObj.setFullYear(today.getFullYear()); // Set the birth year to the current year

    const uptoLimit = new Date(
      today.getTime() + currentUptoLimit * 24 * 60 * 60 * 1000
    );

    return joiningDateObj >= today && joiningDateObj <= uptoLimit;
  };
  const getTodaysBirthdays = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);

    birthDateObj.setFullYear(today.getFullYear()); // Set the birth year to the current year

    return (
      birthDateObj.getMonth() === today.getMonth() &&
      birthDateObj.getDate() === today.getDate()
    );
  };


  useEffect(() => {
    if (excelData.length > 0) {
      const birthdaysWithinLimit = excelData?.filter((person) => {
        return person?.length > 2
          ? getUpcomingBirthdays(person[1], currentLimit)
          : false;
      });
      setUpcomingBirthdays(birthdaysWithinLimit);
      console.log("birthdayswithinlimit", birthdaysWithinLimit)
      const anniversaryWithtinLimit = excelData?.filter((person) => {
        return person?.length > 2
          ? getUpcomingAnniversary(person[2], currentLimit)
          : false;
      });
      setUpcomingAnniversary(anniversaryWithtinLimit);

      const todayBirthdays = excelData?.filter((person) => {
        return person?.length > 2 ? getTodaysBirthdays(person[1]) : false;
      });
      console.log("todayBirthdays", todayBirthdays)
      setTodaysBirthdays(todayBirthdays); // Update "Today" tab data here
    }
  }, [currentLimit, excelData]);


  const handleTabChange = (currentTab) => {
    setCurrentLimit(currentTab);
  };
  const sendBirthdayEmail = async (employeeEmail) => {
    try {
      const response = await axios.post(API.EMAIL, {
        employeeEmail,
      });
      console.log(response.data.message); // Log the server's response message
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const renderPanel = (data) => {
    return (
      <div>
        {activeTab === "Birthdays" && upcomingBirthdays.length > 0 && (
          <div>
            <h3>Upcoming Birthdays</h3>
            <div>
              <table>
                <tbody>
                  <tr>
                    <td className="px-4 py-1 column2">Employee Name</td>
                    <td className="px-4 py-1 column2">
                      {activeTab === "Birthdays" ? "Date of Birth" : "Date of Anniversary"}
                    </td>
                    {activeTab === "Birthdays" && (
                      <td className="px-4 py-1 column2">Actions</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
            {data.map((row, index) => (
              <div key={index}>
                <table>
                  <tr>
                    <td className="px-4 py-1 column1">{row[0]}</td>
                    <td className="px-4 py-1 column1">{row[1]}</td>
                    {activeTab === "Birthdays" && (
                      <td className="px-4 py-1 column1">
                        {getTodaysBirthdays(row[1]) ? (
                          <button
                            className="btn btn-secondary"
                            onClick={() => sendBirthdayEmail(row[5])}
                          >
                            Send Birthday Email
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={(event) => handleClick(event, index)}
                          >
                            Show Info
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                </table>

              </div>
            ))}

            <ReactModal
              isOpen={showModal}
              onRequestClose={() => setShowModal(false)}
              contentLabel="Additional Information"
              className="customModal"
              overlayClassName="customOverlay"
            >
              {selectedRow !== null && upcomingBirthdays[selectedRow] && (
                <div>
                  <h3>Additional Information</h3>
                  <p>Employee Name: {upcomingBirthdays[selectedRow][0]}</p>
                  <p>Date of Birth: {upcomingBirthdays[selectedRow][1]}</p>
                  <p>Favourite Colour: {upcomingBirthdays[selectedRow][3]}</p>
                  <p>Favourite Food: {upcomingBirthdays[selectedRow][4]}</p>
                  <p>Employee Email: {upcomingBirthdays[selectedRow][5]}</p>
                  <button className="closeButton" onClick={() => setShowModal(false)}>Close</button>
                </div>
              )}
            </ReactModal>


          </div>
        )}

        {activeTab === "Anniversary" && upcomingAnniversary.length > 0 && (
          <div>
            <h3>Upcoming Work Anniversaries</h3>
            <div >
              <table>
                <tbody>
                  <tr>
                    <td className="px-4 py-1 column2">Employee Name</td>
                    <td className="px-4 py-1 column2">Date of Anniversary</td>
                    <td className="px-4 py-1 column2">favourite Colour</td>
                    <td className="px-4 py-1 column2">favourite food</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {upcomingAnniversary.map((row, index) => (
              <div key={index}>
                <table>
                  <tr>
                    <td className="px-4 py-1 column1">{row[0]}</td>
                    <td className="px-4 py-1 column1">{row[2]}</td>
                    <td className="px-4 py-1 column1">{row[3]}</td>
                    <td className="px-4 py-1 column1">{row[4]}</td>
                  </tr>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Tabs>
        <TabList className="tabss">
          <Tab onClick={() => handleTabChange(1)}>Today</Tab>
          <Tab onClick={() => handleTabChange(7)}>Upto 7 Days</Tab>
          <Tab onClick={() => handleTabChange(14)}>Upto 14 Days</Tab>
          <Tab onClick={() => handleTabChange(30)}>Upto 1 Month</Tab>
        </TabList>
        <TabPanel>
          {renderPanel(todaysBirthdays)}
        </TabPanel>
        <TabPanel>
          {renderPanel(upcomingBirthdays)}
        </TabPanel>
        <TabPanel>
          {renderPanel(upcomingBirthdays)}
        </TabPanel>
        <TabPanel>
          {renderPanel(upcomingAnniversary)}
        </TabPanel>
      </Tabs>
    </div>
  );
};
export default Tabspanel;