export const onBookingCreated = (data: any, socket: any) => {
  console.log("@socket booking create@", data, socket);
  socket.emit("create_booking", { data: data, roomId: "global_room"}) ;
}
export const onCustomerCreated = (data: any, socket: any) => {
  console.log("@socket customer create@", data, socket);
  socket.emit("create_customer", { data: data, roomId: "global_room"}) ;
}
export const onCustomerUpdated = (data: any, socket: any) => {
  console.log("@socket customer update@", data, socket);
  socket.emit("update_customer", { data: data, roomId: "global_room"}) ;
}
export const onBookingUpdated = (data: any, socket: any) => {
  console.log("@socket booking update@", data, socket);
  socket.emit("update_booking", { data: data, roomId: "global_room"}) ;
}
export const onBookingStatusUpdated = (data: any, socket: any) => {
  console.log("@socket booking status create@", data, socket);
  socket.emit("update_booking_status", { data: data, roomId: "global_room"}) ;
}
export const onBookingRescheduled = (data: any, socket: any) => {
  console.log("@socket booking rescheduled@", data, socket);
  socket.emit("reschedule_booking", { data: data, roomId: "global_room"}) ;
}