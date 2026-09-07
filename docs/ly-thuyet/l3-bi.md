---
id: l3-bi
title: "Lý thuyết 3 — BI & Dashboard"
sidebar_label: "L3 — BI"
sidebar_position: 4
description: "Dashboard la gi, measure vs dimension, star schema, filter context, nguyen tac thiet ke, spec Portfolio #1."
format: md
---

# LESSON 3 — BI & Dashboard (W10–W12)

Bổ trợ cho [Stage 3 — BI & Dashboard](../stages/stage-3-bi-dashboard.md). Trọng tâm: hiểu **khái niệm** BI (đúng cho mọi công cụ), không phải học thao tác của một phần mềm.

Số thật dùng làm ví dụ (từ `superstore.csv`, đã chạy kiểm chứng): tổng doanh thu 2.297.201 · 5.009 đơn · AOV 458,6 · biên lợi nhuận Technology 17,4% · Office Supplies 17,0% · **Furniture 2,5%** · sub-category `Tables` doanh thu 206.966 nhưng **lỗ 17.725**.

---

## 3.1 — Dashboard là gì và không phải là gì {#dashboard-la-gi}

**Định nghĩa.** Dashboard = một màn hình trả lời **một** câu hỏi kinh doanh chính, cập nhật định kỳ, giúp người xem quyết định làm gì tiếp theo.

| Là dashboard | Không phải dashboard |
|---|---|
| Trả lời 1 câu hỏi chính | Trưng bày mọi chart vẽ được |
| Mỗi số có mốc so sánh | Số trần trụi không biết tốt hay xấu |
| Người xem biết phải làm gì | Người xem gật gù rồi đóng tab |
| Ghi rõ dữ liệu cập nhật lúc nào | Không ai biết số cũ hay mới |

**Ví dụ so sánh.**
- ❌ Card: "Doanh thu: 2.297.201$"
- ✅ Card: "Doanh thu tháng này 45.2K$ · **−12,3% so tháng trước** · đạt 89% target"

Con số không có mốc so sánh gần như vô dụng. Đây là lỗi số 1 của dashboard người mới.

**Bài tập 3.1.** Với mỗi dashboard sau, viết ra **một** câu hỏi chính mà nó phải trả lời:
a) Dashboard cho Giám đốc bán hàng, xem hàng tuần.
b) Dashboard cho nhân viên vận hành kho, xem hàng ngày.
c) Dashboard cho Giám đốc sản phẩm sau khi ra tính năng mới.

<details>
<summary>Đáp án 3.1</summary>

a) "Tuần này chúng ta có đang đi đúng hướng để đạt target quý không, và vùng/nhóm hàng nào đang kéo lùi?"
b) "Hôm nay đơn nào có nguy cơ trễ hạn giao?"
c) "Tính năng mới có được dùng không, và nó ảnh hưởng thế nào tới chỉ số chính?"

Điểm chung: mỗi câu đều dẫn tới **một hành động cụ thể**. Nếu không nghĩ ra được hành động, dashboard đó không cần tồn tại.

</details>

---

## 3.2 — Measure vs Dimension (khái niệm gốc của mọi công cụ BI) {#measure-dimension}

**Định nghĩa.** **Measure** = cột số được tổng hợp (SUM, AVG…). **Dimension** = cột dùng để cắt lát/nhóm/lọc.

| Superstore | Loại | Vì sao |
|---|---|---|
| `Sales`, `Profit`, `Quantity` | Measure | cộng lại có ý nghĩa |
| `Region`, `Category`, `Segment` | Dimension | dùng để nhóm |
| `Order Date` | Dimension (đặc biệt) | chiều thời gian, có phân cấp năm→quý→tháng→ngày |
| `Discount` | **cả hai** | AVG(Discount) là measure; nhóm theo mức 0%/20%/40% là dimension |
| `Row ID` | không dùng | số nhưng cộng vô nghĩa |

**Bẫy tỷ số.** `profit_margin` **không** phải measure cộng được. Sai: tính margin từng dòng rồi lấy trung bình. Đúng: `SUM(Profit) / SUM(Sales)`. Trong Looker Studio phải tạo calculated field theo dạng tỷ số của hai tổng, không phải tổng của các tỷ số.

