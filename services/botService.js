const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require('../models/Product'); 

if (!process.env.GEMINI_API_KEY) {
  console.error("🚨 LỖI: Không tìm thấy GEMINI_API_KEY trong file .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getBotResponse = async (userMessage) => {
  try {
    console.log(`🤖 Khách vừa hỏi: "${userMessage}"`);

    // ==========================================
    // BƯỚC 1: LỤC TÌM MONGODB THEO TỪ KHÓA CỦA KHÁCH
    // ==========================================
    // Tách câu hỏi của khách thành các từ (chỉ lấy các từ có ý nghĩa, dài hơn 2 chữ cái)
    // VD: "bánh pía ở đâu" -> ["bánh", "pía", "đâu"]
    const searchWords = userMessage.split(/\s+/).filter(word => word.length > 2);
    
    let products = [];

    if (searchWords.length > 0) {
       // Tạo điều kiện tìm kiếm: Tên sản phẩm có chứa MỘT TRONG CÁC TỪ khách vừa gõ
       const searchConditions = searchWords.map(word => ({
          name: { $regex: word, $options: "i" }
       }));

       // Tìm tối đa 5 sản phẩm liên quan nhất
       products = await Product.find({ $or: searchConditions }).limit(5);
    }

    // Nếu khách gõ mấy câu không liên quan ("hello", "shop ơi"), ta lấy 3 món bán chạy mớm cho Bot
    if (products.length === 0) {
       products = await Product.find().sort({ sold: -1 }).limit(3);
    }

    // ==========================================
    // BƯỚC 2: ĐÓNG GÓI DỮ LIỆU MỚM CHO AI
    // ==========================================
    const productList = products.map(p => `- ${p.name} (Giá: ${(p.price || 0).toLocaleString()}đ)`).join('\n');
    const contextData = `Danh sách sản phẩm hệ thống tìm được:\n${productList}`;

const systemPrompt = `
      Bạn là nhân viên chăm sóc khách hàng tên là "Shop Tinh Hoa Hồn Việt" của website "Tinh Hoa Hồn Việt".
      Nhiệm vụ: Trả lời khách hàng lịch sự, xưng hô "dạ/vâng", "em" và "anh/chị". Trả lời NGẮN GỌN dưới 3 câu.
      
      Kiến thức cửa hàng:
      - Phí ship: 30.000đ toàn quốc. Miễn phí ship đơn từ 500.000đ.
      - Kho hàng: Hà Nội. Giao hỏa tốc toàn quốc.
      - Hạn sử dụng: 3-6 tháng.
      
      Dữ liệu Database (CỰC KỲ QUAN TRỌNG):
      ${contextData}

      Quy tắc ứng xử (BẮT BUỘC TUÂN THỦ):
      1. TƯ VẤN SẢN PHẨM: Chỉ tư vấn và báo giá các sản phẩm có trong phần "Dữ liệu Database" bên trên.
      2. SẢN PHẨM KHÔNG CÓ: Nếu khách hỏi một món mà KHÔNG CÓ trong "Dữ liệu Database", hãy nói: "Dạ hiện tại bên em chưa kinh doanh hoặc đang tạm hết món này, anh/chị tham khảo thử các đặc sản khác như [kể tên 1-2 món trong danh sách] nhé ạ!".
      3. CHUYỂN TIẾP NHÂN VIÊN (HUMAN HANDOFF): Nếu khách hỏi những thông tin KHÁC ngoài lề mà bạn không biết (ví dụ: hình thức thanh toán, chính sách đổi trả, khiếu nại...), TUYỆT ĐỐI KHÔNG tự bịa câu trả lời. Hãy trả lời ĐÚNG NGUYÊN VĂN câu sau và không nói thêm gì khác: 
      "Dạ cảm ơn anh/chị đã quan tâm đến shop. Vấn đề này phiền anh/chị đợi một lát để nhân viên bên em vào hỗ trợ trực tiếp nhé ạ!"

      Hãy trả lời câu hỏi sau: "${userMessage}"
    `;

    // ==========================================
    // BƯỚC 3: GỌI GEMINI XỬ LÝ
    // ==========================================
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(systemPrompt);
    
    return result.response.text();

  } catch (error) {
    console.error("❌ Lỗi AI Bot:", error.message || error);
    return "Dạ hệ thống em đang bận chút xíu, anh/chị đợi em một lát nhé!";
  }
};