'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMoodStore } from '../store/moodStore';
import { AISentimentService } from '../services/aiService';

interface ChatMessage { sender: 'You' | 'Companion'; text: string; }

export default function ChatCompanion() {
  const { setCurrentView } = useMoodStore();
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedStreak = localStorage.getItem('streak');
    const savedDate = localStorage.getItem('lastCheckInDate');
    if (savedStreak) setStreak(Number(savedStreak));
    if (savedDate) setLastCheckInDate(savedDate);
  }, []);

  useEffect(() => {
    localStorage.setItem('streak', String(streak));
    if (lastCheckInDate) localStorage.setItem('lastCheckInDate', lastCheckInDate);
  }, [streak, lastCheckInDate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [chat]);

  const getSupportiveResponse = useMemo(() => (text: string) => {
    const moodLower = text.toLowerCase();
    if (moodLower.includes('sad') || moodLower.includes('depressed') || moodLower.includes('stressed') || moodLower.includes('anxious')) {
      return '💙 I’m sorry you’re feeling this way. You’re not alone. Maybe try a short walk, deep breathing, or writing down your thoughts. Small steps can help.';
    }
    if (moodLower.includes('happy') || moodLower.includes('excited') || moodLower.includes('joy') || moodLower.includes('calm')) {
      return '🎉 That’s wonderful! Take a moment to enjoy this and maybe write down what made today good so you can look back later.';
    }
    if (moodLower.includes('neutral') || moodLower.includes('okay') || moodLower.includes('fine')) {
      return '🌿 Feeling neutral is totally okay. Want to share what’s been on your mind today?';
    }
    return '❤️ Thanks for sharing. Every feeling is valid. Would you like to tell me a little more?';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { sender: 'You', text: trimmed };
    setChat(prev => [...prev, userMsg]);

    // Bot response
    const botText = getSupportiveResponse(trimmed);
    const botMsg: ChatMessage = { sender: 'Companion', text: botText };
    setChat(prev => [...prev, userMsg, botMsg]);

    // Streak (one per day)
    const today = new Date().toDateString();
    if (lastCheckInDate !== today) {
      setStreak(prev => prev + 1);
      setLastCheckInDate(today);
    }

    setInput('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">🌸 Mood Companion</h1>
          <button onClick={()=>setCurrentView('dashboard')} className="text-sm text-gray-500 hover:text-gray-700">Back</button>
        </div>
        <p className="text-center text-gray-500 mb-4">🔥 Current Streak: {streak} day{streak !== 1 ? 's' : ''}</p>

        <div ref={scrollRef} className="flex-1 overflow-y-auto mb-4 space-y-3 p-3 bg-gray-50 rounded-xl shadow-inner max-h-[50vh]">
          {chat.map((msg, i) => (
            <div key={i} className={`p-2 rounded-xl max-w-[80%] ${msg.sender === 'You' ? 'bg-indigo-100 self-end ml-auto text-right' : 'bg-pink-100 self-start mr-auto text-left'}`}>
              <p className="font-semibold">{msg.sender}:</p>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input type="text" placeholder="Type your mood or message..." value={input} onChange={(e)=>setInput(e.target.value)} className="border rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded-xl hover:bg-indigo-600 transition">Send</button>
        </form>
      </div>
    </div>
  );
}
