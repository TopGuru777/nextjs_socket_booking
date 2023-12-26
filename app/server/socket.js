const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`user with id-${socket.id} joined room - ${roomId}`);
  });

  socket.on("create_booking", (data) => {
    console.log(data, "DATA");
    //This will send a message to a specific room ID
    socket.to(data.roomId).emit("booking_created", data.data);
  });
  
  socket.on("update_booking", (data) => {
    console.log(data, "update_booking");
    //This will send a message to a specific room ID
    socket.to(data.roomId).emit("booking_updated", data.data);
  });
  
  socket.on("reschedule_booking", (data) => {
    console.log(data, "reschedule_booking");
    //This will send a message to a specific room ID
    socket.to(data.roomId).emit("booking_rescheduled", data.data);
  });
  
  socket.on("create_customer", (data) => {
    console.log(data, "create_customer");
    //This will send a message to a specific room ID
    socket.to(data.roomId).emit("customer_created", data.data);
  });
  
  socket.on("update_customer", (data) => {
    console.log(data, "update_customer");
    //This will send a message to a specific room ID
    socket.to(data.roomId).emit("customer_updated", data.data);
  });
  
  socket.on("update_booking_status", (data) => {
    console.log(data, "update_booking_status");
    //This will send a message to a specific room ID
    socket.to(data.roomId).emit("booking_status_updated", data.data);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});