**Bài tập 3.2.** Phân loại và nêu công thức đúng: `AOV`, `số khách duy nhất`, `tỷ lệ đơn có giảm giá`, `doanh thu trung bình mỗi khách`.

<details>
<summary>Đáp án 3.2</summary>

- AOV = `SUM(Sales) / COUNT(DISTINCT Order ID)` = 2.297.201/5.009 = **458,6**. Sai lầm hay gặp: `AVG(Sales)` = 229,9 (trung bình mỗi *dòng*).
- Số khách duy nhất = `COUNT(DISTINCT Customer ID)` = 793. Không cộng được giữa các kỳ (khách tháng 1 và tháng 2 trùng nhau) — đây là "non-additive measure", tổng 12 tháng ≠ cả năm.
- Tỷ lệ đơn có giảm giá = `COUNT(DISTINCT Order ID có Discount>0) / COUNT(DISTINCT Order ID)`. Chú ý grain: một đơn có nhiều dòng, chỉ cần 1 dòng giảm giá là đơn đó tính có.
- Doanh thu/khách = `SUM(Sales) / COUNT(DISTINCT Customer ID)` = 2.297.201/793 = 2.897 trong 4 năm.

</details>

---

## 3.3 — Star schema: tại sao dashboard cần mô hình dữ liệu {#star-schema}

**Định nghĩa.** **Fact table** ghi sự kiện đã xảy ra (nhiều dòng, có cột số để cộng). **Dimension table** mô tả (ít dòng, dùng để lọc). Nối fact ở giữa với các dim xung quanh = **star schema**.

Superstore hiện là **một bảng phẳng** — tiện cho người mới nhưng có 3 vấn đề: lặp dữ liệu khách hàng ở 9.994 dòng · sửa tên khách phải sửa nhiều chỗ · không thể trả lời "khách chưa mua gì" vì khách chỉ tồn tại khi có đơn.

Tách thành star schema:
```
                dim_customer (793 dong)
                        |
dim_date (1.457 ngay) -- fact_sales (9.994 dong) -- dim_product (1.862 dong)
                        |
                dim_region
```
`fact_sales` giữ: `order_id, order_date, customer_id, product_id, region_id, sales, quantity, discount, profit`.

Vì sao BI thích cấu trúc này: bộ lọc `Region` chỉ cần quét bảng dim nhỏ, chart tự động gom đúng, và có thể LEFT JOIN từ dim → fact để hiện cả nhóm không phát sinh doanh thu.

**Bài tập 3.3.** Viết SQL tách `superstore` thành `dim_customer`, `dim_product`, `fact_sales`. Kiểm tra: `SUM(sales)` của fact phải bằng đúng 2.297.201.

<details>
<summary>Đáp án 3.3</summary>

```sql
CREATE TABLE dim_customer AS
SELECT DISTINCT "Customer ID" AS customer_id, "Customer Name" AS ten, Segment, Country, City, State, Region
FROM superstore;                                  -- kiem tra: 793 dong? Neu >793 thi co khach doi Segment/City -> phai chon 1 ban ghi

CREATE TABLE dim_product AS
SELECT DISTINCT "Product ID" AS product_id, "Product Name" AS ten, Category, "Sub-Category" AS sub_category
FROM superstore;                                  -- kiem tra so dong so voi COUNT(DISTINCT "Product ID")

CREATE TABLE fact_sales AS
SELECT "Order ID" AS order_id, "Order Date" AS order_date, "Ship Date" AS ship_date,
       "Customer ID" AS customer_id, "Product ID" AS product_id,
       Sales AS sales, Quantity AS quantity, Discount AS discount, Profit AS profit
FROM superstore;

SELECT ROUND(SUM(sales),0) FROM fact_sales;       -- phai ra 2297201
```
Nếu `dim_product` nhiều dòng hơn số `Product ID` duy nhất → cùng mã sản phẩm có nhiều tên khác nhau (dữ liệu bẩn có thật trong Superstore). Cách xử lý: chọn tên xuất hiện gần nhất, và **ghi lại quyết định đó vào README**.

</details>

---

