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

        // Save message to database - implementation in the Message model
        const newMessage = await import("../models/Message").then((module) =>
          module.default.create({
            conversation: conversationId,
            sender: senderId,
            content,
            messageType: messageType || "text",
          })
        );

        // Emit the message to all users in the conversation
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

        // Create quote message
        const quoteContent = {
          productId,
          quantity,
          price,
          note,
        };

        // Save the quote message
        const newQuote = await import("../models/Message").then((module) =>
          module.default.create({
            conversation: conversationId,
            sender: senderId,
            content: JSON.stringify(quoteContent),
            messageType: "quote",
          })
        );

        // Update RFQ status
        await import("../models/RFQ").then((module) =>
          module.default.findOneAndUpdate(
            { conversation: conversationId },
            { status: "Quoted" }
          )
        );

        // Emit the quote to all users in the conversation
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
