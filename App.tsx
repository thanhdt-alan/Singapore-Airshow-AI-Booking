
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HashRouter, Routes, Route, useNavigate, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Settings, Bell, LogOut, Menu, X, CheckCircle2, Clock, MapPin, Share2, Sparkles, MessageSquare, Mail, Smartphone, ArrowRight, UserCircle, Edit3, HelpCircle, Target, Info, ShieldAlert, Inbox, Check, Slash, AlertCircle, FileUp, Download, Table, BarChart3, Database, Send, Save, Link2, ExternalLink, CalendarClock, MessageCircle, RefreshCw, Search, Filter, ChevronRight, ShieldCheck, ToggleLeft, ToggleRight, Trash2, Eye, Flag, Zap, TrendingUp, Award, Lock, Plane, Camera, UserPlus } from 'lucide-react';
import WhatsAppSimulation from './components/WhatsAppSimulation';
import { AttendeeProfile, Booking, BookingStatus, AttendeeType, ChatMessage } from './types';
import { MOCK_ATTENDEES, INDUSTRY_OPTIONS, INTEREST_OPTIONS, EVENT_DATES, EVENT_HOURS, MOCK_BOOKINGS } from './constants';
import { evaluateMatch, EvaluateMatchResponse, getNextChatResponse } from './services/geminiService';

const MEETING_LOCATIONS = [
  "Experia Meeting Pod A1",
  "Experia Meeting Pod B2",
  "Main Stage Lounge",
  "VIP Reception Hall",
  "Cafe Aero - Zone C",
  "Networking Garden",
  "Press Center Lounge"
];

// --- Login View ---
const LoginView: React.FC<{ onLogin: (userData?: { name: string, email: string }) => void }> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isRegistering) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (name.length < 2) {
        setError('Please enter your full name');
        return;
      }
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(isRegistering ? { name, email } : undefined);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden p-6">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]"></div>
      
      <div className="w-full max-w-md relative z-10 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-500/20 ring-4 ring-white/10">
            <Plane className="w-10 h-10 rotate-[-45deg]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isRegistering ? 'Create Delegate Account' : 'Delegate Portal'}
            </h1>
            <p className="text-slate-400 font-medium text-sm">Singapore Airshow 2025 • Official AI Partner</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 text-red-400 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {isRegistering && (
              <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {isRegistering ? 'Create Password' : 'Access Code'}
                </label>
                {!isRegistering && (
                  <button type="button" className="text-[10px] font-black text-blue-400 uppercase hover:underline">Forgot?</button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                />
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input 
                    required
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin text-white/50" />
              ) : (
                <>
                  {isRegistering ? 'Register Now' : 'Sign In to Hub'} 
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-400 transition-colors"
            >
              {isRegistering ? (
                <span className="flex items-center gap-2">Already have an account? <span className="text-blue-400 underline">Sign In</span></span>
              ) : (
                <span className="flex items-center gap-2">New to the Airshow? <span className="text-blue-400 underline">Register Here</span></span>
              )}
            </button>
          </div>

          <div className="mt-8 space-y-4">
             <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-500"><span className="bg-[#1a2133] px-4">Or continue with</span></div>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all text-[10px] font-black text-white uppercase tracking-widest">
                   SIA SSO
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all text-[10px] font-black text-white uppercase tracking-widest">
                   LinkedIn
                </button>
             </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Secured by Experia Events Pte Ltd • 2025
        </p>
      </div>
    </div>
  );
};

// --- Private Chat Modal (User to User) ---
const PrivateChatModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  partner: AttendeeProfile | null;
}> = ({ isOpen, onClose, partner }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && partner && messages.length === 0) {
      setMessages([{
        role: 'model',
        text: `Hi! This is a secure channel between you and ${partner.name}. You can discuss meeting details or follow up on your collaboration here.`,
        timestamp: Date.now()
      }]);
    }
  }, [isOpen, partner]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Simulate auto-reply for demo
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Thanks for reaching out! I've received your message and will check my schedule. Talk soon!",
        timestamp: Date.now()
      }]);
    }, 1500);
  };

  if (!isOpen || !partner) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg h-[600px] flex flex-col shadow-2xl border border-white overflow-hidden">
        <header className="p-6 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={partner.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=random`} className="w-10 h-10 rounded-xl bg-slate-100 border border-white/20" />
            <div>
              <h3 className="font-black text-sm uppercase tracking-widest">{partner.name}</h3>
              <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.2em]">{partner.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
                m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <footer className="p-4 bg-white border-t border-slate-100 flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${partner.name.split(' ')[0]}...`}
            className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-medium text-sm transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </footer>
      </div>
    </div>
  );
};

