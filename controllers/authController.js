const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. API Đăng ký tài khoản
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email đã được sử dụng!' });

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Lưu User mới vào Database
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Đăng ký thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// 2. API Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email không tồn tại!' });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu!' });

    // Tạo Token (Thẻ căn cước) có thời hạn 1 ngày
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // Trả về thông tin user (ẩn password đi) và Token cho Frontend
    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token: token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};