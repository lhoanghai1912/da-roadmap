---
id: stage-2-sql
title: "Stage 2 — SQL: trục xương sống"
sidebar_label: "Stage 2 — SQL"
sidebar_position: 3
description: "Tuan 3-9: SELECT, JOIN, CTE, window function, cohort, funnel. 62 query tu viet, 125+ bai tap."
format: md
---

# STAGE 2 — SQL: trục xương sống

| | |
|---|---|
| **Thời lượng** | 7 tuần (W3–W9), ~105h |
| **Prerequisite** | CHECKPOINT 1 đã pass |
| **Mục tiêu** | Viết được query phân tích nhiều bảng, window function, cohort/funnel — không tra cứu |
| **Output** | ≥ 125 bài đã giải + bộ 12 query báo cáo + 6 metric definition |
| **Checkpoint** | CHECKPOINT 2 |

Đây là stage quan trọng nhất. JD Junior DA banking yêu cầu rõ: *"Thành thạo SQL (JOIN, subquery, window functions)"*. 7 tuần này quyết định có qua được vòng technical hay không.

---

## Dựng sân tập (làm 1 lần, đầu W3, 30 phút)

**Chinook** — 11 bảng mô hình bán nhạc số (artist → album → track → invoice → customer). Đủ sâu để tập JOIN 4–5 bảng.

```bash
cd ~/Documents/Study/DA/da-portfolio/data
curl -LO https://github.com/lerocha/chinook-database/raw/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite

duckdb chinook.duckdb
```
```sql
INSTALL sqlite; LOAD sqlite;
CALL sqlite_attach('Chinook_Sqlite.sqlite');
SHOW TABLES;
SELECT COUNT(*) FROM Invoice;   -- kiểm tra kết nối
```

**Nạp thêm Superstore từ Stage 1:**
```sql
CREATE TABLE superstore AS SELECT * FROM read_csv_auto('superstore.csv');
```

**Kết nối DBeaver:** New Connection → DuckDB → trỏ tới file `chinook.duckdb`. Dùng DBeaver để nhìn ERD (Database → View Diagram) — hiểu quan hệ bảng trước khi viết JOIN.

**Sân tập online:** LeetCode Database (miễn phí, có test case) · StrataScratch (đề từ phỏng vấn thật) · SQLBolt (interactive, học nhanh cú pháp) · Mode SQL Tutorial (dạy tư duy phân tích, không chỉ cú pháp).

---

# TUẦN 3 — Truy vấn cơ bản

| ID | Chủ đề | Cú pháp / khái niệm | Xong |
|---|---|---|---|
| W3.1 | `SELECT`, alias | `SELECT col AS ten_moi` | ☐ |
| W3.2 | `WHERE` + toán tử so sánh | `= != > < >= <=` | ☐ |
| W3.3 | Toán tử logic | `AND`, `OR`, `NOT`, thứ tự ưu tiên + ngoặc | ☐ |
| W3.4 | `BETWEEN`, `IN`, `LIKE` | `LIKE '%bank%'`, `_` là 1 ký tự | ☐ |
| W3.5 | `IS NULL` / `IS NOT NULL` | **Không dùng `= NULL`** | ☐ |
| W3.6 | `ORDER BY` + `LIMIT`/`OFFSET` | `ORDER BY x DESC NULLS LAST` | ☐ |
| W3.7 | `DISTINCT` | Khác biệt `DISTINCT` vs `GROUP BY` | ☐ |
| W3.8 | Ép kiểu | `CAST(x AS INT)`, `::DATE` | ☐ |
| W3.9 | Thứ tự thực thi logic | `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT` | ☐ |

**Bài tập bắt buộc W3:**
- [ ] SQLBolt bài 1–6 (toàn bộ)
- [ ] 15 bài LeetCode Database Easy
- [ ] 10 query tự viết trên Chinook, lưu vào `sql/w3-basics.sql`

