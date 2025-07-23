import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { PORT } from './config/serverConfig.js';
import connectDB from './config/dbConfig.js';
import apiRouter from "./routes/apiRoutes.js"
import cookieParser from 'cookie-parser';
import bullServerAdapter from './config/bullboardConfig.js';
import { Server } from 'socket.io';
import http from "http"

import "./procesors/mailProcessor.js"
import { log } from 'console';
import messageSocketController from './controllers/messageSocketController.js';
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server)

app.use("/api", apiRouter)
app.use('/ui', bullServerAdapter.getRouter());


app.get("/ping", (req,res) => {
    res.status(StatusCodes.OK).json({message : "pong"});
});


io.on("connection", (socket) => {
  // console.log(`client connected to socket with id : ${socket.id}`);
  
  // socket.on("sendMsg", (data) => {
    
    
  //   io.emit("receiveMsg",  {
  //  message : data,
  //  id : socket.id
  //   })
  // })
  messageSocketController(io, socket)
})


server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  try {
    await connectDB();
    console.log(" Connected to DB");

  } catch (error) {
    console.error("❌ Startup error:", error);
  }
});

