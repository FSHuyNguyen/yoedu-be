# PERMISSION.md

# YOEDU - Permission Matrix

## 1. Vai trò hệ thống

| Role    | Mô tả                        |
| ------- | ---------------------------- |
| ADMIN   | Quản trị hệ thống            |
| STAFF   | Nhân viên vận hành trung tâm |
| TEACHER | Giáo viên                    |
| STUDENT | Học viên                     |
| PARENT  | Phụ huynh                    |

---

# 2. Dashboard

| Chức năng | ADMIN | STAFF | TEACHER | STUDENT | PARENT |
| --------- | ----- | ----- | ------- | ------- | ------ |
| Dashboard | ✅     | ✅     | ✅       | ✅       | ✅      |

---

# 3. Quản lý tài khoản (User)

| Chức năng           | ADMIN | STAFF | TEACHER | STUDENT | PARENT |
| ------------------- | ----- | ----- | ------- | ------- | ------ |
| Danh sách tài khoản | ✅     | ❌     | ❌       | ❌       | ❌      |
| Chi tiết tài khoản  | ✅     | ❌     | ❌       | ❌       | ❌      |
| Tạo tài khoản       | ✅     | ❌     | ❌       | ❌       | ❌      |
| Cập nhật tài khoản  | ✅     | ❌     | ❌       | ❌       | ❌      |
| Khóa tài khoản      | ✅     | ❌     | ❌       | ❌       | ❌      |

---

# 4. Khóa học (Course)

> Course là chương trình học chuẩn của trung tâm.

Ví dụ:

* IELTS Foundation
* IELTS Advanced
* TOEIC 500+

| Chức năng          | ADMIN | STAFF | TEACHER | STUDENT | PARENT |
| ------------------ | ----- | ----- | ------- | ------- | ------ |
| Danh sách khóa học | ✅     | ✅     | ❌       | ❌       | ❌      |
| Chi tiết khóa học  | ✅     | ✅     | ❌       | ❌       | ❌      |
| Tạo khóa học       | ✅     | ✅     | ❌       | ❌       | ❌      |
| Cập nhật khóa học  | ✅     | ✅     | ❌       | ❌       | ❌      |

---

# 5. Phòng học (Room)

| Chức năng       | ADMIN | STAFF | TEACHER | STUDENT | PARENT |
| --------------- | ----- | ----- | ------- | ------- | ------ |
| Danh sách phòng | ✅     | ✅     | ❌       | ❌       | ❌      |
| Chi tiết phòng  | ✅     | ✅     | ❌       | ❌       | ❌      |
| Tạo phòng       | ✅     | ✅     | ❌       | ❌       | ❌      |
| Cập nhật phòng  | ✅     | ✅     | ❌       | ❌       | ❌      |

---

# 6. Ca học cố định (Schedule Slot)

| Chức năng        | ADMIN | STAFF | TEACHER | STUDENT | PARENT |
| ---------------- | ----- | ----- | ------- | ------- | ------ |
| Danh sách ca học | ✅     | ✅     | ❌       | ❌       | ❌      |
| Chi tiết ca học  | ✅     | ✅     | ❌       | ❌       | ❌      |
| Tạo ca học       | ✅     | ✅     | ❌       | ❌       | ❌      |
| Cập nhật ca học  | ✅     | ✅     | ❌       | ❌       | ❌      |

---

# 7. Giáo viên (Teacher)

| Chức năng           | ADMIN | STAFF | TEACHER      | STUDENT | PARENT |
| ------------------- | ----- | ----- | ------------ | ------- | ------ |
| Danh sách giáo viên | ✅     | ✅     | ❌            | ❌       | ❌      |
| Chi tiết giáo viên  | ✅     | ✅     | Chỉ bản thân  | ❌       | ❌      |
| Tạo giáo viên       | ✅     | ❌     | ❌            | ❌       | ❌      |
| Cập nhật giáo viên  | ✅     | ❌     | ❌            | ❌       | ❌      |

---

# 8. Học viên (Student)

| Chức năng          | ADMIN | STAFF | TEACHER               | STUDENT  | PARENT       |
| ------------------ | ----- | ----- | --------------------- | -------- | ------------ |
| Danh sách học viên | ✅     | ✅     | Chỉ học viên lớp mình | ❌        | ❌            |
| Chi tiết học viên  | ✅     | ✅     | Chỉ học viên lớp mình | Bản thân | Con của mình |
| Tạo học viên       | ✅     | ✅     | ❌                     | ❌        | ❌            |
| Cập nhật học viên  | ✅     | ✅     | ❌                     | ❌        | ❌            |

---

# 9. Lớp học (Course Class)

> Đây là module trung tâm của Teacher.

| Chức năng     | ADMIN | STAFF | TEACHER          | STUDENT          | PARENT               |
| ------------- | ----- | ----- | ---------------- | ---------------- | -------------------- |
| Danh sách lớp | ✅     | ✅     | Chỉ lớp mình dạy | Chỉ lớp đang học | Chỉ lớp con đang học |
| Chi tiết lớp  | ✅     | ✅     | Chỉ lớp mình dạy | Chỉ lớp đang học | Chỉ lớp con đang học |
| Tạo lớp       | ✅     | ✅     | ❌                | ❌                | ❌                    |
| Cập nhật lớp  | ✅     | ✅     | ❌                | ❌                | ❌                    |

---

# 10. Lịch học / Buổi học (CourseClassSession)

