# Những lưu ý khi deploy BackEnd

## Không deploy lên render.com được

Render.com không cho phép sqllite cũng như upload ảnh ở plan free => recommend deploy trên vps cá nhân

> Có hướng dẫn ở blog

## Deploy lên VPS

Khi deploy lên VPS thì không đẩy file database (`/server/prisma/dev.db`) và folder `uploads` lên VPS.

Vì database ở local của các bạn nó khác database trên VPS (môi trường production).

ví dụ: Khi bạn upload ảnh ở local thì đường link ảnh là `http://localhost:4000/static/anh.jpg` và url này sẽ được lưu trong `dev.db`. Nếu các bạn dùng file `dev.db` này ở VPS thì kết quả API trả về khi gọi các api có chứa ảnh là `http://localhost:4000/static/anh.jpg`. Rõ ràng url này không dùng được, kết quả đúng phải là `http://yourdomain.com/static/anh.jpg`.

Ở vps, khi các bạn clone project backend về rồi, để khởi tạo database ngay lần đầu tiên thì các bạn chạy câu lệnh prisma sau.

Nhớ `cd` vào trong thư mục server

```bash
npx prisma db push
```
