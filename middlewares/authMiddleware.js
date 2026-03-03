const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // Lấy token từ header của request do Frontend gửi lên
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'Từ chối truy cập. Bạn chưa đăng nhập!' });

  try {
    // Frontend thường gửi token dạng "Bearer chuoi_token_loang_ngoang"
    const token = authHeader.split(' ')[1]; 
    
    // Giải mã token bằng chữ ký bí mật của bạn
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Gắn thông tin user (đã giải mã) vào request để các API phía sau dùng
    req.user = verified; 
    next(); // Cho phép đi tiếp vào Controller
  } catch (err) {
    res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};

// Phân quyền: Chỉ Admin hoặc Staff mới được đi tiếp
exports.verifyAdminOrStaff = (req, res, next) => {
  // Lấy role từ token đã được giải mã ở bước verifyToken trước đó
  if (req.user.role === 'admin' || req.user.role === 'staff') {
    next(); // Chức vụ đúng -> Cho đi tiếp
  } else {
    res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này!' });
  }
};