---
id: l2-sql
title: "Lý thuyết 2 — SQL từ số 0"
sidebar_label: "L2 — SQL"
sidebar_position: 3
description: "Thu tu thuc thi, bay NULL, GROUP BY/HAVING, JOIN va 2 bay chet nguoi, CTE, window function, funnel/cohort/RFM, debug query."
format: md
---

# LESSON 2 — SQL từ số 0 đến phỏng vấn được (W3–W9)

:::tip Cách đọc trang này
Từ khóa **in đậm có gạch chân** là thuật ngữ — bấm vào để nhảy sang [Từ điển](/glossary) xem định nghĩa kèm ví dụ.
Cuối mỗi mục có khối **Chốt lại** tóm tắt điều quan trọng nhất. Đọc lướt các khối đó là nắm được xương sống của bài.
:::

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

### Bàn tập 2 bảng — dùng suốt bài này {#ban-tap-2-bang}

Chinook 11 bảng là quá nhiều để học khái niệm mới. Dựng thêm 2 bảng nhỏ, nhìn hết bằng mắt:

```sql
CREATE TABLE khach(id INT, ten VARCHAR, diem INT);
INSERT INTO khach VALUES (1,'An',100),(2,'Binh',50),(3,'Chi',30);

CREATE TABLE don(don_id VARCHAR, khach_id INT, tien INT);
INSERT INTO don VALUES ('HD-01',1,90),('HD-02',1,50),('HD-03',2,30);
```

| khach | | | | don | | |
|---|---|---|---|---|---|---|
| **id** | **ten** | **diem** | | **don_id** | **khach_id** | **tien** |
| 1 | An | 100 | | HD-01 | 1 | 90 |
| 2 | Bình | 50 | | HD-02 | 1 | 50 |
| 3 | Chi | 30 | | HD-03 | 2 | 30 |

Ba điều cần thấy ngay, chỉ bằng mắt:
- **An có 2 đơn**, Bình có 1, **Chi không có đơn nào**
- Cột `diem` thuộc về **khách**, không thuộc về đơn
- 3 khách, 3 đơn — trùng hợp về số lượng, đừng để nó đánh lừa

Mọi khái niệm khó trong bài (JOIN, [fan-out](/glossary#fan-out), window) sẽ thử trên 2 bảng này trước, rồi mới áp lên Chinook.

---

## 2.1 — SQL là gì và chạy theo thứ tự nào {#thu-tu-thuc-thi}

**Định nghĩa.** SQL là ngôn ngữ *khai báo*: mình mô tả **kết quả muốn có**, database tự quyết cách lấy. Khác hoàn toàn Python/JavaScript nơi mình chỉ đạo từng bước.

### Thứ tự viết KHÁC thứ tự chạy

Đây là bảng quan trọng nhất của cả Stage 2. Nhớ nó giải thích được phần lớn lỗi của người mới.

| Bước chạy | Mệnh đề | Làm gì |
|---|---|---|
| 1 | `FROM` / `JOIN` | lấy và ghép bảng |
| 2 | `WHERE` | lọc **dòng** |
| 3 | `GROUP BY` | gom nhóm |
| 4 | `HAVING` | lọc **nhóm** |
| 5 | `SELECT` | chọn/tính cột, **gán alias** |
| 6 | window functions | tính trên cửa sổ |
| 7 | `DISTINCT` | khử trùng |
| 8 | `ORDER BY` | sắp xếp |
| 9 | `LIMIT` | cắt số dòng |

### Thử trên bàn tập

Đoán trước: câu nào **chạy được**, câu nào **lỗi**?

```sql
-- (a)
SELECT tien * 2 AS gap_doi FROM don WHERE gap_doi > 100;
-- (b)
SELECT tien * 2 AS gap_doi FROM don ORDER BY gap_doi DESC;
```

```
(a) LOI: Referenced column "gap_doi" not found
(b) Chay duoc: 180, 100, 60
```

Vì sao khác nhau? `WHERE` chạy ở **bước 2**, lúc đó `SELECT` (bước 5) chưa chạy nên alias `gap_doi` **chưa tồn tại**. Còn `ORDER BY` ở bước 8, sau `SELECT`, nên alias đã có.

Sửa câu (a): lặp lại biểu thức — `WHERE tien * 2 > 100`.

Cùng logic đó giải thích thêm hai lỗi kinh điển:

| Viết sai | Vì sao lỗi | Sửa |
|---|---|---|
| `WHERE COUNT(*) > 5` | Aggregate tính ở bước 3, `WHERE` ở bước 2 — chưa có gì để đếm | Dùng `HAVING COUNT(*) > 5` |
| `WHERE ROW_NUMBER() OVER (...) = 1` | Window ở bước 6, sau `WHERE` | Bọc [CTE](/glossary#cte) rồi lọc ở tầng ngoài, hoặc `QUALIFY` |

**Mẹo tự chữa lỗi:** gặp báo lỗi "column not found" hoặc "aggregate not allowed here", hỏi ngay *"mệnh đề này chạy ở bước mấy, thứ mình đang gọi ra đời ở bước mấy?"*. Bước gọi phải **sau** bước sinh ra.

### Bài tập 2.1

Không chạy máy, dự đoán từng câu chạy được hay lỗi, kèm lý do:

```sql
a) SELECT tien * 2 AS gap_doi FROM don WHERE gap_doi > 100;
b) SELECT tien * 2 AS gap_doi FROM don ORDER BY gap_doi DESC;
c) SELECT khach_id, COUNT(*) n FROM don GROUP BY khach_id HAVING n > 1;
d) SELECT khach_id, COUNT(*) FROM don WHERE COUNT(*) > 1 GROUP BY khach_id;
e) SELECT khach_id, tien FROM don GROUP BY khach_id;
f) SELECT DISTINCT khach_id FROM don ORDER BY tien;
```

<details>
<summary>Đáp án 2.1</summary>

a) **Lỗi** — alias chưa tồn tại lúc `WHERE` chạy (bước 2 < bước 5).
b) **Chạy được** — `ORDER BY` ở bước 8, sau `SELECT`.
c) **Chạy được** trên DuckDB/PostgreSQL/MySQL (cho phép alias trong `HAVING`). Cách viết an toàn mọi DB: `HAVING COUNT(*) > 1`.
d) **Lỗi** — aggregate trong `WHERE`. Đây chính là lý do `HAVING` tồn tại.
e) **Lỗi** — `tien` không nằm trong `GROUP BY` và cũng không được bọc trong hàm aggregate. Database không biết chọn giá trị `tien` nào trong nhóm. Sửa: `SUM(tien)` hoặc thêm `tien` vào `GROUP BY`.
f) **Lỗi** — sau `DISTINCT` (bước 7) chỉ còn cột `khach_id`, không còn `tien` để sắp xếp.

</details>


:::note Chốt lại
Thứ tự viết khác thứ tự chạy. Nhớ bảng 9 bước thì tự chữa được phần lớn lỗi: gặp "column not found" hay "aggregate not allowed", hỏi ngay *mệnh đề này chạy bước mấy, thứ mình gọi ra đời bước mấy*.
:::

## 2.2 — SELECT, WHERE và bẫy NULL {#bay-null}

**Định nghĩa.** `WHERE` giữ lại dòng thỏa điều kiện. Nhưng điều kiện trong SQL không chỉ có TRUE/FALSE — còn có **UNKNOWN**, sinh ra khi dính NULL. **Chỉ dòng TRUE được giữ.**

### Bàn tập — thêm cột có NULL

```sql
CREATE TABLE don(don_id VARCHAR, khach_id INT, tien INT, ghi_chu VARCHAR);
INSERT INTO don VALUES ('HD-01',1,90,'gap'),('HD-02',1,50,NULL),('HD-03',2,30,'gap');
```

| don_id | tien | ghi_chu |
|---|---|---|
| HD-01 | 90 | gấp |
| HD-02 | 50 | **NULL** |
| HD-03 | 30 | gấp |

Câu hỏi: *"Liệt kê đơn KHÔNG phải đơn gấp."* Nhìn bảng bằng mắt: đáp án phải là **HD-02**.

Đoán trước rồi chạy:

```sql
SELECT COUNT(*) FROM don WHERE ghi_chu != 'gap';                        -- ?
SELECT COUNT(*) FROM don WHERE ghi_chu != 'gap' OR ghi_chu IS NULL;     -- ?
```

```
Cach 1:  0 dong   (!!)
Cach 2:  1 dong   (dung: HD-02)
```

