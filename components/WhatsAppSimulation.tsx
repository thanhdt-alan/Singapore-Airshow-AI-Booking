
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, ChevronLeft, ShieldCheck, XCircle } from 'lucide-react';
import { ChatMessage, AttendeeProfile, AttendeeType } from '../types';
import { getNextChatResponse, summarizeProfile } from '../services/geminiService';

interface WhatsAppSimulationProps {
  onComplete: (profile: AttendeeProfile) => void;
  onDecline: () => void;
}

const WhatsAppSimulation: React.FC<WhatsAppSimulationProps> = ({ onComplete, onDecline }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: "Hello! I'm Aria, your official Singapore Airshow assistant. Before we start, I need your consent. We collect your name, company, role, and interests to help with matchmaking and bookings. Your data is kept for the event period plus 30 days and used only for these purposes. Do you agree?", 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping || isDeclined) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, text: m.text }));
      const responseText = await getNextChatResponse(history);
      
      setIsTyping(false);
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const conversationalText = responseText.replace(jsonMatch[0], '').trim();
        if (conversationalText) {
          setMessages(prev => [...prev, { role: 'model', text: conversationalText, timestamp: Date.now() }]);
        }

        const profileData = await summarizeProfile([...history, { role: 'model', text: responseText }]);
        
        if (profileData.declined) {
          setIsDeclined(true);
        } else {
          setTimeout(() => {
            onComplete({
              id: Math.random().toString(36).substr(2, 9),
              ...profileData
            } as AttendeeProfile);
          }, 2000);
        }
      } else {
        setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
      }
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'model', text: "I apologize, I'm experiencing a brief issue. Could you please send that again?", timestamp: Date.now() }]);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-[#e5ddd5] max-w-md mx-auto shadow-2xl overflow-hidden rounded-3xl border border-slate-200">
      {/* Header */}
      <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onDecline} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 border border-white/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Aria</h2>
            <p className="text-[10px] text-white/80 uppercase tracking-widest leading-none">AI Matchmaker</p>
          </div>
        </div>
        <ShieldCheck className="w-5 h-5 text-white/50" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm relative ${
              m.role === 'user' 
                ? 'bg-[#dcf8c6] text-slate-800 rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none'
            }`}>
              {m.text}
              <div className="text-[9px] text-slate-400 mt-1 flex justify-end">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/80 px-4 py-2 rounded-full text-xs italic text-slate-400 animate-pulse">Aria is typing...</div>
          </div>
        )}
        {isDeclined && (
          <div className="bg-white/90 p-6 rounded-2xl border border-red-100 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <div className="space-y-1">
              <p className="font-bold text-slate-900">Consent Declined</p>
              <p className="text-xs text-slate-500">I respect your decision. You can still use the app with basic features.</p>
            </div>
            <button 
              onClick={onDecline}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm"
            >
              Browse General Schedule
            </button>
          </div>
        )}
      </div>

      {/* Input */}
      {!isDeclined && (
        <div className="bg-[#f0f0f0] p-3 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isDeclined || isTyping}
            placeholder="Type your response..."
            className="flex-1 bg-white rounded-full px-5 py-2.5 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-[#075e54] disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !input.trim() || isDeclined}
            className="bg-[#075e54] text-white p-3 rounded-full hover:bg-[#128c7e] transition-colors disabled:opacity-50 shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default WhatsAppSimulation;
