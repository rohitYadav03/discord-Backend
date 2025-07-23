import { createdMessageService } from "../services/messageService.js";

export default function messageHandler(io, socket){

  socket.on("newMessage", 
    async function createdMessageHandler (data, cb) {
    const messageResponse = await createdMessageService(data);
    socket.broadcast.emit("newMessageRecived", messageResponse)
  cb({
    success : true,
  message : "successfully created the message",
  data : messageResponse
  })
})
}

// 📩 Event Listener: "newMessage"
// This event is triggered when a client (e.g., frontend or Postman) sends a new chat message.
// 1. The server receives the message data (text, senderId, channelId, etc.).
// 2. It saves the message to MongoDB using the createdMessageService.
// 3. It broadcasts the saved message to all other connected clients using "newMessageRecived".
// 4. It sends a success response back to the sender using the callback function (cb).
// This ensures that:
//    ✅ The sender knows their message was saved.
//    📢 All other users receive the new message in real-time.