**10 query tự viết:**
1. Danh sách khách hàng ở Brazil, sắp xếp theo tên
2. Track có đơn giá trên 0.99
3. Hóa đơn năm 2013, sắp giảm dần theo tổng tiền
4. Khách hàng có email đuôi `gmail.com`
5. Track không thuộc composer nào (NULL)
6. 10 hóa đơn giá trị cao nhất
7. Danh sách quốc gia duy nhất của khách hàng
8. Nhân viên được thuê trong khoảng 2002–2003
9. Track có tên chứa từ "love" (không phân biệt hoa thường)
10. Hóa đơn từ dòng 11 đến 20 theo thứ tự ngày (dùng OFFSET)

> **Bẫy `NULL`:** `WHERE composer != 'X'` sẽ **loại luôn** các dòng composer NULL, vì so sánh với NULL trả về UNKNOWN chứ không phải TRUE. Muốn giữ, viết `WHERE composer != 'X' OR composer IS NULL`. Lỗi này làm sai số liệu mà không báo lỗi — cực kỳ hay gặp trong việc thật.

---

# TUẦN 4 — Nhóm và tổng hợp

| ID | Chủ đề | Điểm cần nắm | Xong |
|---|---|---|---|
| W4.1 | `COUNT(*)` vs `COUNT(col)` vs `COUNT(DISTINCT col)` | `COUNT(col)` bỏ qua NULL | ☐ |
| W4.2 | `SUM`, `AVG`, `MIN`, `MAX` | `AVG` cũng bỏ qua NULL — khác với coi NULL = 0 | ☐ |
| W4.3 | `GROUP BY` 1 và nhiều cột | Mọi cột không aggregate phải có trong GROUP BY | ☐ |
| W4.4 | `HAVING` vs `WHERE` | WHERE lọc dòng **trước** nhóm; HAVING lọc **sau** nhóm | ☐ |
| W4.5 | `ROUND`, `CEIL`, `FLOOR` | Làm tròn tiền tệ | ☐ |
| W4.6 | Aggregate có điều kiện | `SUM(CASE WHEN x THEN 1 ELSE 0 END)` | ☐ |
| W4.7 | `GROUP BY` + `ORDER BY` aggregate | `ORDER BY COUNT(*) DESC` | ☐ |

**Bài tập W4:**
- [ ] 20 bài LeetCode Easy/Medium (tích lũy: 35)
- [ ] 10 query trên Chinook → `sql/w4-aggregate.sql`

**10 query:**
1. Số khách hàng theo quốc gia, giảm dần
2. Tổng doanh thu theo năm
3. Doanh thu trung bình mỗi hóa đơn theo quốc gia
4. Quốc gia có trên 5 khách hàng (dùng HAVING)
5. Số track theo genre
6. Genre có đơn giá trung bình cao nhất
7. Tháng nào trong năm doanh thu cao nhất (gộp tất cả các năm)
8. Số hóa đơn và tổng tiền theo từng khách hàng, chỉ lấy khách chi trên 40
9. Tỷ lệ % track có composer NULL trên tổng số track
10. Đếm số hóa đơn theo quốc gia, tách cột "trên 10$" và "dưới 10$" bằng CASE WHEN

**Câu hỏi phỏng vấn phải trả lời được:** "Khi nào dùng WHERE, khi nào dùng HAVING?" → WHERE lọc từng dòng trước khi gom nhóm, HAVING lọc kết quả sau khi đã gom nhóm. Không thể dùng WHERE trên kết quả aggregate.

---

# TUẦN 5 — JOIN

| ID | Chủ đề | Điểm cần nắm | Xong |
|---|---|---|---|
| W5.1 | `INNER JOIN` | Chỉ giữ dòng khớp cả hai bên | ☐ |
| W5.2 | `LEFT JOIN` | Giữ toàn bộ bảng trái, bên phải thiếu → NULL | ☐ |
| W5.3 | `RIGHT JOIN` / `FULL OUTER JOIN` | Hiếm dùng nhưng phải hiểu | ☐ |
| W5.4 | `CROSS JOIN` | Tích Descartes — dùng tạo bảng lịch đầy đủ | ☐ |
| W5.5 | `SELF JOIN` | Bảng employee tự join để tìm manager | ☐ |
| W5.6 | JOIN nhiều bảng (3–5 bảng) | Chuỗi artist → album → track → invoice_line → invoice | ☐ |
| W5.7 | JOIN nhiều điều kiện | `ON a.id = b.id AND a.date = b.date` | ☐ |
| W5.8 | **Fan-out** | JOIN 1-nhiều làm nhân đôi số liệu bên "1" | ☐ |
| W5.9 | Anti-join | `LEFT JOIN ... WHERE b.id IS NULL` = tìm cái không có | ☐ |

