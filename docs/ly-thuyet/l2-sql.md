---
id: l2-sql
title: "Lý thuyết 2 — SQL từ số 0"
sidebar_label: "L2 — SQL"
sidebar_position: 3
description: "Thu tu thuc thi, bay NULL, GROUP BY/HAVING, JOIN va 2 bay chet nguoi, CTE, window function, funnel/cohort/RFM, debug query."
format: md
---

# LESSON 2 — SQL từ số 0 đến phỏng vấn được (W3–W9)

Bổ trợ cho [Stage 2 — SQL](../stages/stage-2-sql.md). Mỗi khái niệm: **định nghĩa** → **ví dụ đã chạy thật** (Chinook, kết quả in kèm) → **bài tập** → **đáp án**.

Chinook dùng ở đây: 11 bảng · 412 hóa đơn · 59 khách · 24 quốc gia · 3.503 track (977 track `Composer` NULL) · 8 nhân viên · hóa đơn từ 2021-01-01 đến 2025-12-22.

---

## 2.0 — Dựng sân tập (làm 1 lần, 15 phút) {#san-tap}

```bash
cd ~/Documents/Study/DA/da-portfolio/data
curl -LO https://github.com/lerocha/chinook-database/raw/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite
duckdb chinook.duckdb
```

```sql
INSTALL sqlite; LOAD sqlite;
ATTACH 'Chinook_Sqlite.sqlite' AS ch (TYPE sqlite);
USE ch;
SHOW TABLES;
SELECT COUNT(*) FROM Invoice;   -- phai ra 412
```

> Cú pháp `CALL sqlite_attach(...)` trong roadmap vẫn chạy trên DuckDB 1.5 nhưng là dạng cũ; `ATTACH ... (TYPE sqlite)` là cú pháp hiện hành, nên dùng cái này.

Nạp thêm Superstore (nhớ chuyển mã hóa trước, xem L1):
```sql
CREATE TABLE superstore AS SELECT * FROM read_csv_auto('superstore_utf8.csv');
```

**Mẹo học:** mở DBeaver → kết nối file `chinook.duckdb` → Database → View Diagram để nhìn ERD. Hiểu quan hệ bảng **trước** khi viết JOIN, đừng đoán tên cột.

---

## 2.1 — SQL là gì và chạy theo thứ tự nào {#thu-tu-thuc-thi}

**Định nghĩa.** SQL là ngôn ngữ *khai báo*: mình mô tả kết quả muốn có, database tự quyết cách lấy. Khác hoàn toàn Python/JS nơi mình chỉ đạo từng bước.

**Thứ tự thực thi logic** — thứ tự viết KHÁC thứ tự chạy. Nhớ bảng này giải thích được phần lớn lỗi của người mới:

| Bước chạy | Mệnh đề | Làm gì |
|---|---|---|
| 1 | `FROM` / `JOIN` | lấy và ghép bảng |
| 2 | `WHERE` | lọc **dòng** |
| 3 | `GROUP BY` | gom nhóm |
| 4 | `HAVING` | lọc **nhóm** |
| 5 | `SELECT` | chọn/tính cột, gán alias |
| 6 | window functions | tính trên cửa sổ |
| 7 | `DISTINCT` | khử trùng |
| 8 | `ORDER BY` | sắp xếp (dùng được alias vì SELECT đã chạy) |
| 9 | `LIMIT` | cắt số dòng |

Hệ quả thực tế:
- `WHERE doanh_thu > 100` với `doanh_thu` là alias trong SELECT → **lỗi**, vì WHERE (bước 2) chạy trước SELECT (bước 5).
- `ORDER BY doanh_thu` với cùng alias đó → **chạy được**, vì ORDER BY ở bước 8.
- `WHERE ROW_NUMBER() OVER (...) = 1` → **lỗi**, window ở bước 6, sau WHERE.

**Bài tập 2.1.** Không chạy máy, dự đoán cái nào lỗi:
```sql
a) SELECT Total*2 AS gap_doi FROM Invoice WHERE gap_doi > 10;
b) SELECT Total*2 AS gap_doi FROM Invoice ORDER BY gap_doi DESC;
c) SELECT BillingCountry, COUNT(*) n FROM Invoice GROUP BY BillingCountry HAVING n > 5;
d) SELECT BillingCountry, COUNT(*) FROM Invoice WHERE COUNT(*) > 5 GROUP BY BillingCountry;
```
<details>
<summary>Đáp án 2.1</summary>

a) **Lỗi** — alias chưa tồn tại lúc WHERE chạy. Sửa: lặp lại biểu thức `WHERE Total*2 > 10`.
b) Chạy được.
c) Chạy được trên DuckDB/Postgres/MySQL (cho phép alias trong HAVING). Cách viết an toàn mọi DB: `HAVING COUNT(*) > 5`.
d) **Lỗi** — không được dùng aggregate trong WHERE. Đó chính là lý do HAVING tồn tại.

</details>

---

## 2.2 — SELECT, WHERE và bẫy NULL {#bay-null}

