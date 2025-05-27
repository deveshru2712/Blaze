import "dotenv/config";
import { createServer } from "http";
import env from "./utils/validateEnv";
import { app } from "./index";
import { redisClient } from "./utils/redis/redisClient";
import { Server } from "socket.io";

const httpServer = createServer(app);

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("message", (msg) => {
    try {
      console.log(msg);
      io.emit("message", msg);
    } catch (error) {
      console.log("Error occurred while sending message", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    socket.disconnect();
  });

  socket.on("error", (error) => {
    console.log("Error occurred", error);
  });
});

export default httpServer.listen(env.PORT, async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
    console.log("Server is running on the port:", env.PORT);
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    process.exit(1);
  }
});
