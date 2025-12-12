import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface AIOperatorProps {
    addLog: (msg: string, level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'AI') => void;
}

export const AIOperator: React.FC<AIOperatorProps> = ({ addLog }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'system',
      content: 'LogicFlow-7 Connected. Waiting for operator command...',
      timestamp: Date.now()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    addLog(`Operator Query: ${input}`, 'INFO');

    try {
        // Filter out system messages for API history
        const history = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content }));
        
        const responseText = await sendMessageToGemini(history, input);
        
        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            content: responseText,
            timestamp: Date.now()
        };
        
        setMessages(prev => [...prev, aiMsg]);
        addLog('AI Response Received', 'AI');
    } catch (err) {
        addLog('AI Communication Protocol Failed', 'ERROR');
    } finally {
        setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 bg-quantum-800 border-b border-quantum-600">
        <div className="flex items-center space-x-2">
            <div className="relative">
                <Bot className="w-5 h-5 text-quantum-400" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-quantum-500 rounded-full animate-pulse shadow-glow-cyan"></div>
            </div>
            <span className="font-semibold text-sm tracking-wide text-slate-200">AI OPERATOR</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">LF-7 CORE</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-quantum-950">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] rounded-lg p-3 text-sm relative border
              ${msg.role === 'user' 
                ? 'bg-quantum-800 border-quantum-600 text-slate-200 rounded-br-none' 
                : msg.role === 'system'
                    ? 'bg-transparent border-transparent text-slate-500 font-mono text-xs w-full text-center italic'
                    : 'bg-quantum-900 border-cyan-900/50 text-cyan-100 rounded-bl-none shadow-glow-cyan'
                }
            `}>
              {msg.role !== 'system' && (
                  <div className="absolute -top-2.5 flex items-center bg-quantum-950 px-1 text-[10px] font-mono text-slate-500 border border-quantum-700 rounded-sm">
                      {msg.role === 'user' ? <User className="w-3 h-3 mr-1" /> : <Sparkles className="w-3 h-3 mr-1 text-quantum-400" />}
                      {msg.role === 'user' ? 'OP-01' : 'LF-7'}
                  </div>
              )}
              <div className="mt-1 leading-relaxed whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-quantum-900 border border-cyan-900/50 rounded-lg rounded-bl-none p-3 flex items-center space-x-1">
               <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-0"></div>
               <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-100"></div>
               <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-quantum-800 border-t border-quantum-600">
        <div className="flex items-center space-x-2 bg-quantum-950 border border-quantum-600 rounded-md p-1 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent border-none text-slate-300 text-sm px-2 py-1 focus:ring-0 placeholder-slate-600 font-mono"
            placeholder="Input command sequence..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-1.5 rounded bg-quantum-700 hover:bg-quantum-600 disabled:opacity-50 text-cyan-400 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};