**Định nghĩa.** `SELECT` chọn cột, `WHERE` giữ lại dòng thỏa điều kiện. Điều kiện trả về TRUE / FALSE / **UNKNOWN** (khi dính NULL) — chỉ dòng TRUE được giữ.

**Ví dụ thật.** Chinook có 3.503 track, trong đó 977 track `Composer` là NULL.

```sql
SELECT COUNT(*) FROM Track WHERE Composer != 'AC/DC';    -- KHONG phai 3503 - so track cua AC/DC
SELECT COUNT(*) FROM Track WHERE Composer != 'AC/DC' OR Composer IS NULL;  -- dung y dinh
```
Câu đầu **âm thầm bỏ 977 dòng NULL**, vì `NULL != 'AC/DC'` cho ra UNKNOWN chứ không phải TRUE. Không có cảnh báo, không có lỗi — chỉ có báo cáo sai.

Kiểm chứng nhanh 3 cách đếm:

| Query | Kết quả | Ý nghĩa |
|---|---|---|
| `COUNT(*)` | 3.503 | tổng số dòng |
| `COUNT(Composer)` | 2.526 | số dòng có giá trị (bỏ NULL) |
| `COUNT(DISTINCT Composer)` | 853 | số nhạc sĩ khác nhau |

**Bài tập 2.2.**
1. Đếm khách hàng có email đuôi `gmail.com`.
2. Lấy hóa đơn năm **2023** (chú ý: bản Chinook này dữ liệu 2021–2025, không phải 2013 như nhiều tài liệu cũ ghi), sắp giảm dần theo `Total`.
3. Lấy dòng 11–20 của bảng `Invoice` theo thứ tự ngày.
4. Đếm track có tên chứa "love", không phân biệt hoa thường.

<details>
<summary>Đáp án 2.2</summary>

```sql
-- 1
SELECT COUNT(*) FROM Customer WHERE Email LIKE '%@gmail.com';
-- 2
SELECT * FROM Invoice WHERE InvoiceDate >= '2023-01-01' AND InvoiceDate < '2024-01-01' ORDER BY Total DESC;
--    Viet '>= dau ky AND < dau ky sau' an toan hon BETWEEN khi cot la TIMESTAMP,
--    vi BETWEEN '2023-01-01' AND '2023-12-31' bo mat ca ngay 31/12 sau 00:00.
-- 3
SELECT * FROM Invoice ORDER BY InvoiceDate LIMIT 10 OFFSET 10;
-- 4
SELECT COUNT(*) FROM Track WHERE LOWER(Name) LIKE '%love%';
```

</details>

---

## 2.3 — GROUP BY, HAVING và các hàm tổng hợp {#group-by-having}

**Định nghĩa.** `GROUP BY` gom các dòng cùng giá trị thành 1 nhóm; hàm aggregate (`COUNT/SUM/AVG/MIN/MAX`) tính ra 1 số cho mỗi nhóm. `HAVING` lọc trên kết quả nhóm.

**Ví dụ thật.**
```sql
SELECT Country, COUNT(*) AS n FROM Customer GROUP BY Country ORDER BY n DESC LIMIT 5;
```
```
USA 13 · Canada 8 · Brazil 5 · France 5 · Germany 4
```
Thêm `HAVING COUNT(*) > 4` → còn 4 quốc gia (Germany bị loại). So sánh trực quan:
- `WHERE Country != 'USA'` → loại **dòng** trước khi gom.
- `HAVING COUNT(*) > 4` → loại **nhóm** sau khi gom.

**Aggregate có điều kiện** — mẫu câu dùng cực nhiều trong việc thật:
```sql
SELECT
  COUNT(*)                                              AS tong_dong,
  SUM(CASE WHEN Total > 10 THEN 1 ELSE 0 END)           AS don_lon,
  ROUND(100.0 * SUM(CASE WHEN Total > 10 THEN 1 ELSE 0 END) / COUNT(*), 1) AS ty_le_don_lon
FROM Invoice;
```

**Bài tập 2.3.**
1. Doanh thu theo năm.
2. Doanh thu trung bình mỗi hóa đơn theo quốc gia, chỉ lấy quốc gia có ≥ 5 hóa đơn.
3. Tỷ lệ % track không có `Composer`.
4. Đếm hóa đơn theo quốc gia, tách 2 cột: "≥ 10$" và "< 10$".

<details>
<summary>Đáp án 2.3</summary>

```sql
-- 1
SELECT EXTRACT(YEAR FROM InvoiceDate) AS nam, ROUND(SUM(Total),2) AS doanh_thu
FROM Invoice GROUP BY 1 ORDER BY 1;
-- 2
SELECT BillingCountry, COUNT(*) AS so_hd, ROUND(AVG(Total),2) AS tb_hd
FROM Invoice GROUP BY 1 HAVING COUNT(*) >= 5 ORDER BY tb_hd DESC;
-- 3  (ket qua: 977/3503 = 27,9%)
SELECT ROUND(100.0 * SUM(CASE WHEN Composer IS NULL THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_null
FROM Track;
-- 4
SELECT BillingCountry,
       SUM(CASE WHEN Total >= 10 THEN 1 ELSE 0 END) AS hd_lon,
       SUM(CASE WHEN Total <  10 THEN 1 ELSE 0 END) AS hd_nho
FROM Invoice GROUP BY 1 ORDER BY hd_lon DESC;
```

