import React, { useState, useRef, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Flame,
  Sparkles,
  Zap,
  Shield,
  Loader2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  mode?: 'STANDARD' | 'GOGGINS';
}

export const AICoach: React.FC = () => {
  const { hunter, challenges, settings } = useSystem();

  const [mode, setMode] = useState<'STANDARD' | 'GOGGINS'>('GOGGINS');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `[SYSTEM AI PROTOCOL INITIALIZED]\nHunter ${hunter.name}, ${hunter.rank}-Rank. I don't give a damn about how tired you feel. The System recorded your biometrics. What are you looking for—an excuse, or a protocol to take souls? State your inquiry.`,
      timestamp: 'SYSTEM TIME',
      mode: 'GOGGINS',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [redFlash, setRedFlash] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeChallenge = challenges.find((c) => c.isAccepted && !c.isCompleted);

  const promptChips = [
    'I want to quit today.',
    'Plan my workout protocol.',
    'Brutal diet advice for fat loss.',
    'How do I build mental callus?',
    'Give me a Goggins micro-challenge right now.',
    'I am feeling sore and injured.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Call to Darkness Trigger
  const handleCallToDarkness = () => {
    setMode('GOGGINS');
    setRedFlash(true);
    if (settings.sfxSound) spaceAudio.playCallToDarkness();
    setTimeout(() => setRedFlash(false), 800);

    handleSendMessage('CALL TO DARKNESS: I feel weak, lazy, and ready to quit. Hit me with everything you have.');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    if (settings.sfxSound) spaceAudio.playTap();

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          mode,
          callToDarkness: query.includes('CALL TO DARKNESS'),
          hunterContext: {
            name: hunter.name,
            rank: `${hunter.rank}-Rank`,
            level: hunter.level,
            classType: hunter.hunterClass,
            goal: hunter.primaryGoals.join(', '),
            activeChallenge: activeChallenge ? `${activeChallenge.title} (Day ${activeChallenge.currentDay})` : 'None',
          },
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!res.ok) {
        throw new Error('AI System disrupted');
      }

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: data.mode,
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (settings.sfxSound) spaceAudio.playQuestComplete();
    } catch (err: any) {
      console.warn(err);
      // Autonomous fallback response
      const fallbackText = mode === 'GOGGINS'
        ? `[GOGGINS PROTOCOL - AUTONOMOUS INTERVENTION]\nNobody is coming to save your weak ass, Hunter ${hunter.name}. You think Sung Jinwoo begged for an easy workout? Get your feet on the floor. Drop and give the floor 50 chest-to-deck pushups right now. Don't think. EXECUTE.`
        : `[SYSTEM PROTOCOL - AUTONOMOUS DIRECTIVE]\nHunter ${hunter.name}, telemetry indicates mental hesitation. Prioritize physical execution over emotional reflection. Increase progressive load by 10% on your next set.`;

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          role: 'model',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Web Speech API Voice Input
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        if (settings.sfxSound) spaceAudio.playTap();
      };

      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn(e);
      setIsListening(false);
    }
  };

  const isGoggins = mode === 'GOGGINS';

  return (
    <div
      className={`max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-4 transition-colors ${
        redFlash ? 'bg-red-950/40' : ''
      }`}
    >
      {/* HEADER & MODE TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A2548]">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isGoggins ? 'bg-red-500 animate-ping' : 'bg-[#00E5FF] animate-ping'
              }`}
            />
            <span
              className={`font-mono-system text-xs uppercase tracking-widest font-bold ${
                isGoggins ? 'text-red-400' : 'text-[#00E5FF]'
              }`}
            >
              {isGoggins ? 'GOGGINS PROTOCOL ACTIVE' : 'STANDARD SYSTEM AI ACTIVE'}
            </span>
          </div>
          <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white mt-0.5 tracking-wider">
            SYSTEM AI COACH
          </h1>
        </div>

        {/* Mode Toggle & Call to Darkness */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 rounded-xl bg-[#080B1E] border border-[#1A2548]">
            <button
              onClick={() => {
                if (settings.sfxSound) spaceAudio.playTap();
                setMode('STANDARD');
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                !isGoggins
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              STANDARD
            </button>
            <button
              onClick={() => {
                if (settings.sfxSound) spaceAudio.playTap();
                setMode('GOGGINS');
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                isGoggins
                  ? 'bg-red-500/20 text-red-400 border border-red-500/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              GOGGINS
            </button>
          </div>

          {/* CALL TO DARKNESS BUTTON */}
          <button
            onClick={handleCallToDarkness}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-orbitron font-black text-xs tracking-wider flex items-center gap-1.5 glow-red hover:brightness-110 active:scale-95 transition-all shadow-md shadow-red-950 animate-pulse"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>CALL TO DARKNESS</span>
          </button>
        </div>
      </div>

      {/* HUNTER CONTEXT TELEMETRY BAR */}
      <div className="p-3 rounded-xl border border-[#1A2548] bg-[#07091B]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#8899BB]">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#00E5FF] shrink-0" />
          <span>
            HUNTER TELEMETRY: {hunter.name} ({hunter.rank}-Rank LV.{hunter.level} {hunter.hunterClass})
          </span>
        </div>
        {activeChallenge && (
          <span className="text-amber-400">
            ACTIVE TRIAL: {activeChallenge.title} (Day {activeChallenge.currentDay})
          </span>
        )}
      </div>

      {/* PROMPT CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="px-3 py-1.5 rounded-lg border border-[#1A2548] bg-[#090D22] hover:border-[#00E5FF] hover:text-[#00E5FF] text-xs font-rajdhani font-semibold text-slate-300 whitespace-nowrap transition-colors shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* CHAT MESSAGES LOG */}
      <div className="h-[460px] rounded-2xl border border-[#1A2548] bg-[#050716]/90 backdrop-blur-md p-4 sm:p-5 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          const isMsgGoggins = m.mode === 'GOGGINS';

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 transition-all ${
                  isUser
                    ? 'bg-[#0E1B4D] border border-[#2A3E8A] text-white rounded-br-xs'
                    : isMsgGoggins
                    ? 'bg-[#15070A] border border-red-500/50 text-red-100 rounded-bl-xs glow-red'
                    : 'bg-[#080F29] border border-[#00E5FF]/40 text-[#E8F0FF] rounded-bl-xs glow-blue'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-white/10 text-[10px] font-mono">
                    <span className={isMsgGoggins ? 'text-red-400 font-bold' : 'text-[#00E5FF] font-bold'}>
                      {isMsgGoggins ? 'THE SYSTEM · GOGGINS PROTOCOL' : 'THE SYSTEM AI'}
                    </span>
                    <span className="text-slate-500">{m.timestamp}</span>
                  </div>
                )}

                <p className="font-mono-system text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                  {m.text}
                </p>

                {isUser && (
                  <div className="text-[10px] font-mono text-slate-400 text-right mt-1.5">
                    {m.timestamp}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-800 bg-[#080F29] text-xs font-mono text-[#00E5FF] max-w-xs">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>SYNTHESIZING SYSTEM PROTOCOL...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        <button
          type="button"
          onClick={toggleSpeechRecognition}
          title={isListening ? 'Listening...' : 'Voice Input'}
          className={`p-3 rounded-xl border transition-all ${
            isListening
              ? 'border-red-500 bg-red-950/60 text-red-400 animate-pulse'
              : 'border-[#1A2548] bg-[#0A0D22] text-slate-400 hover:text-white'
          }`}
        >
          {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isGoggins
              ? "State your inquiry or confession of weakness..."
              : "Ask the System AI for training or dietary protocols..."
          }
          className="flex-1 px-4 py-3 rounded-xl border border-[#1A2548] bg-[#0A0D22] text-white font-rajdhani text-base focus:border-[#00E5FF] focus:glow-blue focus:outline-none transition-all placeholder:text-slate-500"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-[#00E5FF] text-black font-orbitron font-bold text-xs hover:bg-cyan-300 disabled:opacity-40 transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>TRANSMIT</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
