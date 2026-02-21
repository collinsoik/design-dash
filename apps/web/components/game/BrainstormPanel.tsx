"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useGameStore } from "@/lib/game-store";
import { getSocket } from "@/lib/socket";
import type { BrainstormMessage } from "@design-dash/shared";

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
    if (!room || !myTeamId) return "#4ACA9A";
    return room.teams[myTeamId]?.color ?? "#4ACA9A";
  }, [room, myTeamId]);

  // Check if it's the current player's turn
  const isMyTurn = useMemo(() => {
    if (!room?.gameState?.currentTurn || !myTeamId || !playerId) return false;
    return room.gameState.currentTurn.activePlayerIds[myTeamId] === playerId;
  }, [room, myTeamId, playerId]);

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
        className="border-t border-border-primary bg-surface-secondary px-4 py-2 cursor-pointer hover:bg-surface-tertiary transition-colors"
        onClick={() => setIsCollapsed(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: teamColor }}
            />
            <h3 className="text-sm font-semibold text-accent-green">
              Team Chat
            </h3>
            {messages.length > 0 && (
              <span className="text-xs text-text-tertiary">
                ({messages.length})
              </span>
            )}
          </div>
          <svg
            className="w-4 h-4 text-text-tertiary"
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
      className="h-36 border-t border-border-primary bg-surface-secondary flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-primary">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: teamColor }}
          />
          <h3 className="text-sm font-semibold text-accent-green">
            Team Chat
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-tertiary">
            {isMyTurn
              ? "Ask your team for help!"
              : "Tell your teammate what you think!"}
          </span>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-0.5 hover:bg-surface-tertiary rounded transition-colors"
            title="Collapse chat"
          >
            <svg
              className="w-3.5 h-3.5 text-text-tertiary"
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
      </div>

      {/* Messages + Input */}
      <div className="flex-1 flex gap-2 px-3 py-2 overflow-hidden">
        {/* Message list */}
        <div className="flex-1 bg-white border border-border-primary rounded-lg p-2 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="space-y-1">
              <p className="text-text-disabled text-xs italic">
                Chat with your team here! Try saying:
              </p>
              <p className="text-text-disabled text-xs italic">
                &quot;I think we should pick...&quot; or &quot;What about option...?&quot;
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-1.5">
                  <span
                    className="text-xs font-semibold flex-shrink-0"
                    style={{
                      color:
                        msg.playerId === playerId ? teamColor : "#9CA3AF",
                    }}
                  >
                    {msg.playerName}:
                  </span>
                  <span className="text-xs text-text-secondary break-words">
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
            className="input flex-1 text-sm"
            maxLength={200}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`
              text-sm font-semibold py-2 px-3 rounded-lg border transition-all
              ${
                inputText.trim()
                  ? "btn-green"
                  : "bg-surface-tertiary border-border-primary text-text-disabled cursor-not-allowed"
              }
            `}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