</details>

---

## 2.4 — JOIN: mô hình tư duy + 2 cái bẫy chết người {#join}

**Định nghĩa.** JOIN ghép dòng của hai bảng theo điều kiện khớp. Hình dung: với **mỗi dòng bảng trái**, database đi tìm **mọi dòng bảng phải** thỏa điều kiện `ON`, rồi ghép ra 1 dòng cho mỗi cặp khớp.

Bảng nhỏ để hình dung:

```
A (khach)          B (don hang)
id  ten            id  khach_id  tien
1   An             101  1        50
2   Binh           102  1        70
3   Chi            103  2        30
```

| Kiểu JOIN | Kết quả | Số dòng |
|---|---|---|
| `INNER JOIN` | An×2, Bình×1 | 3 |
| `LEFT JOIN` | An×2, Bình×1, Chi + NULL | 4 |
| `RIGHT JOIN` | như INNER (B không có dòng thừa) | 3 |
| `FULL OUTER` | 4 dòng như LEFT | 4 |
| `CROSS JOIN` | mọi tổ hợp 3×3 | 9 |

Chú ý dòng "An" xuất hiện **2 lần** — đây là mầm mống của fan-out.

### Bẫy 1 — "LEFT JOIN hóa INNER JOIN" (câu phỏng vấn kinh điển)

Ba query dưới đây đã chạy thật trên Chinook, kết quả khác nhau hoàn toàn:

```sql
-- (a) khong dieu kien
SELECT COUNT(*) FROM Customer c LEFT JOIN Invoice i ON i.CustomerId = c.CustomerId;                        -- 412

-- (b) dieu kien bang phai dat o WHERE
SELECT COUNT(*) FROM Customer c LEFT JOIN Invoice i ON i.CustomerId = c.CustomerId
WHERE i.BillingCountry = 'Brazil';                                                                          -- 35

-- (c) dieu kien dat o ON
SELECT COUNT(*) FROM Customer c LEFT JOIN Invoice i ON i.CustomerId = c.CustomerId
AND i.BillingCountry = 'Brazil';                                                                            -- 89
```

Giải thích: ở (b), những khách không có hóa đơn Brazil sẽ có `i.BillingCountry` = NULL, mà `NULL = 'Brazil'` là UNKNOWN → bị WHERE loại → LEFT JOIN mất tác dụng, thành INNER JOIN. Ở (c), điều kiện nằm trong `ON` nên khách vẫn được giữ, phần hóa đơn để NULL: 35 dòng Brazil + 54 khách còn lại = 89.

Quy tắc nhớ: **điều kiện lọc bảng phải → đặt vào `ON`. Điều kiện lọc bảng trái → đặt vào `WHERE`.** Ngoại lệ hữu ích: `WHERE b.id IS NULL` chính là anti-join (tìm cái không có).

### Bẫy 2 — Fan-out (nhân bản dòng làm phồng số liệu)

Đã chạy thật:
```sql
SELECT SUM(Total) FROM Invoice;                                        -- 2.328,60  (DUNG)
SELECT SUM(i.Total) FROM Invoice i JOIN InvoiceLine il ON il.InvoiceId = i.InvoiceId;  -- 20.848,62 (SAI, phong 9 lan)
```
Nguyên nhân: mỗi hóa đơn có nhiều dòng chi tiết, JOIN làm `Total` của hóa đơn bị lặp lại theo số dòng chi tiết rồi bị cộng nhiều lần.

Ba cách xử lý:
```sql
-- Cach 1: tong hop bang "nhieu" TRUOC roi moi join
WITH line AS (SELECT InvoiceId, SUM(UnitPrice*Quantity) AS tien FROM InvoiceLine GROUP BY 1)
SELECT ROUND(SUM(tien),2) FROM Invoice i JOIN line l ON l.InvoiceId = i.InvoiceId;

-- Cach 2: cong o dung grain (chi cong cot cua bang chi tiet)
SELECT ROUND(SUM(il.UnitPrice * il.Quantity),2) FROM InvoiceLine il;

-- Cach 3: kiem tra truoc khi join -- so dong truoc va sau phai bang nhau neu ky vong 1-1
SELECT COUNT(*) FROM Invoice;                                          -- 412
```
Thói quen bắt buộc: **đếm số dòng trước và sau mỗi JOIN**. Số tăng ngoài dự kiến = fan-out.

**Bài tập 2.4.**
1. Tên khách + tổng tiền từng hóa đơn.
2. Tên track + album + nghệ sĩ (3 bảng).
3. Doanh thu theo nghệ sĩ (5 bảng) — cẩn thận fan-out, cộng ở đúng grain.
4. Khách chưa từng mua (anti-join). Kết quả thật là 0 — giải thích ý nghĩa của con số này.
5. Nhân viên + tên quản lý trực tiếp (self join).
6. Playlist và số track, giữ cả playlist rỗng.

