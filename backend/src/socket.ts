import { WebSocketServer } from "ws";
import { server } from "./index";

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log(socket);

  socket.on("message", (data) => {
    console.log(data);
  });

  socket.on("close", () => {
    console.log("user disconnected");
  });
});
