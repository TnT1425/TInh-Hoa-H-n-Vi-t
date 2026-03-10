import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatBox = () => {
  const token = localStorage.getItem('token');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id || payload._id);
      } catch (err) {}
    }
  }, [token]);

  useEffect(() => {
    if (userId && isOpen) {
      socket.emit('join_room', { userId });

      socket.on('load_history', (history) => setMessages(history));
      socket.on('receive_message', (data) => setMessages((prev) => [...prev, data]));

      return () => {
        socket.off('load_history');
        socket.off('receive_message');
      };
    }
  }, [userId, isOpen]);

  const sendMessage = () => {
    if (currentMessage.trim() !== "" && userId) {
      socket.emit('send_message', { 
        userId: userId, 
        userName: 'Khách hàng', 
        sender: 'khach', 
        text: currentMessage 
      });
      setCurrentMessage("");
    }
  };

  if (!token) return null; 

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-lg shadow-2xl flex flex-col mb-3">
          <div className="bg-red-800 text-yellow-400 p-3 font-bold">CSKH Tinh Hoa Hồn Việt</div>
          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div key={i} className={`p-2 rounded max-w-[80%] ${msg.sender === 'khach' ? 'bg-red-100 self-end text-right' : 'bg-gray-200 self-start text-left'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 p-2 border-t bg-white">
            {["Phí ship thế nào?", "Hạn sử dụng bao lâu?", "Cửa hàng ở đâu?"].map((reply, i) => (
              <button 
                key={i} 
                onClick={() => {
                  if (userId) {
                    socket.emit('send_message', { userId, userName: 'Khách hàng', sender: 'khach', text: reply });
                  }
                }} 
                className="text-xs bg-yellow-100 text-red-800 px-2 py-1 rounded-full border border-yellow-300 hover:bg-yellow-200 transition"
              >
                {reply}
              </button>
            ))}
          </div>
          <div className="p-2 border-t flex">
            <input value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} className="flex-1 border px-2 text-sm outline-none" placeholder="Nhập tin nhắn..." />
            <button onClick={sendMessage} className="bg-red-800 text-white px-3 py-1">Gửi</button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="bg-red-800 text-yellow-400 p-4 rounded-full font-bold">💬</button>
    </div>
  );
};

export default ChatBox;