import { askShoppingAssistant, type AIShoppingAssistantResponse } from "@/services/aiShoppingAssistantService";
import { formatPrice } from "@/utils/products";
import { Bot, ExternalLink, Loader2, Minus, Send, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  products?: AIShoppingAssistantResponse["products"];
};

const suggestedQuestions = [
  "Best Phones",
  "Gaming Laptops",
  "Programming Laptops",
  "Budget Deals",
  "Trending Products",
];

const welcomeMessage =
  "Hi! 👋 I am your AI Shopping Assistant.\nTell me what you're looking for and I will recommend products.";

export default function AIShoppingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", text: welcomeMessage },
  ]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  const submitMessage = async (event?: FormEvent<HTMLFormElement>, quickMessage?: string) => {
    event?.preventDefault();
    const message = String(quickMessage ?? input).trim();
    if (!message || isTyping) return;

    setInput("");
    setMessages((items) => [...items, { id: crypto.randomUUID(), role: "user", text: message }]);
    setIsTyping(true);

    try {
      const response = await askShoppingAssistant(message);
      setMessages((items) => [
        ...items,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: response.answer,
          products: response.products,
        },
      ]);
    } catch (_error) {
      setMessages((items) => [
        ...items,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "I could not reach the assistant right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          aria-label="Ask AI"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_28px_rgba(10,132,255,0.38)] transition-all hover:scale-105 hover:bg-primary/90 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 md:bottom-8 md:right-8 md:h-16 md:w-16 md:shadow-[0_0_35px_rgba(10,132,255,0.45)]"
        >
          <Bot className="h-5 w-5 animate-pulse sm:h-6 sm:w-6 md:h-8 md:w-8" />
          <span className="pointer-events-none absolute right-20 rounded-xl border border-white/10 bg-black/80 px-3 py-2 text-sm font-bold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
            Ask AI
          </span>
        </button>
      )}

      {isOpen && (
        <section className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-[420px] overflow-hidden rounded-3xl border border-white/10 bg-[#101116]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl md:bottom-8 md:right-8">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-black text-white">AI Shopping Assistant</h2>
                <p className="text-xs text-gray-400">Smart product recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setIsMinimized((value) => !value)} className="rounded-xl p-2 text-gray-300 hover:bg-white/10 hover:text-white" aria-label="Minimize AI chat">
                <Minus className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl p-2 text-gray-300 hover:bg-white/10 hover:text-white" aria-label="Close AI chat">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div ref={scrollRef} className="max-h-[58vh] space-y-4 overflow-y-auto px-4 py-5">
                {messages.map((message) => (
                  <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "bg-primary text-white" : "border border-white/10 bg-white/[0.04] text-gray-100"}`}>
                      <p className="whitespace-pre-line">{message.text}</p>
                      {message.products && message.products.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {message.products.map((product) => (
                            <div key={product.uuid ?? product.id} className="rounded-xl border border-white/10 bg-black/25 p-3">
                              <div className="flex gap-3">
                                <img src={product.image} alt={product.name} className="h-16 w-16 rounded-lg bg-white/5 object-contain p-1" />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-bold text-white">{product.name}</p>
                                  <p className="text-xs uppercase text-primary">{product.manufacturer}</p>
                                  <div className="mt-1 flex items-center justify-between gap-2">
                                    <span className="font-bold text-accent">{formatPrice(product.price)}</span>
                                    <span className="text-xs text-gray-400">AI {product.aiProductScore ?? 0}</span>
                                  </div>
                                </div>
                              </div>
                              <Link to={`/products/${product.id}`} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-white hover:border-primary/40">
                                View Product
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-300">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      AI is thinking...
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 p-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => void submitMessage(undefined, question)}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-bold text-gray-200 hover:border-primary/40 hover:text-white"
                    >
                      <Sparkles className="h-3 w-3 text-accent" />
                      {question}
                    </button>
                  ))}
                </div>
                <form onSubmit={submitMessage} className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask for a product..."
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-primary"
                  />
                  <button type="submit" disabled={!input.trim() || isTyping} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
                    {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                </form>
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}
