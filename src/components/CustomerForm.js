import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Select } from "antd";
import axios from "axios";
import { fetchCustomers } from "../store/customerSlice";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // WebSocket connection

const { Option } = Select;

const CustomerForm = ({ customer, closeForm }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      if (customer) {
        // Update existing customer
        await axios.put(
          `http://localhost:5000/api/customers/${customer._id}`,
          values
        );
        socket.emit("paymentStatusChanged", {
          message: `Row edited for Customer id: ${customer._id}`,
        });
      } else {
        // Add new customer
        await axios.post("http://localhost:5000/api/customers/add", values);
      }

      dispatch(fetchCustomers());
      closeForm();
    } catch (error) {
      console.error("Error saving customer", error);
    }
  };

  return (
    <div className="form-container">
      <h2>{customer ? "Edit Customer" : "Add New Customer"}</h2>

      {/* Use Ant Design Form */}
      <Form form={form} onFinish={handleSubmit} initialValues={customer}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter the name" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="contactInfo"
          label="Contact Info"
          rules={[{ required: true, message: "Please enter contact info" }]}
        >
          <Input placeholder="Contact Info" />
        </Form.Item>

        <Form.Item
          name="outstandingPayment"
          label="Outstanding Payment"
          rules={[{ required: true, message: "Please enter payment amount" }]}
        >
          <Input type="number" placeholder="Outstanding Payment" />
        </Form.Item>

        <Form.Item
          name="paymentDueDate"
          label="Payment Due Date"
          rules={[{ required: true, message: "Please select payment due date" }]}
        >
          <Input type="date" placeholder="Payment Due Date" />
        </Form.Item>

        <Form.Item
          name="paymentStatus"
          label="Payment Status"
          rules={[{ required: true, message: "Please select payment status" }]}
        >
          <Select placeholder="Select Payment Status">
            <Option value="Pending">Pending</Option>
            <Option value="Completed">Completed</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button type="default" onClick={closeForm}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CustomerForm;
