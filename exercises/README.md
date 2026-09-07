# Bài tập có chấm tự động

Bộ bài tập kèm auto-grader cho Stage 2 (SQL) và Stage 4 (Pandas). Chấm theo **kết quả trả về**, không chấm cách viết — nhiều cách giải khác nhau đều được điểm.

## Cài đặt (1 lần, ~2 phút)

```bash
cd exercises
python3 -m venv .venv
.venv/bin/pip install duckdb pandas
.venv/bin/python setup_db.py
```

`setup_db.py` sinh `practice.duckdb` với 5 bảng, dữ liệu ngẫu nhiên nhưng **seed cố định** (mọi người có cùng dữ liệu, cùng đáp án).

| Bảng | Dòng | Ghi chú |
|---|---|---|
| `customers` | 300 | 30 khách chưa từng mua — luyện anti-join |
| `products` | 80 | 5 category |
| `orders` | 2.000 | ~55 đơn có `customer_id` NULL — **bẫy `NOT IN`** |
| `order_items` | ~6.000 | Nhiều dòng/đơn — **bẫy fan-out**. Vài `unit_price` bất thường — luyện outlier |
| `events` | ~2.000 | Phễu view → cart → checkout → purchase, có cột device |

## Stage 2 — SQL (15 câu)

```bash
.venv/bin/python stage2_sql/grade.py --init   # tạo file đề trống
# viết bài vào stage2_sql/answers/q01.sql ... q15.sql
.venv/bin/python stage2_sql/grade.py          # chấm tất cả
.venv/bin/python stage2_sql/grade.py q05      # chấm 1 câu
```

Phân bố: 3 câu Easy (W3–W4) · 5 câu Medium (W5–W8) · 7 câu Hard (W7–W9).
Bao gồm các bẫy kinh điển: fan-out, `NOT IN` với NULL, chia số nguyên, `COUNT(*)` vs `COUNT(DISTINCT)`, top-N per group.

Grader báo lỗi cụ thể:
```
[FAIL] q06 (W5 · Medium)
       Lech gia tri tai dong 1, cot 'total_shipping': bai lam = 22,158.75, can = 7,274.05
       Goi y: Khong JOIN order_items o day. Neu JOIN, moi don bi nhan len theo so san pham...
```

## Stage 4 — Pandas (12 bài)

```bash
# viết code vào stage4_python/tasks.py (thay raise NotImplementedError)
.venv/bin/python stage4_python/grade.py       # chấm tất cả
.venv/bin/python stage4_python/grade.py t5 t8 # chấm vài bài
```

Bao phủ: tạo cột tính toán · lọc nhiều điều kiện · `merge` + `groupby` · `nunique` · tỷ trọng (`transform`) · gom theo tháng · `shift` (LAG) · top-N per group · outlier IQR · phễu · pipeline làm sạch có log · LEFT JOIN + `fillna`.

## Nguyên tắc

- **Không mở `solution_reference.py` trước khi tự làm.** Mở ra là mất giá trị bài tập.
- Sai thì đọc gợi ý, quay lại tài liệu stage tương ứng, sửa rồi chấm lại. Không tra đáp án.
- Đạt toàn bộ ≠ xong stage. Còn phần deliverable và rubric tự đánh giá trên trang web.

## Cấu trúc

```
exercises/
├── setup_db.py                    Sinh practice.duckdb
├── stage2_sql/
│   ├── questions.py               15 câu + lời giải tham chiếu
│   ├── grade.py                   Chấm tự động
│   └── answers/qNN.sql            Bài làm của bạn
└── stage4_python/
    ├── tasks.py                   Đề bài — viết code vào đây
    ├── solution_reference.py      Lời giải (đừng mở sớm)
    └── grade.py                   Chấm tự động
```