Cách 1 ra **rỗng hoàn toàn**. Không lỗi, không cảnh báo — chỉ là kết quả sai.

**Vì sao:** `NULL != 'gap'` không trả về TRUE, cũng không trả về FALSE. Nó trả về **UNKNOWN** — vì không biết ghi chú là gì thì làm sao biết nó có khác 'gap' hay không. Mà `WHERE` chỉ giữ TRUE.

Quy tắc: **mọi phép so sánh với NULL đều ra UNKNOWN.** Kể cả `NULL = NULL`.

```sql
SELECT NULL = NULL AS a, NULL != NULL AS b, NULL > 1 AS c;   -- ca ba deu NULL, khong phai true/false
```

Cách duy nhất đúng để kiểm tra: `IS NULL` / `IS NOT NULL`.

### Ba biến thể COUNT

```sql
SELECT COUNT(*) AS count_sao, COUNT(ghi_chu) AS count_cot, COUNT(DISTINCT ghi_chu) AS count_distinct FROM don;
```

```
count_sao = 3      count_cot = 2      count_distinct = 1
```

| Cách viết | Đếm gì | Kết quả |
|---|---|---|
| `COUNT(*)` | mọi dòng | 3 |
| `COUNT(ghi_chu)` | dòng **có giá trị** (bỏ NULL) | 2 |
| `COUNT(DISTINCT ghi_chu)` | số giá trị **khác nhau** | 1 (chỉ có 'gấp') |

Trên Chinook, cùng ba cách với cột `Composer`: **3.503 / 2.526 / 853**.

Ba con số, ba câu hỏi khác nhau. Chọn nhầm là trả lời nhầm câu hỏi của sếp.

### Toán tử lọc

| Toán tử | Dùng khi | Ví dụ |
|---|---|---|
| `=` `!=` `>` `<` `>=` `<=` | so sánh trực tiếp | `tien > 40` |
| `BETWEEN a AND b` | trong khoảng, **bao gồm 2 đầu** | `tien BETWEEN 30 AND 50` |
| `IN (...)` | thuộc danh sách | `khach_id IN (1,2)` |
| `LIKE` | khớp mẫu chuỗi | `'%love%'` chứa · `'a_c'` đúng 1 ký tự giữa |
| `IS NULL` | kiểm tra thiếu | bắt buộc, không dùng `= NULL` |

**Bẫy `BETWEEN` với cột thời gian:** `InvoiceDate BETWEEN '2023-01-01' AND '2023-12-31'` **mất toàn bộ giao dịch ngày 31/12 sau 00:00**, vì `'2023-12-31'` được hiểu là `2023-12-31 00:00:00`. Viết an toàn: `>= '2023-01-01' AND < '2024-01-01'`.

### Bài tập 2.2

Trên bàn tập 3 dòng, đoán trước rồi kiểm:

1. `SELECT COUNT(*) FROM don WHERE ghi_chu = 'gap';` → mấy dòng?
2. `SELECT COUNT(*) FROM don WHERE tien NOT BETWEEN 40 AND 60;` → mấy dòng?
3. Muốn đếm "số đơn không ghi chú gì" thì viết thế nào?

Trên Chinook:

4. Đếm khách có email đuôi `gmail.com`.
5. Hóa đơn năm 2023, sắp giảm dần theo `Total` — viết cách an toàn với kiểu TIMESTAMP.
6. Lấy dòng 11–20 của `Invoice` theo thứ tự ngày.

<details>
<summary>Đáp án 2.2</summary>

1. **2 dòng** (HD-01, HD-03). Dòng NULL bị loại — lần này là đúng ý đồ.
2. **2 dòng** (90 và 30). Cẩn thận: nếu `tien` có NULL thì dòng NULL cũng bị loại khỏi cả `BETWEEN` lẫn `NOT BETWEEN` — nghĩa là tổng hai kết quả **không** bằng tổng số dòng.
3. `SELECT COUNT(*) FROM don WHERE ghi_chu IS NULL;` → 1.
4. `SELECT COUNT(*) FROM Customer WHERE Email LIKE '%@gmail.com';`
5. ```sql
   SELECT * FROM Invoice
   WHERE InvoiceDate >= '2023-01-01' AND InvoiceDate < '2024-01-01'
   ORDER BY Total DESC;
   ```
6. `SELECT * FROM Invoice ORDER BY InvoiceDate LIMIT 10 OFFSET 10;`

</details>


:::note Chốt lại
Mọi phép so sánh với NULL đều ra **UNKNOWN**, và `WHERE` chỉ giữ TRUE — nên `!= 'x'` âm thầm nuốt mất dòng NULL. Chỉ `IS NULL` mới đúng. Ba biến thể `COUNT` trả lời ba câu hỏi khác nhau, chọn nhầm là trả lời nhầm câu của sếp.
:::

## 2.3 — GROUP BY, HAVING và các hàm tổng hợp {#group-by-having}

**Định nghĩa.** `GROUP BY` gom các dòng có cùng giá trị thành **một nhóm**, rồi hàm aggregate tính ra **một số cho mỗi nhóm**. Số dòng kết quả = số nhóm, không phải số dòng gốc.

### Bàn tập — thấy việc gộp dòng

```sql
SELECT khach_id, COUNT(*) AS so_don, SUM(tien) AS tong_tien FROM don GROUP BY khach_id;
```

```
3 dong goc  ->  2 dong ket qua

khach_id=1   so_don=2   tong_tien=140     (HD-01 + HD-02 gop lai)
khach_id=2   so_don=1   tong_tien=30
```

