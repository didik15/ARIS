import React, { useState } from 'react';
import { Bot, Send, Sparkles, Copy, Check, MessageSquare, AlertCircle, RefreshCw, User, Building } from 'lucide-react';
import { ImmigrationDocument } from '../types';

interface AiAssistantProps {
  documents: ImmigrationDocument[];
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ documents }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am the **A.R.I.S. AI Assistant** (Immigration Consultancy Assistant).\n\nI can help you draft customized reminder messages, answer questions regarding Indonesian immigration regulations (Passports, KITAS, KITAP, VOA, Overstay, PMA rules), or compose formal sponsor letters for corporate clients. How can I assist you today?',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const contextText = documents
    .map(d => `- ${d.clientName} (${d.docType}, Expired: ${d.expiryDate}, Company: ${d.companyName || 'Personal'})`)
    .slice(0, 10)
    .join('\n');

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newMsgList = [...messages, { sender: 'user' as const, text: textToSend, time: userTime }];
    setMessages(newMsgList);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: `Client Document List:\n${contextText}`,
        }),
      });

      const data = await res.json();
      const aiTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process AI response');
      }

      setMessages([...newMsgList, { sender: 'ai', text: data.reply, time: aiTime }]);
    } catch (err: any) {
      const aiTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setMessages([
        ...newMsgList,
        {
          sender: 'ai',
          text: `⚠️ Error: ${err.message || 'Failed to connect to Gemini AI server'}. Please ensure GEMINI_API_KEY is configured.`,
          time: aiTime,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const quickPrompts = [
    'Investor KITAS vs Working KITAS renewal rules',
    'Draft formal expiry notice email to PMA Company HR',
    'Indonesian passport express renewal requirements',
    'Overstay fines & calculation for VOA / Tourist visa',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-md shadow-purple-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-purple-100 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span>Immigration Agency AI Assistant</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            A.R.I.S. AI Assistant (Gemini 2.5 Flash)
          </h2>
          <p className="text-xs text-purple-100 max-w-2xl leading-relaxed">
            Ask about Indonesian immigration rules, generate renewal proposal drafts in multiple languages (English, Japanese, Mandarin), or compose formal sponsor letters for PMA companies.
          </p>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[600px]">
        
        {/* Messages History */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-1 max-w-[85%] md:max-w-[75%]">
                <div
                  className={`p-4 rounded-2xl text-xs md:text-sm whitespace-pre-wrap leading-relaxed shadow-xs relative group ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-none'
                  }`}
                >
                  {msg.text}

                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => handleCopy(msg.text, idx)}
                      className="absolute top-2 right-2 p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy Text"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                <div
                  className={`text-[10px] text-slate-400 px-1 ${
                    msg.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs p-2">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-500" />
              <span>A.R.I.S. AI Assistant is thinking and composing response...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-500 shrink-0">Sample Prompts:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 hover:border-purple-400 hover:text-purple-600 whitespace-nowrap transition-colors shrink-0 shadow-2xs"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask about immigration rules, passport/KITAS renewal, or sponsor letters..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1 p-3 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
            />

            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold shadow-md shadow-purple-500/20 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
