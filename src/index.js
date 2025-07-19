import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { PORT } from './config/serverConfig.js';
import connectDB from './config/dbConfig.js';
import apiRouter from "./routes/apiRoutes.js"

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use("/api", apiRouter)

app.get("/ping", (req,res) => {
    res.status(StatusCodes.OK).json({message : "pong"});
});



app.listen(PORT, async() => {
    console.log(`running in port ${PORT}`);
  await  connectDB();
});
