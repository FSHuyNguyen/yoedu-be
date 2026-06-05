# 📘 YOEDU Database Architecture (Prisma Version)

## 📌 Overview

YOEDU là hệ thống quản lý trung tâm đào tạo (Education Management System) được thiết kế theo hướng:

- Clean Architecture (Domain separation)
- Multi-role system (ADMIN / STAFF / TEACHER / STUDENT / PARENT)
- Course → Class → Enrollment model chuẩn nghiệp vụ
- Tách biệt User (auth) và Domain entities
- Sẵn sàng scale sang NestJS / Spring Boot / Microservices

---

# 🧠 Core Design Principles

## 1. User là root authentication layer

Tất cả tài khoản đăng nhập đều đi qua `User`.

User
 ├── Student
 ├── Teacher
 ├── Parent

Vai trò của User:
- Authentication (JWT / Session)
- Global profile (email, password, phone)
- Role-based access control (RBAC)

---

## 2. Domain-specific data tách khỏi User

- Student → học tập
- Teacher → giảng dạy
- Parent → quản lý con

---

## 3. Course vs CourseClass

Course = chương trình học  
CourseClass = lớp học thực tế

Ví dụ:
- Course: React Basic
- CourseClass:
  - React Basic K01
  - React Basic K02

---

## 4. Enrollment theo Class

Student → Enrollment → CourseClass

---

## 5. Finance tách riêng domain

- Invoice (hóa đơn)
- Payment (thanh toán)
- Promotion (giảm giá)

---

# 🧱 System Architecture Overview

USER DOMAIN
User
 ├── Student
 ├── Teacher
 ├── Parent

ACADEMIC DOMAIN
Course → CourseClass
                 ├── Room
                 ├── ScheduleSlot
                 ├── Teacher

Student → Enrollment → CourseClass
        → Attendance
        → LearningResult
        → LeaveRequest

FINANCE DOMAIN
Student → TuitionInvoice → Payment
                └── Promotion

SYSTEM DOMAIN
Notification
ActivityLog

---

# 🔐 Authentication Domain

## 👤 User

Thông tin đăng nhập và profile cơ bản.

Fields:
- email (unique)
- password
- fullName
- phone / address
- gender
- role
- status

Roles:
ADMIN   → toàn quyền  
STAFF   → vận hành hệ thống (kế toán / CSKH / học vụ)  
TEACHER → giảng dạy  
STUDENT → học viên  
PARENT  → phụ huynh  

---

## 👨‍🎓 Student

Fields:
- studentCode
- gradeLevel
- schoolName
- latestTestScore
- learningGoal
- status:
  - ACTIVE → đang học
  - PAUSED → tạm nghỉ
  - DROPPED → đã dừng học

Relations:
- User (1–1)
- Parent (optional)
- Enrollment (1–N)

---

## 👨‍🏫 Teacher

Fields:
- teacherCode
- teacherRole:
  - TEACHER
  - ASSISTANT
  - BOTH
- specialization
- qualification
- yearsOfExperience
- status:
  - ACTIVE
  - PAUSED
  - INACTIVE

Relations:
- User (1–1)
- Course (1–N)

---

## 👨 Parent

Relations:
- User (1–1)
- Students (1–N)

---

# 📚 Academic Domain

## 📖 Course

- courseCode
- name
- tuitionFee
- totalSessions
- level
- status:
  - DRAFT
  - OPEN
  - CLOSED
  - DELETED

---

## 🏫 CourseClass

Fields:
- classCode
- courseId
- roomId
- scheduleSlotId
- mainTeacherId
- assistantTeacherId
- startDate / endDate
- maxStudents
- tuitionFee
- status:
  - OPEN
  - ONGOING
  - CLOSED
  - FULL

---

## 🏢 Room

- roomCode
- name
- capacity

---

## ⏰ ScheduleSlot

- weekday (2–8)
- startTime ("08:00")
- endTime ("10:00")

---

## 🧑‍🎓 Enrollment

Student → Enrollment → CourseClass

Status:
- ACTIVE
- PAUSED
- DROPPED
- COMPLETED

---

## 📋 Attendance

- courseClassId
- studentId
- attendanceDate
- status:
  - PRESENT
  - ABSENT
  - LATE
  - EXCUSED

---

## 📊 LearningResult

resultMonth = ngày đầu tháng (01/MM/YYYY)

---

## 📝 LeaveRequest

- studentId
- courseClassId
- leaveDate
- reason
- status:
  - PENDING
  - APPROVED
  - REJECTED

---

# 💰 Finance Domain

## 🎟 Promotion

- promoCode
- discountType:
  - PERCENT
  - AMOUNT
- discountValue
- status:
  - ACTIVE
  - INACTIVE
  - SCHEDULED
  - EXPIRED

---

## 🧾 TuitionInvoice

Student + CourseClass + Month

- originalAmount
- discountAmount
- finalAmount
- amountPaid
- balanceAmount
- status:
  - UNPAID
  - PARTIAL
  - PAID
  - OVERPAID

---

## 💳 Payment

- invoiceId
- paidAmount
- paymentMethod:
  - CASH
  - BANK_TRANSFER
- cashierUserId

---

# 📡 System Domain

## 🔔 Notification

recipientType + recipientRefId

Types:
- ABSENCE
- TUITION
- GENERAL

---

## 📊 ActivityLog

Audit system:
- CREATE / UPDATE / DELETE / ACTION
- actorId
- entityType
- entityId

---

# 🔗 ERD Summary

User
 ├── Student
 ├── Teacher
 ├── Parent

Course
 └── CourseClass
        ├── Room
        ├── ScheduleSlot
        ├── Teacher

Student
 ├── Enrollment
 ├── Attendance
 ├── LearningResult
 ├── LeaveRequest
 └── TuitionInvoice
        └── Payment

Promotion → TuitionInvoice

Notification (global)
ActivityLog (audit)

---

# 🚀 Future Extensions

- Lesson / Chapter system
- Online learning
- Quiz / Assignment
- Certificate
- RBAC permission system
- AI assistant