<details>
<summary>Đáp án 2.4</summary>

```sql
-- 1
SELECT c.FirstName || ' ' || c.LastName AS khach, i.InvoiceId, i.Total
FROM Customer c JOIN Invoice i ON i.CustomerId = c.CustomerId;
-- 2
SELECT t.Name AS track, al.Title AS album, ar.Name AS nghe_si
FROM Track t JOIN Album al ON al.AlbumId = t.AlbumId JOIN Artist ar ON ar.ArtistId = al.ArtistId;
-- 3  cong UnitPrice*Quantity cua InvoiceLine (dung grain), KHONG cong Invoice.Total
SELECT ar.Name AS nghe_si, ROUND(SUM(il.UnitPrice * il.Quantity),2) AS doanh_thu
FROM InvoiceLine il
JOIN Track t   ON t.TrackId   = il.TrackId
JOIN Album al  ON al.AlbumId  = t.AlbumId
JOIN Artist ar ON ar.ArtistId = al.ArtistId
GROUP BY 1 ORDER BY doanh_thu DESC LIMIT 10;
-- 4
SELECT c.CustomerId FROM Customer c
LEFT JOIN Invoice i ON i.CustomerId = c.CustomerId
WHERE i.InvoiceId IS NULL;      -- 0 dong: moi khach trong Chinook deu da mua it nhat 1 lan
-- 5
SELECT e.FirstName AS nhan_vien, m.FirstName AS quan_ly
FROM Employee e LEFT JOIN Employee m ON m.EmployeeId = e.ReportsTo;
-- 6
SELECT p.Name, COUNT(pt.TrackId) AS so_track
FROM Playlist p LEFT JOIN PlaylistTrack pt ON pt.PlaylistId = p.PlaylistId
GROUP BY 1 ORDER BY so_track DESC;
--   Dung COUNT(pt.TrackId) chu KHONG dung COUNT(*):
--   COUNT(*) dem ca dong NULL nen playlist rong se ra 1 thay vi 0.
```
Câu 4: kết quả 0 nghĩa là dataset đã "sạch" theo hướng này — không có khách mồ côi. Trong dữ liệu thật, con số này thường khác 0 và chính là danh sách cần gửi cho marketing.

</details>

---

## 2.5 — Subquery, CTE và bẫy NOT IN {#subquery-cte}

**Định nghĩa.** Subquery = query lồng trong query. CTE (`WITH ... AS (...)`) = đặt tên cho bước trung gian, viết query như liệt kê các bước suy nghĩ.

**So sánh trực tiếp:**
```sql
-- Subquery long: kho doc khi qua 2 tang
SELECT * FROM (SELECT BillingCountry, SUM(Total) rev FROM Invoice GROUP BY 1) x WHERE x.rev > 100;

-- CTE: doc nhu tieng Viet
WITH doanh_thu_quoc_gia AS (
  SELECT BillingCountry AS quoc_gia, SUM(Total) AS doanh_thu
  FROM Invoice GROUP BY 1
)
SELECT * FROM doanh_thu_quoc_gia WHERE doanh_thu > 100 ORDER BY doanh_thu DESC;
```
Quy tắc: lồng quá 2 tầng → chuyển sang CTE. Query dài mà đọc được quan trọng hơn query ngắn mà rối.

**Bẫy `NOT IN` gặp NULL.** Đã chạy thật:
```sql
WITH t(id) AS (VALUES (1),(2),(3)), x(v) AS (VALUES (2),(NULL))
SELECT COUNT(*) FROM t WHERE id NOT IN (SELECT v FROM x);                  -- 0  (!!)
SELECT COUNT(*) FROM t WHERE NOT EXISTS (SELECT 1 FROM x WHERE x.v = t.id); -- 2  (dung)
```
Lý do: `1 NOT IN (2, NULL)` = `1 != 2 AND 1 != NULL` = `TRUE AND UNKNOWN` = UNKNOWN → không dòng nào qua được. Kết quả trả về **rỗng hoàn toàn**, dễ bị hiểu nhầm là "không có ai thỏa điều kiện".

Quy tắc: **luôn dùng `NOT EXISTS`** thay cho `NOT IN` khi subquery có thể chứa NULL.

**Bài tập 2.5.**
1. Khách chi tiêu cao hơn mức trung bình toàn bộ khách.
2. Track có `UnitPrice` cao hơn trung bình của chính genre nó (correlated subquery).
3. Top 3 genre theo doanh thu, rồi lấy chi tiết track thuộc 3 genre đó (CTE nhiều tầng).
4. Khách chưa từng mua thể loại Rock — viết bằng `NOT EXISTS`, rồi viết lại bằng `NOT IN` và so kết quả.

<details>
<summary>Đáp án 2.5</summary>

