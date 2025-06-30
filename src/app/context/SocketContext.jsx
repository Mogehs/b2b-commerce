"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isProduction, setIsProduction] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // Check if we're in production (Render, Vercel, or other hosting)
    const isHostedEnvironment =
      window.location.hostname.includes("vercel.app") ||
      window.location.hostname.includes(".vercel.app") ||
      window.location.hostname.includes("onrender.com") ||
      window.location.hostname.includes(".onrender.com") ||
      process.env.NODE_ENV === "production";
    setIsProduction(isHostedEnvironment);

    // Log the environment for debugging
    console.log("Environment check:", {
      hostname: window.location.hostname,
      nodeEnv: process.env.NODE_ENV,
      isProduction: isHostedEnvironment,
    });
  }, []);

  useEffect(() => {
    if (!session?.user) return;

    let socketInstance;

    try {
      // Use production socket URL if available, fallback to current origin
      let socketUrl;

      if (process.env.NEXT_PUBLIC_SOCKET_URL) {
        socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
      } else if (isProduction) {
        // For production deployments (Render, Vercel, etc.)
        socketUrl = `${window.location.protocol}//${window.location.host}`;
      } else {
        // For local development
        socketUrl = window.location.origin;
      }

      console.log("Connecting to socket at:", socketUrl);
      console.log("Is production environment:", isProduction);

      socketInstance = io(socketUrl, {
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        // Additional options for production
        transports: ["websocket", "polling"],
        upgrade: true,
        forceNew: false,
      });

      socketInstance.on("connect", () => {
        console.log("Socket connected with ID:", socketInstance.id);
        setConnected(true);
      });

      socketInstance.on("disconnect", (reason) => {
        console.log("Socket disconnected. Reason:", reason);
        setConnected(false);
      });

      socketInstance.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
      });

      socketInstance.on("error", (error) => {
        console.error("Socket error:", error);
      });

      setSocket(socketInstance);
    } catch (error) {
      console.error("Error initializing socket connection:", error);
    }

    return () => {
      if (socketInstance) {
        console.log("Cleaning up socket connection");
        socketInstance.disconnect();
      }
    };
  }, [session, isProduction]);
  const joinConversation = (conversationId) => {
    if (!socket || !session?.user) {
      console.log("Cannot join conversation: socket or session not available");
      return;
    }

    try {
      console.log(`Joining conversation: ${conversationId}`);
      socket.emit("join-chat", {
        conversationId,
        userId: session.user.id,
      });
    } catch (error) {
      console.error("Error joining conversation:", error);
    }
  };

  const sendMessage = (conversationId, content, messageType = "text") => {
    if (!socket || !session?.user) {
      console.log("Cannot send message: socket or session not available");
      return false;
    }

    try {
      console.log(
        `Sending ${messageType} message to conversation: ${conversationId}`
      );
      socket.emit("send-message", {
        conversationId,
        senderId: session.user.id,
        content,
        messageType,
      });
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  };

  const sendQuote = (conversationId, quoteData) => {
    if (!socket || !session?.user) {
      console.log("Cannot send quote: socket or session not available");
      return false;
    }

    try {
      console.log(`Sending quote to conversation: ${conversationId}`);
      socket.emit("send-quote", {
        conversationId,
        senderId: session.user.id,
        ...quoteData,
      });
      return true;
    } catch (error) {
      console.error("Error sending quote:", error);
      return false;
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        isProduction,
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
