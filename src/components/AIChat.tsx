import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Eraser, Key, Loader2, ExternalLink } from 'lucide-react';
import { PDF_CONTENT } from '../pdfContent';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const DEFAULT_WELCOME: Message = {
  role: 'model',
  text: 'أهلاً بك! أنا المساعد الذكي الخاص بمادة النظم الموزعة. كيف يمكنني مساعدتك في دراستك اليوم؟'
};

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '');
  const [apiKeyInput, setApiKeyInput] = useState('');

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('ds_ai_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch (e) { }
    return [DEFAULT_WELCOME];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    localStorage.setItem('ds_ai_chat_history', JSON.stringify(messages));
  }, [messages, isOpen]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      localStorage.setItem('geminiApiKey', apiKeyInput.trim());
      setApiKey(apiKeyInput.trim());
      setApiKeyInput('');
    }
  };

  const clearHistory = () => {
    setMessages([DEFAULT_WELCOME]);
  };

  const removeApiKey = () => {
    localStorage.removeItem('geminiApiKey');
    setApiKey('');
    setMessages([DEFAULT_WELCOME]); // optional: reset chat on key removal
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !apiKey) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `أنت مساعد ذكي مصمم لمساعدة الطلاب في دراسة منهج النظم الموزعة (Distributed Systems).
استخدم المحتوى التالي المعطى من المنهج للإجابة على أسئلة الطلاب. إذا كان السؤال خارج سياق المنهج، اعتذر بلطف.
يجب أن تكون إجاباتك دقيقة وواضحة وباللغة العربية ما لم يطلب الطالب غير ذلك.

هذا هو محتوى المنهج:
${PDF_CONTENT}`
            }]
          },
          contents: newMessages.map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text }]
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch from Gemini');
      }

      const modelText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'عذراً، لم أتمكن من توليد الاستجابة.';
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);

    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: `خطأ: ${error.message || 'فشل الاتصال بالخادم. تأكد من صحة مفتاح API.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-[#E07A5F] text-white rounded-full shadow-lg hover:bg-opacity-90 hover:scale-105 transition-all z-40 focus:outline-none focus:ring-4 focus:ring-[#E07A5F]/40"
        title="AI Tutor"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90vw] max-w-sm sm:max-w-md h-[550px] max-h-[85vh] bg-white border border-[#E9E4D9] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden dark:bg-[#111319] dark:border-[#2d3244]">
          {/* Header */}
          <div className="bg-[#3D405B] text-white p-4 flex justify-between items-center rounded-t-xl shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#E07A5F]" />
              <h3 className="font-bold tracking-wider">Distributed Systems AI</h3>
            </div>
            <div className="flex items-center gap-1">
              {apiKey && (
                <>
                  <button onClick={clearHistory} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Clear Chat History">
                    <Eraser className="w-4 h-4" />
                  </button>
                  <button onClick={removeApiKey} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Remove API Key">
                    <Key className="w-4 h-4" />
                  </button>
                </>
              )}
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors ml-1">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 bg-[#F9F7F2] dark:bg-[#151720]">
            {!apiKey ? (
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center overflow-y-auto">
                <Key className="w-12 h-12 text-[#81B29A] mb-4" />
                <h4 className="text-lg font-bold text-[#3D405B] dark:text-[#e2e8f0] mb-2">Google Gemini API</h4>
                <p className="text-sm text-[#5C5F7F] dark:text-[#94a3b8] mb-4">
                  Please provide your Gemini API key to activate the AI Tutor. Your key is stored securely in your browser's local storage and is sent directly to Google.
                </p>
                <a
                  href="https://aistudio.google.com/u/1/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#E07A5F] hover:text-[#E07A5F]/80 font-bold mb-6 transition-colors bg-[#E07A5F]/10 px-3 py-1.5 rounded-lg"
                >
                  Get API Key <ExternalLink className="w-3 h-3" />
                </a>
                <form onSubmit={handleSaveKey} className="w-full flex gap-2">
                  <input
                    type="password"
                    placeholder="Enter API Key..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="flex-1 px-4 py-2 text-sm border border-[#E0D8C3] dark:border-[#2d3244] dark:bg-[#1a1d27] dark:text-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#81B29A] transition-colors"
                    required
                  />
                  <button type="submit" className="px-4 py-2 bg-[#81B29A] text-white text-sm font-bold rounded-xl hover:opacity-90">
                    Save
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" dir="rtl">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                            ? 'bg-[#E07A5F] text-white rounded-tr-sm whitespace-pre-wrap'
                            : 'bg-white border border-[#E9E4D9] text-[#3D405B] rounded-tl-sm dark:bg-[#1a1d27] dark:border-[#2d3244] dark:text-[#e2e8f0] overflow-hidden'
                          }`}
                      >
                        {msg.role === 'user' ? (
                          <div dir="auto" className="whitespace-pre-wrap">{msg.text}</div>
                        ) : (
                          <div dir="auto" className="space-y-2">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({node, ...props}: any) => <p dir="auto" className="mb-2 last:mb-0" {...props} />,
                                ul: ({node, ...props}: any) => <ul dir="auto" className="list-disc list-outside ps-5 mb-2 space-y-1" {...props} />,
                                ol: ({node, ...props}: any) => <ol dir="auto" className="list-decimal list-outside ps-5 mb-2 space-y-1" {...props} />,
                                li: ({node, ...props}: any) => <li dir="auto" className="" {...props} />,
                                a: ({node, ...props}: any) => <a dir="auto" className="text-[#E07A5F] underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                h1: ({node, ...props}: any) => <h1 dir="auto" className="text-xl font-bold mb-2 mt-4" {...props} />,
                                h2: ({node, ...props}: any) => <h2 dir="auto" className="text-lg font-bold mb-2 mt-3" {...props} />,
                                h3: ({node, ...props}: any) => <h3 dir="auto" className="text-md font-bold mb-2 mt-2" {...props} />,
                                code: ({node, inline, className, children, ...props}: any) => {
                                  return !inline ? (
                                    <pre className="bg-[#1e1e1e] text-white p-3 rounded-lg overflow-x-auto my-2 text-left" dir="ltr">
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    </pre>
                                  ) : (
                                    <code dir="auto" className="bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-[#E07A5F] font-mono text-[0.9em]" {...props}>
                                      {children}
                                    </code>
                                  )
                                },
                                table: ({node, ...props}: any) => <div dir="auto" className="overflow-x-auto my-3"><table className="min-w-full divide-y divide-[#E0D8C3] dark:divide-[#2d3244] border border-[#E0D8C3] dark:border-[#2d3244] rounded" {...props} /></div>,
                                th: ({node, ...props}: any) => <th dir="auto" className="px-3 py-2 bg-[#F9F7F2] dark:bg-[#151720] font-bold text-start" {...props} />,
                                td: ({node, ...props}: any) => <td dir="auto" className="px-3 py-2 border-t border-[#E0D8C3] dark:border-[#2d3244] text-start" {...props} />,
                                blockquote: ({node, ...props}: any) => <blockquote dir="auto" className="border-s-4 border-[#81B29A] ps-3 my-2 text-[#5C5F7F] dark:text-[#94a3b8] italic" {...props} />
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-end">
                      <div className="bg-white border border-[#E9E4D9] text-[#81B29A] p-3 rounded-2xl rounded-tl-sm dark:bg-[#1a1d27] dark:border-[#2d3244]">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="shrink-0 p-3 bg-white dark:bg-[#1a1d27] border-t border-[#E9E4D9] dark:border-[#2d3244]">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      dir="rtl"
                      placeholder="اسأل AI..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 min-w-0 px-4 py-2 text-sm border border-[#E0D8C3] dark:border-[#2d3244] dark:bg-[#151720] dark:text-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#E07A5F] transition-colors bg-[#F9F7F2]"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="shrink-0 p-2 text-white bg-[#E07A5F] rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
