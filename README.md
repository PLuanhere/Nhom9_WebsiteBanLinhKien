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
|-- index.html
|-- README.md
|-- CSS/
|-- HTML/
|-- IMG/
|-- JS/
`-- data/
    `-- products.json
```

Chi tiết:

- CSS/: Toàn bộ style cho từng trang và các thành phần dùng chung (header, footer, dropdown, suggestionbox...).
- HTML/: Các trang con (HomePage, Products, ProductDetail, GioHang, Checkout, Contact, About, tài khoản...).
- JS/: Logic tương tác người dùng (tìm kiếm, lọc sản phẩm, validate form, carousel...).
- data/products.json: Dữ liệu mẫu sản phẩm cho trang danh sách.

## 4. Hướng dẫn chạy dự án

### Cách 1: Live Server (khuyến nghị)

1. Mở folder dự án bằng VS Code.
2. Cài extension Live Server (nếu chưa có).
3. Chuột phải vào index.html -> Open with Live Server.
4. Trình duyệt sẽ mở website tại địa chỉ local (ví dụ: http://127.0.0.1:5500/).

### Cách 2: Dùng static server bất kỳ

Có thể dùng bất kỳ static server nào, ví dụ:

```bash
npx serve .
```

Sau đó mở URL được cung cấp bởi server.

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

## 7. Lưu ý kỹ thuật hiện tại

- Một số trang đang tham chiếu đến các file JS chưa tồn tại:
  - JS/local_storage_bridge.js
  - JS/app_state.js
- JS/about_script.js hiện đang trống (chưa có logic).
- Suggestion box sử dụng fetch("../data/products.json"): hoạt động tốt ở các trang trong thư mục HTML, nhưng có thể không đúng đường dẫn khi mở từ index.html nếu không cấu hình lại đường dẫn.

## 8. Định hướng cải tiến

- Bổ sung backend/API để quản lý tài khoản, giỏ hàng, đơn hàng.
- Đồng bộ dữ liệu giỏ hàng và trạng thái đăng nhập bằng localStorage hoặc API.
- Bổ sung script còn thiếu (local_storage_bridge.js, app_state.js) hoặc bỏ tham chiếu nếu chưa sử dụng.
- Thêm bộ test giao diện/cơ bản cho các luồng quan trọng.

---

Nếu bạn cần, có thể mở rộng README theo hướng:

- Hướng dẫn contributor (quy tắc đặt tên file, commit message).
- Checklist test thủ trước khi merge.
- Chụp màn hình từng trang (screenshots) để dễ demo dự án.
