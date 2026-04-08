const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http'); 
const { Server } = require('socket.io');
const Chat = require('./models/Chat');
const userRoutes = require('./routes/userRoutes');
const botService = require('./services/botService');

const app = express();
app.use(cors()); 
app.use(express.json());

const server = http.createServer(app);


app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Đã kết nối MongoDB thành công!'))
  .catch((err) => console.log('❌ Lỗi kết nối DB: ', err));

app.get('/', (req, res) => {
  res.send('API Tinh Hoa Hồn Việt đang chạy...');
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('🟢 Có người kết nối Chat:', socket.id);

  socket.on('join_room', async ({ userId }) => { // mõi user 1 room
    socket.join(userId); 
    const chatHistory = await Chat.findOne({ userId });
    if (chatHistory) {
      socket.emit('load_history', chatHistory.messages); // load lịch sử chat gưi fronetend
    }
  });

  socket.on('send_message', async (data) => {
    const { userId, userName, sender, text } = data;
    const msgObj = { sender, text, timestamp: new Date() };

    let chat = await Chat.findOne({ userId });
    if (!chat) {
      chat = new Chat({ userId, userName: userName || 'Khách', messages: [] });
    }
    chat.messages.push(msgObj);
    await chat.save();

    io.to(userId).emit('receive_message', msgObj);

    // ==========================================
    // 🤖 LÀM BOT AI THÔNG MINH (Thay thế đoạn if-else cũ)
    // ==========================================
    if (sender === 'khach') {
      try {
        // Gọi hàm từ AI Service (truyền câu hỏi của khách vào)
        const botText = await botService.getBotResponse(text);

        if (botText) {
          // Tạo delay 1.5s - 2s để tạo cảm giác AI "đang gõ phím" cho chân thật
          setTimeout(async () => {
            const currentChat = await Chat.findOne({ userId });
            if (currentChat) {
              const botMsg = { sender: 'bot', text: botText, timestamp: new Date() };
              currentChat.messages.push(botMsg);
              await currentChat.save();
              io.to(userId).emit('receive_message', botMsg);
            }
          }, 1500); 
        }
      } catch (err) {
        console.log("Lỗi gửi tin nhắn Bot:", err);
      }
    }
  });
});

app.get('/api/chats', async (req, res) => {
  const chats = await Chat.find().sort('-updatedAt');
  res.json(chats);
});

app.delete('/api/chats/:userId', async (req, res) => {
  await Chat.findOneAndDelete({ userId: req.params.userId });
  res.json({ message: 'Đã xóa lịch sử chat!' });
});

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const statRoutes = require('./routes/statRoutes');
app.use('/api/stats', statRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server và Tổng đài Chat đang chạy tại port ${PORT}`));