**Drill bắt buộc (làm 5 lần trong tuần):** trước khi chạy query có LEFT JOIN, **vẽ tay ra giấy** kết quả mong đợi (bao nhiêu dòng, cột nào NULL). Chạy rồi so. Sai ở đâu, giải thích tại sao. Đây là cách nhanh nhất để JOIN trở thành phản xạ.

**Bài tập W5:**
- [ ] 20 bài (tích lũy: 55)
- [ ] 12 query trên Chinook → `sql/w5-joins.sql`

**12 query:**
1. Tên khách hàng + tổng tiền từng hóa đơn (2 bảng)
2. Tên track + tên album + tên nghệ sĩ (3 bảng)
3. Doanh thu theo nghệ sĩ (5 bảng, cẩn thận fan-out)
4. Khách hàng **chưa từng** mua hàng (anti-join)
5. Track chưa từng nằm trong hóa đơn nào
6. Nhân viên + tên người quản lý trực tiếp (self join)
7. Doanh thu theo genre và theo năm
8. Playlist và số track trong đó, kể cả playlist rỗng (LEFT JOIN)
9. Top 5 khách hàng theo tổng chi, kèm quốc gia
10. Mỗi nhân viên hỗ trợ bao nhiêu khách, tổng doanh thu bao nhiêu
11. So sánh: cùng câu hỏi làm bằng INNER JOIN và LEFT JOIN, giải thích chênh lệch số dòng
12. Tạo bảng đủ 12 tháng bằng CROSS JOIN, LEFT JOIN doanh thu vào (tháng không có đơn phải hiện 0)

> **Bẫy "LEFT JOIN hóa INNER JOIN":** `LEFT JOIN b ON ... WHERE b.status = 'active'` — điều kiện trên bảng phải nằm ở WHERE sẽ loại hết dòng NULL, biến LEFT JOIN thành INNER JOIN. Muốn giữ, đưa điều kiện vào `ON`: `LEFT JOIN b ON a.id = b.id AND b.status = 'active'`. **Đây là câu phỏng vấn kinh điển.**

> **Bẫy fan-out:** join `orders` (1 dòng/đơn) với `order_items` (nhiều dòng/đơn) rồi `SUM(orders.shipping_fee)` → phí ship bị cộng nhiều lần. Cách xử lý: gộp bảng nhiều trước rồi mới join, hoặc dùng `SUM(DISTINCT ...)` cẩn thận. **Đây là lỗi làm sai báo cáo doanh thu ngoài đời thật.**

---

# TUẦN 6 — Subquery & CTE

| ID | Chủ đề | Điểm cần nắm | Xong |
|---|---|---|---|
| W6.1 | Subquery trong `WHERE` | `WHERE id IN (SELECT ...)` | ☐ |
| W6.2 | Subquery trong `FROM` (derived table) | Phải đặt alias | ☐ |
| W6.3 | Scalar subquery trong `SELECT` | Trả về đúng 1 giá trị | ☐ |
| W6.4 | Correlated subquery | Tham chiếu bảng ngoài, chạy từng dòng → chậm | ☐ |
| W6.5 | `EXISTS` vs `IN` | `IN` với NULL cho kết quả bất ngờ; `EXISTS` an toàn hơn | ☐ |
| W6.6 | `NOT EXISTS` vs `NOT IN` | `NOT IN` + NULL → **luôn trả về rỗng** | ☐ |
| W6.7 | CTE `WITH ... AS ()` | Đặt tên cho bước trung gian, dễ đọc hơn subquery lồng | ☐ |
| W6.8 | Nhiều CTE nối tiếp | `WITH a AS (...), b AS (SELECT ... FROM a)` | ☐ |
| W6.9 | Khi nào chọn CTE, khi nào chọn subquery | Query trên 2 tầng lồng nhau → chuyển sang CTE | ☐ |

