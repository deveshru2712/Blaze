import { io, Socket } from "socket.io-client";
import React, { useState, useEffect } from "react";

interface SocketContextProps {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}

const SocketContext = React.createContext<SocketContextProps>({
  socket: null,
  setSocket: () => null,
});

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const client = io("http://localhost:5050");
    setSocket(client);

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
