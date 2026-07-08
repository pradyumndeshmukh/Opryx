import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, CheckCheck, Users, Lock, Sparkles, AlertCircle } from "lucide-react";
import { ChatMessage } from "../../types";

interface ChatViewProps {
  email: string;
}

export default function ChatView({ email }: ChatViewProps) {
  const [channels, setChannels] = useState([
    { id: "general", name: "#general-ops", unread: false, active: true },
    { id: "deals", name: "#brand-deals", unread: true, active: false },
    { id: "payouts", name: "#payout-reconciliations", unread: false, active: false },
    { id: "strategy", name: "#growth-strategies", unread: false, active: false },
  ]);

  const [activeChannelId, setActiveChannelId] = useState("general");
  
  // Chat message cache keyed by channel
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    general: [
      { id: "1", sender: "manager", text: "Aria, Apex Gaming contract terms look fantastic. Ready to lock down and sign?", timestamp: "10:14 AM" },
      { id: "2", sender: "creator", text: "Yes Marcus, please push the task Checklist to the board so we stay on schedule.", timestamp: "10:15 AM" },
      { id: "3", sender: "manager", text: "Excellent! The checklists are pushed. Sarah is finalizing the financial statement for the previous month too.", timestamp: "10:16 AM" },
    ],
    deals: [
      { id: "1", sender: "manager", text: "Reviewing Peak Design pitch deck. We should request a 15% premium for short-form video amplification.", timestamp: "Yesterday" },
    ],
    payouts: [
      { id: "1", sender: "manager", text: "Reconciled $12,450 payout from YouTube platform. Ready for invoice routing.", timestamp: "3 days ago" },
    ],
    strategy: [
      { id: "1", sender: "manager", text: "Suggesting we run 3 dynamic shorts targeting travel vlogging tips. Retentions are looking strong there.", timestamp: "4 days ago" },
    ]
  });

  const [textInput, setTextInput] = useState("");
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChannelId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const userMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender: "creator",
      text: textInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentChanMsgs = messages[activeChannelId] || [];
    setMessages({
      ...messages,
      [activeChannelId]: [...currentChanMsgs, userMsg],
    });
    
    setTextInput("");

    // Simulate Sarah/Marcus response after 1.5 seconds!
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: "msg_reply_" + Date.now(),
        sender: "manager",
        text: `Understood! Let's get right on that. The OPRYX Operating Team is coordinating your request. Check your Kanban or Synced Audience stats for updates.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages((prev) => {
        const chanMsgs = prev[activeChannelId] || [];
        return {
          ...prev,
          [activeChannelId]: [...chanMsgs, replyMsg],
        };
      });
    }, 1500);
  };

  const activeChannel = channels.find((c) => c.id === activeChannelId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[480px]">
      
      {/* LEFT COLUMN: Channels Selection */}
      <div className="md:col-span-4 flex flex-col gap-4.5">
        <div className="glass p-4 rounded-2xl bg-white/2 border border-white/5 flex flex-col gap-3 h-full">
          <span className="text-[10px] text-slate font-mono uppercase tracking-widest font-semibold pb-2 border-b border-white/5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-violet" />
            <span>Operational Channels</span>
          </span>

          <div className="flex flex-col gap-1.5 overflow-y-auto">
            {channels.map((chan) => (
              <button
                key={chan.id}
                onClick={() => {
                  setActiveChannelId(chan.id);
                  setChannels(
                    channels.map((c) => (c.id === chan.id ? { ...c, unread: false } : c))
                  );
                }}
                className={`w-full p-3 rounded-xl flex justify-between items-center text-xs font-mono transition-colors text-left cursor-pointer ${
                  chan.id === activeChannelId
                    ? "bg-gradient-to-r from-violet to-blue text-white border border-violet/20"
                    : "text-slate hover:bg-white/2 border border-transparent"
                }`}
              >
                <span>{chan.name}</span>
                {chan.unread && (
                  <span className="w-2 h-2 rounded-full bg-violet" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-auto p-3.5 bg-[#0c0c10] rounded-xl border border-white/5 text-[10.5px] leading-relaxed text-slate flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Double-encrypted</span>
            </div>
            <span>Messages are secured via secure client keys. Only OPRYX crew can read chats.</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Messages Feed and Input */}
      <div className="md:col-span-8 flex flex-col gap-4.5 h-full">
        <div className="glass p-4 rounded-2xl bg-white/2 border border-white/5 flex flex-col h-full overflow-hidden">
          
          {/* Feed Header */}
          <div className="pb-3 border-b border-white/5 mb-4 flex justify-between items-center flex-shrink-0">
            <div className="flex flex-col">
              <h3 className="font-display font-bold text-sm text-white">{activeChannel?.name}</h3>
              <span className="text-[10px] text-slate font-mono uppercase mt-0.5">• Active Operational Feed</span>
            </div>
          </div>

          {/* Messages stream */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 mb-4">
            {(messages[activeChannelId] || []).map((msg) => {
              const isCreator = msg.sender === "creator";
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col max-w-[85%] ${
                    isCreator ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isCreator 
                      ? "bg-gradient-to-br from-violet to-blue text-white rounded-tr-none border border-violet/10" 
                      : "bg-[#0c0c10] text-slate-200 rounded-tl-none border border-white/5"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate/50 font-mono mt-1 px-1.5">
                    {isCreator ? "Aria" : "Manager Marcus"} • {msg.timestamp}
                  </span>
                </div>
              );
            })}
            <div ref={feedEndRef} />
          </div>

          {/* Text Input area */}
          <form onSubmit={handleSendMessage} className="flex gap-2.5 pt-3.5 border-t border-white/5 flex-shrink-0">
            <input 
              type="text"
              placeholder={`Send secure message to ${activeChannel?.name}...`}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet font-mono placeholder-slate/50"
            />
            <button
              type="submit"
              className="btn bg-gradient-to-r from-violet to-blue text-white rounded-xl py-3 px-5 flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
