const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

// Update payment status
router.post("/pay/:id", async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!["Pending", "Completed"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Payment status updated", customer: updatedCustomer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating payment status", error: error.message });
  }
});

module.exports = router;