**Bài tập W6:**
- [ ] 20 bài StrataScratch Medium (tích lũy: 75)
- [ ] Viết lại 5 query của W5 dưới dạng CTE → `sql/w6-cte.sql`
- [ ] 8 query mới dùng subquery/CTE

**8 query:**
1. Khách hàng chi tiêu cao hơn mức trung bình toàn bộ
2. Track có đơn giá cao hơn trung bình genre của chính nó (correlated)
3. Top 3 genre theo doanh thu, sau đó lấy chi tiết track trong 3 genre đó (CTE nhiều tầng)
4. Khách hàng có mua thể loại Rock (dùng EXISTS)
5. Khách hàng **chưa từng** mua Rock (dùng NOT EXISTS) — thử cả NOT IN, so kết quả
6. Mỗi quốc gia: doanh thu, doanh thu trung bình toàn cầu, chênh lệch giữa hai số
7. Chuỗi CTE 3 bước: lọc → tổng hợp → xếp hạng
8. Tính tỷ trọng % của mỗi genre trên tổng doanh thu (subquery trong SELECT)

**Metric drill W6:** viết định nghĩa **Conversion rate** theo 5 trường: tên · công thức · bảng/cột nguồn · grain · owner. Lưu vào `notes/metrics.md`.

---

# TUẦN 7 — Window functions

Đây là kỹ năng phân biệt Fresher và Junior. Học kỹ.

| ID | Hàm | Dùng để | Xong |
|---|---|---|---|
| W7.1 | Cú pháp `OVER (PARTITION BY ... ORDER BY ...)` | Nền tảng chung | ☐ |
| W7.2 | `ROW_NUMBER()` | Đánh số thứ tự, khử trùng lặp | ☐ |
| W7.3 | `RANK()` vs `DENSE_RANK()` | Xếp hạng có/không nhảy số khi hòa | ☐ |
| W7.4 | `LAG()` / `LEAD()` | So sánh với dòng trước/sau → tính MoM growth | ☐ |
| W7.5 | `SUM() OVER (ORDER BY ...)` | Running total (lũy kế) | ☐ |
| W7.6 | `AVG() OVER (...)` | Moving average — làm mượt dữ liệu nhiễu | ☐ |
| W7.7 | Aggregate không `ORDER BY` | `SUM(x) OVER (PARTITION BY g)` = tổng nhóm gắn vào từng dòng → tính % tỷ trọng | ☐ |
| W7.8 | Frame clause | `ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` (7 ngày gần nhất) | ☐ |
| W7.9 | `NTILE(n)` | Chia nhóm phần tư/phần mười — dùng cho RFM | ☐ |
| W7.10 | `FIRST_VALUE` / `LAST_VALUE` | Giá trị đầu/cuối trong nhóm | ☐ |
| W7.11 | Window vs GROUP BY | Window **giữ nguyên số dòng**, GROUP BY gộp dòng | ☐ |

**Bài tập W7:**
- [ ] 20 bài window function (tích lũy: 95)
- [ ] 10 query → `sql/w7-window.sql`

**10 query (đây là 10 dạng hay hỏi nhất khi phỏng vấn):**
1. Doanh thu lũy kế theo tháng (running total)
2. Tăng trưởng doanh thu MoM tính bằng LAG
3. Top 3 track bán chạy nhất **trong mỗi genre**
4. Xếp hạng khách hàng theo chi tiêu trong từng quốc gia
5. Moving average 3 tháng của doanh thu
6. Tỷ trọng % doanh thu mỗi genre trên tổng (dùng SUM OVER)
7. Khử trùng lặp: giữ dòng mới nhất mỗi khách (ROW_NUMBER + filter = 1)
8. Khoảng cách ngày giữa 2 lần mua liên tiếp của cùng khách (LAG trên ngày)
9. Chia khách hàng thành 4 nhóm chi tiêu bằng NTILE(4)
10. Hóa đơn đầu tiên và gần nhất của mỗi khách trên cùng 1 dòng

