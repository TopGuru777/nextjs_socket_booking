import { Server } from "socket.io";

export default function handler(req: any, res: any) {
  if (res.socket.server.io) {
    console.log("Server already started!");
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: "/api/socketio",
    //@ts-ignore
    addTrailingSlash: false
  });
  res.socket.server.io = io;

  const onConnection =  (socket: any) => {
    console.log("A user connected:", socket.id);
    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
      console.log(`user with id-${socket.id} joined room - ${roomId}`);
    });
  
    socket.on("create_booking", (data: any) => {
      console.log(data, "DATA");
      //This will send a message to a specific room ID
      socket.to(data.roomId).emit("booking_created", data.data);
    });
    
    socket.on("update_booking", (data: any) => {
      console.log(data, "update_booking");
      //This will send a message to a specific room ID
      socket.to(data.roomId).emit("booking_updated", data.data);
    });
    
    socket.on("reschedule_booking", (data: any) => {
      console.log(data, "reschedule_booking");
      //This will send a message to a specific room ID
      socket.to(data.roomId).emit("booking_rescheduled", data.data);
    });
    
    socket.on("create_customer", (data: any) => {
      console.log(data, "create_customer");
      //This will send a message to a specific room ID
      socket.to(data.roomId).emit("customer_created", data.data);
    });
    
    socket.on("update_customer", (data: any) => {
      console.log(data, "update_customer");
      //This will send a message to a specific room ID
      socket.to(data.roomId).emit("customer_updated", data.data);
    });
    
    socket.on("update_booking_status", (data: any) => {
      console.log(data, "update_booking_status");
      //This will send a message to a specific room ID
      socket.to(data.roomId).emit("booking_status_updated", data.data);
    });
  };

  io.on("connection", onConnection);

  console.log("Socket server started successfully!");
  res.end();
}

export const config = {
  api: {
    bodyParser: false
  }
}