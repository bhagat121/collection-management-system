import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Customers from "./pages/Customers";
import BulkUpload from "./components/BulkUpload";
import RealTimeNotifications from "./components/RealTimeNotifications";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/customers" element={<Customers />} />
        <Route path="/bulk-upload" element={<BulkUpload />} />
      </Routes>
      <RealTimeNotifications />
    </Router>
  );
}

export default App;
