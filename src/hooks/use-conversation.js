"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/app/context/SocketContext";
import { useSession } from "next-auth/react";
import axios from "axios";

export const useConversation = (conversationId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const { socket, connected, joinConversation, sendMessage } = useSocket();
  const { data: session } = useSession();

  // Fetch conversation and messages
  useEffect(() => {
    if (!conversationId || !session?.user) return;

    const fetchConversation = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/conversations/${conversationId}`
        );
        const data = response.data;
        setConversation(data.conversation);
        setMessages(data.messages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId, session?.user]);

  // Join the conversation socket room
  useEffect(() => {
    if (!connected || !conversationId) return;

    joinConversation(conversationId);
  }, [connected, conversationId, joinConversation]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receive-message", handleNewMessage);

    return () => {
      socket.off("receive-message", handleNewMessage);
    };
  }, [socket]);

  // Send a message
  const sendNewMessage = useCallback(
    (content, messageType = "text") => {
      if (!conversationId) return;

      return sendMessage(conversationId, content, messageType);
    },
    [conversationId, sendMessage]
  );

  return {
    loading,
    error,
    conversation,
    messages,
    sendMessage: sendNewMessage,
  };
};

export const useRfq = (rfqId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rfq, setRfq] = useState(null);
  const { socket } = useSocket();
  const { data: session } = useSession();

  // Fetch RFQ details
  useEffect(() => {
    if (!rfqId || !session?.user) return;

    const fetchRfq = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/rfq/${rfqId}`);
        const data = response.data;
        setRfq(data.rfq);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRfq();
  }, [rfqId, session?.user]);

  // Listen for RFQ status updates
  useEffect(() => {
    if (!socket || !rfq) return;

    const handleQuoteUpdate = (data) => {
      if (data.rfqId === rfqId) {
        setRfq((prev) => ({ ...prev, status: data.status }));
      }
    };

    socket.on("quote-updated", handleQuoteUpdate);

    return () => {
      socket.off("quote-updated", handleQuoteUpdate);
    };
  }, [socket, rfqId, rfq]);

  // Submit a quote
  const submitQuote = async (price, note) => {
    if (!rfqId || !session?.user) return;

    try {
      const response = await fetch(`/api/rfq/${rfqId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Quoted",
          price,
          note,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote");
      }

      const data = await response.json();
      setRfq(data.rfq);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    loading,
    error,
    rfq,
    submitQuote,
  };
};
