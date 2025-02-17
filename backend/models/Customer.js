const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactInfo: { type: String, required: true },
  outstandingPayment: { type: String, required: true }, // Ensure it's a string
  paymentDueDate: { type: Date, required: true },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Completed"], // Ensure "Pending" and "Paid" are valid values
    default: "Pending",
    required: true,
  },
});

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
