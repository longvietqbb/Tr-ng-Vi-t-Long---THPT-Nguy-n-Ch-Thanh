import { GoogleGenAI } from "@google/genai";
import { ChatMessage, Role, GeminiContent } from "../types";

const SYSTEM_INSTRUCTION = `
Bạn là một gia sư toán học chuyên nghiệp và tận tâm, chuyên giải đáp các bài tập Toán lớp 12 (Giải tích, Hình học không gian, Số phức, Tích phân, Mũ & Logarit, v.v.).

NHIỆM VỤ CỦA BẠN:
Giúp học sinh hiểu và giải quyết bài toán từ hình ảnh hoặc văn bản được cung cấp.

QUY TẮC ĐỊNH DẠNG (BẮT BUỘC):
1.  **Công thức toán học:** BẮT BUỘC sử dụng định dạng LaTeX.
    -   Công thức cùng dòng (inline): bọc trong dấu $ (ví dụ: $f(x) = x^2$).
    -   Công thức riêng dòng (block): bọc trong dấu $$ (ví dụ: $$ \int_{0}^{1} x dx $$).
2.  **Trình bày:** Sử dụng Markdown để tạo tiêu đề, danh sách, in đậm các ý chính.

CẤU TRÚC CÂU TRẢ LỜI:
1.  **Phân tích đề bài:** Tóm tắt giả thiết và yêu cầu của bài toán. Xác định dạng toán (VD: Tìm cực trị, Tính thể tích khối đa diện...).
2.  **Phương pháp giải:** Nhắc lại ngắn gọn công thức hoặc định lý cần sử dụng.
3.  **Lời giải chi tiết:** Trình bày từng bước logic, rõ ràng.
    -   Bước 1: ...
    -   Bước 2: ...
4.  **Kết luận:** Ghi rõ đáp án cuối cùng.
5.  **Lưu ý (nếu có):** Nhắc nhở về điều kiện xác định, các lỗi sai thường gặp hoặc mẹo bấm máy tính Casio.

Phong cách: Thân thiện, khuyến khích học sinh, giải thích dễ hiểu.
`;

// Helper to convert internal message format to Gemini API format
const formatHistory = (messages: ChatMessage[]): GeminiContent[] => {
  return messages.map((msg) => {
    const parts: any[] = [];
    
    if (msg.imageUrl) {
      // Extract base64 from data URL
      const base64Data = msg.imageUrl.split(',')[1];
      const mimeType = msg.imageUrl.substring(msg.imageUrl.indexOf(':') + 1, msg.imageUrl.indexOf(';'));
      
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }
    
    if (msg.text) {
      parts.push({ text: msg.text });
    }

    return {
      role: msg.role,
      parts: parts
    };
  });
};

export const sendMessageToGemini = async (
  currentHistory: ChatMessage[],
  newMessageText: string,
  newMessageImage?: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Construct the contents including history and the new message
    const historyParts = formatHistory(currentHistory);
    
    const newContentParts: any[] = [];
    if (newMessageImage) {
      const base64Data = newMessageImage.split(',')[1];
      const mimeType = newMessageImage.substring(newMessageImage.indexOf(':') + 1, newMessageImage.indexOf(';'));
      newContentParts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }
    if (newMessageText) {
      newContentParts.push({ text: newMessageText });
    }

    const contents = [
      ...historyParts,
      { role: Role.USER, parts: newContentParts }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, // Lower temperature for more precise math
      },
    });

    return response.text || "Xin lỗi, tôi không thể tạo ra câu trả lời lúc này.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Có lỗi xảy ra khi kết nối với gia sư AI. Vui lòng thử lại.");
  }
};