import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../store/customerSlice";
import CustomerForm from "../components/CustomerForm";
import axios from "axios";
import io from "socket.io-client";
import { Table, Button, Space, Modal, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const socket = io("http://localhost:5000"); // WebSocket connection

const CustomerList = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customers);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers());

    // Listen for real-time updates
    socket.on("notification", (data) => {
      alert(data.message); // Show notification
      dispatch(fetchCustomers()); // Refresh the customer list
    });

    return () => {
      socket.off("notification");
    };
  }, [dispatch]);

  // Handle payment status update
  const updatePaymentStatus = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/payments/pay/${id}`,
        {
          paymentStatus: "Completed",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Emit WebSocket event
      socket.emit("paymentStatusChanged", {
        message: `Payment status updated for Customer ID: ${id}`,
      });

      message.success("Payment status updated successfully!");
    } catch (error) {
      console.error("Error updating payment status", error);
      message.error("Error updating payment status");
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/customers/${deleteCustomerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete customer");

      // Emit WebSocket event
      socket.emit("paymentStatusChanged", {
        message: `Customer Deleted for Customer ID: ${deleteCustomerId}`,
      });

      dispatch(fetchCustomers()); // Refresh list after deleting ✅
      setShowDeleteModal(false);
      message.success("Customer deleted successfully!");
    } catch (error) {
      console.error("Error deleting customer:", error);
      message.error("Error deleting customer");
    }
  };

  const showDeleteConfirmation = (customerId) => {
    setDeleteCustomerId(customerId);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contact",
      dataIndex: "contactInfo",
      key: "contactInfo",
    },
    {
      title: "Outstanding Payment",
      dataIndex: "outstandingPayment",
      key: "outstandingPayment",
      render: (text) => `$${text}`,
    },
    {
      title: "Payment Due Date",
      dataIndex: "paymentDueDate",
      key: "paymentDueDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedCustomer(record);
              setShowForm(true);
            }}
            type="primary"
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirmation(record._id)}
            type="danger"
          >
            Delete
          </Button>
          {record.paymentStatus === "Pending" && (
            <Button
              icon={<CheckCircleOutlined />}
              onClick={() => updatePaymentStatus(record._id)}
              type="success"
            >
              Mark as Paid
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Customer Details</h2>
      <Button
        onClick={() => {
          setSelectedCustomer(null);
          setShowForm(true);
        }}
        type="primary"
        style={{ marginBottom: "20px" }}
      >
        Add Customer
      </Button>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {showForm && (
        <CustomerForm
          customer={selectedCustomer}
          closeForm={() => setShowForm(false)}
        />
      )}

      <Table
        columns={columns}
        dataSource={customers}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={showDeleteModal}
        onOk={handleDeleteCustomer}
        onCancel={handleCancelDelete}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this customer?</p>
      </Modal>
    </div>
  );
};

export default CustomerList;
