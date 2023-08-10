import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./tabs.css"


const Tabspanel = ({ activeTab, excelData }) => {
  const [currentLimit, setCurrentLimit] = useState(7);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [upcomingAnniversary, setUpcomingAnniversary] = useState([]);

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

  useEffect(() => {
    if (excelData.length > 0) {
      const birthdaysWithinLimit = excelData?.filter((person) => {
        return person?.length > 2
          ? getUpcomingBirthdays(person[1], currentLimit)
          : false;
      });
      setUpcomingBirthdays(birthdaysWithinLimit);
      console.log("UpcomingBirthDays", birthdaysWithinLimit);
      const anniversaryWithtinLimit = excelData?.filter((person) => {
        return person?.length > 2
          ? getUpcomingAnniversary(person[2], currentLimit)
          : false;
      });
      setUpcomingAnniversary(anniversaryWithtinLimit);
      console.log("upcomingAnniversary", anniversaryWithtinLimit);
    }
  }, [currentLimit]);

  const handleTabChange = (currentTab) => {
    setCurrentLimit(currentTab);
  };

  const renderPanel = () => {
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
                  <td className="px-4 py-1 column2">Date of Birth</td>
                  <td className="px-4 py-1 column2">favourite Colour</td>
                  <td className="px-4 py-1 column2">favourite food</td>
                </tr>
                </tbody>
              </table>
      </div>
          {upcomingBirthdays.map((row, index) => (
            <div key={index}>
            <table>
                <tbody>
                <tr>
                  <td className="px-4 py-1 column1">{row[0]}</td>
                  <td className="px-4 py-1 column1">{row[2]}</td>
                  <td className="px-4 py-1 column1">{row[3]}</td>
                  <td className="px-4 py-1 column1">{row[4]}</td>
                </tr>
                </tbody>
              </table>
            </div>
          ))}
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
          <Tab onClick={() => handleTabChange(7)}>Upto 7 Days</Tab>
          <Tab onClick={() => handleTabChange(14)}>Upto 14 Days</Tab>
          <Tab onClick={() => handleTabChange(30)}>Upto 1 Month</Tab>
        </TabList>
        <TabPanel>
          {renderPanel()}
        </TabPanel>
        <TabPanel>
          {renderPanel()}
        </TabPanel>
        <TabPanel>
          {renderPanel()}
        </TabPanel>
      </Tabs>
    </div>
  );
};
export default Tabspanel;
