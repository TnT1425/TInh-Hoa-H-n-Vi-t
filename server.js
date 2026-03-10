const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http'); 
const { Server } = require('socket.io');
const Chat = require('./models/Chat');
const userRoutes = require('./routes/userRoutes');

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

  socket.on('join_room', async ({ userId }) => {
    socket.join(userId); 
    const chatHistory = await Chat.findOne({ userId });
    if (chatHistory) {
      socket.emit('load_history', chatHistory.messages);
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

    // 🤖 LÀM BOT TỰ ĐỘNG NẾU KHÁCH HỎI
    if (sender === 'khach') {
      const cauHoi = text.toLowerCase();
      let botText = "";
      if (cauHoi.includes('phí ship') || cauHoi.includes('vận chuyển')) {
        botText = 'Dạ phí ship đồng giá toàn quốc là 30.000đ ạ. Miễn phí ship cho đơn từ 500k!';
      } 
      else if (cauHoi.includes('bảo quản') || cauHoi.includes('hạn sử dụng')) {
        botText = 'Dạ các đặc sản bên em đều có hạn sử dụng từ 3-6 tháng. Hàng gửi đi luôn là lô mới nhất sản xuất trong tuần ạ!';
      }
      else if (cauHoi.includes('địa chỉ') || cauHoi.includes('ở đâu')) {
        botText = 'Kho hàng chính của bên em ở Hà Nội. Nhưng bọn em hỗ trợ giao nhanh hỏa tốc toàn quốc ạ.';
      }

      if (botText) {
        setTimeout(async () => {
          const currentChat = await Chat.findOne({ userId });
          if (currentChat) {
            const botMsg = { sender: 'bot', text: botText, timestamp: new Date() };
            currentChat.messages.push(botMsg);
            await currentChat.save();
            io.to(userId).emit('receive_message', botMsg);
          }
        }, 1000);
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