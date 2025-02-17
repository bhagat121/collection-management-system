require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const http = require("http");
const socketIo = require("socket.io");

const app = express();

// Allow cross-origin requests from frontend (localhost:3000)
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware to parse JSON body
app.use(express.json());

// Create the HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    // allowedHeaders: ["Content-Type"],
  }
});

// Placeholder route for testing the API
app.get("/", (req, res) => {
  res.send("Mini Collection Management System API");
});

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/collectionDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use your authentication and customer routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);

const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/payments", paymentRoutes);

// Real-time notification example using WebSocket (Socket.IO)
io.on("connection", (socket) => {
  console.log("A user connected");

  // Example: Send a notification when a payment status changes
  socket.on("paymentStatusChanged", (data) => {
    io.emit("notification", data); // Broadcast to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = { io }; 