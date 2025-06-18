"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSocket } from "@/app/context/SocketContext";
import { useConversation } from "@/hooks/use-conversation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ChatBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const rfqId = searchParams.get("rfq");

  const { data: session } = useSession();
  const { connected } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);

  const messagesEndRef = useRef(null);

  const {
    loading: loadingCurrentConversation,
    conversation: currentConversation,
    messages,
    sendMessage,
  } = useConversation(conversationId);
  useEffect(() => {
    if (!session?.user) return;

    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/conversations");
        if (!response.ok) throw new Error("Failed to fetch conversations");

        const data = await response.json();
        setConversations(data.conversations);

        if (
          !conversationId &&
          data.conversations &&
          data.conversations.length > 0
        ) {
          const firstConversation = data.conversations[0];
          router.push(
            `/dashboard/buyer/chat?conversationId=${firstConversation._id}`
          );
        }
      } catch (error) {
        toast.error("Failed to load conversations");
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConversations();
  }, [session, conversationId, router]);

  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find((c) => c._id === conversationId);
      if (conv) setSelectedConversation(conv);
    }
  }, [conversationId, conversations]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageInput.trim() || !conversationId) return;

    sendMessage(messageInput);
    setMessageInput("");
  };

  const handleSelectConversation = (conv) => {
    router.push(`/dashboard/buyer/chat?conversationId=${conv._id}`);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Check if message is from current user
  const isMyMessage = (sender) => {
    if (!session?.user?.id) return false;
    if (typeof sender === "string") return sender === session.user.id;
    if (typeof sender === "object" && sender._id)
      return sender._id === session.user.id;
    return false;
  };

  // Helper to check unread messages for a conversation
  const getUnreadCount = (conv) => {
    if (!conv.lastMessage) return 0;
    // Only count if the last message is not read and not sent by the current user
    if (
      !conv.lastMessage.read &&
      conv.lastMessage.sender !== session?.user?.id &&
      conv.lastMessage.sender?._id !== session?.user?.id
    ) {
      return 1;
    }
    return 0;
  };

  // Render message content based on type
  const renderMessageContent = (message) => {
    switch (message.messageType) {
      case "rfq":
        try {
          const rfqData = JSON.parse(message.content);
          return (
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <p className="font-medium text-blue-800">Quote Request</p>
              <p className="text-sm text-gray-700">
                Product: {rfqData.productName}
              </p>
              <p className="text-sm text-gray-700">
                Quantity: {rfqData.quantity}
              </p>{" "}
              <p className="text-sm text-gray-700">
                Message: {rfqData.message || "No additional message"}
              </p>
            </div>
          );
        } catch (error) {
          return <p>{message.content}</p>;
        }
      case "quote":
        try {
          const quoteData = JSON.parse(message.content);
          const rfqId = currentConversation?.rfq?._id;
          const isClosed = currentConversation?.rfq?.status === "Closed";
          return (
            <div className="bg-green-50 p-3 rounded-md border border-green-100">
              <p className="font-medium text-green-800">Quote Offered</p>
              <p className="text-sm text-gray-700">
                Price: PKR {quoteData.price}
              </p>
              <p className="text-sm text-gray-700">
                Quantity: {quoteData.quantity}
              </p>
              {quoteData.note && (
                <p className="text-sm text-gray-700 mt-2 italic">
                  {quoteData.note}
                </p>
              )}
              <div className="mt-3">
                <Button
                  className="bg-[#C9AF2F] hover:bg-[#b89d2c] text-white text-xs"
                  disabled={isClosed}
                  onClick={async () => {
                    if (!rfqId) return;
                    try {
                      const res = await fetch(`/api/rfq/${rfqId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "Closed" }),
                      });
                      if (!res.ok) throw new Error("Failed to accept quote");
                      toast.success("Quote accepted. RFQ is now closed.");
                      // Optionally, refresh conversation or update state
                      router.refresh && router.refresh();
                    } catch (err) {
                      toast.error("Failed to accept quote");
                    }
                  }}
                >
                  {isClosed ? "RFQ Closed" : "Accept Quote"}
                </Button>
              </div>
            </div>
          );
        } catch (error) {
          return <p>{message.content}</p>;
        }
      default:
        return <p>{message.content}</p>;
    }
  };

  return (
    <div className="md:min-h-screen bg-gray-100 text-gray-800 p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#C9AF2F]">
        💬 Conversations
      </h1>

      <div className="flex flex-col md:flex-row md:h-[80vh] overflow-hidden bg-white shadow-lg rounded-lg">
        {/* Sidebar */}
        <div className="w-full md:w-[30%] border-r border-gray-200 overflow-y-auto">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">My Quote Requests</h2>
          </div>

          {loadingConversations ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length > 0 ? (
            conversations.map((conv) => {
              const otherParticipant = conv.participants[0] || {
                name: "Unknown",
              };
              const unread = getUnreadCount(conv);
              return (
                <div
                  key={conv._id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`border-b border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?._id === conv._id ? "bg-[#f7f3e3]" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p
                        className={`font-medium text-gray-800 ${
                          unread ? "font-bold" : ""
                        }`}
                      >
                        {otherParticipant.name}
                        {unread ? (
                          <span className="ml-2 inline-block bg-red-500 text-white text-xs rounded-full px-2 py-0.5 align-middle">
                            {unread}
                          </span>
                        ) : null}
                      </p>
                      {conv.product && (
                        <p className="text-xs text-gray-500">
                          Product: {conv.product.name}
                        </p>
                      )}
                    </div>
                    {conv.rfq && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          conv.rfq.status === "Quoted"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {conv.rfq.status === "Quoted"
                          ? "Quote Received"
                          : "No Quote"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500">
              {" "}
              <p>No quote requests yet</p>
              <p className="text-sm mt-2">
                Browse products and request quotes to start conversations
              </p>
              <button
                onClick={() => router.push("/dashboard/buyer/my-rfq")}
                className="mt-4 bg-[#C9AF2F] text-white px-4 py-2 rounded-lg hover:bg-[#b89d2c] transition"
              >
                Create a Quote Request
              </button>
            </div>
          )}
        </div>

        {/* Conversation Box */}
        <div className="md:w-[70%] flex flex-col">
          {conversationId ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                {loadingCurrentConversation ? (
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium">
                        {currentConversation?.participants?.[1]?.name ||
                          "Conversation"}
                      </h3>

                      {currentConversation?.product && (
                        <div
                          onClick={() =>
                            router.push(
                              `/product-details/${currentConversation.product._id}`
                            )
                          }
                          className="cursor-pointer"
                        >
                          <p className="text-xs text-gray-500">
                            Product: {currentConversation.product.name}
                          </p>
                          <img
                            src={currentConversation.product.images[0].url}
                            alt=""
                            className="mt-2 h-10 w-10 rounded-md object-cover"
                          />
                        </div>
                      )}
                    </div>
                    {currentConversation?.rfq && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          currentConversation.rfq.status === "Quoted"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {currentConversation.rfq.status === "Quoted"
                          ? "Quote Received"
                          : "No Quote"}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingCurrentConversation ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex flex-col space-y-2">
                        <Skeleton className="h-4 w-[100px] self-start" />
                        <Skeleton className="h-24 w-[80%] self-start rounded-md" />
                      </div>
                    ))}
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((message) => {
                    const isMine = isMyMessage(message.sender);

                    return (
                      <div
                        key={message._id}
                        className={`flex flex-col ${
                          isMine ? "items-end" : "items-start"
                        }`}
                      >
                        <div className="flex items-center mb-1 text-xs text-gray-500">
                          {!isMine && (
                            <span className="mr-1">{message.sender.name}</span>
                          )}
                          <span>{formatTime(message.createdAt)}</span>
                        </div>
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            isMine
                              ? "bg-[#C9AF2F] bg-opacity-20 text-gray-800"
                              : "bg-white border border-gray-200"
                          }`}
                        >
                          {renderMessageContent(message)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 text-center">No messages yet</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-gray-200 p-4"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-sm outline-none focus:ring-1 focus:ring-[#C9AF2F] focus:border-[#C9AF2F]"
                    disabled={!connected || loadingCurrentConversation}
                  />
                  <Button
                    type="submit"
                    className="bg-[#C9AF2F] hover:bg-[#b89d2c] text-white"
                    disabled={
                      !connected ||
                      !messageInput.trim() ||
                      loadingCurrentConversation
                    }
                  >
                    Send
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-400 mb-4">
                  Welcome to your Conversations
                </p>{" "}
                <p className="text-gray-400 max-w-md">
                  {conversations.length > 0
                    ? "Choose a conversation from the sidebar to view messages"
                    : "You don't have any conversations yet. Create an RFQ to start chatting with sellers"}
                </p>{" "}
                {conversations.length === 0 && (
                  <button
                    onClick={() => router.push("/dashboard/buyer/my-rfq")}
                    className="mt-6 bg-[#C9AF2F] text-white px-4 py-2 rounded-lg hover:bg-[#b89d2c] transition"
                  >
                    Create New RFQ
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
