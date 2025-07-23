import nodemailer from "nodemailer";
import { MAIL_ID, MAIL_PASSWORD } from "./serverConfig.js";


const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: MAIL_ID,
    pass: MAIL_PASSWORD,
  },
});


export default transporter;