```sql
-- 1
WITH chi_tieu AS (SELECT CustomerId, SUM(Total) AS tong FROM Invoice GROUP BY 1)
SELECT * FROM chi_tieu WHERE tong > (SELECT AVG(tong) FROM chi_tieu) ORDER BY tong DESC;
-- 2
SELECT t.Name, t.UnitPrice, t.GenreId FROM Track t
WHERE t.UnitPrice > (SELECT AVG(t2.UnitPrice) FROM Track t2 WHERE t2.GenreId = t.GenreId);
-- 3
WITH rev_genre AS (
  SELECT g.GenreId, g.Name AS genre, SUM(il.UnitPrice*il.Quantity) AS doanh_thu
  FROM InvoiceLine il JOIN Track t ON t.TrackId = il.TrackId JOIN Genre g ON g.GenreId = t.GenreId
  GROUP BY 1,2
),
top3 AS (SELECT * FROM rev_genre ORDER BY doanh_thu DESC LIMIT 3)
SELECT top3.genre, t.Name AS track FROM top3 JOIN Track t ON t.GenreId = top3.GenreId LIMIT 20;
-- 4
SELECT c.CustomerId, c.LastName FROM Customer c
WHERE NOT EXISTS (
  SELECT 1 FROM Invoice i
  JOIN InvoiceLine il ON il.InvoiceId = i.InvoiceId
  JOIN Track t ON t.TrackId = il.TrackId
  JOIN Genre g ON g.GenreId = t.GenreId
  WHERE i.CustomerId = c.CustomerId AND g.Name = 'Rock'
);
```
Bản `NOT IN`: nếu danh sách con chứa NULL (ví dụ khi join hụt làm sinh NULL), kết quả trả rỗng. Chạy cả hai và giải thích chênh lệch là bài tập chính ở đây.

</details>

---

## 2.6 — Window functions (kỹ năng phân biệt fresher và junior) {#window}

**Định nghĩa.** Window function tính toán dựa trên một nhóm dòng liên quan **mà không gộp dòng lại**. GROUP BY: 100 dòng → 5 dòng. Window: 100 dòng → vẫn 100 dòng, thêm cột kết quả.

Cú pháp: `HAM() OVER (PARTITION BY nhom ORDER BY thu_tu [ROWS BETWEEN ...])`
- `PARTITION BY` = chia nhóm (giống GROUP BY nhưng không gộp)
- `ORDER BY` = thứ tự trong nhóm (bắt buộc cho LAG/LEAD/running total)
- frame = lấy bao nhiêu dòng quanh dòng hiện tại

**Ví dụ 1 — Running total + MoM (đã chạy thật, 5 tháng đầu Chinook):**
```sql
WITH m AS (
  SELECT DATE_TRUNC('month', InvoiceDate) AS mo, SUM(Total) AS rev
  FROM Invoice WHERE InvoiceDate < '2021-06-01' GROUP BY 1
)
SELECT strftime(mo,'%Y-%m') AS thang,
       ROUND(rev,2)                                              AS doanh_thu,
       ROUND(SUM(rev) OVER (ORDER BY mo),2)                      AS luy_ke,
       ROUND(100*(rev - LAG(rev) OVER (ORDER BY mo))
                 / LAG(rev) OVER (ORDER BY mo), 1)               AS mom_pct
FROM m ORDER BY mo;
```
```
2021-01  35.64   35.64   NULL
2021-02  37.62   73.26   5.6
2021-03  37.62  110.88   0.0
2021-04  37.62  148.50   0.0
2021-05  37.62  186.12   0.0
```
Đọc kết quả: cột `mom_pct` dòng đầu là NULL vì không có tháng trước — đúng, không phải lỗi. Trong báo cáo thật phải quyết định hiển thị NULL đó thành gì ("—", không phải 0%).

**Ví dụ 2 — Top N mỗi nhóm (dạng đề phỏng vấn phổ biến nhất):**
```sql
WITH t AS (
  SELECT g.Name AS genre, tr.Name AS track, SUM(il.UnitPrice*il.Quantity) AS rev
  FROM InvoiceLine il JOIN Track tr ON tr.TrackId = il.TrackId JOIN Genre g ON g.GenreId = tr.GenreId
  GROUP BY 1,2
),
r AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY genre ORDER BY rev DESC) AS rn FROM t)
SELECT genre, track, ROUND(rev,2) AS rev FROM r WHERE rn <= 2 ORDER BY genre, rn;
```
```
Latin  Selvagem   2.97   |  Latin  Brasil               2.97
Rock   Eruption   3.96   |  Rock   Sure Know Something  3.96
```
Chú ý: hai track cùng doanh thu nhưng `ROW_NUMBER` vẫn phân 1 và 2 tùy tiện. Nếu muốn giữ cả hai khi hòa → dùng `RANK()`. Đây là điểm khác biệt phải nói được trong phỏng vấn:

| Hàm | Giá trị khi hòa (10, 10, 9) |
|---|---|
| `ROW_NUMBER()` | 1, 2, 3 |
| `RANK()` | 1, 1, 3 |
| `DENSE_RANK()` | 1, 1, 2 |

