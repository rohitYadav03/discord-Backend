import Queue from "bull";
import { REDIS_HOST, REDIS_PORT } from "../config/serverConfig.js";

const mailQueue = new Queue("mailQueue", {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

mailQueue.on("error", (err) => {
  console.error("REDIS QUEUE ERROR:", err);
});

export default mailQueue;