| Chức năng             | ADMIN | STAFF | TEACHER          | STUDENT          | PARENT               |
| --------------------- | ----- | ----- | ---------------- | ---------------- | -------------------- |
| Xem lịch học          | ✅     | ✅     | Chỉ lớp mình dạy | Chỉ lớp đang học | Chỉ lớp con đang học |
| Xem chi tiết buổi học | ✅     | ✅     | Chỉ lớp mình dạy | Chỉ lớp đang học | Chỉ lớp con đang học |
| Hoàn thành buổi học   | ✅     | ✅     | ✅                | ❌                | ❌             |
| Hủy buổi học          | ✅     | ✅     | ❌                | ❌                | ❌             |

---

# 11. Điểm danh (Attendance)

| Chức năng           | ADMIN | STAFF | TEACHER          | STUDENT      | PARENT           |
| ------------------- | ----- | ----- | ---------------- | ------------ | ---------------- |
| Xem điểm danh       | ✅     | ✅     | Chỉ lớp mình dạy | Chỉ bản thân | Chỉ con của mình |
| Điểm danh           | ✅     | ✅     | Chỉ lớp mình dạy | ❌            | ❌                |
| Chỉnh sửa điểm danh | ✅     | ✅     | Chỉ lớp mình dạy | ❌            | ❌                |

---

# 12. Kết quả học tập (Learning Result)

| Chức năng        | ADMIN | STAFF | TEACHER          | STUDENT  | PARENT       |
| ---------------- | ----- | ----- | ---------------- | -------- | ------------ |
| Xem kết quả      | ✅     | ✅     | Chỉ lớp mình dạy | Bản thân | Con của mình |
| Tạo kết quả      | ✅     | ✅     | Chỉ lớp mình dạy | ❌        | ❌            |
| Cập nhật kết quả | ✅     | ✅     | Chỉ lớp mình dạy | ❌        | ❌            |

---

# 13. Ghi danh lớp (Enrollment)

| Chức năng              | ADMIN | STAFF | TEACHER          | STUDENT | PARENT |
| ---------------------- | ----- | ----- | ---------------- | ------- | ------ |
| Xem danh sách ghi danh | ✅     | ✅     | ❌ | ❌       | ❌      |
| Ghi danh học viên      | ✅     | ✅     | ❌                | ❌       | ❌      |
| Hủy ghi danh           | ✅     | ✅     | ❌                | ❌       | ❌      |

---

# 14. Hóa đơn học phí (Tuition Invoice)

| Chức năng         | ADMIN | STAFF | TEACHER | STUDENT              | PARENT              |
| ----------------- | ----- | ----- | ------- | -------------------- | ------------------- |
| Danh sách hóa đơn | ✅     | ✅     | ❌       | Chỉ hóa đơn của mình | Chỉ hóa đơn của con |
| Chi tiết hóa đơn  | ✅     | ✅     | ❌       | Chỉ hóa đơn của mình | Chỉ hóa đơn của con |
| Tạo hóa đơn       | ✅     | ✅     | ❌       | ❌                    | ❌                   |

---

# 15. Thanh toán (Payment)

| Chức năng            | ADMIN | STAFF | TEACHER | STUDENT                 | PARENT                 |
| -------------------- | ----- | ----- | ------- | ----------------------- | ---------------------- |
| Danh sách thanh toán | ✅     | ✅     | ❌       | Chỉ thanh toán của mình | Chỉ thanh toán của con |
| Tạo thanh toán       | ✅     | ✅     | ❌       | ❌                       | ❌                      |

---

# 16. Khuyến mãi (Promotion)

| Chức năng            | ADMIN | STAFF | TEACHER | STUDENT | PARENT |
| -------------------- | ----- | ----- | ------- | ------- | ------ |
| Danh sách khuyến mãi | ✅     | ✅     | ❌       | ❌       | ❌      |
| Chi tiết khuyến mãi  | ✅     | ✅     | ❌       | ❌       | ❌      |
| Tạo khuyến mãi       | ✅     | ✅     | ❌       | ❌       | ❌      |

---

# 17. Xin nghỉ học (Leave Request)

| Chức năng      | ADMIN | STAFF | TEACHER          | STUDENT  | PARENT       |
| -------------- | ----- | ----- | ---------------- | -------- | ------------ |
| Xem đơn nghỉ   | ✅     | ✅     | Chỉ lớp mình dạy | Bản thân | Con của mình |
| Tạo đơn nghỉ   | ❌     | ❌     | ❌                | ✅        | ✅            |
| Duyệt đơn nghỉ | ✅     | ✅     | ❌                | ❌        | ❌            |

---

# 18. Thông báo (Notification)

| Chức năng       | ADMIN | STAFF | TEACHER | STUDENT | PARENT |
| --------------- | ----- | ----- | ------- | ------- | ------ |
| Xem thông báo   | ✅     | ✅     | ✅       | ✅       | ✅      |
| Đánh dấu đã đọc | ✅     | ✅     | ✅       | ✅       | ✅      |

---

# 19. Nhật ký hoạt động (Activity Log)

| Chức năng        | ADMIN | STAFF | TEACHER | STUDENT | PARENT |
| ---------------- | ----- | ----- | ------- | ------- | ------ |
| Xem Activity Log | ✅     | ❌     | ❌       | ❌       | ❌      |

---

# Nguyên tắc phân quyền Teacher

Teacher không làm việc trực tiếp với Course.

Teacher làm việc dựa trên CourseClass.

Teacher chỉ được truy cập dữ liệu khi:

* Là giáo viên chính của lớp
* Là trợ giảng của lớp

Từ CourseClass sẽ suy ra quyền trên:

* Student
* Session
* Attendance
* LearningResult
* LeaveRequest

Mọi API của Teacher nên kiểm tra:

Teacher có thuộc CourseClass này hay không?