> **Không lọc được window function trong WHERE.** `WHERE ROW_NUMBER() OVER (...) = 1` sẽ lỗi, vì window được tính sau WHERE. Phải bọc vào CTE/subquery rồi lọc ở tầng ngoài:
> ```sql
> WITH ranked AS (
>   SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
>   FROM orders
> )
> SELECT * FROM ranked WHERE rn = 1;
> ```

**Metric drill W7:** định nghĩa **AOV (Average Order Value)**. Chú ý grain: mẫu số là số đơn hàng duy nhất, không phải số dòng.

---

# TUẦN 8 — Ngày tháng, CASE WHEN, NULL

| ID | Chủ đề | Xong |
|---|---|---|
| W8.1 | Truncate ngày: `DATE_TRUNC('month', d)` — gom về đầu tháng/tuần/quý | ☐ |
| W8.2 | Trích phần: `EXTRACT(YEAR FROM d)`, `EXTRACT(DOW FROM d)` | ☐ |
| W8.3 | Cộng trừ ngày: `d + INTERVAL '7 days'`, `DATE_DIFF` | ☐ |
| W8.4 | Định dạng: `STRFTIME` / `FORMAT_DATE` | ☐ |
| W8.5 | Tạo bảng lịch đầy đủ: `generate_series` | ☐ |
| W8.6 | So sánh cùng kỳ năm trước (YoY) | ☐ |
| W8.7 | `CASE WHEN` phân nhóm (binning) | ☐ |
| W8.8 | Pivot bằng `SUM(CASE WHEN ... THEN ... END)` | ☐ |
| W8.9 | `COALESCE` (giá trị đầu tiên không NULL) | ☐ |
| W8.10 | `NULLIF` (tránh chia cho 0) | ☐ |
| W8.11 | Ép kiểu khi chia số nguyên: `x * 1.0 / y` | ☐ |

**Bẫy chia số nguyên:** `SELECT 3/4` ở một số DB trả về `0` chứ không phải `0.75`. Tính conversion rate mà quên ép kiểu → ra 0 hết. Luôn viết `COUNT(a) * 1.0 / NULLIF(COUNT(b), 0)`.

**Deliverable W8 — Bộ 12 query báo cáo tháng** → `sql/w8-monthly-report.sql`

| # | Query | Yêu cầu |
|---|---|---|
| 1 | Doanh thu theo tháng, đủ 12 tháng kể cả tháng 0 đơn | Dùng calendar table |
| 2 | Số đơn, số khách, AOV theo tháng | Grain đúng |
| 3 | Tăng trưởng MoM và YoY | LAG |
| 4 | Doanh thu lũy kế trong năm (YTD) | Running total |
| 5 | Top 10 sản phẩm theo doanh thu tháng gần nhất | |
| 6 | Doanh thu theo region × tháng (pivot ngang) | CASE WHEN |
| 7 | Phân nhóm khách theo mức chi (Cao/TB/Thấp) | CASE WHEN binning |
| 8 | Tỷ lệ % đơn có giảm giá | Ép kiểu + NULLIF |
| 9 | Số khách mới vs khách quay lại theo tháng | First order date |
| 10 | Khoảng cách trung bình giữa 2 lần mua | LAG |
| 11 | Doanh thu theo thứ trong tuần | EXTRACT DOW |
| 12 | Top 5 khách đóng góp bao nhiêu % tổng doanh thu | Window + tỷ trọng |

**Metric drill W8:** định nghĩa **Retention D7**.

---

# TUẦN 9 — Phân tích thực chiến + BigQuery

