# Thông tin sinh viên :
Họ Tên : Võ Văn Linh 
Mã Sinh Viên : 23730371
# 🎓 Hệ thống Quản lý Sinh viên (Student Management System)

Một ứng dụng full-stack hoàn chỉnh chuyên về quản lý dữ liệu sinh viên. Được thiết kế chuyên nghiệp với kiến trúc hiện đại, tập trung vào hiệu suất, tính dễ dùng và tính thẩm mỹ cao cấp với phong cách **Dark Mode Glassmorphism**.

## 🌟 Tính năng Nổi bật

- **Giao diện Tuyệt đẹp:** Thiết kế cao cấp sử dụng Tailwind CSS với các hiệu ứng kính mờ (glassmorphism), neon phát sáng (glowing shadows), tối màu toàn diện, và hoạt ảnh mượt mà.
- **Micro-Interactions (Tương tác siêu nhỏ):**
  - Thanh trượt mượt mà (slider) cho việc nhập điểm GPA trực quan.
  - Phản hồi hành động thời gian thực (Toast Notifications) cực kì nhạy bén và đẹp mắt.
  - Xác nhận Xóa dữ liệu an toàn ngay tại dòng (Inline Delete) thay vì mở popup khó chịu.
  - Hệ thống huy hiệu GPA đổi màu tự động (Xanh/Vàng/Đỏ tùy theo thành tích).
- **Tìm kiếm rảnh tay:** Thanh tìm kiếm trực tiếp có thể lọc mọi thông tin (Tên, MSSV, Ngành học) theo thời gian thực mà không trễ nhịp.

## 🛠️ Công nghệ Sử dụng

- **Frontend:**
  - `React.js` (chạy trên core nền tảng cực nhanh là `Vite`)
  - `Tailwind CSS` (hệ thống CSS class tối tân)
  - `Lucide React` (thư viện biểu tượng SVG đẹp nhất hiện nay)
  - `React Router DOM` cho điều hướng trang đơn.
  - `Axios` để kết nối API và `React Hot Toast` cho thông báo.
- **Backend:**
  - `FastAPI` (framework Python tốc độ cao, hoàn hảo cho API)
  - `SQLAlchemy` & `Pydantic` (Quản lý Database và Schema validation)
  - Lưu trữ trên cơ sở dữ liệu siêu nhẹ `SQLite` (`students.db`).
  - Server được chạy bởi `Uvicorn`.

## 📂 Cấu trúc Thư mục Hệ thống

```text
student-management/
├── backend/
│   ├── requirements.txt      # Gói phần mềm Python
│   ├── database.py           # Thiết lập kết nối SQLite
│   ├── models.py             # Cấu trúc bảng CSDL (SQLAlchemy)
│   ├── schemas.py            # Quy chuẩn kiểu dữ liệu (Pydantic)
│   ├── crud.py               # Lệnh thao tác logic với CSDL 
│   ├── main.py               # Đầu não FastAPI và Routes API
│   └── students.db           # (Auto-gen) Database gốc của bạn
└── frontend/
    ├── package.json          # Gói node modules
    ├── tailwind.config.js    # Tùy biến Tailwind
    └── src/
        ├── api.js            # Khai báo máy chủ trung tâm (Axios)
        ├── App.jsx           # Bố cục layout và Cảnh báo
        ├── index.css         # Reset và Glassmorphism Base
        └── components/       
            ├── StudentList.jsx  # Bảng danh mục và Thống kê
            └── StudentForm.jsx  # Form nộp và chỉnh sửa
```

---

## 🚀 Hướng dẫn Cài đặt & Chạy Phần mềm

Để hệ thống hoạt động, bạn sẽ cần khởi chạy độc lập 2 máy chủ: một cho Giao diện (Frontend) và một cho Máy chủ Xử lý Dữ liệu (Backend).

### BƯỚC 1: Khởi Động Máy Chủ Dữ Liệu (Backend)

1. Mở Terminal (Cửa sổ Dòng Lệnh).
2. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
3. (Tùy chọn nhưng khuyến nghị) Tạo môi trường ảo:
   ```bash
   python -m venv venv
   # Nếu dùng Windows:
   venv\Scripts\activate
   # Nếu dùng macOS/Linux:
   source venv/bin/activate
   ```
4. Cài đặt các thư viện lõi của dự án:
   ```bash
   pip install -r requirements.txt
   ```
5. Đóng cầu dao khởi động Uvicorn:
   ```bash
   uvicorn main:app --reload
   ```
   *Lúc này Server API sẽ hoạt động tại `http://127.0.0.1:8000`. Bạn có thể theo dõi tài liệu cấu trúc API trực quan bằng cách truy xuất tự động tại `http://127.0.0.1:8000/docs`.*

### BƯỚC 2: Khởi Động Giao Diện Trực Quan (Frontend)

1. Cũng tại cửa sổ Dòng Lệnh (nên thêm một Tab Terminal mới dấu `+`), trỏ vào thư mục Frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt các gói thư viện Node.js:
   ```bash
   npm install
   ```
3. Chạy lệnh kích hoạt giao diện tốc độ ánh sáng qua Vite:
   ```bash
   npm run dev
   ```
   *Vite sẽ thường mở đường truyền tại `http://localhost:5173`. Chỉ cần bấm vào link này (Ctrl + Click) để chiêm ngưỡng thế giới dữ liệu quản lý.*

---

## 💻 Thiết Khái Khoát về API Cốt Lõi

Mọi kết nối dữ liệu được thiết lập chặt chẽ tại Server chạy qua `RESTful API`. Đây là các hành vi minh họa:

### Thêm Mới Hồ Sơ Sinh Viên (`POST /students`)
**Request Body:**
```json
{
  "student_id": "SE2001",
  "name": "Nguyên Nguyệt Chi",
  "birth_year": 2004,
  "major": "Kỹ thuật Phầm mềm",
  "gpa": 3.92
}
```

### Yêu Cầu Xuất Toàn Bộ Danh Sách (`GET /students`)
Hệ thống sẽ phản hồi lại chuỗi mảng JSON chứa 100% hồ sơ học sinh.

### Cập Nhật Dữ Liệu Chuyên Môn (`PUT /students/SE2001`)
Cho phép sửa đổi điểm GPA, ngành nghề hoặc tên (Thông qua giao diện, Mã Sinh viên ID bị vô hiệu hóa chỉnh sửa để đảm bảo tính nhất quán của Root CSDL).

### Loại Bỏ Hồ Sơ Hệ Thống (`DELETE /students/SE2001`)
Lệnh gọi tiêu diệt hồ sơ vĩnh viễn trực tiếp trong Database (`students.db`), đi kèm với phản hồi HTTP 200 OK từ Server.
