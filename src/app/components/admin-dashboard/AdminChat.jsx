"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, AlertTriangle, Shield, Clock, Check } from "lucide-react";
import { useSession } from "next-auth/react";

const AdminChat = ({ seller }) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [warningType, setWarningType] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (seller && session?.user) {
      initializeConversation();
    }
  }, [seller, session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeConversation = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/admin/conversations", {
        sellerId: seller.user._id,
        type: "admin_seller",
      });
      setConversationId(response.data.conversationId);
      fetchMessages(response.data.conversationId);
    } catch (error) {
      console.error("Error initializing conversation:", error);
      toast.error("Failed to initialize chat");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const response = await axios.get(`/api/conversations/${convId}/messages`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId || sending) return;

    try {
      setSending(true);
      const messageData = {
        content: newMessage,
        type: warningType || "message",
        isAdminMessage: true,
      };

      const response = await axios.post(
        `/api/conversations/${conversationId}/messages`,
        messageData
      );

      setMessages((prev) => [...prev, response.data.message]);
      setNewMessage("");
      setWarningType("");

      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const sendWarning = (type) => {
    let warningMessage = "";
    switch (type) {
      case "policy_violation":
        warningMessage =
          "⚠️ WARNING: Your recent activities may violate our platform policies. Please review our terms of service and ensure compliance.";
        break;
      case "quality_concern":
        warningMessage =
          "⚠️ WARNING: We've received complaints about product quality. Please review your products and ensure they meet our standards.";
        break;
      case "delivery_issue":
        warningMessage =
          "⚠️ WARNING: Multiple delivery complaints have been reported. Please improve your shipping and fulfillment processes.";
        break;
      case "final_warning":
        warningMessage =
          "🚨 FINAL WARNING: This is your final warning. Any further violations may result in account suspension.";
        break;
      default:
        warningMessage =
          "⚠️ WARNING: Please ensure compliance with platform policies.";
    }

    setNewMessage(warningMessage);
    setWarningType(type);
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getMessageTypeStyle = (type) => {
    switch (type) {
      case "policy_violation":
      case "quality_concern":
      case "delivery_issue":
        return "bg-yellow-50 border-l-4 border-l-yellow-400";
      case "final_warning":
        return "bg-red-50 border-l-4 border-l-red-500";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white border border-gray-200 rounded-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 font-medium">
              {seller.applicationData?.businessName?.charAt(0) || "S"}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {seller.applicationData?.businessName || "Unknown Business"}
            </h3>
            <p className="text-sm text-gray-600">{seller.user?.name}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Shield className="w-3 h-3 mr-1" />
          Admin Chat
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation with the seller.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.sender._id === session?.user?.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender._id === session?.user?.id
                    ? `bg-indigo-600 text-white ${getMessageTypeStyle(
                        message.type
                      )}`
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs opacity-75">
                    {formatMessageTime(message.createdAt)}
                  </p>
                  {message.sender._id === session?.user?.id && (
                    <Check className="w-3 h-3 opacity-75" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Warning Buttons */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex flex-wrap gap-2 mb-2">
          <Button
            onClick={() => sendWarning("policy_violation")}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Policy Warning
          </Button>
          <Button
            onClick={() => sendWarning("quality_concern")}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Quality Warning
          </Button>
          <Button
            onClick={() => sendWarning("delivery_issue")}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Clock className="w-3 h-3 mr-1" />
            Delivery Warning
          </Button>
          <Button
            onClick={() => sendWarning("final_warning")}
            variant="outline"
            size="sm"
            className="text-xs text-red-600 hover:bg-red-50"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Final Warning
          </Button>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        {warningType && (
          <p className="text-xs text-orange-600 mt-1">
            Warning message ready to send. Click send to deliver.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