**Ví dụ 3 — NTILE để phân khúc khách (đã chạy thật):**
```sql
WITH sp AS (SELECT CustomerId, SUM(Total) AS spend FROM Invoice GROUP BY 1),
q AS (SELECT *, NTILE(4) OVER (ORDER BY spend DESC) AS nhom FROM sp)
SELECT nhom, COUNT(*) n, ROUND(MIN(spend),2) min_spend, ROUND(MAX(spend),2) max_spend, ROUND(SUM(spend),2) tong
FROM q GROUP BY 1 ORDER BY 1;
```
```
nhom 1: 15 khach, chi 39.62-49.62, tong 654.30
nhom 2: 15 khach, chi 37.62-39.62, tong 584.30
nhom 3: 15 khach, chi 37.62-37.62, tong 564.30
nhom 4: 14 khach, chi 36.64-37.62, tong 525.70
```
Diễn giải quan trọng: nhóm 1 chỉ đóng góp 654/2.328 = 28% — dataset này **không** có hiện tượng 80/20. Trong dữ liệu thương mại điện tử thật, nhóm 1 thường chiếm 50–70%. Biết nêu ra khác biệt này là dấu hiệu của người thật sự đọc số.

**Bẫy: không lọc được window function trong WHERE.**
```sql
-- SAI
SELECT *, ROW_NUMBER() OVER (PARTITION BY CustomerId ORDER BY InvoiceDate DESC) rn
FROM Invoice WHERE rn = 1;
-- DUNG: boc CTE roi loc o tang ngoai
WITH r AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY CustomerId ORDER BY InvoiceDate DESC) rn FROM Invoice)
SELECT * FROM r WHERE rn = 1;
-- DUNG (chi DuckDB/BigQuery/Snowflake):
SELECT * FROM Invoice QUALIFY ROW_NUMBER() OVER (PARTITION BY CustomerId ORDER BY InvoiceDate DESC) = 1;
```

**Bài tập 2.6** (10 dạng hay hỏi nhất):
1. Doanh thu lũy kế theo tháng.
2. Tăng trưởng MoM.
3. Top 3 track bán chạy trong mỗi genre.
4. Xếp hạng khách theo chi tiêu **trong từng quốc gia**.
5. Trung bình trượt 3 tháng.
6. Tỷ trọng % doanh thu mỗi genre trên tổng (dùng `SUM() OVER ()` không PARTITION).
7. Giữ hóa đơn mới nhất của mỗi khách.
8. Số ngày giữa 2 lần mua liên tiếp của cùng khách.
9. Chia khách thành 4 nhóm chi tiêu.
10. Hóa đơn đầu tiên và gần nhất của mỗi khách trên **cùng một dòng**.

<details>
<summary>Đáp án 2.6 (các câu khó)</summary>

```sql
-- 4
SELECT c.Country, c.LastName, SUM(i.Total) AS chi,
       RANK() OVER (PARTITION BY c.Country ORDER BY SUM(i.Total) DESC) AS hang
FROM Customer c JOIN Invoice i ON i.CustomerId = c.CustomerId
GROUP BY c.Country, c.LastName, c.CustomerId;
--   Luu y: window chay SAU GROUP BY nen dung truc tiep SUM() trong OVER duoc.
-- 5
WITH m AS (SELECT DATE_TRUNC('month', InvoiceDate) mo, SUM(Total) rev FROM Invoice GROUP BY 1)
SELECT mo, rev, ROUND(AVG(rev) OVER (ORDER BY mo ROWS BETWEEN 2 PRECEDING AND CURRENT ROW),2) AS ma3 FROM m;
-- 6
WITH g AS (SELECT ge.Name genre, SUM(il.UnitPrice*il.Quantity) rev
           FROM InvoiceLine il JOIN Track t ON t.TrackId=il.TrackId JOIN Genre ge ON ge.GenreId=t.GenreId
           GROUP BY 1)
SELECT genre, ROUND(rev,2) rev, ROUND(100*rev/SUM(rev) OVER (),1) AS pct FROM g ORDER BY rev DESC;
-- 8
WITH x AS (SELECT CustomerId, InvoiceDate,
                  LAG(InvoiceDate) OVER (PARTITION BY CustomerId ORDER BY InvoiceDate) AS lan_truoc
           FROM Invoice)
SELECT CustomerId, ROUND(AVG(DATE_DIFF('day', lan_truoc, InvoiceDate)),1) AS so_ngay_tb
FROM x WHERE lan_truoc IS NOT NULL GROUP BY 1 ORDER BY so_ngay_tb;
-- 10
SELECT DISTINCT CustomerId,
  FIRST_VALUE(InvoiceDate) OVER (PARTITION BY CustomerId ORDER BY InvoiceDate) AS lan_dau,
  LAST_VALUE(InvoiceDate)  OVER (PARTITION BY CustomerId ORDER BY InvoiceDate
                                 ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS lan_cuoi
FROM Invoice;
--   Bay: LAST_VALUE khong co frame se chi lay den dong hien tai -> ra sai. Phai ghi ro frame.
```

