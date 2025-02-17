import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { List, Typography, notification, Button } from "antd";

const socket = io("http://localhost:5000");

const RealTimeNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Display a pop-up notification for each new event
  const openNotification = (message) => {
    notification.open({
      message: "New Notification",
      description: message,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  useEffect(() => {
    socket.on("notification", (data) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        data.message,
      ]);
      openNotification(data.message); // Show a pop-up notification
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <Typography.Title level={3}>Real-Time Notifications</Typography.Title>

      {/* Notification list */}
      <List
        bordered
        dataSource={notifications}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <Typography.Text>{item}</Typography.Text>
          </List.Item>
        )}
      />

      {/* Optional clear notifications button */}
      <Button
        type="default"
        onClick={() => setNotifications([])}
        style={{ marginTop: "10px" }}
      >
        Clear Notifications
      </Button>
    </div>
  );
};

export default RealTimeNotifications;
