const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'Từ chối truy cập. Bạn chưa đăng nhập!' });

  try {
    const token = authHeader.split(' ')[1]; 
    
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = verified; 
    next(); 
  } catch (err) {
    res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};

exports.verifyAdminOrStaff = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'staff') {
    next(); 
  } else {
    res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này!' });
  }
};