</details>

---

## 2.7 — Ngày tháng, CASE WHEN, chia số và NULL {#date-case-null}

**DATE_TRUNC** gom về đầu kỳ: `DATE_TRUNC('month', d)` biến 2023-03-17 thành 2023-03-01. Đây là cách chuẩn để gom theo tháng — **không** dùng chuỗi `'2023-03'` để so sánh lớn/nhỏ.

**Bảng lịch đủ kỳ** — báo cáo tháng phải có đủ 12 dòng kể cả tháng không có đơn:
```sql
WITH cal AS (SELECT UNNEST(generate_series(DATE '2023-01-01', DATE '2023-12-01', INTERVAL 1 MONTH)) AS thang),
rev AS (SELECT DATE_TRUNC('month', InvoiceDate) AS thang, SUM(Total) AS doanh_thu FROM Invoice GROUP BY 1)
SELECT cal.thang, COALESCE(rev.doanh_thu, 0) AS doanh_thu
FROM cal LEFT JOIN rev ON rev.thang = cal.thang ORDER BY 1;
```
Không có bảng lịch thì tháng doanh thu 0 sẽ **biến mất** khỏi báo cáo, và chart đường sẽ nối thẳng qua chỗ trống — che mất đúng vấn đề cần thấy.

**Bẫy chia số nguyên — khác nhau theo database (đã kiểm chứng):**

| DB | `SELECT 3/4` |
|---|---|
| SQLite | **0** |
| PostgreSQL / SQL Server | **0** |
| DuckDB / BigQuery / MySQL | 0.75 |

Nghĩa là code chạy đúng trên DuckDB có thể cho conversion rate = 0 khi đưa lên Postgres. Viết an toàn ở mọi nơi:
```sql
COUNT(a) * 1.0 / NULLIF(COUNT(b), 0)
```
`NULLIF(x, 0)` biến 0 thành NULL → phép chia trả NULL thay vì lỗi "division by zero".

**CASE WHEN** dùng 2 việc: phân nhóm và xoay bảng.
```sql
-- phan nhom
SELECT CASE WHEN Total >= 15 THEN 'Cao' WHEN Total >= 8 THEN 'Trung binh' ELSE 'Thap' END AS nhom,
       COUNT(*) FROM Invoice GROUP BY 1;
-- xoay bang (pivot): moi quoc gia mot cot
SELECT DATE_TRUNC('year', InvoiceDate) AS nam,
       SUM(CASE WHEN BillingCountry = 'USA'    THEN Total ELSE 0 END) AS usa,
       SUM(CASE WHEN BillingCountry = 'Canada' THEN Total ELSE 0 END) AS canada
FROM Invoice GROUP BY 1 ORDER BY 1;
```

**Bài tập 2.7.** Viết bộ 12 query báo cáo tháng trong [Stage 2 — SQL](../stages/stage-2-sql.md) (mục Deliverable W8). Ba câu khó nhất:
- Khách mới vs khách quay lại theo tháng
- Khoảng cách trung bình giữa 2 lần mua
- Top 5 khách đóng góp bao nhiêu % tổng doanh thu

<details>
<summary>Gợi ý 3 câu khó</summary>

```sql
-- Khach moi vs quay lai: lay ngay mua dau tien cua moi khach roi so voi thang dang xet
WITH first_buy AS (SELECT CustomerId, MIN(DATE_TRUNC('month', InvoiceDate)) AS thang_dau FROM Invoice GROUP BY 1),
m AS (SELECT DISTINCT CustomerId, DATE_TRUNC('month', InvoiceDate) AS thang FROM Invoice)
SELECT m.thang,
       COUNT(*) FILTER (WHERE m.thang = f.thang_dau) AS khach_moi,
       COUNT(*) FILTER (WHERE m.thang > f.thang_dau) AS khach_quay_lai
FROM m JOIN first_buy f ON f.CustomerId = m.CustomerId GROUP BY 1 ORDER BY 1;
--   FILTER (WHERE ...) la cach viet gon cua SUM(CASE WHEN ... THEN 1 ELSE 0 END), co o DuckDB/Postgres.

-- Top 5 khach dong gop bao nhieu %
WITH sp AS (SELECT CustomerId, SUM(Total) AS chi FROM Invoice GROUP BY 1),
r AS (SELECT *, ROW_NUMBER() OVER (ORDER BY chi DESC) AS hang, SUM(chi) OVER () AS tong FROM sp)
SELECT ROUND(100 * SUM(chi) / MAX(tong), 1) AS pct_top5 FROM r WHERE hang <= 5;
```

</details>

---

## 2.8 — Ba mẫu phân tích thực chiến (W9) {#funnel-cohort-rfm}

Đây là 3 dạng query mà hầu hết bài test DA đều hỏi. Học thuộc **cấu trúc**, không phải cú pháp.

