"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function ChatPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* ================= LOAD CURRENT USER ================= */
  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.user);
    }
    loadUser();
  }, []);

  /* ================= INIT SOCKET ================= */
  useEffect(() => {
    if (!sessionId) return;

    socket = io("http://localhost:3001");

    socket.emit("joinRoom", sessionId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  /* ================= SEND MESSAGE ================= */
  function sendMessage() {
    if (!text.trim() || !user) return;

    const messageData = {
      sessionId,
      senderId: user.id,   // 🔥 REQUIRED
      content: text,
    };

    socket.emit("sendMessage", messageData);

    setText("");
  }

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <div className="p-4 bg-white border-b font-semibold">
        Chat Room
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const isMine = user?.id === m.senderId;

          return (
            <div
              key={m.id || Math.random()}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow
                  ${
                    isMine
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 bg-white border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2"
          placeholder="Write something..."
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-6 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}