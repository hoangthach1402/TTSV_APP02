const express = require('express');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const app = express();
const PORT = process.env.PORT || 3005;
const ADMIN_KEY = process.env.ADMIN_KEY || 'thachdeptrai';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'student.json');

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const FIELDS = [
  'fullName',
  'mssv',
  'lopHoc',
  'ngaySinh',
  'gioiTinh',
  'soBHXH',
  'tinhThanhPho',
  'maTinhLh',
  'quanHuyen',
  'maHuyenLh',
  'phuongXa',
  'maXaLh',
  'soNha',
  'danToc',
  'quocTich',
  'cccd'
];

app.post('/submit', (req, res) => {
  const student = {};
  FIELDS.forEach(f => {
    student[f] = (req.body[f] || '').toString();
  });
  student._createdAt = new Date().toISOString();

  const data = readData();
  data.push(student);
  try {
    writeData(data);
    res.send('<p>Đã lưu học viên. <a href="/">Quay lại</a></p>');
  } catch (err) {
    console.error('Write error', err);
    res.status(500).send('Lỗi khi lưu dữ liệu');
  }
});

app.get('/students', (req, res) => {
  res.json(readData());
});

// --- admin endpoints ---
function checkAdminKey(req, res) {
  const key = req.query.key || req.headers['x-admin-key'];
  if (!key || key !== ADMIN_KEY) {
    res.status(401).send('Unauthorized');
    return false;
  }
  return true;
}

app.get('/admin/data', (req, res) => {
  if (!checkAdminKey(req, res)) return;
  res.json(readData());
});

// Serve admin UI (hidden link, accessible by direct URL)
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/admin/export', async (req, res) => {
  if (!checkAdminKey(req, res)) return;
  const data = readData();
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Students');
  ws.columns = [
    { header: 'Họ và tên', key: 'fullName' },
    { header: 'MSSV', key: 'mssv' },
    { header: 'Lớp học', key: 'lopHoc' },
    { header: 'Ngày sinh', key: 'ngaySinh' },
    { header: 'Giới tính', key: 'gioiTinh' },
    { header: 'Số BHXH cũ', key: 'soBHXH' },
    { header: 'Tỉnh/Thành Phố', key: 'tinhThanhPho' },
    { header: 'maTinhLh', key: 'maTinhLh' },
    { header: 'Quận/Huyện', key: 'quanHuyen' },
    { header: 'maHuyenLh', key: 'maHuyenLh' },
    { header: 'Phường/Xã', key: 'phuongXa' },
    { header: 'maXaLh', key: 'maXaLh' },
    { header: 'Số nhà', key: 'soNha' },
    { header: 'Dân tộc', key: 'danToc' },
    { header: 'Quốc tịch', key: 'quocTich' },
    { header: 'CCCD', key: 'cccd' },
    { header: 'CreatedAt', key: '_createdAt' }
  ];
  data.forEach(row => ws.addRow(row));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
  await wb.xlsx.write(res);
  res.end();
});

app.post('/admin/delete-all', (req, res) => {
  if (!checkAdminKey(req, res)) return;
  try {
    writeData([]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
