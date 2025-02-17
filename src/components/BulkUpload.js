import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Button, Input, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
        setMessage("Please select a file first.");
      return;
    }

    setUploading(true);
    setMessageText("");

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = async (e) => {
      try {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Send data to backend
        const response = await axios.post(
          "http://localhost:5000/api/customers/bulk-upload",
          { customers: jsonData }
        );

        if (response.status === 201) {
            setMessage("Customers uploaded successfully!");
        } else {
            setMessage("Error uploading customers.");
        }
      } catch (error) {
        message.error("Error processing the file.");
      } finally {
        setUploading(false);
      }
    };
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bulk Upload Customers</h2>
      <div style={{ marginBottom: "20px" }}>
        <Input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          style={{ width: "100%" }}
        />
      </div>
      <Button
        type="primary"
        icon={<UploadOutlined />}
        onClick={handleUpload}
        disabled={uploading}
        loading={uploading}
        style={{ marginBottom: "20px" }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>

      {/* Message feedback */}
      {message  && <p>{message}</p>}
      {uploading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
