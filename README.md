## Prisma 
-- format: npx prisma format (Format file schema.prisma)
-- Validate: npx prisma validate (Kiểm tra lỗi trước khi migration)
-- Reset: npx prisma migrate reset (Reset lại toàn bộ các dữ liệu trong DB)
-- sync schema with db: npx prisma db push (Dùng khi muốn sync nhanh schema → DB)
-- generate: npx prisma generate (Dùng khi updated các thay đổi trong scheme để tránh Prisma Client bị outdated)
-- npx prisma migrate deploy (Đồng bộ các scheme nếu chưa có)
-- new migration: npx prisma migrate dev --name init (Dùng khi muốn lưu log migration để quản lý version DB)
-- Run Seed: npx prisma db seed (Dùng để insert dữ liệu mẫu)
