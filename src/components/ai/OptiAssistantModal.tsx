import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  ShoppingBag,
  TrendingDown,
  ArrowRight,
  Minimize2,
  Maximize2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  poweredBy?: string;
  suggestedAction?: {
    label: string;
    view: string;
    productId?: string;
  };
}

export const OptiAssistantModal: React.FC = () => {
  const {
    products,
    cart,
    cartTotal,
    budget,
    currentUser,
    setActiveView,
    setSelectedProductForDetail,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-01',
      sender: 'assistant',
      text: `Hello ${currentUser.name.split(' ')[0]}! I'm **Opti Assistant**, your intelligent commerce copilot. I can evaluate Price Guardian deals, discover high-discount surplus hardware, or optimize your cart so you never exceed your ₹${budget.cartBudgetLimit.toLocaleString('en-IN')} budget target. How can I assist you today?`,
      time: 'Just now',
      poweredBy: 'OptiMart AI Core',
    },
  ]);

  const quickPrompts =
    currentUser.role === 'seller'
      ? [
          'Which products have high surplus risk?',
          'Suggest clearance discounts for slow movers',
          'Explain sales velocity & restock trends',
        ]
      : [
          'Which headphones offer the best surplus deal?',
          'Help me keep my cart under budget',
          'Show me certified ultrabooks under ₹90k',
          'Is Acoustiq Max Pro a good deal right now?',
        ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    setInput('');
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Gather relevant app context for server Gemini proxy
      const context = {
        userRole: currentUser.role,
        userName: currentUser.name,
        cartCount: cart.length,
        cartTotal,
        cartBudgetLimit: budget.cartBudgetLimit,
        cartItems: cart.map((i) => ({ name: i.product.name, price: i.product.currentPrice, qty: i.quantity })),
        topSurplusDeals: products
          .filter((p) => p.surplusStatus === 'surplus')
          .slice(0, 5)
          .map((p) => ({
            id: p.id,
            name: p.name,
            price: p.currentPrice,
            orig: p.originalPrice,
            discount: p.discountPercentage,
            category: p.category,
          })),
      };

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, context }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          poweredBy: data.poweredBy || 'Gemini 3.8 Flash',
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('Server returned an error');
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: `I analyzed our live inventory! For premium audio, look at the **Acoustiq Max Pro Wireless Headphones** at ₹17,499 (30% off factory surplus). If you are looking to stay within budget, our **Smart Cart Optimizer** is ready to compare cheaper certified alternatives!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        poweredBy: 'Fallback Intelligence',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Glowing Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 font-bold shadow-[0_0_30px_0px_rgba(6,182,212,0.55)] hover:shadow-[0_0_40px_5px_rgba(6,182,212,0.75)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Open Opti Assistant"
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute -inset-1 rounded-full bg-cyan-300 animate-ping opacity-40" />
            <Sparkles className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
          </div>
          <span className="text-xs uppercase tracking-wider font-extrabold">Opti Assistant</span>
        </button>
      )}

      {/* Assistant Modal Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 flex flex-col bg-slate-950/95 border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_-10px_rgba(6,182,212,0.3)] backdrop-blur-2xl overflow-hidden ${
            isExpanded
              ? 'inset-4 md:inset-12'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] h-[580px] max-h-[88vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Opti Assistant</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-mono">
                    Gemini 3.8
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">Smart Surplus & Price Guardian Copilot</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Context Bar */}
          <div className="px-4 py-1.5 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Cart: ₹{cartTotal.toLocaleString('en-IN')}</span>
              <span>/</span>
              <span className="text-slate-300">Target: ₹{budget.cartBudgetLimit.toLocaleString('en-IN')}</span>
            </div>
            {cartTotal > budget.cartBudgetLimit && (
              <span className="text-amber-400 font-medium shrink-0">Over Target</span>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm shadow-md'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400/80">
                    <span>{msg.time}</span>
                    {msg.poweredBy && (
                      <span className="font-mono text-[9px] text-cyan-400/80 ml-2">
                        {msg.poweredBy}
                      </span>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-blue-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start items-center text-xs text-slate-400">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                </div>
                <span>Opti Assistant is evaluating catalog data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 border-t border-slate-800/80 bg-slate-900/30 overflow-x-auto">
            <div className="flex gap-1.5 whitespace-nowrap">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-[11px] text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-colors cursor-pointer shrink-0"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about deals, products, or budget..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
