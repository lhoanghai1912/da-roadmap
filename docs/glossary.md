---
id: glossary
title: "Từ điển thuật ngữ DA"
sidebar_label: "Từ điển thuật ngữ"
sidebar_position: 3
slug: /glossary
description: "~110 thuat ngu Data Analyst: du lieu, thong ke, SQL, BI, Python, A/B test, metric business. Dinh nghia tu 0 kem vi du that."
format: md
---

# GLOSSARY — Từ điển thuật ngữ DA (dành cho người bắt đầu từ 0)

Quy tắc đọc: mỗi mục = **Thuật ngữ** → định nghĩa bằng lời thường → *Ví dụ cụ thể* (dùng dữ liệu thật của repo này).
Dữ liệu tham chiếu: `da-portfolio/data/superstore.csv` (9.994 dòng, 5.009 đơn, 793 khách, 2014-01-03 → 2017-12-30) và Chinook (11 bảng, 412 hóa đơn, 59 khách).

Mục lục: [A. Dữ liệu & bảng](#a-dữ-liệu--bảng) · [B. Thống kê mô tả](#b-thống-kê-mô-tả) · [C. SQL](#c-sql) · [D. BI & Dashboard](#d-bi--dashboard) · [E. Python & Pandas](#e-python--pandas) · [F. Thống kê suy diễn & A/B](#f-thống-kê-suy-diễn--ab-test) · [G. Metric business](#g-metric-business)

---

## A. Dữ liệu & bảng

**Dataset (bộ dữ liệu)** — tập hợp dữ liệu đã gom lại để phân tích, thường là 1 hoặc nhiều bảng. *Ví dụ: Superstore = 1 bảng 9.994 dòng; Chinook = 11 bảng liên kết nhau.*

**Table (bảng)** — dữ liệu xếp thành hàng và cột, giống một sheet Excel nhưng có kiểu dữ liệu chặt chẽ. *Ví dụ: bảng `Invoice` trong Chinook có 412 dòng.*

**Row / Record (dòng, bản ghi)** — một quan sát. *Ví dụ: 1 dòng Superstore = 1 sản phẩm trong 1 đơn hàng.*

**Column / Field (cột, trường)** — một thuộc tính đo được. *Ví dụ: cột `Sales` = số tiền của dòng đó.*

**Grain (độ mịn)** — câu trả lời cho "1 dòng đại diện cho cái gì". Đây là khái niệm quan trọng nhất trong toàn bộ nghề DA. *Ví dụ: grain Superstore = "1 dòng = 1 sản phẩm trong 1 đơn hàng" → 9.994 dòng nhưng chỉ 5.009 đơn. Đếm số dòng để báo "số đơn hàng" là sai gấp đôi.*

**Data type (kiểu dữ liệu)** — loại giá trị cột được phép chứa: số nguyên (`INTEGER`), số thực (`DOUBLE`), chuỗi (`VARCHAR`), ngày (`DATE`), thời điểm (`TIMESTAMP`), đúng/sai (`BOOLEAN`). *Ví dụ: `Postal Code` nên là VARCHAR chứ không phải số — mã 02134 lưu kiểu số sẽ mất số 0 đầu.*

**NULL** — ô không có giá trị. Khác `0`, khác chuỗi rỗng `''`. NULL nghĩa là "không biết". *Ví dụ: 977/3.503 track trong Chinook có `Composer` NULL — không phải "không có nhạc sĩ", mà là "dữ liệu không ghi".*

**Primary key (khóa chính, PK)** — cột (hoặc bộ cột) xác định duy nhất một dòng, không trùng, không NULL. *Ví dụ: `Invoice.InvoiceId`. Chú ý `Order ID` của Superstore KHÔNG phải PK vì 1 đơn có nhiều dòng sản phẩm.*

**Foreign key (khóa ngoại, FK)** — cột trỏ sang khóa chính của bảng khác, tạo quan hệ. *Ví dụ: `Invoice.CustomerId` → `Customer.CustomerId`.*

**Cardinality (quan hệ 1-1 / 1-nhiều / nhiều-nhiều)** — một dòng bên này ứng với bao nhiêu dòng bên kia. *Ví dụ: 1 `Invoice` có nhiều `InvoiceLine` → quan hệ 1-nhiều. Đây là nguồn gốc của bẫy fan-out.*

**ERD (Entity Relationship Diagram)** — sơ đồ vẽ các bảng và đường nối khóa. Trong DBeaver: chuột phải database → View Diagram. *Xem ERD trước khi viết JOIN, đừng đoán.*

**Fact table (bảng sự kiện)** — bảng ghi việc đã xảy ra, có cột số để cộng, thường rất nhiều dòng. *Ví dụ: `InvoiceLine` (mỗi lần bán 1 track).*

**Dimension table (bảng chiều)** — bảng mô tả, dùng để cắt lát và lọc, ít dòng. *Ví dụ: `Customer`, `Genre`, `Track`.*

**Star schema (lược đồ sao)** — 1 bảng fact ở giữa nối ra nhiều bảng dimension xung quanh, nhìn như ngôi sao. Đây là cách sắp xếp dữ liệu chuẩn cho BI. *Ví dụ: fact `sales` + dim `date`, `product`, `customer`, `region`.*

**Wide vs long format (bảng ngang / bảng dọc)** — wide: mỗi tháng 1 cột; long: 1 cột `month`, 1 cột `value`. Công cụ BI và Python đều thích long. *Ví dụ wide: `product | jan | feb | mar`. Long: `product | month | sales`.*

**Denormalize (làm phẳng)** — gộp nhiều bảng thành 1 bảng rộng để đọc nhanh, chấp nhận lặp dữ liệu. *Ngược với chuẩn hóa (normalize) vốn để tránh lặp khi ghi.*

**Data dictionary (từ điển dữ liệu)** — bảng liệt kê từng cột: tên, kiểu, ý nghĩa, giá trị hợp lệ, ai sở hữu. Việc đầu tiên khi nhận dataset lạ là tự viết cái này.

**Source of truth (nguồn chuẩn)** — hệ thống được công nhận là đúng khi số liệu mâu thuẫn. *Ví dụ: doanh thu lấy theo hệ thống kế toán, không lấy theo dashboard marketing.*

**ETL / ELT** — quy trình đưa dữ liệu từ nguồn về kho: Extract (lấy) → Transform (biến đổi) → Load (nạp). ELT đảo thứ tự 2 bước cuối, phổ biến hơn với kho hiện đại.

**Data warehouse (kho dữ liệu)** — database tối ưu cho phân tích, không phải cho ứng dụng. *Ví dụ: BigQuery, Snowflake, Redshift; bản mini chạy local: DuckDB.*

**OLTP vs OLAP** — OLTP = hệ thống vận hành (ghi từng giao dịch, đọc ít dòng); OLAP = hệ thống phân tích (quét hàng triệu dòng để tổng hợp). DA làm việc trên OLAP.

**Idempotent (chạy lại vẫn ra một kết quả)** — tiêu chuẩn cho notebook/query: chạy 2 lần phải cho kết quả giống nhau, không nhân đôi dữ liệu.

---

## B. Thống kê mô tả

**Mean (trung bình cộng)** — tổng chia số lượng. Bị kéo lệch bởi giá trị lớn. *Ví dụ: mean `Sales` Superstore = **229,86**.*

**Median (trung vị)** — giá trị đứng giữa khi sắp xếp. Không bị outlier kéo. *Ví dụ: median `Sales` = **54,49** — chỉ bằng 24% mean → phân phối lệch phải rất mạnh. Báo cáo "đơn hàng trung bình 230$" là sai lệch: nửa số dòng dưới 55$.*

**Mode (yếu vị)** — giá trị xuất hiện nhiều nhất. Hữu ích cho dữ liệu phân loại. *Ví dụ: mode của `Discount` = 0.*

**Range (khoảng biến thiên)** — max − min. *Ví dụ: `Sales` từ 0,44 đến 22.638,48.*

**Percentile (phân vị)** — P90 = giá trị mà 90% dữ liệu nằm dưới. *Ví dụ: dùng P95 thời gian tải trang thay vì mean để đo trải nghiệm nhóm chậm nhất.*

**Quartile (tứ phân vị)** — Q1 = P25, Q2 = median, Q3 = P75. *Ví dụ Superstore: Q1 = 17,28 · Q3 = 209,94.*

**IQR (khoảng tứ phân vị)** — Q3 − Q1, đo độ phân tán của phần giữa dữ liệu. *Ví dụ: IQR = 209,94 − 17,28 = **192,66**.*

**Outlier (giá trị ngoại lai)** — điểm nằm xa phần còn lại. Quy tắc IQR: ngoài khoảng [Q1 − 1,5×IQR ; Q3 + 1,5×IQR]. *Ví dụ: ngưỡng trên = 209,94 + 1,5×192,66 = **498,93** → **1.167 dòng (11,7%)** vượt ngưỡng. Con số lớn như vậy nói rằng đây là phân phối lệch tự nhiên, không phải lỗi nhập liệu → giữ lại, chỉ đổi cách báo cáo (dùng median).*

**Standard deviation (độ lệch chuẩn, SD)** — trung bình mức lệch khỏi mean. *Ví dụ: SD `Sales` = 623,25, lớn gấp 2,7 lần mean → dữ liệu cực kỳ phân tán.*

**Variance (phương sai)** — SD bình phương. Dùng trong công thức, ít dùng khi báo cáo vì sai đơn vị.

**Coefficient of variation (hệ số biến thiên, CV)** — SD / mean. So sánh độ biến động giữa các nhóm khác đơn vị. *Ví dụ: CV `Sales` = 623,25/229,86 = 2,71.*

**Skewness (độ lệch)** — phân phối nghiêng về bên nào. Lệch phải = đuôi dài bên phải, mean > median. *Ví dụ: doanh thu, thu nhập, thời gian chờ gần như luôn lệch phải.*

**Distribution (phân phối)** — hình dạng dữ liệu trải ra thế nào. Nhìn bằng histogram trước khi tính bất kỳ con số nào.

**Histogram** — biểu đồ cột thể hiện phân phối 1 biến số, trục X chia thành các "bin" (khoảng). Khác bar chart: bar so sánh hạng mục, histogram xem phân phối.

**Box plot (biểu đồ hộp)** — vẽ Q1, median, Q3 và râu; chấm ngoài râu là outlier. Dùng so sánh phân phối giữa nhiều nhóm.

**Correlation (tương quan, r)** — mức độ 2 biến số đi cùng nhau, giá trị từ −1 đến +1. *Ví dụ: corr(`Discount`, `Profit`) = **−0,219** — quan hệ âm nhưng yếu.*

**Correlation ≠ causation (tương quan không phải nhân quả)** — hai thứ đi cùng nhau không có nghĩa cái này gây ra cái kia. *Ví dụ Superstore: r = −0,219 nhìn có vẻ yếu, nhưng chia theo mức chiết khấu thì rõ: discount 0% → lợi nhuận TB +66,9$; 20% → +24,7$; 30% → **−45,7$**; 40% → **−111,9$**. Vẫn chưa được kết luận "chiết khấu gây lỗ" vì có biến ẩn: mặt hàng ế (bàn ghế) mới bị chiết khấu sâu, mà nhóm đó vốn dĩ biên lợi nhuận thấp.*

**Confounder (biến gây nhiễu)** — biến thứ ba tác động lên cả hai biến đang xét, tạo ra tương quan giả. *Ví dụ trên: "loại mặt hàng" là confounder.*

---

## C. SQL

**SQL (Structured Query Language)** — ngôn ngữ hỏi dữ liệu từ database. Không phải ngôn ngữ lập trình đầy đủ; nó mô tả "muốn gì" chứ không phải "làm thế nào".

**Query (truy vấn)** — một câu lệnh SQL lấy dữ liệu. *Ví dụ: `SELECT * FROM Invoice LIMIT 10;`*

**SELECT** — chọn cột cần lấy. `SELECT *` = lấy tất cả cột (tiện khi khám phá, tránh khi chạy thật vì tốn tài nguyên).

**Alias (bí danh)** — đổi tên cột/bảng trong kết quả bằng `AS`. *Ví dụ: `SELECT SUM(Total) AS doanh_thu FROM Invoice;`*

**FROM** — chỉ bảng nguồn.

**WHERE** — lọc **dòng** trước khi gom nhóm. *Ví dụ: `WHERE BillingCountry = 'Brazil'`.*

**Toán tử so sánh** — `=`, `!=` (hoặc `<>`), `>`, `<`, `>=`, `<=`.

**BETWEEN / IN / LIKE** — `BETWEEN 1 AND 10` (bao gồm 2 đầu) · `IN ('a','b')` (thuộc danh sách) · `LIKE '%love%'` (`%` = nhiều ký tự bất kỳ, `_` = đúng 1 ký tự).

**IS NULL** — cách duy nhất đúng để kiểm tra NULL. `= NULL` luôn sai. *Bẫy: `WHERE Composer != 'X'` sẽ loại luôn 977 dòng NULL của Chinook mà không báo lỗi.*

**ORDER BY / LIMIT / OFFSET** — sắp xếp · giới hạn số dòng · bỏ qua N dòng đầu. *Ví dụ: lấy dòng 11–20: `ORDER BY InvoiceDate LIMIT 10 OFFSET 10`.*

**DISTINCT** — loại dòng trùng trong kết quả. *Ví dụ: `COUNT(DISTINCT "Order ID")` cho 5.009 đơn thay vì 9.994 dòng.*

**CAST / ép kiểu** — đổi kiểu dữ liệu: `CAST(x AS INTEGER)`, `x::DATE`. *Bẫy chia số nguyên: ở một số DB `3/4 = 0`; viết `3 * 1.0 / 4` hoặc `CAST(3 AS DOUBLE)/4`.*

**Aggregate function (hàm tổng hợp)** — gộp nhiều dòng thành 1 số: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`. Tất cả (trừ `COUNT(*)`) **bỏ qua NULL**.

**COUNT(\*) vs COUNT(col) vs COUNT(DISTINCT col)** — đếm mọi dòng · đếm dòng có giá trị khác NULL ở cột đó · đếm số giá trị khác nhau. *Ví dụ Chinook Track: `COUNT(*)` = 3.503, `COUNT(Composer)` = 2.526.*

**GROUP BY** — gom dòng theo giá trị cột rồi tính aggregate cho từng nhóm. Mọi cột trong SELECT mà không nằm trong hàm aggregate đều phải có mặt ở GROUP BY.

**HAVING** — lọc **sau** khi gom nhóm, dùng được với aggregate. *Ví dụ: `GROUP BY Country HAVING COUNT(*) > 5`. So sánh: `WHERE` lọc dòng thô, `HAVING` lọc nhóm.*

**Thứ tự thực thi logic** — `FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT`. Nhớ thứ tự này giải thích được 80% lỗi "column not found" và lỗi window function.

**JOIN** — ghép dòng của 2 bảng theo điều kiện khớp khóa.

**INNER JOIN** — chỉ giữ dòng khớp ở cả hai bảng.

**LEFT JOIN** — giữ toàn bộ bảng bên trái; bên phải không khớp thì điền NULL. *Ví dụ Chinook: `Customer LEFT JOIN Invoice` → 412 dòng.*

**Bẫy "LEFT JOIN hóa INNER JOIN"** — đặt điều kiện của bảng phải vào `WHERE` sẽ loại hết dòng NULL. *Ví dụ thật đã chạy: điều kiện ở `WHERE i.BillingCountry='Brazil'` → **35 dòng**; cùng điều kiện đặt trong `ON` → **89 dòng** (35 dòng Brazil + 54 khách không có hóa đơn Brazil vẫn được giữ, cột bên phải NULL). Đây là câu phỏng vấn kinh điển.*

**RIGHT / FULL OUTER JOIN** — giữ bảng phải / giữ cả hai. Ít dùng, nhưng phải hiểu.

**CROSS JOIN** — ghép mọi tổ hợp (tích Descartes). Dùng hợp lệ khi tạo bảng lịch đủ tháng × đủ region.

**SELF JOIN** — join bảng với chính nó. *Ví dụ: `Employee e JOIN Employee m ON e.ReportsTo = m.EmployeeId` để lấy tên quản lý.*

**Anti-join** — tìm cái KHÔNG có: `LEFT JOIN b ON ... WHERE b.id IS NULL`. *Ví dụ: khách chưa từng mua hàng.*

**Fan-out (nhân bản dòng)** — join 1-nhiều làm số liệu bên "1" bị cộng lặp. *Ví dụ thật đã chạy trên Chinook: `SUM(Total)` từ bảng `Invoice` = **2.328,60**; sau khi `JOIN InvoiceLine` thì `SUM(i.Total)` = **20.848,62** — phồng gấp 9 lần. Cách xử lý: tổng hợp bảng "nhiều" trước rồi mới join, hoặc đếm/cộng ở đúng grain.*

**Subquery (truy vấn con)** — query lồng trong query. Ở `WHERE` (lọc theo tập), ở `FROM` (bảng dẫn xuất, bắt buộc đặt alias), ở `SELECT` (scalar, phải trả đúng 1 giá trị).

**Correlated subquery (truy vấn con tương quan)** — subquery tham chiếu bảng ngoài, chạy lại cho từng dòng → chậm. *Ví dụ: track có giá cao hơn giá trung bình của chính genre nó.*

**EXISTS vs IN** — `EXISTS` kiểm tra "có tồn tại dòng nào không", an toàn với NULL. *Bẫy: `NOT IN (danh sách có NULL)` luôn trả về rỗng. Dùng `NOT EXISTS`.*

**CTE (Common Table Expression, `WITH ... AS (...)`)** — đặt tên cho một bước trung gian để query đọc như các bước suy nghĩ. *Ví dụ: `WITH doanh_thu_thang AS (...), xep_hang AS (SELECT ... FROM doanh_thu_thang) SELECT ...`. Quy tắc: lồng quá 2 tầng subquery thì chuyển sang CTE.*

**Window function (hàm cửa sổ)** — tính toán trên một "cửa sổ" các dòng liên quan **mà vẫn giữ nguyên số dòng**. Khác GROUP BY (gộp dòng lại). Cú pháp: `HAM() OVER (PARTITION BY nhom ORDER BY thu_tu)`.

**PARTITION BY** — chia dữ liệu thành nhóm để tính riêng, tương đương "GROUP BY nhưng không gộp dòng".

**ROW_NUMBER / RANK / DENSE_RANK** — đánh số 1,2,3 không trùng · xếp hạng, hòa thì nhảy số (1,1,3) · xếp hạng, hòa thì không nhảy (1,1,2).

**LAG / LEAD** — lấy giá trị dòng trước / dòng sau. Đây là cách tính tăng trưởng MoM. *Ví dụ: `(rev - LAG(rev) OVER (ORDER BY thang)) / LAG(rev) OVER (ORDER BY thang)`.*

**Running total (lũy kế)** — `SUM(x) OVER (ORDER BY ngay)` cộng dồn từ đầu đến dòng hiện tại.

**Moving average (trung bình trượt)** — làm mượt dữ liệu nhiễu: `AVG(x) OVER (ORDER BY ngay ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)` = trung bình 7 ngày.

**Frame clause (khung cửa sổ)** — `ROWS BETWEEN ... AND ...` quy định lấy bao nhiêu dòng quanh dòng hiện tại.

**NTILE(n)** — chia dữ liệu thành n nhóm bằng nhau theo thứ hạng. Dùng cho RFM, phân khúc khách.

**QUALIFY** — lọc trực tiếp kết quả window function (chỉ có ở BigQuery, DuckDB, Snowflake). Ở DB khác phải bọc CTE rồi lọc bên ngoài. *Bẫy: `WHERE ROW_NUMBER() OVER (...) = 1` luôn lỗi, vì WHERE chạy trước window.*

**DATE_TRUNC** — cắt ngày về đầu tháng/tuần/quý để gom nhóm theo thời gian. *Ví dụ: `DATE_TRUNC('month', order_date)`.*

**EXTRACT** — lấy một phần của ngày: `EXTRACT(YEAR FROM d)`, `EXTRACT(DOW FROM d)` (thứ trong tuần).

**generate_series** — tạo dãy liên tục (thường là dãy ngày) để bảng báo cáo có đủ kỳ, kể cả kỳ không phát sinh đơn.

**CASE WHEN** — if/else trong SQL. Dùng để phân nhóm (`binning`) và để xoay bảng (`pivot`) bằng `SUM(CASE WHEN region='West' THEN sales END)`.

**COALESCE** — trả về giá trị đầu tiên khác NULL. *Ví dụ: `COALESCE(discount, 0)`.*

**NULLIF** — `NULLIF(x, 0)` biến 0 thành NULL để tránh lỗi chia cho 0. *Mẫu chuẩn tính tỷ lệ: `COUNT(a) * 1.0 / NULLIF(COUNT(b), 0)`.*

**EXPLAIN / query plan** — xem DB dự định chạy query thế nào, tốn bao nhiêu. Trên BigQuery chú ý "bytes scanned" vì đó là thứ bị tính tiền/tính quota.

**Index (chỉ mục)** — cấu trúc giúp tìm dòng nhanh. Ở kho phân tích cột (BigQuery, DuckDB) thay bằng partition và clustering.

**Partition (phân vùng)** — chia bảng lớn theo ngày để query chỉ quét phần cần. *Ví dụ: lọc `WHERE date >= '2023-01-01'` trên bảng partition theo ngày giúp giảm quota quét cực mạnh.*

---

## D. BI & Dashboard

**BI (Business Intelligence)** — công cụ biến dữ liệu thành báo cáo tự phục vụ cho người không biết SQL. *Ví dụ: Looker Studio, Metabase, Power BI, Tableau.*

**Dashboard** — một trang tập hợp biểu đồ trả lời **một** câu hỏi kinh doanh chính. Không phải nơi trút mọi chart có thể vẽ.

**Report vs Dashboard** — report trả lời "chuyện gì đã xảy ra" chi tiết, đọc một lần; dashboard theo dõi định kỳ, cần so sánh với kỳ trước hoặc target.

**Measure (chỉ số đo)** — cột số được tổng hợp. *Ví dụ: doanh thu, số đơn, AOV.*

**Dimension (chiều)** — cột dùng để cắt lát dữ liệu. *Ví dụ: region, category, tháng.*

**Calculated field (trường tính toán)** — cột tạo mới ngay trong BI tool. *Ví dụ: `profit_margin = SUM(Profit)/SUM(Sales)`.*

**Filter context (ngữ cảnh lọc)** — mỗi ô/biểu đồ tính toán trong phạm vi các bộ lọc đang áp. Hiểu sai chỗ này là nguyên nhân "tổng các phần khác tổng chung".

**Blend / Join data (trộn dữ liệu)** — ghép 2 nguồn trong BI tool theo khóa chung.

**Drill-down** — bấm vào một cột để xem chi tiết cấp thấp hơn (năm → quý → tháng).

**Slicer / Control** — bộ lọc người dùng tự chỉnh: khoảng thời gian, region.

**Data model (mô hình dữ liệu)** — cách các bảng nối với nhau trong BI tool. Star schema là mô hình chuẩn.

**Cache / refresh (làm mới)** — BI thường lưu tạm kết quả; phải biết dashboard đang hiển thị dữ liệu lúc nào. Luôn ghi "cập nhật lần cuối" lên dashboard.

**Chart junk** — trang trí thừa (3D, gradient, viền đậm) làm khó đọc số. Bỏ hết.

**Baseline (mốc so sánh)** — con số không có mốc so sánh thì vô nghĩa. Luôn kèm kỳ trước, cùng kỳ năm trước, hoặc target.

---

## E. Python & Pandas

**Python** — ngôn ngữ lập trình dùng cho phân tích khi SQL không đủ (làm sạch phức tạp, thống kê, vẽ chart, lặp lại quy trình).

**Jupyter Notebook** — môi trường chạy code theo từng ô, xen kẽ chữ và biểu đồ. *Bẫy: chạy ô lộn xộn khiến kết quả không tái lập → trước khi nộp luôn Restart & Run All.*

**Library (thư viện)** — bộ code viết sẵn: `pandas` (bảng dữ liệu), `numpy` (số học), `matplotlib`/`seaborn` (vẽ), `scipy.stats` (thống kê).

**DataFrame** — bảng 2 chiều trong pandas, tương đương một bảng SQL. `Series` = 1 cột.

**Index (chỉ mục dòng)** — nhãn của dòng trong DataFrame. Khác với "index" của database.

**loc vs iloc** — `df.loc[dòng, cột]` chọn theo **nhãn**; `df.iloc[0:5]` chọn theo **vị trí số**.

**Boolean mask (lọc điều kiện)** — `df[df["Sales"] > 500]` tương đương `WHERE Sales > 500`.

**groupby().agg()** — tương đương `GROUP BY`. *Ví dụ: `df.groupby("Category")["Sales"].sum()`.*

**merge()** — tương đương `JOIN`; tham số `how=` nhận `inner`/`left`/`right`/`outer`. *Luôn kiểm tra số dòng trước và sau merge để phát hiện fan-out.*

**pivot_table()** — tương đương Pivot Table của Excel, tạo bảng ngang.

**isna / fillna / dropna** — kiểm tra thiếu · điền giá trị · bỏ dòng thiếu. *Nguyên tắc: ghi log đã bỏ bao nhiêu dòng và vì sao, không im lặng xóa.*

**duplicated / drop_duplicates** — tìm và bỏ dòng trùng. Phải xác định "trùng theo cột nào" chứ không mặc định toàn bộ cột.

**dtype** — kiểu dữ liệu của cột pandas: `int64`, `float64`, `object` (thường là chuỗi), `datetime64`, `category`.

**EDA (Exploratory Data Analysis — phân tích khám phá)** — quy trình xem dữ liệu có gì trước khi kết luận: kích thước, kiểu, thiếu, phân phối, quan hệ, bất thường.

**Vectorization (tính theo vector)** — thao tác trên cả cột thay vì lặp từng dòng; nhanh hơn nhiều. *Ví dụ: `df["a"] * 2` thay cho `for` loop.*

---

## F. Thống kê suy diễn & A/B test

**Population (tổng thể)** — toàn bộ đối tượng quan tâm. **Sample (mẫu)** — phần được quan sát. Suy diễn = từ mẫu nói về tổng thể.

**Sampling bias (thiên lệch chọn mẫu)** — mẫu không đại diện. Mẫu lệch thì cỡ mẫu lớn cũng vô dụng, thậm chí nguy hiểm hơn vì tạo cảm giác chắc chắn.

**CLT (Central Limit Theorem — định lý giới hạn trung tâm)** — trung bình của nhiều mẫu sẽ phân phối gần chuẩn dù tổng thể lệch, khi cỡ mẫu đủ lớn. Đây là lý do các kiểm định dựa trên phân phối chuẩn vẫn dùng được cho dữ liệu doanh thu lệch phải.

**Standard error (sai số chuẩn, SE)** — độ dao động của ước lượng: `SD / √n`. Muốn giảm sai số một nửa phải tăng cỡ mẫu gấp 4.

**Confidence interval (khoảng tin cậy, CI)** — khoảng ước lượng kèm mức tin cậy. *Diễn giải đúng: "nếu lặp lại cách lấy mẫu này nhiều lần, khoảng tính theo cách này chứa giá trị thật khoảng 95% số lần". Diễn giải sai (rất phổ biến): "có 95% xác suất giá trị thật nằm trong khoảng này".*

**Margin of error (biên sai số)** — nửa độ rộng của CI.

**Hypothesis (giả thuyết)** — **H0** (giả thuyết không): "không có khác biệt". **H1**: "có khác biệt". Kiểm định luôn xuất phát từ giả định H0 đúng.

**p-value** — xác suất quan sát được kết quả ít nhất cực đoan như dữ liệu hiện có, **nếu H0 đúng**. *Cách nói cho stakeholder: "nếu thật ra hai phiên bản như nhau, khả năng ta nhìn thấy chênh lệch lớn thế này chỉ khoảng 3%. Thấp nên ta nghiêng về kết luận có khác biệt thật." p-value KHÔNG phải xác suất H0 đúng, cũng không phải độ lớn tác động.*

**Alpha (mức ý nghĩa)** — ngưỡng chấp nhận sai lầm loại I, thường 0,05. Phải chốt **trước** khi chạy test.

**Type I error (sai lầm loại I)** — kết luận có khác biệt trong khi thực ra không có (báo động giả).
**Type II error (sai lầm loại II)** — bỏ sót khác biệt thật.

**Power (lực kiểm định)** — xác suất phát hiện được khác biệt thật khi nó tồn tại; chuẩn ngành 80%.

**MDE (Minimum Detectable Effect — mức tác động nhỏ nhất muốn phát hiện)** — quyết định cỡ mẫu. MDE càng nhỏ, mẫu càng lớn. *Đây là quyết định kinh doanh, không phải quyết định kỹ thuật: "tăng 0,5% conversion có đáng để triển khai không?"*

**Sample size (cỡ mẫu)** — tính trước khi chạy test, từ baseline rate, MDE, alpha, power.

**t-test** — so sánh trung bình 2 nhóm (doanh thu/đơn, thời gian). **Chi-square** — so sánh tỷ lệ giữa các nhóm phân loại (mua/không mua). **Mann-Whitney** — bản không giả định phân phối chuẩn, dùng khi dữ liệu rất lệch.

**A/B test** — chia người dùng ngẫu nhiên thành nhóm A (đối chứng) và B (biến thể), chỉ đổi một thứ, so kết quả. Ngẫu nhiên hóa là thứ cho phép nói "nhân quả" thay vì "tương quan".

**Primary metric (metric chính)** — chỉ một, chốt trước khi chạy. **Guardrail metric (metric chặn)** — chỉ số không được xấu đi (tỷ lệ hoàn hàng, tốc độ tải, hủy đăng ký).

**Peeking problem (bệnh nhìn lén)** — kiểm tra kết quả liên tục và dừng ngay khi p < 0,05 làm tỷ lệ báo động giả tăng vọt. Cách tránh: chốt trước ngày dừng, hoặc dùng phương pháp sequential testing.

**Novelty effect (hiệu ứng mới lạ)** — người dùng phản ứng tích cực chỉ vì thấy lạ, hiệu ứng tan sau vài tuần.

**SRM (Sample Ratio Mismatch)** — tỷ lệ chia nhóm lệch khỏi thiết kế (ví dụ 55/45 thay vì 50/50) → hệ thống chia nhóm có lỗi, kết quả không dùng được. Luôn kiểm tra đầu tiên.

**Simpson's paradox (nghịch lý Simpson)** — xu hướng trong từng nhóm con bị đảo ngược khi gộp chung. *Nguyên nhân thường là tỷ trọng nhóm khác nhau. Luôn tách nhóm kiểm tra lại trước khi báo cáo.*

**Practical significance (ý nghĩa thực tiễn)** — khác với ý nghĩa thống kê. Mẫu đủ lớn thì chênh lệch 0,01% cũng "có ý nghĩa thống kê" nhưng không đáng triển khai.

---

## G. Metric business

Mỗi metric phải khai báo đủ **5 trường**: tên · công thức · bảng/cột nguồn · grain · owner.

**DAU / WAU / MAU** — số người dùng hoạt động duy nhất theo ngày/tuần/tháng. *Phải định nghĩa "hoạt động" là gì: mở app? thực hiện hành động? MAU ≠ tổng 30 ngày DAU.*

**Stickiness (độ dính)** — DAU/MAU. 0,2 nghĩa là người dùng trung bình vào 6 ngày/tháng.

**Conversion rate (tỷ lệ chuyển đổi)** — số đạt bước sau / số ở bước trước. *Bẫy: mẫu số phải cùng grain — user hay session? Phải ghi rõ.*

**Funnel (phễu)** — chuỗi bước dẫn tới mục tiêu (xem → thêm giỏ → thanh toán → mua), đo tỷ lệ rơi từng bước.

**AOV (Average Order Value — giá trị đơn trung bình)** — doanh thu / **số đơn duy nhất**. *Bẫy: chia cho số dòng sản phẩm sẽ ra AOV thấp giả. Với Superstore: 2.297.201 / 5.009 = 458,6 chứ không phải chia cho 9.994.*

**ARPU** — doanh thu / số người dùng. Khác AOV ở mẫu số.

**Retention (giữ chân)** — % người dùng quay lại sau N ngày. *Phải nói rõ định nghĩa: D7 là "đúng ngày thứ 7" hay "trong vòng 7 ngày" — hai con số khác nhau rất nhiều.*

**Cohort (nhóm đồng hành)** — nhóm người dùng chia theo thời điểm bắt đầu (tháng đăng ký), theo dõi hành vi theo thời gian để tách ảnh hưởng của "người mới" khỏi "sản phẩm tốt lên".

**Churn rate (tỷ lệ rời bỏ)** — % khách mất đi trong kỳ. *Với sản phẩm không đăng ký định kỳ, phải chốt ngưỡng "bao lâu không mua thì coi là mất" cùng bộ phận kinh doanh — không tự quyết.*

**LTV (Customer Lifetime Value)** — tổng lợi nhuận kỳ vọng từ một khách trong suốt vòng đời.

**CAC (Customer Acquisition Cost)** — chi phí marketing + bán hàng / số khách mới. Tỷ lệ LTV/CAC ≥ 3 thường được coi là lành mạnh.

**GMV vs Revenue vs Net revenue** — tổng giá trị hàng bán · doanh thu ghi nhận · doanh thu sau hoàn/hủy/chiết khấu. Ba con số này khác nhau; nhầm là mất uy tín.

**Gross margin (biên lợi nhuận gộp)** — lợi nhuận / doanh thu. *Ví dụ thật Superstore: Technology 17,4% · Office Supplies 17,0% · Furniture chỉ **2,5%** dù doanh thu 742.000 — đây là phát hiện đáng giá nhất của dataset này.*

**MoM / QoQ / YoY** — so tháng trước / quý trước / cùng kỳ năm trước. *Với dữ liệu có mùa vụ phải dùng YoY, MoM sẽ gây hiểu nhầm.*

**YTD (Year To Date)** — lũy kế từ đầu năm đến hiện tại.

**Target vs Actual vs Forecast** — mục tiêu · thực tế · dự báo. Dashboard thiếu target là dashboard chỉ mô tả, không hỗ trợ quyết định.

**North Star Metric** — chỉ số duy nhất phản ánh giá trị cốt lõi mà sản phẩm mang lại cho người dùng. *Ví dụ: Airbnb — số đêm đã đặt.*

**Vanity metric (chỉ số phù phiếm)** — chỉ số nhìn đẹp nhưng không dẫn tới hành động. *Ví dụ: tổng lượt xem trang, tổng số tài khoản đã đăng ký từ trước tới nay.*
