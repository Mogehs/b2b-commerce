import { Server as SocketIOServer } from "socket.io";

let io;

export function initSocketServer(server) {
  if (io) return io;

  io = new SocketIOServer(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? [
              process.env.NEXT_PUBLIC_SOCKET_URL,
              "https://your-app-name.vercel.app",
            ]
          : "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-chat", ({ conversationId, userId }) => {
      console.log(`User ${userId} joined conversation ${conversationId}`);
      socket.join(conversationId);
    });

    socket.on("send-message", async (messageData) => {
      try {
        const { conversationId, senderId, content, messageType } = messageData;

        const MessageModel = (
          await import(new URL("../models/Message.js", import.meta.url))
        ).default;
        const newMessage = await MessageModel.create({
          conversation: conversationId,
          sender: senderId,
          content,
          messageType: messageType || "text",
        });

        io.to(conversationId).emit("receive-message", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Error sending message" });
      }
    });

    socket.on("send-quote", async (quoteData) => {
      try {
        const { conversationId, senderId, productId, quantity, price, note } =
          quoteData;

        const MessageModel = (
          await import(new URL("../models/Message.js", import.meta.url))
        ).default;

        const newMessage = await MessageModel.create({
          conversation: conversationId,
          sender: senderId,
          content: `Quote: ${quantity} units at $${price} each`,
          messageType: "quote",
          quoteDetails: {
            productId,
            quantity,
            price,
            note,
          },
        });

        io.to(conversationId).emit("receive-message", newMessage);
      } catch (error) {
        console.error("Error sending quote:", error);
        socket.emit("error", { message: "Error sending quote" });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

// Fallback for Vercel serverless environment
export function createSimpleSocketConnection() {
  // For production on Vercel, we'll use a polling-based approach
  // or integrate with external services like Pusher or Ably
  console.log("Socket.io not available in serverless environment");
  return null;
}
