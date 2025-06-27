"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export function usePollingMessages(conversationId, enabled = true) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const fetchMessages = useCallback(async (lastMessageId = null) => {
    if (!conversationId || !enabled) return;

    try {
      setLoading(true);
      const url = new URL('/api/messages/polling', window.location.origin);
      url.searchParams.set('conversationId', conversationId);
      if (lastMessageId) {
        url.searchParams.set('lastMessageId', lastMessageId);
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();
      
      if (lastMessageId) {
        // Append new messages
        setMessages(prev => [...prev, ...data.messages]);
      } else {
        // Replace all messages
        setMessages(data.messages);
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, enabled]);

  const sendMessage = useCallback(async (content, messageType = 'text', quoteDetails = null) => {
    if (!session?.user || !conversationId) return false;

    try {
      const response = await fetch('/api/messages/polling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          senderId: session.user.id,
          content,
          messageType,
          quoteDetails,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      setMessages(prev => [...prev, data.message]);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error sending message:', err);
      return false;
    }
  }, [session, conversationId]);

  // Initial load
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Polling for new messages
  useEffect(() => {
    if (!enabled || !conversationId) return;

    const interval = setInterval(() => {
      const lastMessage = messages[messages.length - 1];
      fetchMessages(lastMessage?._id);
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [fetchMessages, messages, enabled, conversationId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetch: () => fetchMessages(),
  };
}
