const express = require("express");
const Customer = require("../models/Customer");
const multer = require("multer");
const xlsx = require("xlsx");

// Configure Multer for file upload
const upload = multer({ dest: "uploads/" });

const router = express.Router();

// Create a new customer
router.post("/add", async (req, res) => {
    try {
      const { name, contactInfo, outstandingPayment, paymentDueDate, paymentStatus } = req.body;
      const newCustomer = new Customer({ name, contactInfo, outstandingPayment, paymentDueDate, paymentStatus });
      await newCustomer.save();
      res.status(201).json(newCustomer);
    } catch (error) {
      res.status(500).json({ message: "Error adding customer", error: error.message });
    }
  });

// Get All Customers (with filtering & sorting)
router.get("/", async (req, res) => {
  try {
    const { sortBy, order, search } = req.query;
    let query = {};
    if (search) query.name = new RegExp(search, "i"); // Case-insensitive search

    const customers = await Customer.find(query).sort({ [sortBy || "name"]: order === "desc" ? -1 : 1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Customer
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Customer
router.put("/:id", async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) return res.status(404).json({ error: "Customer not found" });
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Customer
router.delete("/:id", async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk Upload Route
router.post("/bulk-upload", async (req, res) => {
    try {
    //   console.log("Received Data:", req.body);  // Debugging line
      const { customers } = req.body;
  
      if (!Array.isArray(customers) || customers.length === 0) {
        return res.status(400).json({ message: "Invalid file or no data provided." });
      }
  
      // Insert customers into database
      await Customer.insertMany(customers);
  
      res.status(201).json({ message: "Customers uploaded successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error uploading customers", error: error.message });
    }
  });

module.exports = router;