Ba dòng vào, hai dòng ra. **Chi tiết từng đơn biến mất** — muốn giữ chi tiết thì phải dùng [window function](/glossary#window-function) (§2.6).

### WHERE lọc dòng, HAVING lọc nhóm

Cùng một câu hỏi, hai chỗ lọc khác nhau, kết quả khác hẳn:

```sql
-- Loc TRUOC khi gom: chi tinh don tren 40
SELECT khach_id, SUM(tien) FROM don WHERE tien > 40 GROUP BY khach_id;
-- khach 1 -> 140 (90+50), khach 2 -> bien mat (don 30 bi loai truoc)

-- Loc SAU khi gom: chi giu khach chi tren 100
SELECT khach_id, SUM(tien) FROM don GROUP BY khach_id HAVING SUM(tien) > 100;
-- khach 1 -> 140, khach 2 -> bi loai vi tong 30 khong dat
```

| | `WHERE` | `HAVING` |
|---|---|---|
| Chạy ở bước | 2 (trước gom) | 4 (sau gom) |
| Lọc cái gì | từng **dòng** | từng **nhóm** |
| Dùng được aggregate? | ❌ | ✅ |

**Câu phỏng vấn:** *"Khi nào dùng WHERE, khi nào dùng HAVING?"* → điều kiện áp lên **giá trị của một dòng** thì dùng `WHERE`; áp lên **kết quả tổng hợp của nhóm** thì dùng `HAVING`. Dùng `WHERE` được thì luôn ưu tiên, vì lọc sớm nghĩa là gom ít dòng hơn, chạy nhanh hơn.

### Aggregate bỏ qua NULL

Đây là chỗ âm thầm làm sai số liệu:

```sql
SELECT COUNT(*) AS so_dong, COUNT(ghi_chu) AS co_ghi_chu, AVG(tien) AS tien_tb FROM don;
```

`AVG` cũng bỏ qua NULL. Nếu cột `tien` có 100 ô NULL trên 9.994 dòng, `AVG(tien)` chia cho **9.894**, không phải 9.994. Nếu những ô NULL đó thực chất là "bằng 0" thì trung bình bị **thổi lên**.

Muốn coi NULL là 0, phải nói rõ: `AVG(COALESCE(tien, 0))`.

### Aggregate có điều kiện — mẫu câu dùng nhiều nhất khi đi làm

Đếm/cộng có phân loại mà **không cần chạy nhiều query**:

```sql
SELECT COUNT(*)                                        AS tong,
       SUM(CASE WHEN tien > 40 THEN 1 ELSE 0 END)      AS don_lon,
       ROUND(100.0 * SUM(CASE WHEN tien > 40 THEN 1 ELSE 0 END) / COUNT(*), 1) AS ty_le_don_lon
FROM don;
```

```
tong = 3    don_lon = 2    ty_le_don_lon = 66.7
```

DuckDB/PostgreSQL có cách viết gọn hơn, cùng ý nghĩa:

```sql
SELECT COUNT(*) FILTER (WHERE tien > 40) AS don_lon FROM don;
```

Kỹ thuật này là nền của **pivot bằng CASE WHEN** (§2.7) và của **[funnel](/glossary#funnel)** (§2.8). Học kỹ.

### Bài tập 2.3

Trên bàn tập:

1. `SELECT khach_id, SUM(tien) FROM don GROUP BY khach_id HAVING COUNT(*) > 1;` → ra gì?
2. Tính "tỷ lệ % đơn có ghi chú" — viết query, chú ý NULL.
3. Vì sao `SELECT khach_id, don_id, SUM(tien) FROM don GROUP BY khach_id` bị lỗi?

Trên Chinook:

4. Doanh thu theo năm.
5. Doanh thu trung bình mỗi hóa đơn theo quốc gia, chỉ lấy quốc gia có ≥ 5 hóa đơn.
6. Tỷ lệ % track không có `Composer`.
7. Đếm hóa đơn theo quốc gia, tách 2 cột "≥ 10$" và "< 10$".

<details>
<summary>Đáp án 2.3</summary>

1. Chỉ ra `khach_id=1, 140`. Khách 2 chỉ có 1 đơn nên không qua `HAVING`.
2. ```sql
   SELECT ROUND(100.0 * COUNT(ghi_chu) / COUNT(*), 1) AS pct FROM don;   -- 66.7
   ```
   Dùng `COUNT(ghi_chu)` (bỏ NULL) trên `COUNT(*)` (mọi dòng). Đây là mẫu đếm tỷ lệ dữ liệu đầy đủ, dùng rất nhiều khi kiểm tra chất lượng dữ liệu.
3. `don_id` không nằm trong `GROUP BY` và không được bọc aggregate. Nhóm `khach_id=1` có 2 giá trị `don_id` khác nhau — database không biết chọn cái nào. Muốn xem cả hai thì đừng gộp, dùng window function.
4. ```sql
   SELECT EXTRACT(YEAR FROM InvoiceDate) AS nam, ROUND(SUM(Total),2) FROM Invoice GROUP BY 1 ORDER BY 1;
   ```
5. ```sql
   SELECT BillingCountry, COUNT(*) AS so_hd, ROUND(AVG(Total),2) AS tb
   FROM Invoice GROUP BY 1 HAVING COUNT(*) >= 5 ORDER BY tb DESC;
   ```
6. ```sql
   SELECT ROUND(100.0 * SUM(CASE WHEN Composer IS NULL THEN 1 ELSE 0 END) / COUNT(*), 1) FROM Track;  -- 27.9
   ```
   Hoặc gọn hơn: `ROUND(100.0 * (COUNT(*) - COUNT(Composer)) / COUNT(*), 1)`.
7. ```sql
   SELECT BillingCountry,
          SUM(CASE WHEN Total >= 10 THEN 1 ELSE 0 END) AS hd_lon,
          SUM(CASE WHEN Total <  10 THEN 1 ELSE 0 END) AS hd_nho
   FROM Invoice GROUP BY 1 ORDER BY hd_lon DESC;
   ```

</details>


:::note Chốt lại
`WHERE` lọc dòng trước khi gom, `HAVING` lọc nhóm sau khi gom — dùng được `WHERE` thì luôn ưu tiên vì lọc sớm chạy nhanh hơn. Aggregate bỏ qua NULL nên mẫu số có thể nhỏ hơn bạn tưởng. Mẫu `SUM(CASE WHEN ...)` là nền của cả pivot lẫn funnel.
:::

## 2.4 — JOIN: mô hình tư duy + 2 cái bẫy chết người {#join}

**Định nghĩa.** JOIN ghép dòng của hai bảng theo điều kiện khớp. Hình dung đúng: với **mỗi dòng bảng trái**, database đi tìm **mọi dòng bảng phải** thỏa điều kiện `ON`, rồi sinh ra một dòng cho **mỗi cặp khớp**.

Câu "mỗi cặp khớp" là chìa khóa. Nó giải thích cả hai cái bẫy bên dưới.

### Thử trên bàn tập 2 bảng

Trước khi chạy, **tự đoán số dòng** của mỗi câu rồi hãy chạy.

```sql
-- (a) INNER JOIN
SELECT k.ten, d.don_id, d.tien FROM khach k INNER JOIN don d ON d.khach_id = k.id;
```
```
An   HD-01  90
An   HD-02  50
Binh HD-03  30          -> 3 dong. Chi BIEN MAT (khong co don nao)
```

```sql
-- (b) LEFT JOIN
SELECT k.ten, d.don_id, d.tien FROM khach k LEFT JOIN don d ON d.khach_id = k.id;
```
```
An   HD-01  90
An   HD-02  50
Binh HD-03  30
Chi  NULL   NULL        -> 4 dong. Chi duoc giu lai, phan ben phai la NULL
```

Hai điều rút ra ngay:
- **An chiếm 2 dòng** vì có 2 đơn — bảng trái bị nhân bản theo số dòng khớp bên phải
- **Chi mất ở INNER, còn ở LEFT** — đây là toàn bộ khác biệt giữa hai loại

| Kiểu JOIN | Kết quả trên bàn tập | Số dòng |
|---|---|---|
| `INNER JOIN` | An×2, Bình×1 | 3 |
| `LEFT JOIN` | An×2, Bình×1, Chi + NULL | 4 |
| `RIGHT JOIN` | như INNER (bảng `don` không có dòng thừa) | 3 |
| `FULL OUTER` | như LEFT | 4 |
| `CROSS JOIN` | mọi tổ hợp 3×3 | 9 |

### Bẫy 1 — "LEFT JOIN hóa INNER JOIN" {#bay-left-join}

Câu hỏi: *"Liệt kê mọi khách, kèm đơn trên 40 nghìn nếu có."*

Hai cách viết, khác nhau đúng một chỗ. Đoán trước xem cách nào ra mấy dòng:

```sql
-- Cach 1: dieu kien o WHERE
SELECT COUNT(*) FROM khach k LEFT JOIN don d ON d.khach_id = k.id WHERE d.tien > 40;

-- Cach 2: dieu kien o ON
SELECT COUNT(*) FROM khach k LEFT JOIN don d ON d.khach_id = k.id AND d.tien > 40;
```

```
Cach 1 (WHERE): 2 dong
Cach 2 (ON):    4 dong
```

Vì sao? Ở cách 1, Chi có `d.tien` = NULL. Mà `NULL > 40` cho ra UNKNOWN, không phải TRUE → `WHERE` loại Chi đi. Bình cũng bị loại vì đơn 30 < 40. **LEFT JOIN mất tác dụng, biến thành INNER JOIN.**

Ở cách 2, điều kiện nằm trong `ON` nên nó chỉ quyết định "dòng nào bên phải được ghép", còn mọi khách bên trái vẫn được giữ.

Cùng chuyện đó trên Chinook, quy mô lớn hơn:

```sql
SELECT COUNT(*) FROM Customer c LEFT JOIN Invoice i ON i.CustomerId = c.CustomerId;                    -- 412
SELECT COUNT(*) FROM Customer c LEFT JOIN Invoice i ON i.CustomerId = c.CustomerId
WHERE i.BillingCountry = 'Brazil';                                                                      -- 35
SELECT COUNT(*) FROM Customer c LEFT JOIN Invoice i ON i.CustomerId = c.CustomerId
AND i.BillingCountry = 'Brazil';                                                                        -- 89
```

89 = 35 dòng hóa đơn Brazil + 54 khách còn lại được giữ với cột phải NULL.

**Quy tắc nhớ:** điều kiện lọc **bảng phải** → đặt vào `ON`. Điều kiện lọc **bảng trái** → đặt vào `WHERE`.

Ngoại lệ hữu ích: `WHERE b.id IS NULL` chính là **[anti-join](/glossary#anti-join)** — tìm cái *không* có. Trên bàn tập, đó là cách tìm ra Chi.

### Bẫy 2 — Fan-out {#fan-out}

Câu hỏi: *"Tổng điểm thưởng của các khách đã từng mua hàng là bao nhiêu?"*

Nhìn bảng `khach` bằng mắt: An 100 + Bình 50 = **150** (Chi chưa mua nên không tính).

Viết query kiểu tự nhiên:

```sql
SELECT SUM(k.diem) FROM khach k JOIN don d ON d.khach_id = k.id;   -- 250 (!!)
```

Ra **250**. Sai. Nhìn kết quả JOIN thì rõ ngay:

```
An   100  HD-01     <- diem 100 dem lan 1
An   100  HD-02     <- diem 100 dem lan 2
Binh  50  HD-03
```

An có 2 đơn nên dòng của An bị nhân đôi, kéo theo `diem` bị cộng 2 lần: 100 + 100 + 50 = 250.

Đây chính là chuyện `ship` bị lặp ở [Lesson 1](/ly-thuyet/l1-foundation#grain), chỉ khác là lần này **JOIN tạo ra sự lặp** thay vì có sẵn trong bảng.

Trên Chinook, cùng lỗi đó ở quy mô thật:

```sql
SELECT SUM(Total) FROM Invoice;                                                       -- 2.328,60  DUNG
SELECT SUM(i.Total) FROM Invoice i JOIN InvoiceLine il ON il.InvoiceId = i.InvoiceId; -- 20.848,62 SAI, phong 9 lan
```

**Ba cách sửa:**

```sql
-- Cach 1: khu trung truoc khi cong
SELECT SUM(diem) FROM (SELECT DISTINCT k.id, k.diem FROM khach k JOIN don d ON d.khach_id = k.id);

-- Cach 2: tong hop bang "nhieu" TRUOC roi moi join
WITH line AS (SELECT InvoiceId, SUM(UnitPrice*Quantity) AS tien FROM InvoiceLine GROUP BY 1)
SELECT ROUND(SUM(tien),2) FROM Invoice i JOIN line l ON l.InvoiceId = i.InvoiceId;

-- Cach 3: cong o dung grain, khong join
SELECT ROUND(SUM(UnitPrice * Quantity),2) FROM InvoiceLine;
```

### Mẹo phát hiện fan-out {#meo-fan-out}

**Đếm số dòng trước và sau mỗi JOIN.** Số tăng ngoài dự kiến = fan-out.

```sql
SELECT COUNT(*) FROM khach;                                      -- 3
SELECT COUNT(*) FROM khach k JOIN don d ON d.khach_id = k.id;    -- 3, nhung khac tap dong
```

Hoặc kiểm khóa sau khi join:

```sql
SELECT khach_id, COUNT(*) FROM don GROUP BY 1 HAVING COUNT(*) > 1;   -- co dong tra ve = quan he 1-nhieu = nguy co fan-out
```

Quy tắc thực chiến: **thấy con số cao bất thường thì nghi fan-out trước, nghi dữ liệu sau.**

### Bài tập 2.4

Trên **bàn tập 2 bảng**, không chạy query, tự đoán rồi kiểm:

1. `SELECT COUNT(*) FROM khach k CROSS JOIN don d;` ra mấy dòng?
2. Muốn liệt kê khách **chưa từng mua**, viết thế nào? Kết quả là ai?
3. `SELECT SUM(d.tien) FROM khach k JOIN don d ON d.khach_id = k.id` — có bị fan-out không? Vì sao có/không?
4. Muốn biết "mỗi khách chi tổng bao nhiêu, khách chưa mua hiện 0" thì dùng JOIN nào, và xử lý NULL ra sao?

Trên Chinook:

5. Tên khách + tổng tiền từng hóa đơn.
6. Doanh thu theo nghệ sĩ (5 bảng) — cẩn thận cộng đúng [grain](/glossary#grain).
7. Playlist và số track, giữ cả playlist rỗng.

<details>
<summary>Đáp án 2.4</summary>

1. **9 dòng** (3×3). `CROSS JOIN` không có điều kiện nên ghép mọi tổ hợp. Hữu ích khi cần tạo bảng lịch đủ tháng × đủ region.
2. ```sql
   SELECT k.ten FROM khach k LEFT JOIN don d ON d.khach_id = k.id WHERE d.don_id IS NULL;
   ```
   Ra **Chi**. Đây là anti-join. Chú ý: điều kiện `IS NULL` đặt ở `WHERE` là **đúng ý đồ** ở đây — khác hoàn toàn với bẫy 1.
3. **Không bị.** Vì `tien` thuộc grain **đơn**, mà JOIN đang sinh ra đúng một dòng cho mỗi đơn. Tổng = 90+50+30 = 170, đúng. Fan-out chỉ xảy ra với cột thuộc grain **cao hơn** (như `diem` của khách).
4. `LEFT JOIN` từ `khach` sang `don`, rồi `COALESCE(SUM(d.tien), 0)`. Nếu dùng `INNER JOIN` thì Chi biến mất khỏi báo cáo — đúng kiểu "khách hàng bị bỏ quên" trong dữ liệu thật.
5. ```sql
   SELECT c.FirstName || ' ' || c.LastName AS khach, i.InvoiceId, i.Total
   FROM Customer c JOIN Invoice i ON i.CustomerId = c.CustomerId;
   ```
6. Cộng `il.UnitPrice * il.Quantity` của `InvoiceLine` (đúng grain), **không** cộng `Invoice.Total`:
   ```sql
   SELECT ar.Name, ROUND(SUM(il.UnitPrice * il.Quantity),2) AS doanh_thu
   FROM InvoiceLine il
   JOIN Track t   ON t.TrackId   = il.TrackId
   JOIN Album al  ON al.AlbumId  = t.AlbumId
   JOIN Artist ar ON ar.ArtistId = al.ArtistId
   GROUP BY 1 ORDER BY doanh_thu DESC LIMIT 10;
   ```
7. ```sql
   SELECT p.Name, COUNT(pt.TrackId) AS so_track
   FROM Playlist p LEFT JOIN PlaylistTrack pt ON pt.PlaylistId = p.PlaylistId
   GROUP BY 1;
   ```
   Dùng `COUNT(pt.TrackId)` chứ **không** `COUNT(*)` — `COUNT(*)` đếm cả dòng NULL nên playlist rỗng sẽ ra 1 thay vì 0.

</details>


:::note Chốt lại
JOIN sinh một dòng cho **mỗi cặp khớp** — đó là nguồn gốc của cả hai cái bẫy. Điều kiện lọc bảng phải đặt vào `ON`, lọc bảng trái đặt vào `WHERE`. Và **đếm số dòng trước/sau mỗi JOIN** là thói quen bắt buộc, vì fan-out không báo lỗi, chỉ thổi phồng số.
:::

## 2.5 — Subquery, CTE và bẫy NOT IN {#subquery-cte}

**Định nghĩa.** Subquery = query lồng trong query. CTE (`WITH ... AS (...)`) = đặt **tên** cho một bước trung gian, để query đọc như liệt kê các bước suy nghĩ.

### Ba vị trí đặt subquery

Trên bàn tập, cùng một câu hỏi *"đơn nào lớn hơn mức trung bình?"*:

```sql
-- 1. O WHERE - loc theo mot gia tri
SELECT * FROM don WHERE tien > (SELECT AVG(tien) FROM don);        -- AVG = 56.7 -> ra HD-01 (90)

-- 2. O FROM - bang dan xuat, BAT BUOC dat alias
SELECT * FROM (SELECT khach_id, SUM(tien) AS tong FROM don GROUP BY 1) x WHERE x.tong > 100;

-- 3. O SELECT - scalar, phai tra dung 1 gia tri
SELECT don_id, tien, (SELECT AVG(tien) FROM don) AS tb_chung FROM don;
```

Vị trí 3 hữu ích khi cần **so từng dòng với một mốc chung** — mỗi dòng đều thấy giá trị trung bình bên cạnh.

### Subquery lồng vs CTE — cùng kết quả, khác khả năng đọc

```sql
-- Subquery long: doc nguoc tu trong ra ngoai
SELECT * FROM (
  SELECT khach_id, SUM(tien) AS tong FROM don GROUP BY 1
) x WHERE x.tong > 100;

-- CTE: doc xuoi nhu tieng Viet
WITH tong_theo_khach AS (
  SELECT khach_id, SUM(tien) AS tong FROM don GROUP BY 1
)
SELECT * FROM tong_theo_khach WHERE tong > 100;
```

Với 1 tầng thì khác biệt nhỏ. Với 3 tầng thì một bên không ai đọc nổi:

```sql
WITH b1 AS (SELECT ... FROM ...),                 -- buoc 1: loc
     b2 AS (SELECT ... FROM b1 GROUP BY ...),     -- buoc 2: tong hop
     b3 AS (SELECT ..., ROW_NUMBER() OVER (...) FROM b2)   -- buoc 3: xep hang
SELECT * FROM b3 WHERE rn <= 3;
```

**Quy tắc: lồng quá 2 tầng → chuyển sang CTE.** Query dài mà đọc được tốt hơn query ngắn mà rối. Sau 2 tuần quay lại chính query của mình vẫn hiểu — đó mới là tiêu chuẩn.

### Correlated subquery — chạy lại cho từng dòng

```sql
-- Track co gia cao hon trung binh CUA CHINH GENRE no
SELECT t.Name, t.UnitPrice FROM Track t
WHERE t.UnitPrice > (SELECT AVG(t2.UnitPrice) FROM Track t2 WHERE t2.GenreId = t.GenreId);
```

Subquery tham chiếu `t.GenreId` của bảng ngoài → phải chạy lại **cho từng dòng**. Đúng nhưng chậm. Với bảng lớn nên viết lại bằng window function:

```sql
SELECT * FROM (SELECT Name, UnitPrice, AVG(UnitPrice) OVER (PARTITION BY GenreId) AS tb_genre FROM Track)
WHERE UnitPrice > tb_genre;
```

### Bẫy NOT IN gặp NULL {#bay-not-in}

Bàn tập nhỏ nhất có thể — 3 số và 1 danh sách:

```sql
WITH t(id) AS (VALUES (1),(2),(3)),
     x(v)  AS (VALUES (2),(NULL))
SELECT COUNT(*) FROM t WHERE id NOT IN (SELECT v FROM x);                   -- ?
SELECT COUNT(*) FROM t WHERE NOT EXISTS (SELECT 1 FROM x WHERE x.v = t.id); -- ?
```

Nhìn bằng mắt: `t` có 1, 2, 3. Loại đi 2. Còn lại **1 và 3** → đáp án phải là 2.

```
NOT IN     ->  0 dong   (!!)
NOT EXISTS ->  2 dong   (dung)
```

**Vì sao:** `1 NOT IN (2, NULL)` được database dịch thành `1 != 2 AND 1 != NULL` = `TRUE AND UNKNOWN` = **UNKNOWN**. Không dòng nào qua được `WHERE`.

Đây là cùng một cơ chế với bẫy NULL ở §2.2, nhưng nguy hiểm hơn: kết quả trả về **rỗng hoàn toàn**, rất dễ bị đọc nhầm thành "không có ai thỏa điều kiện" rồi báo cáo luôn.

**Quy tắc: luôn dùng `NOT EXISTS`** khi subquery có thể chứa NULL. Hoặc nếu vẫn muốn `NOT IN` thì phải tự chặn: `NOT IN (SELECT v FROM x WHERE v IS NOT NULL)`.

`EXISTS` vs `IN` ở dạng khẳng định thì an toàn như nhau, nhưng `EXISTS` thường nhanh hơn vì chỉ cần tìm thấy 1 dòng là dừng.

### Bài tập 2.5

Trên bàn tập:

1. Viết bằng CTE: khách nào chi nhiều hơn mức trung bình của tất cả khách?
2. `SELECT * FROM don WHERE khach_id NOT IN (SELECT id FROM khach WHERE diem > 60);` → ra gì? Nếu cột `diem` có NULL thì sao?

Trên Chinook:

3. Khách chi tiêu cao hơn mức trung bình toàn bộ khách.
4. Top 3 genre theo doanh thu, rồi lấy chi tiết track thuộc 3 genre đó (CTE nhiều tầng).
5. Khách **chưa từng** mua thể loại Rock — viết bằng `NOT EXISTS`, rồi thử `NOT IN`, so kết quả.

<details>
<summary>Đáp án 2.5</summary>

1. ```sql
   WITH chi AS (SELECT khach_id, SUM(tien) AS tong FROM don GROUP BY 1)
   SELECT * FROM chi WHERE tong > (SELECT AVG(tong) FROM chi);
   ```
   Trung bình = (140+30)/2 = 85 → chỉ khách 1 (140) đạt. Chú ý: mẫu số là **2 khách có đơn**, không phải 3 khách trong bảng `khach` — Chi không có đơn nào nên không xuất hiện trong CTE.
2. `diem > 60` chỉ có khách 1 (100 điểm) → `NOT IN (1)` → ra HD-03 của khách 2. Nếu `diem` có NULL thì bản thân subquery vẫn ổn (điều kiện `> 60` đã loại NULL). Nhưng nếu subquery là `SELECT id FROM khach` mà cột `id` có NULL thì kết quả rỗng ngay.
3. ```sql
   WITH chi_tieu AS (SELECT CustomerId, SUM(Total) AS tong FROM Invoice GROUP BY 1)
   SELECT * FROM chi_tieu WHERE tong > (SELECT AVG(tong) FROM chi_tieu) ORDER BY tong DESC;
   ```
4. ```sql
   WITH rev_genre AS (
     SELECT g.GenreId, g.Name AS genre, SUM(il.UnitPrice*il.Quantity) AS doanh_thu
     FROM InvoiceLine il JOIN Track t ON t.TrackId = il.TrackId JOIN Genre g ON g.GenreId = t.GenreId
     GROUP BY 1,2
   ),
   top3 AS (SELECT * FROM rev_genre ORDER BY doanh_thu DESC LIMIT 3)
   SELECT top3.genre, t.Name FROM top3 JOIN Track t ON t.GenreId = top3.GenreId LIMIT 20;
   ```
5. ```sql
   SELECT c.CustomerId, c.LastName FROM Customer c
   WHERE NOT EXISTS (
     SELECT 1 FROM Invoice i
     JOIN InvoiceLine il ON il.InvoiceId = i.InvoiceId
     JOIN Track t ON t.TrackId = il.TrackId
     JOIN Genre g ON g.GenreId = t.GenreId
     WHERE i.CustomerId = c.CustomerId AND g.Name = 'Rock'
   );
   ```
   Bản `NOT IN`: nếu danh sách con sinh ra NULL (do join hụt), kết quả trả rỗng. Chạy cả hai và giải thích chênh lệch chính là bài tập ở đây.

</details>


:::note Chốt lại
Lồng quá 2 tầng thì chuyển sang CTE — query dài mà đọc được tốt hơn query ngắn mà rối. Và luôn dùng `NOT EXISTS` thay `NOT IN` khi subquery có thể chứa NULL, vì `NOT IN` trả về **rỗng hoàn toàn**, rất dễ bị đọc nhầm thành "không có ai thỏa điều kiện".
:::

## 2.6 — Window functions (kỹ năng phân biệt fresher và junior) {#window}

**Định nghĩa.** Window function tính toán dựa trên một nhóm dòng liên quan **mà không gộp dòng lại**.

### Thấy khác biệt trên bàn tập

Cùng một câu hỏi, hai cách làm. Đoán trước: mỗi câu trả về **mấy dòng**?

```sql
-- Cach A: GROUP BY
SELECT k.ten, SUM(d.tien) FROM khach k JOIN don d ON d.khach_id = k.id GROUP BY 1;

-- Cach B: window
SELECT k.ten, d.tien, SUM(d.tien) OVER () AS tong
FROM khach k JOIN don d ON d.khach_id = k.id;
```

```
Cach A ->  2 dong        An 140 · Binh 30          (gop lai, mat chi tiet tung don)
Cach B ->  3 dong        An 90 |170 · An 50 |170 · Binh 30 |170   (giu nguyen dong, gan them cot tong)
```

Đó là toàn bộ khác biệt: **`GROUP BY` gộp dòng, window giữ nguyên dòng và gắn thêm cột.**

Vì sao cần giữ dòng? Vì nhiều câu hỏi cần **cả chi tiết lẫn tổng cùng lúc**: "đơn này chiếm bao nhiêu % tổng doanh thu?" — cần giá trị từng đơn (chi tiết) và tổng (tổng hợp) trên cùng một dòng. `GROUP BY` không làm được, phải join hai lần.

Cú pháp: `HAM() OVER (PARTITION BY nhom ORDER BY thu_tu [ROWS BETWEEN ...])`
- `PARTITION BY` = chia nhóm (giống `GROUP BY` nhưng không gộp)
- `ORDER BY` = thứ tự trong nhóm (bắt buộc cho `LAG`/`LEAD`/running total)
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


:::note Chốt lại
Window **giữ nguyên số dòng**, `GROUP BY` gộp dòng lại — đó là toàn bộ khác biệt. Dùng window khi cần cả chi tiết lẫn tổng hợp trên cùng một dòng. Không lọc được window trong `WHERE`; phải bọc CTE hoặc dùng `QUALIFY`.
:::

## 2.7 — Ngày tháng, CASE WHEN, chia số và NULL {#date-case-null}

### Bàn tập có ngày

```sql
CREATE TABLE don(don_id VARCHAR, ngay DATE, tien INT);
INSERT INTO don VALUES ('HD-01', DATE '2024-01-15', 90),
                       ('HD-02', DATE '2024-01-20', 50),
                       ('HD-03', DATE '2024-03-02', 30);
```

Ba đơn: hai đơn tháng 1, **không có đơn nào tháng 2**, một đơn tháng 3.

### [DATE_TRUNC](/glossary#date-trunc) — gom về đầu kỳ

```sql
SELECT DATE_TRUNC('month', ngay) AS thang, SUM(tien) FROM don GROUP BY 1 ORDER BY 1;
```

```
2024-01-01   140
2024-03-01    30
```

**Tháng 2 biến mất.** Không sai về mặt SQL — không có dữ liệu thì không có dòng. Nhưng đưa lên biểu đồ đường thì tai hại: đường nối thẳng từ tháng 1 sang tháng 3, che mất đúng cái cần thấy là **tháng 2 bán được 0 đồng**.

Đây là lỗi báo cáo hay gặp nhất mà không ai phát hiện, vì nhìn chart vẫn "bình thường".

### Calendar table — bắt kỳ trống hiện ra

```sql
WITH cal AS (
  SELECT UNNEST(generate_series(DATE '2024-01-01', DATE '2024-03-01', INTERVAL 1 MONTH)) AS thang
),
rev AS (
  SELECT DATE_TRUNC('month', ngay) AS thang, SUM(tien) AS dt FROM don GROUP BY 1
)
SELECT strftime(cal.thang,'%Y-%m') AS thang, COALESCE(rev.dt, 0) AS doanh_thu
FROM cal LEFT JOIN rev ON rev.thang = cal.thang ORDER BY 1;
```

```
2024-01   140
2024-02     0     <- hien ra roi
2024-03    30
```

Ba thứ phối hợp: `generate_series` tạo đủ kỳ · `LEFT JOIN` giữ mọi kỳ · `COALESCE` biến NULL thành 0. Mẫu này dùng lại ở mọi báo cáo theo thời gian.

### Hàm ngày hay dùng

| Hàm | Làm gì | Ví dụ |
|---|---|---|
| `DATE_TRUNC('month', d)` | cắt về đầu tháng/tuần/quý | `2024-01-15` → `2024-01-01` |
| `EXTRACT(YEAR FROM d)` | lấy một phần | → `2024` |
| `EXTRACT(DOW FROM d)` | thứ trong tuần | 0 = Chủ nhật |
| `DATE_DIFF('day', a, b)` | khoảng cách | số ngày giữa 2 mốc |
| `d + INTERVAL '7 days'` | cộng trừ | |
| `strftime(d, '%Y-%m')` | định dạng để hiển thị | → `'2024-01'` |

**Quy tắc:** gom nhóm bằng `DATE_TRUNC` (kiểu ngày, sắp xếp đúng). Chỉ đổi sang chuỗi ở **bước hiển thị cuối cùng**. Gom bằng chuỗi từ đầu sẽ sai khi so sánh lớn/nhỏ và khi cần cộng trừ ngày.

### Bẫy chia số nguyên

```sql
SELECT 3/4;
```

| Database | Kết quả |
|---|---|
| SQLite · PostgreSQL · SQL Server | **0** |
| DuckDB · BigQuery · MySQL | 0.75 |

Nghĩa là code tính [conversion rate](/glossary#conversion-rate) chạy đúng ở sân tập DuckDB có thể ra **0 hết** khi đưa lên Postgres. Và không có lỗi nào báo.

Viết an toàn ở mọi nơi — nhân `1.0` để ép sang số thực:

```sql
SELECT COUNT(*) FILTER (WHERE tien > 40) * 1.0 / NULLIF(COUNT(*), 0) AS ty_le FROM don;   -- 0.667
```

`NULLIF(x, 0)` biến 0 thành NULL → phép chia trả NULL thay vì lỗi "division by zero". Kết quả NULL trên báo cáo tốt hơn nhiều so với query chết giữa chừng.

**Mẫu chuẩn cho mọi tỷ lệ, học thuộc:**

```sql
tu_so * 1.0 / NULLIF(mau_so, 0)
```

### CASE WHEN — hai công dụng

**Phân nhóm (binning):**

```sql
SELECT CASE WHEN tien >= 80 THEN 'Cao'
            WHEN tien >= 40 THEN 'Trung binh'
            ELSE 'Thap' END AS nhom,
       COUNT(*) FROM don GROUP BY 1;
```

Thứ tự điều kiện quan trọng: `CASE` dừng ở điều kiện đúng **đầu tiên**. Viết ngược từ nhỏ lên lớn thì mọi dòng rơi vào nhóm đầu.

**Xoay bảng (pivot ngang):**

```sql
SELECT DATE_TRUNC('month', ngay) AS thang,
       SUM(CASE WHEN tien >= 80 THEN tien ELSE 0 END) AS don_lon,
       SUM(CASE WHEN tien <  80 THEN tien ELSE 0 END) AS don_nho
FROM don GROUP BY 1 ORDER BY 1;
```

Từ dạng dọc (mỗi nhóm 1 dòng) thành dạng ngang (mỗi nhóm 1 cột). Đây là cách làm báo cáo "region × tháng" mà sếp hay yêu cầu.

### [COALESCE](/glossary#coalesce) và [NULLIF](/glossary#nullif)

| Hàm | Làm gì | Dùng khi |
|---|---|---|
| `COALESCE(a, b, c)` | trả giá trị **đầu tiên khác NULL** | điền mặc định: `COALESCE(discount, 0)` |
| `NULLIF(a, b)` | trả NULL nếu `a = b` | chặn chia 0: `NULLIF(mau_so, 0)` |

### Bài tập 2.7

1. Trên bàn tập, viết query ra đủ 3 tháng kèm cột "tăng trưởng so tháng trước". Tháng 2 doanh thu 0 thì tăng trưởng tháng 3 tính thế nào?
2. `SELECT COUNT(*)/COUNT(DISTINCT don_id) FROM don;` — chạy trên Postgres ra gì, trên DuckDB ra gì?
3. Viết `CASE WHEN` phân 3 nhóm nhưng cố tình sai thứ tự, giải thích kết quả sai ra sao.

Trên Chinook — **deliverable W8: bộ 12 query báo cáo tháng**. Ba câu khó nhất:

4. Khách mới vs khách quay lại theo tháng.
5. Khoảng cách trung bình giữa 2 lần mua.
6. Top 5 khách đóng góp bao nhiêu % tổng doanh thu.

<details>
<summary>Đáp án 2.7</summary>

1. Tháng 3 so tháng 2: `(30 − 0) / 0` → chia cho 0. Với `NULLIF` sẽ ra NULL, và **NULL là câu trả lời đúng** — không thể tính phần trăm tăng trưởng trên nền bằng 0. Trên báo cáo hiển thị "—" hoặc "n/a", **không** hiển thị 0% và tuyệt đối không hiển thị ∞.
2. Postgres: `3/3` = 1 (may mắn đúng). Nhưng nếu là `2/3` thì Postgres ra **0** còn DuckDB ra 0.667. Luôn viết `* 1.0`.
3. ```sql
   CASE WHEN tien >= 40 THEN 'Trung binh' WHEN tien >= 80 THEN 'Cao' ELSE 'Thap' END
   ```
   Đơn 90 rơi vào 'Trung bình' vì điều kiện `>= 40` đúng trước. Nhóm 'Cao' **không bao giờ** có dòng nào. Lỗi này không báo lỗi, chỉ ra phân nhóm sai — kiểm bằng cách đếm số dòng mỗi nhóm, thấy nhóm nào bằng 0 thì nghi ngay.
4. ```sql
   WITH first_buy AS (SELECT CustomerId, MIN(DATE_TRUNC('month', InvoiceDate)) AS thang_dau FROM Invoice GROUP BY 1),
   m AS (SELECT DISTINCT CustomerId, DATE_TRUNC('month', InvoiceDate) AS thang FROM Invoice)
   SELECT m.thang,
          COUNT(*) FILTER (WHERE m.thang = f.thang_dau) AS khach_moi,
          COUNT(*) FILTER (WHERE m.thang > f.thang_dau) AS khach_quay_lai
   FROM m JOIN first_buy f ON f.CustomerId = m.CustomerId GROUP BY 1 ORDER BY 1;
   ```
5. ```sql
   WITH x AS (SELECT CustomerId, InvoiceDate,
                     LAG(InvoiceDate) OVER (PARTITION BY CustomerId ORDER BY InvoiceDate) AS lan_truoc
              FROM Invoice)
   SELECT ROUND(AVG(DATE_DIFF('day', lan_truoc, InvoiceDate)), 1) FROM x WHERE lan_truoc IS NOT NULL;
   ```
6. ```sql
   WITH sp AS (SELECT CustomerId, SUM(Total) AS chi FROM Invoice GROUP BY 1),
   r AS (SELECT *, ROW_NUMBER() OVER (ORDER BY chi DESC) AS hang, SUM(chi) OVER () AS tong FROM sp)
   SELECT ROUND(100 * SUM(chi) / MAX(tong), 1) AS pct_top5 FROM r WHERE hang <= 5;   -- 10.1%
   ```
   10,1% — thấp bất thường. Dữ liệu thương mại thật thường 30–50%. Nêu được nhận xét đó mới là phân tích, chỉ chạy ra số thì chưa.

</details>


:::note Chốt lại
Kỳ không có dữ liệu sẽ **biến mất** khỏi báo cáo nếu không dùng calendar table — và biểu đồ vẫn trông bình thường. Luôn viết tỷ lệ theo mẫu `tu_so * 1.0 / NULLIF(mau_so, 0)` để an toàn với cả chia số nguyên lẫn chia cho 0.
:::

## 2.8 — Ba mẫu phân tích thực chiến {#funnel-cohort-rfm}

Ba dạng này chiếm phần lớn bài test DA. Học **cấu trúc**, đừng học thuộc cú pháp.

### Bàn tập sự kiện — 10 dòng

```sql
CREATE TABLE sk(user_id INT, buoc VARCHAR, ngay DATE);
INSERT INTO sk VALUES
 (1,'xem','2024-01-05'),(1,'gio','2024-01-05'),(1,'mua','2024-01-05'),
 (2,'xem','2024-01-06'),(2,'gio','2024-01-06'),
 (3,'xem','2024-01-07'),
 (4,'xem','2024-02-02'),(4,'gio','2024-02-02'),(4,'mua','2024-02-03'),
 (1,'mua','2024-02-10');
```

Nhìn bằng mắt trước khi viết query:
- **User 1**: xem → giỏ → mua (tháng 1), rồi **mua lại** tháng 2
- **User 2**: xem → giỏ, dừng lại, không mua
- **User 3**: chỉ xem
- **User 4**: xem → giỏ → mua (tháng 2)

### Funnel — đếm user rơi rụng qua từng bước

Cách ngây thơ, và vì sao nó thiếu:

```sql
SELECT buoc, COUNT(DISTINCT user_id) FROM sk GROUP BY 1;
-- xem 4 · gio 3 · mua 2
```

Ra đúng số, nhưng **không tính được tỷ lệ chuyển đổi giữa các bước** vì mỗi bước nằm ở một dòng riêng. Mẫu chuẩn là gom cờ về mỗi user rồi mới tính:

```sql
WITH b AS (
  SELECT user_id,
         MAX(CASE WHEN buoc = 'xem' THEN 1 ELSE 0 END) AS b1,
         MAX(CASE WHEN buoc = 'gio' THEN 1 ELSE 0 END) AS b2,
         MAX(CASE WHEN buoc = 'mua' THEN 1 ELSE 0 END) AS b3
  FROM sk GROUP BY 1
)
SELECT SUM(b1) AS xem, SUM(b2) AS gio, SUM(b3) AS mua,
       ROUND(100.0*SUM(b2)/SUM(b1)) AS cr_xem_gio,
       ROUND(100.0*SUM(b3)/SUM(b2)) AS cr_gio_mua
FROM b;
```

```
xem = 4    gio = 3    mua = 2
cr_xem_gio = 75%      cr_gio_mua = 67%
```

Dùng `MAX(CASE WHEN ...)` chứ không `SUM` — vì user 1 mua **2 lần**, `SUM` sẽ đếm thành 2. `MAX` biến thành cờ 0/1: *"user này đã từng làm bước đó chưa"*.

**Ba quyết định phải nêu khi trình bày** — không nêu là bị hỏi ngay:

| Quyết định | Ở bàn tập này | Vì sao quan trọng |
|---|---|---|
| Cửa sổ thời gian | Không giới hạn | User 4 xem ngày 2/2, mua ngày 3/2 — nếu ép "trong cùng phiên" thì user này rơi khỏi phễu |
| Có ép thứ tự không | **Không** | Query này chỉ hỏi "đã từng làm bước đó chưa", không kiểm tra `xem` có trước `mua` |
| Đơn vị đếm | user duy nhất | Đếm theo session sẽ ra con số khác hoàn toàn |

Funnel chặt chẽ phải kiểm `timestamp` bước sau > bước trước. Nêu được hạn chế này trước khi bị hỏi là điểm cộng lớn khi phỏng vấn.

### [Cohort](/glossary#cohort) [retention](/glossary#retention) — tách "sản phẩm tốt lên" khỏi "mua thêm user mới"

```sql
WITH fm AS (   -- buoc 1: moi user thuoc cohort nao (thang mua dau tien)
  SELECT user_id, DATE_TRUNC('month', MIN(ngay)) AS cohort FROM sk WHERE buoc = 'mua' GROUP BY 1
),
act AS (       -- buoc 2: moi thang user do con hoat dong khong
  SELECT DISTINCT s.user_id, f.cohort,
         DATE_DIFF('month', f.cohort, DATE_TRUNC('month', s.ngay)) AS thang_thu
  FROM sk s JOIN fm f ON f.user_id = s.user_id WHERE s.buoc = 'mua'
)
SELECT strftime(cohort,'%Y-%m') AS cohort, thang_thu, COUNT(*) AS users
FROM act GROUP BY 1,2 ORDER BY 1,2;
```

```
2024-01   thang 0   1 user      <- user 1 mua lan dau thang 1
2024-01   thang 1   1 user      <- user 1 quay lai thang 2  -> retention 100%
2024-02   thang 0   1 user      <- user 4
```

**Cấu trúc 3 bước, nhớ cái này là viết lại được ở mọi dataset:**

```
first_month  →  activity  →  đếm theo (cohort, tháng thứ mấy)
```

Cách đọc bảng cohort:
- **Đọc ngang** — một nhóm người theo thời gian → sản phẩm giữ chân tốt dần hay tệ dần?
- **Đọc dọc** — so các nhóm ở cùng độ tuổi → chất lượng user mới có tốt lên không?
- Cột tháng 0 luôn 100% theo định nghĩa — đừng khoe con số đó.

### RFM — phân khúc dẫn tới hành động

```sql
WITH base AS (
  SELECT user_id,
         DATE_DIFF('day', MAX(ngay), DATE '2024-03-01') AS recency,
         COUNT(*)                                        AS frequency,
         SUM(1)                                          AS monetary   -- that te: SUM(so tien)
  FROM sk WHERE buoc = 'mua' GROUP BY 1
)
SELECT *,
       NTILE(5) OVER (ORDER BY recency)        AS r,   -- moi mua = diem cao
       NTILE(5) OVER (ORDER BY frequency DESC) AS f,
       NTILE(5) OVER (ORDER BY monetary DESC)  AS m
FROM base;
```

Phân khúc thường dùng: **Champions** (555) · **Loyal** (R cao, F cao) · **At risk** (F, M cao nhưng R thấp — nhóm đáng cứu nhất) · **Lost** · **New**.

Giá trị của RFM nằm ở chỗ nối thẳng sang hành động: At risk → gửi ưu đãi giữ chân; Champions → mời chương trình thành viên. **Phân khúc mà mỗi nhóm không dẫn tới hành động khác nhau thì phân khúc vô nghĩa.**

### Bài tập 2.8

Trên bàn tập 10 dòng:

1. Nếu ép funnel theo thứ tự thời gian (bước sau phải sau bước trước), user 4 có còn trong phễu không?
2. Đổi `MAX(CASE WHEN ...)` thành `SUM(CASE WHEN ...)` thì con số nào sai, sai bao nhiêu?
3. Retention tháng 1 của cohort 2024-01 là bao nhiêu %? Cỡ mẫu bao nhiêu người — con số đó có đáng tin không?

Trên BigQuery `thelook_ecommerce`:

4. Funnel theo `event_type`, kèm tỷ lệ từng bước.
5. Cohort retention theo tháng đăng ký, dạng ma trận.
6. RFM đầy đủ + bảng phân khúc kèm hành động đề xuất.

<details>
<summary>Đáp án 2.8</summary>

1. **Còn.** User 4 xem ngày 2/2, mua ngày 3/2 — bước sau đúng là sau bước trước. Nhưng nếu định nghĩa funnel là "trong cùng một phiên/cùng ngày" thì user 4 **rơi ra**, phễu còn `mua = 1` và conversion tụt từ 67% xuống 33%. Cùng dữ liệu, hai định nghĩa, hai kết luận — đó là lý do phải chốt định nghĩa trước khi báo cáo.
2. Cột `mua`: `SUM` ra **3** thay vì 2, vì user 1 mua 2 lần. Kéo theo `cr_gio_mua` thành 100% thay vì 67% — báo cáo đẹp hơn thực tế.
3. **100%** (1/1 user quay lại). Nhưng [cỡ mẫu](/glossary#sample-size) là **1 người** — con số này vô nghĩa. Bài học: cohort luôn phải kèm số user tuyệt đối; nhóm dưới ~30 người thì tỷ lệ % chỉ là nhiễu. Đây là lỗi hay gặp khi chia cohort quá nhỏ.

</details>


:::note Chốt lại
Ba dạng này học **cấu trúc**, không học cú pháp. Với funnel, ba quyết định (cửa sổ thời gian · ép thứ tự · đơn vị đếm) quyết định con số ra bao nhiêu — nêu rõ trước khi báo cáo. Với cohort, luôn kèm số tuyệt đối vì tỷ lệ trên nhóm nhỏ là nhiễu. Với RFM, phân khúc không dẫn tới hành động khác nhau thì vô nghĩa.
:::

## 2.9 — Kỹ năng debug query {#debug-query}

Không có trong stage file, nhưng phỏng vấn hay hỏi và đi làm dùng hằng ngày.

**Tình huống:** query chạy xong, ra một con số. Con số đó **trông lạ**. Giờ làm gì?

### Năm bước, theo đúng thứ tự

**Bước 1 — Đếm dòng ở từng bước.** Bọc mỗi CTE bằng `SELECT COUNT(*)`, chạy riêng. Bước nào số nhảy bất thường là bước có lỗi.

```sql
WITH b1 AS (...), b2 AS (SELECT ... FROM b1 JOIN ...)
SELECT (SELECT COUNT(*) FROM b1) AS sau_buoc_1,
       (SELECT COUNT(*) FROM b2) AS sau_buoc_2;
```

**Bước 2 — Kiểm grain sau JOIN.** Có dòng trả về nghĩa là đã fan-out:

```sql
SELECT khoa, COUNT(*) FROM ket_qua GROUP BY 1 HAVING COUNT(*) > 1 LIMIT 5;
```

**Bước 3 — Soi NULL.** Cột nào thiếu bao nhiêu:

```sql
SELECT COUNT(*) - COUNT(cot_nghi_ngo) AS so_null FROM bang;
```

**Bước 4 — Đối chiếu tổng.** Tổng ở bảng chi tiết phải bằng tổng ở bảng cha. Lệch = fan-out hoặc mất dòng.

```sql
SELECT (SELECT SUM(Total) FROM Invoice)                    AS tu_bang_cha,     -- 2.328,60
       (SELECT SUM(UnitPrice*Quantity) FROM InvoiceLine)   AS tu_bang_chi_tiet; -- phai khop
```

**Bước 5 — Thu nhỏ bài toán.** Lọc còn **1 khách hàng**, tự tính bằng máy tính tay, so với query. Đây là bước cuối cùng nhưng hiệu quả nhất — sai ở đâu lộ ra ngay.

```sql
SELECT * FROM don WHERE khach_id = 1;   -- chi 2 dong, tinh tay duoc
```

### Bảng tra triệu chứng → nguyên nhân

| Triệu chứng | Nghi ngờ đầu tiên | Kiểm bằng |
|---|---|---|
| Doanh thu cao bất thường | Fan-out | Bước 2 và 4 |
| Kết quả **rỗng hoàn toàn** | `NOT IN` gặp NULL, hoặc điều kiện NULL | §2.5, §2.2 |
| Số dòng ít hơn dự kiến | `LEFT JOIN` bị `WHERE` biến thành `INNER` | §2.4 |
| Tỷ lệ ra 0 hết | Chia số nguyên | §2.7 |
| Số user bị thổi phồng | Quên `DISTINCT` | Bước 2 |
| Báo cáo thiếu tháng | Không dùng calendar table | §2.7 |
| Tổng các phần ≠ tổng chung | Measure non-additive | [L3 §3.4](/ly-thuyet/l3-bi#filter-context) |

### Câu phỏng vấn kinh điển

*"Sếp nói doanh thu trên dashboard không khớp với số của kế toán. Bạn kiểm tra thế nào?"*

Trả lời theo 5 bước trên, cộng thêm 4 thứ **ngoài kỹ thuật**:

1. **Khoảng thời gian** — hai bên có đang tính cùng kỳ không? Dashboard lấy theo ngày đặt hay ngày giao?
2. **Múi giờ** — dữ liệu lưu UTC, kế toán tính theo giờ Việt Nam → lệch nguyên một ngày ở hai đầu kỳ.
3. **Định nghĩa doanh thu** — gộp hay đã trừ hoàn hàng, hủy đơn, chiết khấu? GMV ≠ Revenue ≠ Net revenue.
4. **Bộ lọc mặc định** — dashboard có đang ẩn đơn test, đơn nội bộ, hay một kênh nào đó không?

Trong thực tế, nguyên nhân nằm ở nhóm 4 thứ này nhiều hơn là ở query. Nêu được cả hai phía mới là câu trả lời đủ.

### Bài tập 2.9

1. Query này trả về rỗng, tìm lỗi:
   ```sql
   SELECT * FROM Customer WHERE CustomerId NOT IN (SELECT SupportRepId FROM Customer);
   ```
2. Query này ra doanh thu gấp nhiều lần thực tế, chỉ ra chỗ sai và sửa:
   ```sql
   SELECT c.Country, SUM(i.Total) FROM Customer c
   JOIN Invoice i ON i.CustomerId = c.CustomerId
   JOIN InvoiceLine il ON il.InvoiceId = i.InvoiceId
   GROUP BY 1;
   ```
3. Báo cáo tháng thiếu mất tháng 7, dữ liệu gốc kiểm tra thấy tháng 7 thật sự không có đơn nào. Query đã đúng chưa? Nên sửa thế nào?

<details>
<summary>Đáp án 2.9</summary>

1. `SupportRepId` có thể chứa NULL → `NOT IN` với danh sách có NULL trả rỗng. Sửa: dùng `NOT EXISTS`, hoặc thêm `WHERE SupportRepId IS NOT NULL` vào subquery. (Ngoài ra bản thân query này còn sai logic: so `CustomerId` với `SupportRepId` là so hai loại thực thể khác nhau — nhân viên và khách hàng.)
2. Bảng `InvoiceLine` được join vào nhưng **không dùng cột nào của nó**, chỉ làm nhân bản dòng → `i.Total` bị cộng lặp theo số dòng chi tiết. Sửa: **bỏ hẳn** `JOIN InvoiceLine`. Nếu thật sự cần dữ liệu chi tiết thì cộng `SUM(il.UnitPrice * il.Quantity)` thay vì `SUM(i.Total)`.
3. Query **không sai** nhưng báo cáo **sai**. Không có dữ liệu thì `GROUP BY` không sinh dòng. Sửa bằng calendar table + `LEFT JOIN` + `COALESCE(..., 0)` để tháng 7 hiện lên với giá trị 0 — vì "bán được 0 đồng" là thông tin quan trọng, còn "không có dòng" thì người đọc tưởng là quên lấy dữ liệu.

</details>


:::note Chốt lại
Số lạ thì đếm dòng từng bước, kiểm grain sau JOIN, soi NULL, đối chiếu tổng, rồi thu nhỏ về 1 khách để tính tay. Và nhớ: khi số không khớp với bộ phận khác, nguyên nhân thường nằm ở **định nghĩa, kỳ, múi giờ, bộ lọc mặc định** nhiều hơn là ở query.
:::

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
