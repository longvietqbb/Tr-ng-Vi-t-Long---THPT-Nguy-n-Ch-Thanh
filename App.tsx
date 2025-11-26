import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, Role } from './types';
import { sendMessageToGemini } from './services/geminiService';
import MessageBubble from './components/MessageBubble';
import InputArea from './components/InputArea';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: '### Xin chào! 👋 \n\nMình là gia sư AI chuyên Toán lớp 12. Hãy gửi ảnh bài tập (Hàm số, Logarit, Tích phân, Hình không gian...) hoặc nhập câu hỏi, mình sẽ hướng dẫn bạn giải chi tiết nhé!',
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string, image?: string) => {
    const newUserMsg: ChatMessage = {
      id: uuidv4(),
      role: Role.USER,
      text: text,
      imageUrl: image,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const validHistory = messages.filter(m => !m.isError && m.id !== 'welcome');
      const responseText = await sendMessageToGemini(validHistory, text, image);

      const botMsg: ChatMessage = {
        id: uuidv4(),
        role: Role.MODEL,
        text: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: uuidv4(),
        role: Role.MODEL,
        text: 'Xin lỗi, có lỗi xảy ra trong quá trình phân tích. Vui lòng thử lại.',
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ đoạn chat không?')) {
      setMessages([{
        id: uuidv4(),
        role: Role.MODEL,
        text: '### Sẵn sàng! 🚀 \n\nĐã xóa lịch sử. Bạn có thể bắt đầu bài tập mới ngay bây giờ.',
        timestamp: Date.now()
      }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm border-b border-slate-200 z-40 h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md">
            <i className="fa-solid fa-graduation-cap text-xl"></i>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-slate-800 tracking-tight">MathTutor 12</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Trợ lý AI Online</p>
            </div>
          </div>
        </div>
        <button 
          onClick={clearHistory}
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
          title="Xóa lịch sử chat"
        >
          <i className="fa-solid fa-trash-can text-lg"></i>
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-grow pt-24 pb-36 px-4 md:px-6 max-w-4xl mx-auto w-full overflow-y-auto">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-6 w-full">
             <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                 <i className="fa-solid fa-spinner fa-spin text-emerald-600"></i>
              </div>
              <span className="text-sm text-slate-600 font-medium">Đang suy nghĩ...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;