"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [session]);

  const joinConversation = (conversationId) => {
    if (!socket || !session?.user) return;

    socket.emit("join-chat", {
      conversationId,
      userId: session.user.id,
    });
  };

  const sendMessage = (conversationId, content, messageType = "text") => {
    if (!socket || !session?.user) return;

    socket.emit("send-message", {
      conversationId,
      senderId: session.user.id,
      content,
      messageType,
    });
  };

  const sendQuote = (conversationId, quoteData) => {
    if (!socket || !session?.user) return;

    socket.emit("send-quote", {
      conversationId,
      senderId: session.user.id,
      ...quoteData,
    });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        joinConversation,
        sendMessage,
        sendQuote,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
