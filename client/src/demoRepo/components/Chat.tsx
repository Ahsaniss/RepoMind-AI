import React, { useState, useEffect, useRef } from 'react';
import { Message } from './Message';
import { useChat } from '../../hooks/useChat';

export const Chat: React.FC = () => {
  const { messages, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex p-2 border-t border-subtle bg-[var(--color-card)]">
        <input
          type="text"
          className="flex-1 rounded-md border border-subtle px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the repo..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
};
