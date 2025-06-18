import { Server as SocketIOServer } from "socket.io";

let io;

export function initSocketServer(server) {
  if (io) return io;

  io = new SocketIOServer(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_SITE_URL
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

        // Use ESM absolute import for Message model
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
        const quoteContent = { productId, quantity, price, note };

        // Use ESM absolute import for Message and RFQ models
        const MessageModel = (
          await import(new URL("../models/Message.js", import.meta.url))
        ).default;
        const RFQModel = (
          await import(new URL("../models/RFQ.js", import.meta.url))
        ).default;

        const newQuote = await MessageModel.create({
          conversation: conversationId,
          sender: senderId,
          content: JSON.stringify(quoteContent),
          messageType: "quote",
        });

        await RFQModel.findOneAndUpdate(
          { conversation: conversationId },
          { status: "Quoted" }
        );

        io.to(conversationId).emit("receive-message", newQuote);
        io.to(conversationId).emit("quote-updated", {
          conversationId,
          status: "Quoted",
        });
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
    throw new Error("Socket.io has not been initialized");
  }
  return io;
}
