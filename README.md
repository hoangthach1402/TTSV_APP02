# TTS Student App

Nhỏ gọn Express app để nhập thông tin sinh viên và lưu vào `student.json` ở root.

Chạy local (node):

```bash
npm install
npm start
```

Mở http://localhost:3005 để truy cập form. Dữ liệu sẽ được thêm vào `student.json`.

Chạy với Docker:

```bash
# build image
docker build -t ttsv_app:latest .

# chạy container (port 3005)
docker run -p 3005:3005 -e ADMIN_KEY=secret -v $(pwd)/student.json:/usr/src/app/student.json --restart unless-stopped ttsv_app:latest
```

Hoặc dùng docker-compose:

```bash
docker compose up -d --build
```

Lưu ý: thay `ADMIN_KEY` bằng giá trị mạnh khi deploy.

