const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
  
const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password, phone, address } = req.body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email đã được sử dụng!' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Lưu thêm phone và address vào DB
      const newUser = new User({ name, email, password: hashedPassword, phone, address });
      await newUser.save();
      
      res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server khi đăng ký', error });
    }
  },

  // 2. Đăng nhập
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu!' });

      // Cấp Token
      const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET || 'tinhhoahonviet_secret_key', 
        { expiresIn: '1d' }
      );

      res.status(200).json({ message: 'Đăng nhập thành công!', token, user: { name: user.name, role: user.role, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server khi đăng nhập', error });
    }
  },

  // 3. Lấy thông tin cá nhân (Profile)
  getProfile: async (req, res) => {
    try {
      // Tìm user theo ID trong Token, loại bỏ trường password để bảo mật
      const user = await User.findById(req.user.id).select('-password');
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi lấy thông tin cá nhân', error });
    }
  },

  // 4. Cập nhật thông tin cá nhân
  updateProfile: async (req, res) => {
    try {
      const { name, phone, address } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { name, phone, address },
        { new: true } // Trả về data mới sau khi update
      ).select('-password');
      
      res.status(200).json({ message: 'Cập nhật thành công', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi cập nhật thông tin', error });
    }
  },

  // 5. Gửi mã OTP Quên Mật Khẩu
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'Email này chưa được đăng ký!' });

      // Tạo mã OTP 6 chữ số ngẫu nhiên
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.resetOtp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP sống được 10 phút
      await user.save();

      // Cấu hình Bưu tá (Thay email và mật khẩu của bạn vào đây)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'youknowwho5225@gmail.com', // VD: tinhhoahonviet@gmail.com
          pass: 'yxgx wotu ghsw ailo'        // Lấy ở cài đặt Google (Xem lưu ý bên dưới)
        }
      });

      const mailOptions = {
        from: 'Hệ Thống Tinh Hoa Hồn Việt',
        to: email,
        subject: 'Mã OTP Khôi Phục Mật Khẩu',
        html: `<h3>Xin chào ${user.name},</h3>
               <p>Mã bảo mật để khôi phục mật khẩu của bạn là: <b style="color:red; font-size:24px;">${otp}</b></p>
               <p>Mã này sẽ hết hạn sau 10 phút. Tuyệt đối không chia sẻ cho người khác!</p>`
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Mã OTP đã được gửi đến email của bạn!' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi gửi email', error });
    }
  },

  // 6. Đặt lại Mật Khẩu Mới
  resetPassword: async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      const user = await User.findOne({ email });

      if (!user) return res.status(404).json({ message: 'Email không hợp lệ!' });
      if (user.resetOtp !== otp) return res.status(400).json({ message: 'Mã OTP không chính xác!' });
      if (user.otpExpires < Date.now()) return res.status(400).json({ message: 'Mã OTP đã hết hạn!' });

      // Hợp lệ -> Tiến hành đổi mật khẩu
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetOtp = ''; // Dùng xong thì xóa mã đi
      await user.save();

      res.status(200).json({ message: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập.' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi hệ thống khi đổi mật khẩu', error });
    }
  },
  // 7. Đổi mật khẩu (Dành cho người đã đăng nhập)
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id);

      // 1. Kiểm tra xem mật khẩu cũ (khách nhập) có khớp với DB không
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng!' });

      // 2. Băm (Hash) mật khẩu mới và lưu lại
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.status(200).json({ message: 'Đổi mật khẩu thành công!' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server khi đổi mật khẩu', error });
    }
  }
};

module.exports = authController;