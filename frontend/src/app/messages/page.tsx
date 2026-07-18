"use client";

import React, { useState } from "react";
import { Send, Search, CheckCheck, ShieldAlert, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

interface Message {
  id: number;
  sender: "user" | "other";
  text: string;
  time: string;
}

interface ChatThread {
  id: number;
  name: string;
  avatar: string;
  role: "Guest" | "Host" | "System";
  listingTitle: string;
  status: string;
  messages: Message[];
}

const MOCK_CHATS: ChatThread[] = [
  {
    id: 1,
    name: "Shaq Freq",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    role: "Guest",
    listingTitle: "Vayu Vihar Stay",
    status: "Confirmed",
    messages: [
      { id: 1, sender: "other", text: "Hey! Looking forward to checking in tomorrow! Is early check-in possible?", time: "Yesterday, 2:40 PM" },
      { id: 2, sender: "user", text: "Hi Shaq! Yes, the previous guests are checking out early, so the room will be clean and ready by 12 PM.", time: "Yesterday, 2:45 PM" },
      { id: 3, sender: "other", text: "That is perfect, thank you so much! See you then.", time: "Yesterday, 2:50 PM" }
    ]
  },
  {
    id: 2,
    name: "Kilyan Vilal",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    role: "Host",
    listingTitle: "Urban Skyline Loft",
    status: "Checkout complete",
    messages: [
      { id: 1, sender: "other", text: "Hello! Welcome to Bengaluru. Let me know if you need directions to the loft.", time: "July 12, 10:15 AM" },
      { id: 2, sender: "user", text: "Awesome, thanks Kilyan! We're arriving around 6 PM, will keep you updated.", time: "July 12, 10:20 AM" },
      { id: 3, sender: "other", text: "Perfect. Keybox code is 4452. Have a safe trip!", time: "July 12, 10:22 AM" }
    ]
  },
  {
    id: 3,
    name: "Airbnb Support",
    avatar: "",
    role: "System",
    listingTitle: "Account Security",
    status: "Closed",
    messages: [
      { id: 1, sender: "other", text: "Your identity verification submission has been approved successfully. Welcome to the hosting community!", time: "July 10, 11:00 AM" }
    ]
  }
];

export default function MessagesInboxPage() {
  const { currentUser } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>(MOCK_CHATS);
  const [selectedThreadId, setSelectedThreadId] = useState<number>(1);
  const [typedMessage, setTypedMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const activeThread = threads.find(t => t.id === selectedThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: typedMessage.trim(),
      time: "Just now"
    };

    setThreads(prev => 
      prev.map(thread => 
        thread.id === selectedThreadId 
          ? { ...thread, messages: [...thread.messages, newMsg] }
          : thread
      )
    );
    setTypedMessage("");
  };

  const filteredThreads = threads.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.listingTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 font-sans select-none">
      
      <div className="max-w-6xl w-full bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex h-[75vh]">
        
        {/* Left Pane - Threads List */}
        <div className="w-full md:w-[350px] border-r border-gray-150 flex flex-col bg-white flex-shrink-0">
          {/* Header search */}
          <div className="p-4 border-b border-gray-150 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-black text-gray-900 tracking-tight">Inbox</h1>
              <Link href="/" className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit</span>
              </Link>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-[11px]" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-xs bg-gray-50/50"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-grow overflow-y-auto divide-y divide-gray-100">
            {filteredThreads.map((thread) => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              const isSelected = thread.id === selectedThreadId;

              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`p-4 cursor-pointer transition flex gap-3 items-center ${
                    isSelected ? "bg-gray-50/80 border-l-[3px] border-black" : "hover:bg-gray-50/40"
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-150 border border-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-sm text-gray-500">
                    {thread.avatar ? (
                      <img src={thread.avatar} alt={thread.name} className="w-full h-full object-cover" />
                    ) : (
                      thread.name.charAt(0)
                    )}
                  </div>

                  {/* Context */}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-extrabold text-[13px] text-gray-800 truncate">{thread.name}</h4>
                      <span className="text-[9px] text-gray-400 font-bold">{lastMsg ? lastMsg.time : ""}</span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 truncate mb-1">{thread.listingTitle}</p>
                    <p className="text-xs text-gray-500 font-light truncate">{lastMsg ? lastMsg.text : ""}</p>
                  </div>
                </div>
              );
            })}
            {filteredThreads.length === 0 && (
              <div className="p-8 text-center text-xs text-gray-400 font-bold">
                No conversations found
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Chat Window */}
        <div className="hidden md:flex flex-grow flex-col bg-[#F9FAFB] relative">
          
          {/* Top Thread info header */}
          <div className="bg-white border-b border-gray-150 px-6 py-4 flex items-center justify-between z-10 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-150 border border-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-500 text-xs">
                {activeThread.avatar ? (
                  <img src={activeThread.avatar} alt={activeThread.name} className="w-full h-full object-cover" />
                ) : (
                  activeThread.name.charAt(0)
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-[14px] text-gray-900 flex items-center gap-2">
                  <span>{activeThread.name}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {activeThread.role}
                  </span>
                </h3>
                <p className="text-[11px] text-gray-500 font-light mt-0.5">{activeThread.listingTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>{activeThread.status}</span>
            </div>
          </div>

          {/* Messages stack list */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4 flex flex-col justify-end">
            <div className="space-y-4">
              {activeThread.messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[70%] space-y-1">
                      <div className={`p-3.5 rounded-2xl text-xs leading-normal shadow-xs border ${
                        isUser 
                          ? "bg-black text-white border-black rounded-tr-none" 
                          : "bg-white text-gray-800 border-gray-200/80 rounded-tl-none"
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`text-[9px] text-gray-400 font-bold flex items-center gap-1 ${isUser ? "justify-end" : "justify-start"}`}>
                        <span>{msg.time}</span>
                        {isUser && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom message input form */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-150 flex gap-2">
            <input
              type="text"
              placeholder={`Message ${activeThread.name}...`}
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              className="flex-grow p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-xs bg-gray-50/50"
            />
            <button
              type="submit"
              disabled={!typedMessage.trim()}
              className="w-10 h-10 bg-black hover:bg-neutral-850 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-xl flex items-center justify-center transition flex-shrink-0 cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
