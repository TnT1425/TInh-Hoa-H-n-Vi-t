const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { region } = req.query; 
    let query = {};
    if (region) query.region = region; 

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : '';

    // 2. Gom dữ liệu chữ (tên, giá...) và dữ liệu ảnh lại
    const productData = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      region: req.body.region,
      stock: req.body.stock,
      image: imageUrl // Lưu link ảnh thật vào Database
    };

    // 3. Lưu vào Database
    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json({ 
      message: 'Thêm đặc sản thành công rực rỡ!', 
      product: newProduct 
    });
  } catch (error) {
    res.status(400).json({ message: 'Lỗi tạo sản phẩm, vui lòng kiểm tra dữ liệu', error: error.message });
  }
};

// [SỬA ĐẶC SẢN]
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.status(200).json({ message: 'Cập nhật thành công!', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật', error: error.message });
  }
};

// [XÓA ĐẶC SẢN]
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.status(200).json({ message: 'Đã xóa sản phẩm thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa', error: error.message });
  }
};

// Lấy thông tin 1 sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm!' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm', error });
  }
};


// --- THUẬT TOÁN TẠO REGEX CHO TỪNG TỪ ---
const createWordRegex = (word) => {
  // Biến 1 từ (VD: "thanh") thành mảng các ký tự linh hoạt hỗ trợ tiếng Việt
  const regexArray = word.toLowerCase().split('').map(char => {
    if ('aáàạảãâấầậẩẫăắằặẳẵ'.includes(char)) return '[aáàạảãâấầậẩẫăắằặẳẵ]';
    if ('eéèẹẻẽêếềệểễ'.includes(char)) return '[eéèẹẻẽêếềệểễ]';
    if ('iíìịỉĩ'.includes(char)) return '[iíìịỉĩ]';
    if ('oóòọỏõôốồộổỗơớờợởỡ'.includes(char)) return '[oóòọỏõôốồộổỗơớờợởỡ]';
    if ('uúùụủũưứừựửữ'.includes(char)) return '[uúùụủũưứừựửữ]';
    if ('yýỳỵỷỹ'.includes(char)) return '[yýỳỵỷỹ]';
    if ('dđ'.includes(char)) return '[dđ]';
    
    // Thêm // để an toàn nếu khách vô tình gõ các ký tự đặc biệt của code
    if ('\\[]^$*+?.()|{}'.includes(char)) return `\\${char}`; 
    return char;
  });
  return regexArray.join('');
};

// [TÍNH NĂNG TÌM KIẾM TỐI ƯU 3.0 - BAO CHUẨN]
exports.searchProducts = async (req, res) => {
  try {
    const keyword = req.query.q; 
    
    if (!keyword || keyword.trim() === "") {
      return res.status(200).json([]);
    }

    // 1. Tách chuỗi khách gõ thành các từ riêng biệt (VD: "nem thanh" -> ["nem", "thanh"])
    // Hàm filter(Boolean) giúp loại bỏ các khoảng trắng thừa nếu khách bấm nhầm nhiều dấu cách
    const words = keyword.trim().split(/\s+/).filter(Boolean);

    // 2. Tạo mảng điều kiện: Ép MongoDB phải tìm thấy TẤT CẢ các từ trong mảng
    const andConditions = words.map(word => ({
      name: { $regex: createWordRegex(word), $options: "i" }
    }));

    // 3. Tìm kiếm với toán tử $and
    const products = await Product.find({
      $and: andConditions
    })
    .limit(8)
    .sort({ sold: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thuật toán tìm kiếm', error: err.message });
  }
};