## 3.4 — Filter context: vì sao tổng các phần khác tổng chung {#filter-context}

**Định nghĩa.** Mỗi biểu đồ tính toán trong phạm vi bộ lọc đang áp lên nó (filter dashboard + filter riêng của chart + phạm vi ngày).

Ba nguyên nhân khiến số không khớp nhau trên cùng một dashboard:
1. **Khác bộ lọc** — chart A lọc năm 2017, card B lấy toàn bộ thời gian.
2. **Đo lường không cộng được** — `COUNT(DISTINCT customer)` theo tháng cộng lại **không** bằng cả năm (khách quay lại bị đếm 1 lần ở tổng, nhiều lần khi cộng tháng).
3. **Làm tròn** — mỗi chart tự làm tròn rồi mới hiển thị.

**Bài tập 3.4.** Dashboard hiện: "Khách hàng: 793" trên card, nhưng cộng cột "số khách" của 12 tháng ra 2.184. Giải thích cho sếp trong 3 câu, không dùng thuật ngữ kỹ thuật.

<details>
<summary>Đáp án 3.4</summary>

*"Card đếm số người khác nhau đã mua trong cả kỳ — mỗi người chỉ tính một lần dù mua nhiều tháng. Cột theo tháng đếm số người mua trong từng tháng, nên ai mua 3 tháng sẽ được tính ở cả 3 tháng đó. Vì vậy cộng 12 tháng luôn lớn hơn con số tổng, và đó là hành vi đúng chứ không phải lỗi."*

</details>

---

## 3.5 — Thiết kế: bố cục, màu, mật độ thông tin {#thiet-ke}

**Nguyên tắc bố cục** — mắt đọc trái→phải, trên→dưới:
```
+-------------------------------------------------------+
| Tieu de: cau hoi chinh + khoang thoi gian + cap nhat luc |
+-------------------------------------------------------+
| [Card: Doanh thu] [Card: Don] [Card: AOV] [Card: Margin]|   <- 3-5 so quan trong nhat, KEM % so ky truoc
+-------------------------------------------------------+
| Line: xu huong theo thang        | Bar: theo Region     |   <- xu huong ben trai, so sanh ben phai
+-------------------------------------------------------+
| Table: top/bottom 10 san pham (co the sap xep)         |   <- chi tiet o duoi cung
+-------------------------------------------------------+
| Ghi chu: nguon du lieu, cach tinh metric, han che       |
+-------------------------------------------------------+
```

**Màu.** Một màu nhấn cho thứ quan trọng, xám cho phần còn lại. Đỏ/xanh chỉ dành cho tốt/xấu — không dùng đỏ chỉ vì đẹp. Kiểm tra bằng cách in đen trắng: vẫn đọc được thông điệp thì màu dùng đúng.

**Mật độ.** Tối đa 5–7 thành phần một trang. Nhiều hơn thì tách trang.

**Ví dụ áp dụng vào Superstore.** Phát hiện đáng giá nhất của dataset này là: Furniture doanh thu 742.000 (32% tổng) nhưng biên lợi nhuận chỉ **2,5%**, trong đó `Tables` **lỗ 17.725**. Dashboard tốt phải làm phát hiện đó nổi lên trong 5 giây — bằng scatter (doanh thu × lợi nhuận, chấm lỗ tô đỏ) hoặc bar margin theo sub-category sắp tăng dần với các cột âm màu đỏ. Dashboard xấu chôn nó trong một bảng 17 dòng không sắp xếp.

**Bài tập 3.5.** Vẽ tay (giấy) bố cục Portfolio #1 trước khi mở Looker Studio. Ghi rõ với mỗi ô: câu hỏi nó trả lời · chart type · dimension · measure · filter áp lên nó.

---

## 3.6 — Looker Studio và Metabase: chọn cái nào cho việc gì {#looker-metabase}

| | Looker Studio | Metabase |
|---|---|---|
| Cài đặt | trình duyệt, 0 phút | Docker, ~10 phút |
| Nguồn | Sheets, BigQuery, CSV | mọi DB qua JDBC (DuckDB, Postgres) |
| Chia sẻ | link public — nhà tuyển dụng xem được ngay | chạy local, phải chụp ảnh/quay video |
| Điểm mạnh | làm portfolio, dashboard cho người ngoài | SQL question có tham số, mô hình dữ liệu |
| Dùng cho | Portfolio #1 và capstone | tập khái niệm model/fact-dim, dùng nội bộ |

