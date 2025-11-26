import React from 'react';
import { ChatMessage, Role } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-white border-2 border-emerald-500 text-emerald-600'
        }`}>
          {isUser ? (
            <i className="fa-solid fa-user-graduate text-lg"></i>
          ) : (
            <i className="fa-solid fa-robot text-lg"></i>
          )}
        </div>

        {/* Content Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} flex-grow min-w-0`}>
          <div className={`relative px-6 py-4 rounded-xl shadow-md ${
            isUser 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : message.isError 
                ? 'bg-white border-l-4 border-red-500 text-red-800 rounded-tl-none'
                : 'bg-white border border-slate-200 rounded-tl-none'
          }`}>
            {/* Image attachment */}
            {message.imageUrl && (
              <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <img 
                  src={message.imageUrl} 
                  alt="Uploaded content" 
                  className="max-h-80 object-contain mx-auto" 
                />
              </div>
            )}

            {/* Text content */}
            {message.text && (
              <div className={isUser ? 'whitespace-pre-wrap font-medium' : ''}>
                {isUser ? (
                  message.text
                ) : (
                  <MarkdownRenderer content={message.text} />
                )}
              </div>
            )}
            
            {message.isError && (
              <div className="flex items-center gap-2 mt-2 text-red-600 font-medium">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>Không thể xử lý yêu cầu</span>
              </div>
            )}
          </div>
          
          <span className="text-xs text-slate-400 mt-2 px-1 font-medium">
            {isUser ? 'Học sinh' : 'Gia sư AI'} • {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;