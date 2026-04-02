import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, User, Bot, Loader2, Sparkles, Music } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Chào em! Cô là Nguyễn Thị Thuý Hoa, giáo viên âm nhạc của em. Em có thắc mắc gì về bài học hay nhạc cụ không? Đừng ngần ngại hỏi cô nhé! 🎵' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, userMsg].map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: "Bạn là Nguyễn Thị Thuý Hoa, một giáo viên âm nhạc tiểu học thân thiện, nhiệt huyết. Bạn dạy theo chương trình sách giáo khoa Cánh Diều 2018. Hãy trả lời học sinh một cách dễ hiểu, khuyến khích các em yêu âm nhạc. Nếu học sinh hỏi về các khối lớp 1-5, hãy trả lời đúng trọng tâm chương trình Cánh Diều. Đối với khối 4, 5 bạn có thể hướng dẫn thêm về sáo Recorder và kèn phím.",
        }
      });

      const modelText = response.text || "Cô xin lỗi, có chút trục trặc. Em hỏi lại nhé!";
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Cô đang bận một chút, em quay lại sau nhé!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
      <div className="bg-blue-600 p-6 flex items-center justify-between shadow-lg shadow-blue-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Music size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Hỏi đáp cùng Cô Thuý Hoa</h2>
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Trợ lý âm nhạc thông minh</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.length <= 1 && (
          <div className="flex flex-col items-center justify-center text-center p-4 space-y-4 mb-4">
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-50">
              <Sparkles size={40} className="text-blue-500" />
            </div>
            <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
              {['Làm sao để đọc nhạc tốt hơn?', 'Kể cho em nghe về đàn Piano', 'Sáo Recorder thổi như thế nào?'].map((q, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(q)}
                  className="bg-white p-3 rounded-2xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-all text-left shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex flex-col max-w-[85%]",
              msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <div
              className={cn(
                "p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm",
                msg.role === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
              )}
            >
              <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:m-0 prose-headings:m-0 prose-strong:text-inherit">
                <ReactMarkdown>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-2 px-2">
              {msg.role === 'user' ? 'Em' : 'Cô Thuý Hoa'}
            </span>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex flex-col items-start max-w-[85%]">
            <div className="bg-white p-5 rounded-[2rem] rounded-tl-none border border-gray-100 shadow-sm">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-white border-t border-gray-50">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhập câu hỏi của em tại đây..."
            className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-6 py-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-700"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