| ID | Chủ đề | Xong |
|---|---|---|
| W9.1 | Chuyển sang BigQuery Sandbox, đọc `techstack/storage/BIGQUERY.md` Level 1 | ☐ |
| W9.2 | Dataset: `bigquery-public-data.thelook_ecommerce` — khám phá schema, xác định grain từng bảng | ☐ |
| W9.3 | Funnel analysis: đếm user theo từng bước, tính tỷ lệ chuyển đổi từng bước | ☐ |
| W9.4 | Cohort retention: nhóm theo tháng đăng ký, đo % quay lại tháng 1/2/3 | ☐ |
| W9.5 | RFM: Recency, Frequency, Monetary + phân nhóm bằng NTILE | ☐ |
| W9.6 | Khử trùng lặp bằng `QUALIFY` (cú pháp riêng của BigQuery/DuckDB) | ☐ |
| W9.7 | Đọc query plan, hiểu chi phí quét dữ liệu (bytes scanned) | ☐ |
| W9.8 | Tối ưu: chọn cột thay vì `SELECT *`, lọc theo partition date | ☐ |

**Bài tập W9:**
- [ ] 15 bài (tích lũy: 125+)
- [ ] Chuyển 5 query của W8 sang chạy trên BigQuery
- [ ] 3 query phân tích lớn → `sql/w9-analytics.sql`

**3 query lớn:**

**1. Funnel** — từ bảng `events`, đếm số user duy nhất qua các bước, tính conversion từng bước và conversion tổng:
```sql
WITH step_users AS (
  SELECT event_type, COUNT(DISTINCT user_id) AS users
  FROM `bigquery-public-data.thelook_ecommerce.events`
  WHERE created_at >= '2023-01-01'
  GROUP BY event_type
)
-- tiếp tục: tính tỷ lệ giữa các bước bằng LAG hoặc cross join với bước đầu
```

**2. Cohort retention** — bảng ma trận cohort_month × month_number, giá trị là % user quay lại.

**3. RFM** — mỗi khách 1 dòng: recency (ngày kể từ lần mua cuối), frequency (số đơn), monetary (tổng chi), điểm NTILE(5) từng chiều, và nhãn phân khúc.

**Metric drill W9:** định nghĩa **Churn rate**. Chú ý: churn cần định nghĩa "bao lâu không mua thì coi là mất" — con số này phải thống nhất với business, không tự quyết.

---

## ✅ CHECKPOINT 2 (cuối W9)

Pass khi **cả 6** điều đúng:

- [ ] Đã giải ≥ 125 bài SQL, có link profile LeetCode/StrataScratch
- [ ] Giải 1 bài Medium window function trong ≤ 15 phút, không tra cứu
- [ ] Viết được "top 3 sản phẩm doanh thu cao nhất mỗi tháng" từ đầu, không xem lại
- [ ] Giải thích được vì sao `LEFT JOIN` + điều kiện ở `WHERE` biến thành `INNER JOIN`
- [ ] Giải thích được fan-out và cách xử lý
- [ ] Có 6 metric definition đầy đủ 5 trường trong `notes/metrics.md`

Commit toàn bộ thư mục `sql/` lên GitHub:
```bash
git add sql/ notes/
git commit -m "feat: hoan thanh bo query stage 2 (SQL)"
git push
```

---

## Bẫy tổng hợp Stage 2

| Bẫy | Dấu hiệu | Cách tránh |
|---|---|---|
| `NOT IN` với subquery có NULL | Kết quả rỗng bất thường | Dùng `NOT EXISTS` |
| Fan-out khi JOIN 1-nhiều | Doanh thu cao bất thường | Gộp trước, join sau |
| Chia số nguyên | Conversion rate = 0 | `* 1.0` hoặc `CAST` |
| Chia cho 0 | Lỗi hoặc NULL | `NULLIF(mau_so, 0)` |
| `COUNT(*)` khi cần user duy nhất | Số user bị thổi phồng | `COUNT(DISTINCT user_id)` |
| Lọc window function ở WHERE | Lỗi cú pháp | Bọc CTE rồi lọc ngoài |
| `SELECT *` trên BigQuery | Tốn quota, hết 1TB free nhanh | Chọn đúng cột, lọc partition |
| Học thuộc cú pháp không hiểu logic | Gặp đề lạ là bí | Luôn tự hỏi "query này chạy theo thứ tự nào" |

**Tiếp theo:** [Stage 3 →](./stage-3-bi-dashboard)