// --- Messages View (WhatsApp Style List) ---
const MessagesView: React.FC<{
  recentChatIds: string[];
  onOpenChat: (partner: AttendeeProfile) => void;
}> = ({ recentChatIds, onOpenChat }) => {
  const [search, setSearch] = useState('');
  
  const chats = useMemo(() => {
    return MOCK_ATTENDEES.filter(a => recentChatIds.includes(a.id))
      .filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase()));
  }, [recentChatIds, search]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Direct Messages</h1>
          <p className="text-slate-500 font-medium">Connect and collaborate with event participants.</p>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-green-200">
          {chats.length} Active Chats
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Search Bar */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-50 outline-none transition-all"
            />
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 px-6 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                <MessageSquare className="w-10 h-10" />
              </div>
              <div>
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">No active conversations</p>
                <p className="text-slate-400 text-xs mt-2 font-medium">Head to 'Discover' to find matches and start a chat.</p>
              </div>
              <Link to="/discover" className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Start Discovering</Link>
            </div>
          ) : (
            chats.map(chat => (
              <button 
                key={chat.id}
                onClick={() => onOpenChat(chat)}
                className="w-full flex items-center gap-5 p-6 hover:bg-slate-50 transition-all group text-left"
              >
                <div className="relative">
                  <img 
                    src={chat.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=random`} 
                    className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform" 
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-black text-slate-900 truncate pr-4">{chat.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400">12:45 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500 font-medium truncate pr-4">
                      {chat.company} • Let's discuss the strategic partnership...
                    </p>
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0">1</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- Schedule View (Google Calendar Style) ---
const ScheduleView: React.FC<{ 
  bookings: Booking[]; 
  myProfile: AttendeeProfile;
  onOpenAttendee: (a: AttendeeProfile) => void;
  eventDates: string[];
  eventHours: { start: number; end: number };
}> = ({ bookings, myProfile, onOpenAttendee, eventDates, eventHours }) => {
  const activeBookings = bookings.filter(b => 
    b.status !== BookingStatus.REJECTED && b.status !== BookingStatus.CANCELLED &&
    (b.fromId === myProfile.id || b.toId === myProfile.id)
  );

  const hours = useMemo(() => {
    const arr = [];
    for (let h = eventHours.start; h <= eventHours.end; h++) {
      arr.push(h);
    }
    return arr;
  }, [eventHours]);

  const getBookingForSlot = (date: string, hour: number) => {
    return activeBookings.find(b => {
      const bStart = new Date(b.startTime);
      const bDateStr = bStart.toISOString().split('T')[0];
      return bDateStr === date && bStart.getHours() === hour;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-full overflow-hidden">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Your Itinerary</h1>
          <p className="text-sm text-slate-500 font-medium">Visual calendar of your business meetings.</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
          <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> Accepted
          </div>
          <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-orange-50 text-orange-600 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div> Pending
          </div>
        </div>
      </header>

      <div className="lg:hidden flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse px-2">
        <ArrowRight className="w-3 h-3" /> Scroll horizontally to see all days
      </div>

      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <div className="min-w-[650px] lg:min-w-full">
            <div className="grid grid-cols-6 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
              <div className="p-4 border-r border-slate-100 text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center justify-center">Time</div>
              {eventDates.map(date => (
                <div key={date} className="p-4 sm:p-6 text-center border-r border-slate-100 last:border-0">
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className="text-lg sm:text-xl font-black text-slate-900">
                    {new Date(date).getDate()}
                  </p>
                </div>
              ))}
            </div>

            <div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto">
              {hours.map(hour => (
                <div key={hour} className="grid grid-cols-6 border-b border-slate-50 last:border-0 min-h-[90px] sm:min-h-[110px]">
                  <div className="p-3 sm:p-4 border-r border-slate-100 bg-slate-50/20 text-center flex flex-col justify-start pt-4">
                    <span className="text-[10px] sm:text-xs font-black text-slate-400">
                      {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                    </span>
                  </div>

                  {eventDates.map(date => {
                    const booking = getBookingForSlot(date, hour);
                    const partnerId = booking ? (booking.fromId === myProfile.id ? booking.toId : booking.fromId) : null;
                    const partner = partnerId ? MOCK_ATTENDEES.find(a => a.id === partnerId) : null;

                    return (
                      <div key={`${date}-${hour}`} className="p-1.5 sm:p-2 border-r border-slate-100 last:border-0 relative bg-slate-50/5">
                        {booking && partner && (
                          <button
                            onClick={() => onOpenAttendee(partner)}
                            className={`w-full h-full p-2 sm:p-3 rounded-xl sm:rounded-2xl text-left transition-all border shadow-sm group hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 ${
                              booking.status === BookingStatus.ACCEPTED 
                                ? 'bg-blue-600 border-blue-700 text-white' 
                                : 'bg-orange-50 border-orange-200 text-orange-800'
                            }`}
                          >
                            <div className="flex flex-col h-full justify-between overflow-hidden">
                              <div className="min-w-0">
                                <p className={`text-[7px] sm:text-[8px] font-black uppercase tracking-widest mb-0.5 sm:mb-1 truncate ${booking.status === BookingStatus.ACCEPTED ? 'text-blue-100' : 'text-orange-500'}`}>
                                  {booking.status}
                                </p>
                                <p className="text-[10px] sm:text-xs font-black truncate leading-tight">{partner.name}</p>
                                <p className={`text-[8px] sm:text-[9px] font-bold truncate opacity-80 ${booking.status === BookingStatus.ACCEPTED ? 'text-white/80' : 'text-slate-500'}`}>
                                  {partner.company}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 mt-1 sm:mt-2 min-w-0">
                                <MapPin className={`w-2.5 h-2.5 shrink-0 ${booking.status === BookingStatus.ACCEPTED ? 'text-blue-200' : 'text-orange-400'}`} />
                                <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-tight truncate">
                                  {booking.location || 'Meeting Pod A1'}
                                </span>
                              </div>
                            </div>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Aria Profile Assistant Modal ---
const AriaProfileAssistant: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  initialMessage?: string;
  onApplyChange?: (field: string, value: any) => void;
}> = ({ isOpen, onClose, initialMessage, onApplyChange }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([{
        role: 'model',
        text: initialMessage || "I'm Aria, your official assistant. How can I help you with your profile or scheduling today?",
        timestamp: Date.now()
      }]);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, text: m.text }));
      const responseText = await getNextChatResponse(history);
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const cleanText = jsonMatch ? responseText.replace(jsonMatch[0], '').trim() : responseText;
      
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'model', text: cleanText, timestamp: Date.now() }]);
    } catch (e) {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I hit a snag. Could you try rephrasing that?", timestamp: Date.now() }]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg h-[600px] flex flex-col shadow-2xl border border-white overflow-hidden">
        <header className="p-6 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-widest">Aria Assistant</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Profile & Scheduling Support</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
                m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/50 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse border border-slate-100">Aria is thinking...</div>
            </div>
          )}
        </div>

        <footer className="p-4 bg-white border-t border-slate-100 flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="How can I help you?" 
            className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-medium text-sm transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </footer>
      </div>
    </div>
  );
};

// --- Attendee Detail Modal ---
const AttendeeDetailModal: React.FC<{ 
  attendee: AttendeeProfile | null, 
  isOpen: boolean, 
  onClose: () => void, 
  onBookingRequest: (target: AttendeeProfile, startTime: string, endTime: string, notes: string, location: string) => void,
  onAskAria: (msg: string) => void,
  onOpenChat: (partner: AttendeeProfile) => void,
  existingBookings: Booking[],
  eventDates: string[],
  eventHours: { start: number; end: number }
}> = ({ attendee, isOpen, onClose, onBookingRequest, onAskAria, onOpenChat, existingBookings, eventDates, eventHours }) => {
  const [selectedDate, setSelectedDate] = useState(eventDates[0] || '');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [customNote, setCustomNote] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(MEETING_LOCATIONS[0]);

  useEffect(() => {
    if (eventDates.length > 0 && !selectedDate) {
      setSelectedDate(eventDates[0]);
    }
  }, [eventDates]);

  if (!isOpen || !attendee) return null;

  const isSlotBusy = (date: string, time: string) => {
    const slotStart = new Date(`${date}T${time}:00`).getTime();
    return existingBookings.some(b => {
      const bStart = new Date(b.startTime).getTime();
      return (b.fromId === attendee.id || b.toId === attendee.id) && 
             b.status !== BookingStatus.REJECTED && 
             b.status !== BookingStatus.CANCELLED && 
             bStart === slotStart;
    });
  };

  const generateAvailableSlots = () => {
    const slots = [];
    const duration = attendee.preferred_meeting_duration;
    for (let h = eventHours.start; h < eventHours.end; h++) {
      for (let m = 0; m < 60; m += duration) {
        const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        if (!isSlotBusy(selectedDate, time)) {
          slots.push(time);
        }
      }
    }
    return slots;
  };

  const availableSlots = generateAvailableSlots();

  const handleRequest = () => {
    if (!selectedSlot) return;
    const startTime = `${selectedDate}T${selectedSlot}:00`;
    const startDate = new Date(startTime);
    const endDate = new Date(startDate.getTime() + attendee.preferred_meeting_duration * 60000);
    onBookingRequest(attendee, startDate.toISOString(), endDate.toISOString(), customNote, selectedLocation);
    onClose();
    setCustomNote(''); 
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-white overflow-hidden">
        <div className="relative h-32 bg-slate-900 overflow-hidden">
           <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 to-transparent"></div>
           </div>
           <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10">
              <X className="w-5 h-5" />
           </button>
        </div>
        
        <div className="px-8 pb-8 -mt-12 relative overflow-y-auto">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div className="flex items-end gap-6">
              <img src={attendee.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(attendee.name)}&background=random`} className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl bg-slate-100" />
              <div className="pb-2">
                <h2 className="text-2xl font-black text-slate-900 leading-none mb-1">{attendee.name}</h2>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">{attendee.role_title} @ {attendee.company}</p>
              </div>
            </div>
            <button 
              onClick={() => { onClose(); onOpenChat(attendee); }}
              className="mb-2 p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-2 group"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Direct Chat</span>
            </button>
          </div>

          <div className="space-y-6">
            {attendee.meet_me_location && (
              <div className="bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-orange-700 uppercase tracking-widest">Meet me at the event</h4>
                    <p className="text-sm font-black text-slate-900">{attendee.meet_me_location}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-blue-600" /> Available Time Slots
                </h4>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {attendee.preferred_meeting_duration} min sessions
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {eventDates.map(date => (
                  <button
                    key={date}
                    onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                    className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                      selectedDate === date 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                        : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-200'
                    }`}
                  >
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </button>
                ))}
              </div>

              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {availableSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedSlot(time)}
                      className={`py-2 rounded-lg text-[10px] font-bold transition-all ${
                        selectedSlot === time
                          ? 'bg-blue-600 text-white ring-2 ring-blue-100'
                          : 'bg-white text-slate-600 border border-slate-100 hover:border-blue-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center bg-white/50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 font-bold italic mb-2">No available slots for this date.</p>
                  {attendee.meet_me_location && (
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">
                      Feel free to visit me at my location mentioned above!
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-2">Location</label>
                  <select 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {MEETING_LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block">Personal Note</label>
                    <button onClick={() => onAskAria(`I'm booking a meeting with ${attendee.name}. Can you help me write a concise intro note for a ${attendee.preferred_meeting_duration} minute session?`)} className="text-[9px] font-black text-blue-600 hover:underline">Draft with Aria</button>
                  </div>
                  <textarea 
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Tell them why you want to meet..."
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium h-32 outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-2">Attendee Intent</label>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                    "{attendee.intent}"
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-2">Industries</label>
                  <div className="flex flex-wrap gap-2">
                    {attendee.industries.map(ind => (
                      <span key={ind} className="px-3 py-1.5 bg-white text-slate-600 rounded-xl text-[10px] font-bold border border-slate-200 shadow-sm">{ind}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button 
              disabled={!selectedSlot}
              onClick={handleRequest}
              className="flex-1 py-5 bg-blue-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none"
            >
              {selectedSlot ? `Request Meeting at ${selectedSlot}` : 'Select a Slot'}
            </button>
            <button className="px-6 py-5 bg-slate-50 text-slate-400 rounded-3xl hover:bg-slate-100 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Inbox component ---
const InboxView: React.FC<{ 
  profile: AttendeeProfile, 
  bookings: Booking[], 
  onRespond: (bookingId: string, status: BookingStatus) => void,
  onAskAria: (msg: string) => void,
  onReschedule: (bookingId: string, newStart: string, newEnd: string) => void,
  eventDates: string[]
}> = ({ profile, bookings, onRespond, onAskAria, onReschedule, eventDates }) => {
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(eventDates[0] || '');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    if (eventDates.length > 0 && !selectedDate) {
      setSelectedDate(eventDates[0]);
    }
  }, [eventDates]);

  const incoming = bookings.filter(b => b.toId === profile.id && b.status === BookingStatus.REQUESTED);
  const acceptedBookings = bookings.filter(b => b.status === BookingStatus.ACCEPTED);

  const checkConflict = (startTimeStr: string) => {
    return acceptedBookings.some(b => b.startTime === startTimeStr);
  };

  const handleRescheduleSubmit = (booking: Booking) => {
    if (!selectedSlot) return;
    const startTime = `${selectedDate}T${selectedSlot}:00`;
    const startDate = new Date(startTime);
    const duration = profile.preferred_meeting_duration; 
    const endDate = new Date(startDate.getTime() + duration * 60000);
    
    onReschedule(booking.id, startDate.toISOString(), endDate.toISOString());
    setReschedulingId(null);
    setSelectedSlot(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Meeting Inbox</h1>
        <p className="text-slate-500 font-medium">Respond to invitations and manage your networking.</p>
      </header>

      <div className="space-y-4">
        {incoming.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Inbox className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">No pending requests</p>
          </div>
        ) : (
          incoming.map(b => {
            const sender = MOCK_ATTENDEES.find(a => a.id === b.fromId);
            const startTime = new Date(b.startTime);
            const hasConflict = checkConflict(b.startTime);
            const isRescheduling = reschedulingId === b.id;

            return (
              <div key={b.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm flex flex-col gap-6 hover:shadow-xl transition-all duration-500">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-2xl shrink-0">
                      {sender?.avatar_url ? (
                        <img src={sender.avatar_url} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        sender?.name.charAt(0) || '?'
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-black text-slate-900 text-xl truncate">{sender?.name}</h3>
                        {hasConflict && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 text-red-500 text-[9px] font-black uppercase rounded border border-red-100 animate-pulse">
                            <AlertCircle className="w-3 h-3" /> Time Conflict
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{sender?.role_title} @ {sender?.company}</p>
                      
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-lg border border-blue-100">
                          <Calendar className="w-3 h-3" />
                          {startTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-black uppercase rounded-lg border border-slate-100">
                          <Clock className="w-3 h-3" />
                          {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-lg border border-green-100">
                          <MapPin className="w-3 h-3" />
                          {b.location || 'Experia Meeting Pod A1'}
                        </div>
                      </div>

                      <div className="mt-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[11px] text-slate-600 font-medium italic leading-relaxed">"{b.notes || 'No intro note provided.'}"</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full md:w-48">
                    <button onClick={() => onRespond(b.id, BookingStatus.ACCEPTED)} className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setReschedulingId(isRescheduling ? null : b.id)} className={`py-3 text-[10px] font-black uppercase rounded-2xl transition-all flex items-center justify-center gap-2 border ${isRescheduling ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'}`}>
                        <RefreshCw className="w-3.5 h-3.5" /> Propose
                      </button>
                      <button onClick={() => onRespond(b.id, BookingStatus.REJECTED)} className="py-3 bg-white text-red-400 border border-slate-100 text-[10px] font-black uppercase rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2">
                        <X className="w-3.5 h-3.5" /> Decline
                      </button>
                    </div>
                    <button 
                      onClick={() => onAskAria(`I'm replying to a meeting request from ${sender?.name}. Help me draft a professional message regarding our scheduled meeting at ${startTime.toLocaleString()}.`)}
                      className="w-full py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" /> Chat with sender
                    </button>
                  </div>
                </div>

                {/* Rescheduling Panel */}
                {isRescheduling && (
                  <div className="mt-2 pt-6 border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
                    <div className="bg-orange-50/30 p-6 rounded-3xl border border-orange-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-orange-700 uppercase tracking-widest flex items-center gap-2">
                          <CalendarClock className="w-4 h-4" /> Propose New Slot
                        </h4>
                        <button onClick={() => setReschedulingId(null)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {eventDates.map(date => (
                          <button
                            key={date}
                            onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                            className={`shrink-0 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${
                              selectedDate === date 
                                ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' 
                                : 'bg-white text-slate-400 border border-slate-100 hover:border-orange-200'
                            }`}
                          >
                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 max-h-32 overflow-y-auto pr-2">
                        {(() => {
                          const slots = [];
                          const duration = profile.preferred_meeting_duration;
                          for (let h = EVENT_HOURS.start; h < EVENT_HOURS.end; h++) {
                            for (let m = 0; m < 60; m += duration) {
                              const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                              const busy = acceptedBookings.some(ab => ab.startTime === `${selectedDate}T${timeStr}:00`);
                              slots.push(
                                <button
                                  key={timeStr}
                                  disabled={busy}
                                  onClick={() => setSelectedSlot(timeStr)}
                                  className={`py-2 rounded-lg text-[9px] font-bold transition-all ${
                                    busy 
                                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed line-through' 
                                      : selectedSlot === timeStr
                                        ? 'bg-orange-600 text-white ring-2 ring-orange-100'
                                        : 'bg-white text-slate-600 border border-slate-100 hover:border-orange-300'
                                  }`}
                                >
                                  {timeStr}
                                </button>
                              );
                            }
                          }
                          return slots;
                        })()}
                      </div>

                      <button 
                        disabled={!selectedSlot}
                        onClick={() => handleRescheduleSubmit(b)}
                        className="w-full py-4 bg-orange-600 text-white text-[10px] font-black uppercase rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all disabled:opacity-50"
                      >
                        Confirm New Proposal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// --- Connections View ---
const ConnectionsView: React.FC<{ 
  profile: AttendeeProfile, 
  bookings: Booking[],
  onOpenChat: (partner: AttendeeProfile) => void 
}> = ({ profile, bookings, onOpenChat }) => {
  const myConnections = bookings.filter(b => b.fromId === profile.id || b.toId === profile.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Connections & My Sent Requests</h1>
        <p className="text-slate-500 font-medium">History of your business engagement and networking.</p>
      </header>

      {myConnections.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Link2 className="w-10 h-10 text-slate-200" />
          </div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">No active connections</p>
          <Link to="/discover" className="mt-6 inline-block px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Start Discovering</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myConnections.map(b => {
            const partnerId = b.fromId === profile.id ? b.toId : b.fromId;
            const partner = MOCK_ATTENDEES.find(a => a.id === partnerId);
            const isOutgoing = b.fromId === profile.id;
            const startTime = new Date(b.startTime);

            return (
              <div key={b.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col gap-6 group">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-2xl border border-slate-50 overflow-hidden shrink-0">
                    {partner?.avatar_url ? (
                      <img src={partner.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      partner?.name.charAt(0) || '?'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-slate-900 truncate text-lg">{partner?.name}</h3>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest ${isOutgoing ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
                        {isOutgoing ? 'Sent' : 'Received'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase truncate tracking-wider">{partner?.company}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                      b.status === BookingStatus.ACCEPTED ? 'text-green-600' : 
                      b.status === BookingStatus.REJECTED ? 'text-red-400' : 
                      b.status === BookingStatus.RESCHEDULE_PROPOSED ? 'text-orange-500' : 'text-blue-400'
                    }`}>
                      {b.status}
                    </div>
                    <div className="flex flex-col items-end gap-1 text-[9px] text-slate-300 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {startTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3 text-slate-300" />
                    <span className="font-bold uppercase tracking-tight">{b.location || 'Exhibition Hall'}</span>
                  </div>
                  <p className="italic">"{b.notes?.slice(0, 100) || 'Networking appointment request.'}..."</p>
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50">
                   <button 
                    onClick={() => partner && onOpenChat(partner)}
                    className="flex-1 py-3 bg-white text-blue-600 border border-blue-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                   >
                    <MessageCircle className="w-4 h-4" /> Chat Now
                  </button>
                  <button className="px-4 py-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- Dashboard component (WORLD CLASS REFINEMENT) ---
const Dashboard: React.FC<{ profile: AttendeeProfile, bookings: Booking[] }> = ({ profile, bookings }) => {
  const confirmed = bookings.filter(b => b.status === BookingStatus.ACCEPTED);
  const pendingIncoming = bookings.filter(b => b.toId === profile.id && b.status === BookingStatus.REQUESTED);
  
  // Calculate upcoming meetings (simulated for today)
  const upcomingMeetings = useMemo(() => {
    return confirmed
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 3);
  }, [confirmed]);

  const profileCompletion = useMemo(() => {
    let score = 0;
    if (profile.name) score += 20;
    if (profile.company) score += 20;
    if (profile.intent) score += 20;
    if (profile.industries.length > 0) score += 20;
    if (profile.avatar_url) score += 20;
    return score;
  }, [profile]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Hero Welcome Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-[3rem] p-10 lg:p-14 shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none"></div>
        <Sparkles className="absolute right-12 top-12 w-32 h-32 text-blue-400/5 rotate-12" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
             <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/30">
               Official Delegate Hub
             </span>
             <span className="text-slate-400 text-xs font-bold">• 4 Days Remaining</span>
          </div>
          
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Good Morning, <br />
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                {profile.name.split(' ')[0]}
              </span>
            </h1>
            <p className="mt-4 text-slate-400 text-lg font-medium leading-relaxed">
              Your {profile.attendee_type} itinerary is optimized and ready. You have {confirmed.length} confirmed meetings scheduled across the Singapore Airshow event dates.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/discover" className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-white/5 hover:bg-slate-100 transition-all flex items-center gap-3">
              <Users className="w-4 h-4" /> Find Strategic Matches
            </Link>
            <button className="bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/15 transition-all">
              Download PDF Schedule
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Confirmed</p>
             <div className="flex items-end gap-2">
               <h3 className="text-4xl font-black text-slate-900">{confirmed.length}</h3>
               <span className="text-emerald-500 font-black text-xs mb-1.5 flex items-center gap-1">
                 <TrendingUp className="w-3 h-3" /> +2 Today
               </span>
             </div>
           </div>
           <div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(confirmed.length / 10) * 100}%` }}></div>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Action Items</p>
             <h3 className={`text-4xl font-black ${pendingIncoming.length > 0 ? 'text-orange-500' : 'text-slate-900'}`}>
               {pendingIncoming.length}
             </h3>
           </div>
           <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending meeting requests</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Profile Strength</p>
             <h3 className="text-4xl font-black text-slate-900">{profileCompletion}%</h3>
           </div>
           <div className="mt-6 flex gap-1">
             {[1,2,3,4,5].map(i => (
               <div key={i} className={`h-1 flex-1 rounded-full ${profileCompletion >= i * 20 ? 'bg-emerald-400' : 'bg-slate-100'}`}></div>
             ))}
           </div>
        </div>

        <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl shadow-blue-100 text-white flex flex-col justify-between relative overflow-hidden group">
           <Zap className="absolute right-[-5%] bottom-[-5%] w-20 h-20 text-white/10 group-hover:scale-125 transition-transform" />
           <div>
             <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-4">Aria Suggests</p>
             <p className="font-black text-lg leading-tight">Identify 3 new OEMs today.</p>
           </div>
           <ArrowRight className="mt-6 w-6 h-6 text-white/50 group-hover:translate-x-2 transition-transform" />
        </div>
      </section>

      {/* Agenda and Insights Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Agenda */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" /> Next on Agenda
            </h2>
            <Link to="/schedule" className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:underline">
              View Full Itinerary
            </Link>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
            {upcomingMeetings.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {upcomingMeetings.map((meeting, idx) => {
                  const partnerId = meeting.fromId === profile.id ? meeting.toId : meeting.fromId;
                  const partner = MOCK_ATTENDEES.find(a => a.id === partnerId);
                  const startTime = new Date(meeting.startTime);

                  return (
                    <div key={meeting.id} className="p-8 flex items-center gap-8 group hover:bg-slate-50/50 transition-all">
                       <div className="text-center min-w-[70px]">
                         <p className="text-[10px] font-black text-slate-300 uppercase">{startTime.toLocaleDateString([], { weekday: 'short' })}</p>
                         <p className="text-2xl font-black text-slate-900 leading-none mt-1">{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                       </div>
                       <div className="flex-1 flex items-center gap-5">
                         <img src={partner?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner?.name || 'User')}`} className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-50 shadow-sm group-hover:scale-105 transition-transform" />
                         <div>
                           <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{partner?.name}</h4>
                           <p className="text-xs text-slate-500 font-medium">{partner?.company}</p>
                         </div>
                       </div>
                       <div className="hidden md:flex flex-col items-end gap-2 text-right">
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-600 uppercase">
                            <MapPin className="w-3 h-3" /> {meeting.location || 'Meeting Pod A1'}
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{meeting.status}</span>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-20 text-center space-y-4">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                   <Clock className="w-10 h-10" />
                 </div>
                 <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">No upcoming meetings today</p>
                 <Link to="/discover" className="mt-4 inline-block text-[10px] font-black text-blue-600 uppercase border-b-2 border-blue-100 pb-1">
                   Start Networking Now
                 </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Insights & Quick Tools */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
              <Award className="w-5 h-5 text-blue-400" /> Strategic Insights
            </h3>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-blue-600/20 rounded-xl flex items-center justify-center border border-white/10">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Market Trend</p>
                  <p className="text-sm font-bold leading-relaxed">Sustainable Fuel is 80% more searched today by Buyers.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-emerald-600/20 rounded-xl flex items-center justify-center border border-white/10">
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Smart Action</p>
                  <p className="text-sm font-bold leading-relaxed">3 OEMs match your focus on Propulsion. Request intro now.</p>
                </div>
              </div>
              
              <button className="w-full py-4 mt-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                Full Synergy Analysis
              </button>
            </div>
          </div>

          {/* Quick Support Tool */}
          <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                 <HelpCircle className="w-6 h-6" />
               </div>
               <div>
                 <h4 className="font-black text-slate-900">Need Assistance?</h4>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Aria is on standby</p>
               </div>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
              "I can help you rewrite your business intent to attract 3x more meeting requests."
            </p>
            <button 
              onClick={() => alert('Opening assistant...')}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
            >
              Optimize Profile
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Discover component ---
const Discover: React.FC<{ 
  myProfile: AttendeeProfile, 
  onBookingRequest: (target: AttendeeProfile, start: string, end: string, notes: string, location: string) => void,
  onAskAria: (msg: string) => void,
  onOpenChat: (partner: AttendeeProfile) => void,
  existingBookings: Booking[],
  eventDates: string[],
  eventHours: { start: number; end: number }
}> = ({ myProfile, onBookingRequest, onAskAria, onOpenChat, existingBookings, eventDates, eventHours }) => {
  const [matchResults, setMatchResults] = useState<Record<string, EvaluateMatchResponse>>({});
  const [loadingEx, setLoadingEx] = useState<Record<string, boolean>>({});
  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeProfile | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleRevealMatch = async (e: React.MouseEvent, target: AttendeeProfile) => {
    e.stopPropagation();
    if (matchResults[target.id]) return;
    setLoadingEx(prev => ({ ...prev, [target.id]: true }));
    const result = await evaluateMatch(myProfile, target);
    setMatchResults(prev => ({ ...prev, [target.id]: result }));
    setLoadingEx(prev => ({ ...prev, [target.id]: false }));
  };

  const allMatchScores = useMemo(() => {
    const scores: Record<string, number> = {};
    MOCK_ATTENDEES.forEach(a => {
      if (a.id === myProfile.id) return;
      let score = 0;
      const industryMatch = a.industries.some(i => myProfile.industries.includes(i));
      const interestMatch = a.interests.some(i => myProfile.interests.includes(i));
      if (industryMatch) score += 0.5;
      if (interestMatch) score += 0.3;
      const myWords = myProfile.intent.toLowerCase().split(' ');
      const targetWords = a.intent.toLowerCase().split(' ');
      const commonWords = myWords.filter(w => targetWords.includes(w) && w.length > 3);
      score += commonWords.length * 0.1;
      scores[a.id] = Math.min(score, 1.0);
    });
    return scores;
  }, [myProfile]);

  const filteredAttendees = useMemo(() => {
    return MOCK_ATTENDEES
      .filter(a => a.id !== myProfile.id)
      .filter(a => {
        const matchesSearch = searchTerm === '' || 
          a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          a.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
          a.role_title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesIndustry = selectedIndustry === '' || a.industries.includes(selectedIndustry);
        const matchesType = selectedType === '' || a.attendee_type === selectedType;
        return matchesSearch && matchesIndustry && matchesType;
      })
      .sort((a, b) => (allMatchScores[b.id] || 0) - (allMatchScores[a.id] || 0));
  }, [searchTerm, selectedIndustry, selectedType, allMatchScores, myProfile]);

  return (
    <div className="space-y-12 pb-24">
      <AttendeeDetailModal 
        isOpen={!!selectedAttendee} 
        attendee={selectedAttendee} 
        onClose={() => setSelectedAttendee(null)}
        onBookingRequest={onBookingRequest}
        onAskAria={onAskAria}
        onOpenChat={onOpenChat}
        existingBookings={existingBookings}
        eventDates={eventDates}
        eventHours={eventHours}
      />
      
      <section className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Discover Matches</h1>
            <p className="text-slate-500 font-medium">AI-curated business opportunities based on your synergy profile.</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Matchmaking Engine ON</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_ATTENDEES.slice(0, 3).filter(a => a.id !== myProfile.id).map(attendee => {
            const matchData = matchResults[attendee.id];
            return (
              <div key={attendee.id} onClick={() => setSelectedAttendee(attendee)} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500 cursor-pointer group">
                <div className="p-8 pb-4 flex-1">
                  <div className="flex items-start gap-4 mb-6">
                    <img src={attendee.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(attendee.name)}&background=random`} className="w-16 h-16 rounded-2xl object-cover border border-slate-50 shadow-md group-hover:scale-110 transition-transform" />
                    <div className="min-w-0">
                      <h3 className="font-black text-slate-900 truncate text-lg leading-tight">{attendee.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{attendee.role_title}</p>
                      <p className="text-[9px] text-blue-600 font-black mt-1">{attendee.company}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {attendee.industries.slice(0, 2).map(ind => (
                        <span key={ind} className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[8px] font-black uppercase border border-slate-100">{ind}</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium line-clamp-2 italic">"{attendee.intent}"</p>
                  </div>
                  {matchData ? (
                    <div className="space-y-4 animate-in fade-in duration-500 border-t border-slate-50 pt-4">
                      <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                         <span className="text-[10px] font-black text-blue-600 uppercase">Match Score</span>
                         <span className="text-xs font-black text-blue-900">{Math.round(matchData.score * 100)}%</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-bold leading-relaxed">"{matchData.why_match}"</p>
                    </div>
                  ) : (
                    <button 
                      onClick={(e) => handleRevealMatch(e, attendee)}
                      disabled={loadingEx[attendee.id]}
                      className="w-full py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 border border-slate-100 disabled:opacity-50 mt-auto"
                    >
                      {loadingEx[attendee.id] ? "Analyzing..." : <><Sparkles className="w-4 h-4" /> Evaluate Synergy</>}
                    </button>
                  )}
                </div>
                <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedAttendee(attendee); }} className="flex-1 py-3.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">View Schedule</button>
                  <button onClick={(e) => { e.stopPropagation(); onOpenChat(attendee); }} className="p-3.5 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:bg-slate-50"><MessageCircle className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Master Participant List</h2>
            <p className="text-sm text-slate-500 font-medium">Browse and search all attendees. Sorted by strategic alignment.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search name, company..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-medium focus:ring-4 focus:ring-blue-50 outline-none transition-all" />
            </div>
            <select value={selectedIndustry} onChange={(e) => setSelectedIndustry(e.target.value)} className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-50 transition-all">
              <option value="">All Industries</option>
              {INDUSTRY_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-50 transition-all">
              <option value="">All Types</option>
              {Object.values(AttendeeType).map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
        </header>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Participant</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry Focus</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAttendees.length > 0 ? filteredAttendees.map(attendee => {
                const score = allMatchScores[attendee.id] || 0;
                return (
                  <tr key={attendee.id} onClick={() => setSelectedAttendee(attendee)} className="group hover:bg-slate-50/30 transition-all cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={attendee.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(attendee.name)}&background=random`} className="w-10 h-10 rounded-xl bg-slate-100 shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <p className="font-black text-slate-900 text-sm leading-tight">{attendee.name}</p>
                          <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{attendee.attendee_type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5"><p className="text-sm font-bold text-slate-700">{attendee.company}</p></td>
                    <td className="px-8 py-5"><p className="text-xs font-medium text-slate-400 truncate max-w-[150px]">{attendee.role_title}</p></td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-1">
                        {attendee.industries.slice(0, 2).map(i => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[9px] font-bold">{i}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center relative">
                          <svg className="w-full h-full -rotate-90">
                            <circle cx="20" cy="20" r="18" fill="transparent" stroke="#eff6ff" strokeWidth="2" />
                            <circle cx="20" cy="20" r="18" fill="transparent" stroke="#3b82f6" strokeWidth="2" strokeDasharray={113} strokeDashoffset={113 - (113 * score)} strokeLinecap="round" />
                          </svg>
                          <span className="absolute text-[8px] font-black text-blue-600">{Math.round(score * 100)}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); onOpenChat(attendee); }} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><MessageCircle className="w-4 h-4" /></button>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto"><Filter className="w-8 h-8 text-slate-200" /></div>
                      <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No participants found matching your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// --- Profile View ---
const ProfileView: React.FC<{ profile: AttendeeProfile, onUpdate: (p: AttendeeProfile) => void }> = ({ profile, onUpdate }) => {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantMsg, setAssistantMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<AttendeeProfile>({ ...profile });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setEditedProfile({ ...profile }); }, [profile]);

  const openAssistant = (msg: string) => { setAssistantMsg(msg); setAssistantOpen(true); };
  const handleManualChange = (field: keyof AttendeeProfile, value: any) => { setEditedProfile(prev => ({ ...prev, [field]: value })); };
  const handleSave = () => { onUpdate(editedProfile); setIsEditing(false); };
  const handleCancel = () => { setEditedProfile({ ...profile }); setIsEditing(false); };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      handleManualChange('avatar_url', base64String);
    };
    reader.readAsDataURL(file);
  };

  const toggleMultiSelect = (field: 'industries' | 'interests', value: string) => {
    const current = editedProfile[field] as string[];
    if (current.includes(value)) { handleManualChange(field, current.filter(i => i !== value)); }
    else { handleManualChange(field, [...current, value]); }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-500 pb-20">
      <AriaProfileAssistant isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} initialMessage={assistantMsg} />
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isEditing ? 'Editing Profile' : 'Your Profile'}</h1>
          <p className="text-slate-500 font-medium">Manage how others see you at the Airshow.</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"><Edit3 className="w-4 h-4" /> Edit Profile</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancel} className="px-5 py-2.5 bg-white text-slate-400 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"><Save className="w-4 h-4" /> Save Changes</button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-slate-50">
              <div className="relative group/avatar">
                <div 
                  onClick={() => isEditing && fileInputRef.current?.click()}
                  className={`w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-4xl border border-slate-100 shadow-inner overflow-hidden transition-all ${isEditing ? 'cursor-pointer hover:ring-4 hover:ring-blue-100' : ''}`}
                >
                  {editedProfile.avatar_url ? (
                    <img src={editedProfile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    editedProfile.name.charAt(0)
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <input type="text" value={editedProfile.name} onChange={(e) => handleManualChange('name', e.target.value)} className="w-full text-xl font-black text-slate-900 bg-slate-50 p-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100" placeholder="Full Name" />
                    <div className="flex gap-2">
                      <input type="text" value={editedProfile.role_title} onChange={(e) => handleManualChange('role_title', e.target.value)} className="flex-1 text-xs font-bold text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-200 outline-none" placeholder="Role Title" />
                      <input type="text" value={editedProfile.company} onChange={(e) => handleManualChange('company', e.target.value)} className="flex-1 text-xs font-bold text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-200 outline-none" placeholder="Company Name" />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-black text-slate-900 truncate leading-tight">{profile.name}</h2>
                    <p className="text-slate-400 font-bold text-sm truncate">{profile.role_title} @ {profile.company}</p>
                  </>
                )}
                <div className="mt-3 flex gap-2">
                  {isEditing ? (
                    <select value={editedProfile.attendee_type} onChange={(e) => handleManualChange('attendee_type', e.target.value)} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100 outline-none">
                      {Object.values(AttendeeType).map(type => (<option key={type} value={type}>{type.toUpperCase()}</option>))}
                    </select>
                  ) : (<span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100 tracking-wider">{profile.attendee_type}</span>)}
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-lg border border-green-100 tracking-wider">Verified</span>
                  {profile.isAdmin && <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg border border-slate-900 tracking-wider">Admin</span>}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Business Intent</label>
                    {!isEditing && <button onClick={() => openAssistant("I'd like to help you rewrite your Business Intent. What are you primarily looking to achieve at the Singapore Airshow?")} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Optimize with Aria</button>}
                  </div>
                  {isEditing ? (
                    <textarea value={editedProfile.intent} onChange={(e) => handleManualChange('intent', e.target.value)} className="w-full text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 min-h-[100px]" placeholder="Describe your goals at the event..." />
                  ) : (
                    <p className="text-sm text-slate-700 font-medium leading-relaxed bg-slate-50/50 p-5 rounded-2xl border border-slate-100 italic relative">
                      <Sparkles className="w-4 h-4 text-blue-400 absolute -top-2 -right-2 bg-white rounded-full p-0.5" />"{profile.intent}"
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Event Location (Meet me at)</label>
                  {isEditing ? (
                    <input type="text" value={editedProfile.meet_me_location || ''} onChange={(e) => handleManualChange('meet_me_location', e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 text-sm font-bold text-slate-700" placeholder="e.g. SIA Pavilion, Booth A12" />
                  ) : (
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-bold bg-slate-50/50 p-5 rounded-2xl border border-slate-100"><MapPin className="w-5 h-5 text-orange-500" /> {profile.meet_me_location || 'Not set'}</div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Meeting Preference</label>
                {isEditing ? (
                  <select value={editedProfile.preferred_meeting_duration} onChange={(e) => handleManualChange('preferred_meeting_duration', parseInt(e.target.value))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm text-slate-700">
                    <option value={15}>15 Minute Sessions</option>
                    <option value={30}>30 Minute Sessions</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-3 text-sm text-slate-700 font-bold bg-slate-50/50 p-5 rounded-2xl border border-slate-100"><Clock className="w-5 h-5 text-blue-500" /> {profile.preferred_meeting_duration} Minute Sessions</div>
                )}
              </div>
            </div>

            <div className="pt-2 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block">Primary Industries</label>
                  {!isEditing && <button onClick={() => openAssistant("Could you explain which industries I should focus on to attract the best partners?")} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ask Aria to Explain</button>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {isEditing ? (
                    INDUSTRY_OPTIONS.map(ind => (
                      <button 
                        key={ind}
                        onClick={() => toggleMultiSelect('industries', ind)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                          editedProfile.industries.includes(ind) 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {ind}
                      </button>
                    ))
                  ) : (
                    profile.industries.map(ind => (
                      <span key={ind} className="px-4 py-2 bg-white text-slate-600 rounded-xl text-xs font-bold border border-slate-100 shadow-sm">{ind}</span>
                    ))
                  )}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 block">Interests & Focus Areas</label>
                <div className="flex flex-wrap gap-2">
                  {isEditing ? (
                    INTEREST_OPTIONS.map(int => (
                      <button 
                        key={int}
                        onClick={() => toggleMultiSelect('interests', int)}
                        className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                          editedProfile.interests.includes(int) 
                            ? 'bg-blue-600 text-white border-blue-700 shadow-md' 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {int}
                      </button>
                    ))
                  ) : (
                    profile.interests.map(int => (
                      <span key={int} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black border border-blue-700 shadow-md shadow-blue-100">{int}</span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-slate-800">
            <Sparkles className="w-16 h-16 text-blue-400/10 absolute -right-4 -top-4 rotate-12 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <h3 className="font-black text-xl mb-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"><MessageSquare className="w-5 h-5" /></div> Aria Assistant
              </h3>
              <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6 uppercase tracking-wider">Support for profile optimization & meeting requests.</p>
              <div className="space-y-3">
                <button onClick={() => openAssistant("I'd like to refine my business goals for this event.")} className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 border border-white/10 group/btn"><Target className="w-4 h-4 text-blue-400 group-hover/btn:scale-110 transition-transform" /> Optimize Goals</button>
                <button onClick={() => openAssistant("How do I best present my company to potential buyers?")} className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 border border-white/10 group/btn"><HelpCircle className="w-4 h-4 text-green-400 group-hover/btn:scale-110 transition-transform" /> Presentation Tips</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Admin Control Panel ---
const AdminView: React.FC<{ 
  bookings: Booking[], 
  attendees: AttendeeProfile[], 
  onCancelBooking: (id: string) => void,
  onImportAttendees: () => void,
  onRegenerateSlots: () => void,
  onExport: (type: 'attendees' | 'meetings') => void,
  isWhatsAppEnabled: boolean,
  onToggleWhatsApp: () => void,
  isFallbackEnabled: boolean,
  onToggleFallback: () => void,
  isMatchmakingEnabled: boolean,
  onToggleMatchmaking: () => void,
  eventSettings: { dates: string[], hours: { start: number, end: number }, duration: number },
  onUpdateEventSettings: (settings: any) => void
}> = ({ 
  bookings, attendees, onCancelBooking, onImportAttendees, onRegenerateSlots, onExport,
  isWhatsAppEnabled, onToggleWhatsApp, isFallbackEnabled, onToggleFallback, isMatchmakingEnabled, onToggleMatchmaking,
  eventSettings, onUpdateEventSettings
}) => {
  const [tab, setTab] = useState<'attendees' | 'meetings' | 'config' | 'reports'>('attendees');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeProfile | null>(null);

  const filteredAttendees = attendees.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            Admin Hub
          </h1>
          <p className="text-slate-500 font-medium">Platform operations & management terminal.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
          {(['attendees', 'meetings', 'config', 'reports'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* Attendee Details Modal (Read-Only) */}
      {selectedAttendee && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
            <button onClick={() => setSelectedAttendee(null)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-6">
              <img src={selectedAttendee.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAttendee.name)}`} className="w-20 h-20 rounded-3xl bg-slate-100 border border-slate-200" />
              <div>
                <h3 className="text-xl font-black text-slate-900">{selectedAttendee.name}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase">{selectedAttendee.company}</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase">{selectedAttendee.attendee_type}</span>
                  <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase">Verified</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 block">Business Intent</label>
                <p className="text-sm text-slate-600 italic">"{selectedAttendee.intent}"</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 block">Industries</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedAttendee.industries.map(i => <span key={i} className="px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded text-[9px] font-bold">{i}</span>)}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 block">Interests</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedAttendee.interests.map(i => <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded text-[9px] font-bold">{i}</span>)}
                  </div>
                </div>
              </div>
              <div className="pt-4 flex gap-2">
                <button className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200">Flag for Review</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        {tab === 'attendees' && (
          <div className="p-0 animate-in slide-in-from-right-4 duration-300">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4 bg-slate-50/30">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search attendees by name or company..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-medium text-sm transition-all" />
              </div>
              <button onClick={onImportAttendees} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3"><FileUp className="w-5 h-5" /> Import CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/20 border-b border-slate-50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-widest">Profile</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-widest">Organization</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredAttendees.map(a => (
                    <tr key={a.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img src={a.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}`} className="w-10 h-10 rounded-xl" />
                          <div><p className="font-black text-slate-900 text-sm">{a.name}</p><p className="text-[10px] font-bold text-slate-400 uppercase">{a.role_title}</p></div>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-bold text-slate-700">{a.company}</td>
                      <td className="px-8 py-5"><span className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase">{a.attendee_type}</span></td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setSelectedAttendee(a)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye className="w-5 h-5" /></button>
                          <button className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"><Flag className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'meetings' && (
          <div className="p-0 animate-in slide-in-from-right-4 duration-300">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30"><h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Meeting Oversight</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/20 border-b border-slate-50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-widest">Meeting</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-widest">Time & Date</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.map(b => {
                    const from = attendees.find(a => a.id === b.fromId);
                    const to = attendees.find(a => a.id === b.toId);
                    const start = new Date(b.startTime);
                    return (
                      <tr key={b.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="text-xs font-bold text-slate-700">{from?.name} <span className="text-slate-300 px-1">→</span> {to?.name}</div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-[10px] font-bold text-slate-500 uppercase">
                            {start.toLocaleDateString([], { month: 'short', day: 'numeric' })} @ {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
                            b.status === BookingStatus.ACCEPTED ? 'bg-green-50 text-green-600' :
                            b.status === BookingStatus.REQUESTED ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                          }`}>{b.status}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button onClick={() => onCancelBooking(b.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Emergency Cancel"><Trash2 className="w-5 h-5" /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'config' && (
          <div className="p-8 space-y-12 animate-in slide-in-from-right-4 duration-300">
            <section className="space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                <CalendarClock className="w-5 h-5 text-blue-600" /> Meeting Window Control
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Daily Start Time</label>
                  <input type="time" value={`${eventSettings.hours.start.toString().padStart(2, '0')}:00`} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Daily End Time</label>
                  <input type="time" value={`${eventSettings.hours.end.toString().padStart(2, '0')}:00`} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Global Slot Duration</label>
                  <select value={eventSettings.duration} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-sm">
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                  </select>
                </div>
              </div>
              <button onClick={onRegenerateSlots} className="w-full py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5" /> Regenerate Slots (DANGER)
              </button>
            </section>

            <section className="space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-blue-600" /> AI Safety & Ops Toggles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "WhatsApp Chatbot", sub: "Toggle AI profiling via text", state: isWhatsAppEnabled, fn: onToggleWhatsApp },
                  { label: "Fallback Form Profiling", sub: "Use manual form if AI is off", state: isFallbackEnabled, fn: onToggleFallback },
                  { label: "AI Matchmaking Engine", sub: "Enable automated synergy scores", state: isMatchmakingEnabled, fn: onToggleMatchmaking },
                ].map((item, idx) => (
                  <button key={item.label} onClick={item.fn} className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all group">
                    <div className="text-left">
                      <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-1">{item.label}</p>
                      <p className="text-[10px] font-bold text-slate-400">{item.sub}</p>
                    </div>
                    {item.state ? <ToggleRight className="w-8 h-8 text-blue-600" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === 'reports' && (
          <div className="p-12 text-center space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200"><Table className="w-12 h-12" /></div>
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-black text-slate-900 leading-tight">Post-Event Export Terminal</h2>
              <p className="text-sm text-slate-400 font-medium mt-3 leading-relaxed">Download complete datasets for external CRM analysis or event reporting.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button onClick={() => onExport('attendees')} className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-blue-600 transition-all group">
                <Download className="w-10 h-10 text-slate-200 group-hover:text-blue-600 mx-auto mb-4" />
                <p className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em]">Export Attendees</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2">CSV formatted list of registered profiles</p>
              </button>
              <button onClick={() => onExport('meetings')} className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-blue-600 transition-all group">
                <BarChart3 className="w-10 h-10 text-slate-200 group-hover:text-blue-600 mx-auto mb-4" />
                <p className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em]">Export Meeting Report</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2">Historical report of all business engagement</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Conflict Modal component ---
const ConflictModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] max-w-sm w-full p-10 text-center shadow-2xl space-y-8 border border-white">
        <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto border border-orange-200">
          <AlertCircle className="w-10 h-10 text-orange-500" />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">Slot Unavailable</h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">I apologize, but that specific slot was just booked by another participant.</p>
        </div>
        <button onClick={onClose} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all active:scale-95">Pick Another Slot</button>
      </div>
    </div>
  );
};

// --- Main Layout ---
const AppContent: React.FC = () => {
  const [view, setView] = useState<'login' | 'welcome' | 'chat' | 'app'>('login');
  const [myProfile, setMyProfile] = useState<AttendeeProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInitialMsg, setAssistantInitialMsg] = useState<string | undefined>();
  
  const [privateChatOpen, setPrivateChatOpen] = useState(false);
  const [chatPartner, setChatPartner] = useState<AttendeeProfile | null>(null);
  const [recentChatIds, setRecentChatIds] = useState<string[]>(['a1', 'a2']); 

  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeProfile | null>(null);

  // Admin / Ops State
  const [isWhatsAppBotEnabled, setIsWhatsAppBotEnabled] = useState(true);
  const [isFallbackFormEnabled, setIsFallbackFormEnabled] = useState(false);
  const [isMatchmakingEnabled, setIsMatchmakingEnabled] = useState(true);
  const [eventDates, setEventDates] = useState<string[]>(EVENT_DATES);
  const [eventHours, setEventHours] = useState({ start: 9, end: 17 });
  const [slotDuration, setSlotDuration] = useState(30);

  const navigate = useNavigate();
  const location = useLocation();

  const handleUpdateProfile = (updated: AttendeeProfile) => { setMyProfile(updated); };

  const handleBookingRequest = (target: AttendeeProfile, startTime: string, endTime: string, notes: string, location: string) => {
    if (!myProfile) return;
    const isTaken = bookings.some(b => b.status !== BookingStatus.REJECTED && b.status !== BookingStatus.CANCELLED && b.startTime === startTime);
    if (isTaken) { setShowConflictModal(true); return; }
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      fromId: myProfile.id, toId: target.id, startTime, endTime, status: BookingStatus.REQUESTED,
      notes: notes || `Requested a ${target.preferred_meeting_duration}-min slot to discuss strategic collaboration.`,
      location, createdAt: new Date().toISOString()
    };
    setBookings(prev => [...prev, newBooking]);
    alert(`Meeting request sent for ${new Date(startTime).toLocaleString()} at ${location}.`);
  };

  const handleRespondToBooking = (bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    if (status === BookingStatus.ACCEPTED) { alert("Meeting approved successfully."); }
    else { alert("Meeting request declined."); }
  };

  const handleReschedule = (bookingId: string, newStart: string, newEnd: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, startTime: newStart, endTime: newEnd, status: BookingStatus.RESCHEDULE_PROPOSED } : b));
    alert("New meeting slot proposed to the sender.");
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm("Admin: Are you sure you want to cancel this meeting? (Emergency only)")) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: BookingStatus.CANCELLED } : b));
    }
  };

  const handleLoginSuccess = (userData?: { name: string, email: string }) => {
    if (userData) {
      // In a real app, we'd save this to a DB. For this demo, we'll set a basic profile shell
      // that the AI onboarding will then flesh out.
      const newProfile: AttendeeProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email, // Assume email added to type
        attendee_type: AttendeeType.BUYER,
        company: '',
        role_title: '',
        industries: [],
        interests: [],
        intent: '',
        preferred_meeting_duration: 30,
        isAdmin: false
      };
      setMyProfile(newProfile);
    } else {
      setMyProfile(MOCK_ATTENDEES[2]); 
    }
    setView('welcome');
  };

  const simulateLogin = () => { 
    if (!myProfile) setMyProfile(MOCK_ATTENDEES[2]); 
    setView('app'); 
  };
  
  const openAriaWithContext = (msg: string) => { setAssistantInitialMsg(msg); setAssistantOpen(true); };
  const handleOpenPrivateChat = (partner: AttendeeProfile) => {
    if (!recentChatIds.includes(partner.id)) { setRecentChatIds(prev => [partner.id, ...prev]); }
    setChatPartner(partner); setPrivateChatOpen(true);
  };

  if (view === 'login') {
    return <LoginView onLogin={handleLoginSuccess} />;
  }

  if (view === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
        <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-12 text-center space-y-12">
          <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl mx-auto shadow-xl">A</div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">Aria, your event assistant</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Singapore Airshow 2025</p>
          </div>
          <div className="space-y-4">
            <button onClick={() => setView(isWhatsAppBotEnabled ? 'chat' : 'app')} className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase shadow-xl hover:bg-slate-800 transition-all">Start AI Onboarding</button>
            <button onClick={simulateLogin} className="w-full py-6 bg-white text-slate-900 border-2 border-slate-100 rounded-3xl font-black text-[10px] uppercase hover:border-slate-900 transition-all">My Schedule</button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'chat' && !myProfile?.company) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
        <div className="w-full max-w-lg">
          <WhatsAppSimulation 
            onComplete={(p) => { setMyProfile({ ...myProfile, ...p }); setView('app'); }} 
            onDecline={() => setView('welcome')} 
          />
        </div>
      </div>
    );
  }

  const NavItem = ({ to, icon: Icon, label, badge }: { to: string, icon: any, label: string, badge?: number }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-sm uppercase tracking-widest relative ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-blue-50 hover:text-blue-600'}`}>
        <Icon className="w-6 h-6" />{label}
        {badge && badge > 0 ? (<span className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full border-2 border-white text-[10px] ${isActive ? 'bg-white text-blue-600' : 'bg-orange-50 text-orange-500'}`}>{badge}</span>) : null}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <ConflictModal isOpen={showConflictModal} onClose={() => setShowConflictModal(false)} />
      <AriaProfileAssistant isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} initialMessage={assistantInitialMsg} />
      <PrivateChatModal isOpen={privateChatOpen} onClose={() => setPrivateChatOpen(false)} partner={chatPartner} />
      <AttendeeDetailModal isOpen={!!selectedAttendee} attendee={selectedAttendee} onClose={() => setSelectedAttendee(null)} onBookingRequest={handleBookingRequest} onAskAria={openAriaWithContext} onOpenChat={handleOpenPrivateChat} existingBookings={bookings} eventDates={eventDates} eventHours={eventHours} />
      
      <aside className={`fixed lg:static inset-y-0 left-0 w-80 bg-white border-r border-slate-100 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-500`}>
        <div className="p-10 border-b border-slate-50 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">A</div>
          <span className="font-black text-slate-900 text-lg">Aria Copilot</span>
        </div>
        <nav className="p-8 space-y-2">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/discover" icon={Users} label="Discover" />
          <NavItem to="/schedule" icon={Calendar} label="Schedule" />
          <NavItem to="/connections" icon={Link2} label="Connections" />
          <NavItem to="/messages" icon={MessageCircle} label="Messages" />
          <NavItem to="/inbox" icon={Inbox} label="Requests" badge={bookings.filter(b => b.toId === myProfile?.id && b.status === BookingStatus.REQUESTED).length} />
          <NavItem to="/profile" icon={UserCircle} label="Profile" />
          {myProfile?.isAdmin && <NavItem to="/admin" icon={Settings} label="Admin" />}
        </nav>
        <div className="mt-auto p-8">
          <button onClick={() => openAriaWithContext("Hello! I need some advice on my event scheduling and invitations.")} className="w-full flex items-center gap-3 p-4 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-slate-800 transition-all group">
            <CalendarClock className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform" />
            <div className="text-left"><p className="text-[10px] font-black uppercase tracking-widest">Aria Helper</p><p className="text-[9px] text-slate-400 font-bold uppercase">Scheduling & Notes</p></div>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-50 p-6 flex items-center justify-between z-30 lg:px-12">
          <button className="lg:hidden p-3 bg-slate-50 rounded-2xl" onClick={() => setSidebarOpen(true)}><Menu className="w-6 h-6" /></button>
          <div className="flex items-center gap-8">
            <button onClick={() => setAssistantOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"><Sparkles className="w-4 h-4 text-blue-600" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Assistant</span></button>
            <Bell className="w-6 h-6 text-slate-300" />
            <button onClick={() => window.location.reload()} className="text-[10px] font-black uppercase text-red-500 bg-red-50 px-5 py-2 rounded-xl">Logout</button>
          </div>
        </header>
        <div className="p-6 sm:p-10 lg:p-16 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard profile={myProfile || MOCK_ATTENDEES[0]} bookings={bookings} />} />
            <Route path="/discover" element={<Discover myProfile={myProfile || MOCK_ATTENDEES[0]} onBookingRequest={handleBookingRequest} onAskAria={openAriaWithContext} onOpenChat={handleOpenPrivateChat} existingBookings={bookings} eventDates={eventDates} eventHours={eventHours} />} />
            <Route path="/schedule" element={<ScheduleView bookings={bookings} myProfile={myProfile || MOCK_ATTENDEES[0]} onOpenAttendee={setSelectedAttendee} eventDates={eventDates} eventHours={eventHours} />} />
            <Route path="/connections" element={<ConnectionsView profile={myProfile || MOCK_ATTENDEES[0]} bookings={bookings} onOpenChat={handleOpenPrivateChat} />} />
            <Route path="/messages" element={<MessagesView recentChatIds={recentChatIds} onOpenChat={handleOpenPrivateChat} />} />
            <Route path="/inbox" element={<InboxView profile={myProfile || MOCK_ATTENDEES[0]} bookings={bookings} onRespond={handleRespondToBooking} onAskAria={openAriaWithContext} onReschedule={handleReschedule} eventDates={eventDates} />} />
            <Route path="/profile" element={<ProfileView profile={myProfile || MOCK_ATTENDEES[0]} onUpdate={handleUpdateProfile} />} />
            <Route path="/admin" element={
              myProfile?.isAdmin ? (
                <AdminView 
                  bookings={bookings} 
                  attendees={MOCK_ATTENDEES} 
                  onCancelBooking={handleCancelBooking}
                  onImportAttendees={() => alert("Simulating import from CSV... 12 profiles added.")}
                  onRegenerateSlots={() => {
                    if (window.confirm("This will refresh the available slot logic based on current window settings. Existing meetings will NOT be deleted but visual slot mapping might shift. Continue?")) {
                      alert("Slots regenerated.");
                    }
                  }}
                  onExport={(type) => alert(`Generating ${type} report... CSV download starting.`)}
                  isWhatsAppEnabled={isWhatsAppBotEnabled}
                  onToggleWhatsApp={() => setIsWhatsAppBotEnabled(!isWhatsAppBotEnabled)}
                  isFallbackEnabled={isFallbackFormEnabled}
                  onToggleFallback={() => setIsFallbackFormEnabled(!isFallbackFormEnabled)}
                  isMatchmakingEnabled={isMatchmakingEnabled}
                  onToggleMatchmaking={() => setIsMatchmakingEnabled(!isMatchmakingEnabled)}
                  eventSettings={{ dates: eventDates, hours: eventHours, duration: slotDuration }}
                  onUpdateEventSettings={(s) => { setEventHours(s.hours); setSlotDuration(s.duration); }}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
