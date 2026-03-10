import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const AdminChat = () => {
  const [chatList, setChatList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

const filteredChats = chatList.filter(chat => 
  (chat.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (chat.userId || "").toLowerCase().includes(searchTerm.toLowerCase())
);

  // 1. Tải danh sách các khách hàng đã chat
  const fetchChats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/chats');
      setChatList(res.data);
    } catch (err) { console.error("Lỗi tải danh sách chat", err); }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // 2. Khi nhân viên click chọn 1 khách hàng
  useEffect(() => {
    if (selectedUser) {
      socket.emit('join_room', { userId: selectedUser.userId });
      socket.on('load_history', (history) => setMessages(history));
      socket.on('receive_message', (data) => setMessages((prev) => [...prev, data]));

      return () => {
        socket.off('load_history');
        socket.off('receive_message');
      };
    }
  }, [selectedUser]);

  const sendMessage = () => {
    if (currentMessage.trim() !== "" && selectedUser) {
      socket.emit('send_message', { 
        userId: selectedUser.userId, 
        sender: 'staff', 
        text: currentMessage 
      });
      setCurrentMessage("");
    }
  };

  // 3. Hàm xóa đoạn chat
  const handleDeleteChat = async (userId) => {
    if (!window.confirm("Xóa đoạn chat với khách hàng này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/chats/${userId}`);
      alert("Đã xóa!");
      setSelectedUser(null);
      fetchChats(); // Tải lại danh sách
    } catch (err) { alert("Lỗi khi xóa"); }
  };

  return (
    
    <div className="container mx-auto p-6 flex gap-4 h-[600px]">
      <div className="mb-3">
        <input 
          type="text" 
          placeholder="🔍 Tìm tên hoặc mã..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-red-800 text-sm"
        />
      </div>
      {/* CỘT TRÁI: DANH SÁCH KHÁCH */}
      <div className="w-1/3 bg-white border rounded shadow p-4 overflow-y-auto">
        <h3 className="font-bold text-xl mb-4 text-red-800">Khách Hàng Cần Hỗ Trợ</h3>
        {filteredChats.map(chat => (
          <div key={chat.userId} className="flex justify-between items-center p-3 border-b hover:bg-gray-100 cursor-pointer">
            <div onClick={() => setSelectedUser(chat)} className="flex-1 font-bold">
              👤 {chat.userName} 
              <p className="text-xs text-gray-500 font-normal">Mã: {chat.userId.slice(-5)}...</p>
            </div>
            <button onClick={() => handleDeleteChat(chat.userId)} className="text-red-500 hover:text-red-700 text-sm">🗑️ Xóa</button>
          </div>
        ))}
      </div>

      {/* CỘT PHẢI: KHUNG CHAT */}
      <div className="w-2/3 bg-white border rounded shadow flex flex-col">
        {selectedUser ? (
          <>
            <div className="bg-red-800 text-white p-4 font-bold">Đang hỗ trợ: {selectedUser.userName}</div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
              {messages.map((msg, i) => (
                <div key={i} className={`p-2 rounded max-w-[70%] ${msg.sender === 'staff' ? 'bg-red-800 text-white self-end' : 'bg-gray-200 self-start'}`}>
                  <span className="text-xs opacity-70 block">{msg.sender === 'staff' ? 'Bạn' : msg.sender === 'bot' ? 'Bot' : 'Khách'}</span>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex">
              <input value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} className="flex-1 border p-2" placeholder="Gõ câu trả lời..." />
              <button onClick={sendMessage} className="bg-red-800 text-white px-6">Gửi</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">👈 Hãy chọn một khách hàng để bắt đầu chat</div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;