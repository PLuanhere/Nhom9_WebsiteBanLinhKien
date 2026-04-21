# SnowIce - Website Bán Linh Kiện Điện Tử

SnowIce là dự án website bán linh kiện điện tử được xây dựng theo hướng Frontend tĩnh (HTML, CSS, JavaScript), tối ưu cho mục tiêu học tập và demo giao diện thương mại điện tử.

## 1. Tổng quan

- Loại dự án: Frontend static website.
- Nguồn dữ liệu sản phẩm: file JSON nội bộ.
- Ngôn ngữ/chuẩn sử dụng:
  - HTML5
  - CSS3
  - JavaScript (Vanilla JS)
  - Bootstrap 5
  - Font Awesome

## 2. Tính năng chính

- Trang chủ/landing page với banner, danh mục nổi bật và điều hướng đầy đủ.
- Danh sách sản phẩm:
  - Tải dữ liệu từ data/products.json.
  - Lọc theo danh mục.
  - Lọc theo khoảng giá (chip nhanh + slider).
  - Lọc theo đánh giá sao.
  - Sắp xếp giá tăng/giảm.
  - Phân trang danh sách.
- Tìm kiếm:
  - Tìm theo từ khóa trên trang sản phẩm.
  - Gợi ý tìm kiếm (suggestion box) theo tên sản phẩm.
  - Tìm kiếm gần đúng (Levenshtein) trong JS/search.js.
- Trang chi tiết sản phẩm:
  - Gallery ảnh sản phẩm.
  - Tabs thông tin (Mô tả, Đánh giá, Thông số kỹ thuật).
- Luồng tài khoản cơ bản:
  - Đăng ký (kiểm tra hợp lệ thông tin, mật khẩu mạnh).
  - Đăng nhập (validate email/mật khẩu).
  - Quên mật khẩu 3 bước (lưu email tạm vào localStorage, OTP mô phỏng, đặt lại mật khẩu).
- Trang liên hệ:
  - Form liên hệ có kiểm tra dữ liệu đầu vào bằng JavaScript.

## 3. Cấu trúc thư mục

```text
.
|-- index.html                        // Trang vào chính của website
|-- README.md                         // Tài liệu mô tả dự án
|-- CSS/                              // Chứa toàn bộ file giao diện
|   |-- default.css                   // CSS mặc định dùng chung
|   |-- header.css                    // Style phần header
|   |-- footer.css                    // Style phần footer
|   |-- home.css                      // Style trang chủ
|   |-- product.css                   // Style trang chi tiết sản phẩm
|   `-- ...                           // Các file CSS khác
|-- HTML/                             // Chứa các trang chức năng
|   |-- HomePage.html                 // Trang chủ
|   |-- Products.html                 // Trang danh sách sản phẩm
|   |-- ProductDetail.html            // Trang chi tiết sản phẩm
|   |-- GioHang.html                  // Trang giỏ hàng
|   |-- Checkout.html                 // Trang thanh toán
|   `-- ...                           // Các trang HTML khác
|-- IMG/                              // Tài nguyên hình ảnh
|   |-- HomeProducts/                 // Ảnh cho khối sản phẩm ở trang chủ
|   |-- Products/                     // Ảnh sản phẩm
|   |-- Profile/                      // Ảnh hồ sơ/tài khoản
|   `-- ...                           // Các nhóm ảnh khác
|-- JS/                               // Logic xử lý phía client
|   |-- products_page.js              // Lọc/sắp xếp/phân trang sản phẩm
|   |-- search.js                     // Xử lý tìm kiếm
|   |-- suggestionbox.js              // Gợi ý từ khóa tìm kiếm
|   |-- frmDangNhap.js                // Validate form đăng nhập
|   |-- frmDangKy.js                  // Validate form đăng ký
|   `-- ...                           // Các file JavaScript khác
`-- data/                             // Dữ liệu mô phỏng
  `-- products.json                 // Danh sách sản phẩm mẫu
```

## 4. Hướng dẫn chạy dự án

1. Mở folder dự án bằng VS Code.
2. Cài extension Live Server (nếu chưa có).
3. Chuột phải vào index.html -> Open with Live Server.
4. Trình duyệt sẽ mở website tại địa chỉ local (ví dụ: http://127.0.0.1:5500/).


## 5. Các trang chính để test

- Trang gốc: /index.html
- Trang chủ: /HTML/HomePage.html
- Danh sách sản phẩm: /HTML/Products.html
- Chi tiết sản phẩm: /HTML/ProductDetail.html
- Giỏ hàng: /HTML/GioHang.html
- Thanh toán: /HTML/Checkout.html
- Đăng nhập: /HTML/FrmDangNhap.html
- Đăng ký: /HTML/FrmDangKy.html
- Quên mật khẩu:
  - /HTML/QuenMatKhau_Buoc1.html
  - /HTML/QuenMatKhau_Buoc2.html
  - /HTML/QuenMatKhau_Buoc3.html
- Liên hệ: /HTML/Contact.html
- Giới thiệu: /HTML/About.html

## 6. Dữ liệu sản phẩm

File data/products.json đang chứa bộ dữ liệu mẫu gồm:

- Tổng 100 sản phẩm.
- Nhóm sản phẩm khuyến mãi và nhóm sản phẩm thường.
- Danh mục và type sản phẩm phục vụ bộ lọc.