### Funnel (phễu)
```sql
WITH b AS (
  SELECT user_id,
         MAX(CASE WHEN event_type = 'view'     THEN 1 ELSE 0 END) AS b1,
         MAX(CASE WHEN event_type = 'cart'     THEN 1 ELSE 0 END) AS b2,
         MAX(CASE WHEN event_type = 'purchase' THEN 1 ELSE 0 END) AS b3
  FROM events WHERE created_at >= '2023-01-01' GROUP BY 1
)
SELECT SUM(b1) AS xem, SUM(b2) AS them_gio, SUM(b3) AS mua,
       ROUND(100.0*SUM(b2)/NULLIF(SUM(b1),0),1) AS cr_xem_gio,
       ROUND(100.0*SUM(b3)/NULLIF(SUM(b2),0),1) AS cr_gio_mua
FROM b;
```
Điểm phải nêu khi trình bày: funnel này **không** ép thứ tự thời gian (user mua mà không "view" vẫn được tính). Funnel chặt chẽ phải kiểm tra `timestamp` bước sau > bước trước. Nói ra được hạn chế này là điểm cộng lớn khi phỏng vấn.

### Cohort retention
```sql
WITH first_month AS (
  SELECT user_id, DATE_TRUNC('month', MIN(created_at)) AS cohort FROM orders GROUP BY 1
),
act AS (
  SELECT o.user_id, f.cohort, DATE_DIFF('month', f.cohort, DATE_TRUNC('month', o.created_at)) AS thang_thu
  FROM orders o JOIN first_month f ON f.user_id = o.user_id GROUP BY 1,2,3
)
SELECT cohort, thang_thu, COUNT(DISTINCT user_id) AS users,
       ROUND(100.0 * COUNT(DISTINCT user_id)
             / MAX(COUNT(DISTINCT user_id)) OVER (PARTITION BY cohort), 1) AS pct_giu_chan
FROM act GROUP BY 1,2 ORDER BY 1,2;
```

### RFM
```sql
WITH base AS (
  SELECT user_id,
         DATE_DIFF('day', MAX(created_at), CURRENT_DATE) AS recency,
         COUNT(DISTINCT order_id)                        AS frequency,
         SUM(amount)                                     AS monetary
  FROM orders GROUP BY 1
)
SELECT *,
       NTILE(5) OVER (ORDER BY recency)          AS r,   -- moi mua = diem cao
       NTILE(5) OVER (ORDER BY frequency DESC)   AS f,
       NTILE(5) OVER (ORDER BY monetary  DESC)   AS m
FROM base;
```

---

## 2.9 — Kỹ năng debug query (không có trong stage file, nhưng phỏng vấn hay hỏi) {#debug-query}

Khi query ra số lạ, kiểm tra theo thứ tự:

1. **Đếm dòng ở từng bước.** Bọc mỗi CTE bằng `SELECT COUNT(*)` — bước nào số nhảy bất thường là bước có lỗi.
2. **Kiểm tra grain sau JOIN.** `SELECT khoa, COUNT(*) FROM ket_qua GROUP BY 1 HAVING COUNT(*) > 1 LIMIT 5;` — có dòng trả về nghĩa là đã fan-out.
3. **Soi NULL.** `SELECT COUNT(*) - COUNT(cot_nghi_ngo) FROM bang;`
4. **Đối chiếu tổng.** Tổng chi tiết phải bằng tổng ở bảng cha. Lệch = fan-out hoặc mất dòng.
5. **Thu nhỏ bài toán.** Lọc còn 1 khách hàng, tự tay tính bằng máy tính, so với query.

Câu hỏi phỏng vấn hay gặp: *"Sếp nói doanh thu dashboard không khớp với kế toán, bạn kiểm tra thế nào?"* → trả lời theo đúng 5 bước trên, cộng thêm: kiểm tra khoảng thời gian, múi giờ, định nghĩa doanh thu (gộp hay trừ hoàn hàng), và bộ lọc mặc định của dashboard.

---

## Checklist tự chấm trước khi sang Stage 3

- [ ] Đọc bảng thứ tự thực thi và giải thích được 4 câu ở bài 2.1
- [ ] Giải thích bẫy `LEFT JOIN` + `WHERE` bằng con số 412 / 35 / 89
- [ ] Giải thích fan-out bằng con số 2.328,60 / 20.848,62 và nêu 2 cách sửa
- [ ] Nêu khác biệt `ROW_NUMBER` / `RANK` / `DENSE_RANK` không cần tra
- [ ] Viết "top 3 sản phẩm doanh thu cao nhất mỗi tháng" từ đầu trong ≤ 15 phút
- [ ] Viết được cohort retention từ trí nhớ với cấu trúc 3 bước (first_month → activity → pivot)
- [ ] ≥ 125 bài trên LeetCode Database / StrataScratch

**Tiếp theo:** [L3 — BI & Dashboard →](./l3-bi.md)

Làm bài tập tự chấm tương ứng: [Bài tập Stage 2](../bai-tap/stage-2.mdx)
