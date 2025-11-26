import React, { useState, useRef, useEffect } from 'react';

interface InputAreaProps {
  onSendMessage: (text: string, image?: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if ((!text.trim() && !selectedImage) || isLoading) return;
    
    onSendMessage(text, selectedImage || undefined);
    setText('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 pb-6 md:pb-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="max-w-3xl mx-auto">
        
        {/* Image Preview */}
        {selectedImage && (
          <div className="mb-3 relative inline-block">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-md h-24 w-24 group">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="h-full w-full object-cover"
              />
              <button 
                onClick={removeImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
              >
                <i className="fa-solid fa-times text-xs"></i>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-end gap-3 bg-white rounded-3xl p-2 border border-slate-300 shadow-sm focus-within:shadow-md focus-within:border-blue-400 transition-all">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"
            disabled={isLoading}
            title="Tải ảnh lên"
          >
            <i className="fa-regular fa-image text-xl"></i>
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập bài toán hoặc tải ảnh đề bài..."
            className="flex-grow bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 py-2.5 max-h-[120px] resize-none leading-relaxed"
            rows={1}
            disabled={isLoading}
          />

          <button 
            onClick={handleSubmit}
            disabled={(!text.trim() && !selectedImage) || isLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
              (!text.trim() && !selectedImage) || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-solid fa-paper-plane"></i>
            )}
          </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-[11px] text-slate-400">
              <i className="fa-solid fa-shield-cat mr-1"></i>
              MathTutor 12 có thể mắc lỗi. Hãy kiểm tra lại thông tin quan trọng.
            </p>
        </div>
      </div>
    </div>
  );
};

export default InputArea;