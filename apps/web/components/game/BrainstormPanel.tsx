"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useGameStore } from "@/lib/game-store";
import { getSocket } from "@/lib/socket";
import type { BrainstormMessage } from "@/lib/types";

export default function BrainstormPanel() {
  const room = useGameStore((s) => s.room);
  const playerId = useGameStore((s) => s.playerId);

  const [messages, setMessages] = useState<BrainstormMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine team color for accent
  const myTeamId = useMemo(() => {
    if (!room || !playerId) return null;
    return room.players[playerId]?.teamId ?? null;
  }, [room, playerId]);

  const teamColor = useMemo(() => {
    if (!room || !myTeamId) return "#16c79a";
    return room.teams[myTeamId]?.color ?? "#16c79a";
  }, [room, myTeamId]);

  // Listen for brainstorm messages from socket
  useEffect(() => {
    const socket = getSocket();

    function handleNewMessage(message: BrainstormMessage) {
      setMessages((prev) => [...prev, message]);
    }

    socket.on("brainstorm:new", handleNewMessage);

    return () => {
      socket.off("brainstorm:new", handleNewMessage);
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send a message
  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || !playerId) return;

    const socket = getSocket();
    socket.emit("brainstorm:message", { text });
    setInputText("");
    inputRef.current?.focus();
  }, [inputText, playerId]);

  // Handle Enter key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  if (isCollapsed) {
    return (
      <div
        className="border-t-3 border-game-blue bg-game-dark/80 px-4 py-2 cursor-pointer hover:bg-game-blue/10 transition-colors"
        onClick={() => setIsCollapsed(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: teamColor }}
            />
            <h3 className="font-pixel text-xs text-game-green">
              TEAM CHAT
            </h3>
            {messages.length > 0 && (
              <span className="font-pixel text-[8px] text-gray-500">
                ({messages.length})
              </span>
            )}
          </div>
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-36 border-t-3 bg-game-dark/80 flex flex-col"
      style={{ borderColor: teamColor + "40" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-game-blue/30">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: teamColor }}
          />
          <h3 className="font-pixel text-xs text-game-green">
            TEAM CHAT
          </h3>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-0.5 hover:bg-game-blue/20 rounded transition-colors"
          title="Collapse chat"
        >
          <svg
            className="w-3.5 h-3.5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Messages + Input */}
      <div className="flex-1 flex gap-2 px-3 py-2 overflow-hidden">
        {/* Message list */}
        <div className="flex-1 bg-game-dark border-2 border-game-blue/40 rounded p-2 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-600 text-xs italic">
              Chat with your team here!
            </p>
          ) : (
            <div className="space-y-1.5">
              {messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-1.5">
                  <span
                    className="font-pixel text-[8px] flex-shrink-0"
                    style={{
                      color:
                        msg.playerId === playerId ? teamColor : "#9ca3af",
                    }}
                  >
                    {msg.playerName}:
                  </span>
                  <span className="text-xs text-gray-300 break-words">
                    {msg.text}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex flex-col gap-1.5 w-48">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-game-dark border-2 border-game-blue/40 rounded px-3 py-1
              text-sm text-white placeholder-gray-600
              focus:border-game-green focus:outline-none transition-colors"
            maxLength={200}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`
              font-pixel text-[10px] py-2 px-3 rounded border-2 transition-all
              ${
                inputText.trim()
                  ? "bg-game-green/20 border-game-green text-game-green hover:bg-game-green/30 hover:shadow-[0_0_8px_rgba(22,199,154,0.2)]"
                  : "bg-gray-800/50 border-gray-700 text-gray-600 cursor-not-allowed"
              }
            `}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