```bash
docker run -d -p 3000:3000 -v metabase-data:/metabase.db --name metabase metabase/metabase
# mo http://localhost:3000
```

> Power BI không chạy native trên macOS. Nếu nhắm ngân hàng/doanh nghiệp lớn ở VN thì học sau W16 bằng máy ảo Windows; khái niệm học ở đây (measure, dimension, filter context, star schema) chuyển sang Power BI gần như nguyên vẹn — chỉ khác cú pháp DAX.

---

## 3.7 — Spec Portfolio #1 và tiêu chí chấm {#spec-portfolio-1}

Câu hỏi chính: **"Doanh thu và lợi nhuận đang diễn biến ra sao, nhóm nào kéo tăng, nhóm nào kéo giảm, và nên làm gì?"**

| Thành phần | Bắt buộc có |
|---|---|
| 4 card | Doanh thu · Số đơn · AOV · Biên lợi nhuận — mỗi cái kèm % so kỳ trước |
| Line | Doanh thu + lợi nhuận theo tháng (48 tháng) |
| Bar | Doanh thu theo Region, sắp giảm dần |
| Scatter | Doanh thu × Lợi nhuận theo sub-category, chấm lỗ tô đỏ |
| Table | Top 10 lãi nhất và Top 10 lỗ nặng nhất |
| Filter | Khoảng thời gian · Region · Category |
| Ghi chú | Nguồn dữ liệu · công thức từng metric · ngày cập nhật |

README kèm theo phải có: nguồn dữ liệu · cách tính từng metric (đúng 5 trường) · **3 insight kèm số** · **2 đề xuất hành động** · hạn chế của dữ liệu.

**Tiêu chí đạt (tự chấm nghiêm):**
- [ ] Người lạ nhìn 5 giây nói được "doanh thu tăng hay giảm"
- [ ] Mọi con số đều có mốc so sánh
- [ ] Phát hiện Furniture/Tables lỗ xuất hiện rõ, không phải đào mới thấy
- [ ] Filter chạy đúng trên tất cả chart
- [ ] Có ít nhất 1 đề xuất mà sếp có thể ra quyết định ngay
- [ ] README nêu được 2 điều dữ liệu **không** trả lời được (không có giá vốn thật, không có dữ liệu marketing)

**3 insight mẫu đạt chuẩn** (dùng số thật, có so sánh, có hàm ý):
1. *"Furniture chiếm 32% doanh thu (742.000$) nhưng chỉ 6,4% lợi nhuận, biên 2,5% so với 17,4% của Technology. Mỗi đồng doanh thu Furniture tạo ra lợi nhuận chỉ bằng 1/7 Technology."*
2. *"Sub-category Tables lỗ 17.725$ trên doanh thu 206.966$ — biên −8,6%. Đây là nhóm duy nhất lỗ ở quy mô lớn."*
3. *"Từ mức chiết khấu 30% trở lên, lợi nhuận trung bình mỗi dòng chuyển sang âm (−45,7$ ở mức 30%, −111,9$ ở mức 40%). 471 dòng đang nằm ở vùng này."*

Insight **không đạt**: "Doanh thu tăng qua các năm" (không số, không so sánh, không hàm ý hành động).

---

## Checklist trước khi sang Stage 4

- [ ] Phân biệt measure và dimension, giải thích vì sao margin không cộng được
- [ ] Giải thích được vì sao tổng 12 tháng số khách ≠ số khách cả năm
- [ ] Vẽ được sơ đồ star schema của Superstore
- [ ] Dashboard public trên Looker Studio, link đã dán vào README
- [ ] 3 insight có số + 2 đề xuất hành động
- [ ] Trình bày dashboard trong 3 phút không vấp

**Tiếp theo:** [L4 — Python & Pandas →](./l4-python.md)

Làm bài tập tự chấm tương ứng: [Bài tập Stage 3](../bai-tap/stage-3.mdx)
