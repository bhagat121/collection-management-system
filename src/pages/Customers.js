import React, { useState } from "react";
import { Tab, Tabs, Box } from "@mui/material";
import CustomerList from "./CustmerList"; // Assuming you have a separate component for customer list
import BulkUpload from "../components/BulkUpload"; // Assuming you have a component for bulk upload

const Customers = () => {
  const [activeTab, setActiveTab] = useState(0); // Track which tab is active

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue); // Update active tab when clicked
  };

  return (
    <Box sx={{ width: "100%" }}>
      <h1>Collection Management System</h1>

      {/* MUI Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        // centered
        sx={{
          borderBottom: 2,
          borderColor: "divider",
          mb: 2, // margin bottom for spacing
          "& .Mui-selected": {
            color: "#1976d2", // Blue color for selected tab
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#1976d2", // Custom underline color for active tab
          },
          // Align tabs to the start (left)
          justifyContent: "flex-start",
        }}
      >
        <Tab label="Customers" />
        <Tab label="Bulk Upload" />
      </Tabs>

      {/* Content based on the active tab */}
      <Box sx={{ p: 3 }}>
        {activeTab === 0 && <CustomerList />}
        {activeTab === 1 && <BulkUpload />}
      </Box>
    </Box>
  );
};

export default Customers;
