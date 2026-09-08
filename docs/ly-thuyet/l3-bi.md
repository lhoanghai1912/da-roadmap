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

**Định nghĩa.** Dashboard = một màn hình trả lời **một** câu hỏi kinh doanh chính, cập nhật định kỳ, giúp người xem quyết định **làm gì tiếp theo**.

### Bàn tập — hai cái card

Cùng một con số, hai cách hiển thị:

```
┌─────────────────────┐        ┌─────────────────────────────┐
│   Doanh thu         │        │   Doanh thu tháng 3         │
│   2.297.201 đ       │        │   45.200 đ                  │
│                     │        │   ▼ 12,3% so tháng trước    │
│                     │        │   Đạt 89% target (51.000)   │
└─────────────────────┘        └─────────────────────────────┘
```

Card bên trái: người xem đọc xong **không biết làm gì**. Cao hay thấp? Tốt hay xấu? So với cái gì?

Card bên phải: đọc xong biết ngay đang hụt target, biết hụt bao nhiêu, và biết xu hướng đang xấu đi.

**Quy tắc: mỗi con số phải có ít nhất một mốc so sánh** — kỳ trước, cùng kỳ năm trước, hoặc target. Không có mốc thì con số gần như vô dụng.

### Bảng phân biệt

| Là dashboard | Không phải dashboard |
|---|---|
| Trả lời 1 câu hỏi chính | Trưng bày mọi chart vẽ được |
| Mỗi số có mốc so sánh | Số trần trụi |
| Người xem biết phải làm gì | Người xem gật gù rồi đóng tab |
| Ghi rõ dữ liệu cập nhật lúc nào | Không ai biết số cũ hay mới |
| 5–7 thành phần | 20 chart chen chúc |

### Report vs Dashboard vs Phân tích

Ba thứ hay bị gọi lẫn lộn:

| Loại | Trả lời | Tần suất đọc | Ví dụ |
|---|---|---|---|
| **Report** | "Chuyện gì đã xảy ra?" chi tiết | đọc 1 lần | Báo cáo doanh thu quý 3 |
| **Dashboard** | "Hiện tại có ổn không?" | đọc định kỳ | Dashboard bán hàng hằng tuần |
| **Phân tích** | "Vì sao? Nên làm gì?" | đọc 1 lần, quyết định lớn | Vì sao khách rời bỏ |

Người mới hay bị yêu cầu "làm cái dashboard" trong khi thứ sếp thật sự cần là **phân tích**. Hỏi lại trước khi làm: *"anh sẽ xem cái này bao lâu một lần?"* — nếu câu trả lời là "một lần thôi" thì đừng làm dashboard.

### Bài tập 3.1

Với mỗi dashboard, viết **một** câu hỏi chính nó phải trả lời, và **một** hành động người xem sẽ làm sau khi xem:

a) Cho Giám đốc bán hàng, xem hàng tuần
b) Cho nhân viên vận hành kho, xem hàng ngày
c) Cho Giám đốc sản phẩm sau khi ra tính năng mới
d) Cho CEO, xem hàng tháng

<details>
<summary>Đáp án 3.1</summary>

a) *"Tuần này có đang đi đúng hướng để đạt target quý không, và vùng/nhóm hàng nào đang kéo lùi?"* → hành động: gọi cho trưởng vùng đang hụt.
b) *"Hôm nay đơn nào có nguy cơ trễ hạn giao?"* → hành động: ưu tiên xử lý danh sách đó ngay trong ngày.
c) *"Tính năng mới có được dùng không, và nó ảnh hưởng thế nào tới chỉ số chính?"* → hành động: quyết định mở rộng cho toàn bộ người dùng hay tắt đi.
d) *"Công ty đang ở đâu so với kế hoạch năm?"* → hành động: điều chỉnh phân bổ ngân sách quý sau.

Điểm chung: **mỗi câu dẫn tới một hành động cụ thể**. Nếu không nghĩ ra được hành động nào, dashboard đó không cần tồn tại.

</details>

## 3.2 — Measure vs Dimension (khái niệm gốc của mọi công cụ BI) {#measure-dimension}

**Định nghĩa.** **Measure** = cột số được tổng hợp (trả lời "đo cái gì"). **Dimension** = cột dùng để cắt lát, nhóm, lọc (trả lời "chia theo cái gì").

Mọi công cụ BI — Looker Studio, Metabase, Power BI, Tableau — đều xoay quanh đúng hai khái niệm này. Nắm chắc ở đây thì đổi công cụ chỉ là đổi chỗ bấm chuột.

### Bàn tập 5 dòng

| don_id | khach | hạng | thành phố | sp | danh mục | tiền | lợi nhuận |
|---|---|---|---|---|---|---|---|
| HD-01 | An | Vàng | Hà Nội | Bàn | Nội thất | 900 | 20 |
| HD-01 | An | Vàng | Hà Nội | Ghế | Nội thất | 300 | 10 |
| HD-02 | An | Vàng | Hà Nội | Laptop | Công nghệ | 2000 | 400 |
| HD-03 | Bình | Bạc | Đà Nẵng | Ghế | Nội thất | 300 | 10 |
| HD-04 | Chi | Bạc | Hà Nội | Laptop | Công nghệ | 2000 | 400 |

Phân loại từng cột:

| Cột | Loại | Vì sao |
|---|---|---|
| `tiền`, `lợi nhuận` | **Measure** | cộng lại có ý nghĩa |
| `khach`, `hạng`, `thành phố`, `danh mục` | **Dimension** | dùng để nhóm và lọc |
| `don_id` | **Dimension** (đặc biệt) | dùng để đếm duy nhất, không cộng |
| `sp` | Dimension | |

### Ba loại measure — và loại nào bị tính sai nhiều nhất

**Loại 1 — cộng thẳng được (additive):**

```sql
SELECT SUM(tien) FROM phang;   -- 5.500. Cong theo bat ky chieu nao cung dung
```

**Loại 2 — đếm duy nhất (non-additive):**

```sql
SELECT COUNT(DISTINCT don_id) FROM phang;   -- 4 don (khong phai 5 dong)
```

Xem lại [§3.4](#filter-context): cộng theo tháng rồi cộng lại **không** ra con số cả kỳ.

**Loại 3 — tỷ số. Đây là loại sai nhiều nhất.**

Bàn tập nhỏ hơn, 3 sản phẩm:

| sp | tiền | lợi nhuận | biên từng dòng |
|---|---|---|---|
| Laptop | 2000 | 200 | 10,0% |
| Bàn | 900 | 20 | 2,2% |
| Bút bi | 10 | 8 | **80,0%** |

Hai cách tính biên lợi nhuận chung:

```sql
SELECT ROUND(100.0*SUM(loi_nhuan)/SUM(tien),1) AS bien_DUNG,   -- 7,8%
       ROUND(AVG(100.0*loi_nhuan/tien),1)      AS bien_SAI;    -- 30,7%
```

**7,8% vs 30,7% — lệch gần 4 lần.**

Vì sao: cây bút bi bán được 10 đồng lãi 80% được tính **ngang hàng** với laptop 2000 đồng. Trung bình của các tỷ số bỏ qua hoàn toàn chênh lệch quy mô.

**Quy tắc: tỷ số phải tính bằng `SUM(tử) / SUM(mẫu)`, không bao giờ dùng `AVG(tỷ số)`.**

Trong Looker Studio, tạo calculated field `SUM(Profit) / SUM(Sales)` — không phải `AVG(profit_margin)`. Trong Power BI, đây là lý do measure phải viết bằng DAX chứ không phải cột tính sẵn.

### AOV — cùng một bẫy, dạng khác

```sql
SELECT ROUND(SUM(tien)*1.0/COUNT(DISTINCT don_id),1) AS AOV_dung,  -- 1.375
       ROUND(AVG(tien),1)                            AS AOV_sai;   -- 1.100
```

`AVG(tien)` là trung bình mỗi **dòng**, không phải mỗi **đơn** — đúng lỗi grain ở [L1 §1.1](/ly-thuyet/l1-foundation#grain). Trên Superstore: 458,6 (đúng) vs 229,9 (sai).

### Dimension đặc biệt: cột số dùng để nhóm

`Discount` là cột số, nhưng có thể dùng cả hai kiểu:

| Dùng như | Ví dụ | Kết quả |
|---|---|---|
| Measure | `AVG(Discount)` | mức chiết khấu trung bình |
| **Dimension** | `GROUP BY Discount` | doanh thu theo từng mức chiết khấu |

Cách dùng thứ hai chính là thứ đã lộ ra ngưỡng 30% ở [L1 §1.5](/ly-thuyet/l1-foundation#tuong-quan). Đừng mặc định cột số là measure.

### Bài tập 3.2

Trên bàn tập 5 dòng, viết công thức đúng và tính ra số:

1. AOV
2. Số khách duy nhất
3. Doanh thu trung bình mỗi khách
4. Tỷ lệ % đơn thuộc danh mục Nội thất
5. Biên lợi nhuận của Nội thất và Công nghệ — nhóm nào lãi hơn?

<details>
<summary>Đáp án 3.2</summary>

1. `SUM(tien) / COUNT(DISTINCT don_id)` = 5.500/4 = **1.375**.
2. `COUNT(DISTINCT khach)` = **3** (An, Bình, Chi). Không phải 5 — An xuất hiện ở 3 dòng.
3. `SUM(tien) / COUNT(DISTINCT khach)` = 5.500/3 = **1.833**.
4. Cẩn thận grain: HD-01 có 2 dòng đều Nội thất, HD-03 một dòng Nội thất → 2/4 đơn = **50%**. Nếu đếm theo dòng sẽ ra 3/5 = 60% — trả lời sai câu hỏi (câu hỏi hỏi về **đơn**).
5. Nội thất: 40/1.500 = **2,7%**. Công nghệ: 800/4.000 = **20%**. Công nghệ lãi hơn gấp 7 lần về biên — đúng mô hình của Superstore thật (Furniture 2,5% vs Technology 17,4%).

</details>

## 3.3 — Star schema: tại sao dashboard cần mô hình dữ liệu {#star-schema}

**Định nghĩa.** **Fact table** ghi sự kiện đã xảy ra (nhiều dòng, có số để cộng, chứa khóa ngoại). **Dimension table** mô tả (ít dòng, dùng để lọc và cắt lát). Fact ở giữa nối ra các dim xung quanh = **star schema**.

### Bàn tập — bảng phẳng có gì sai

Nhìn lại bảng 5 dòng ở §3.2. Đếm số lần lặp:

```
5 dong  ·  3 khach  ·  3 san pham  ·  4 don
```

Thông tin của An (`hạng = Vàng`, `thành phố = Hà Nội`) bị **chép lại 3 lần**. Với Superstore thì con số là 9.994 dòng cho 793 khách — mỗi khách lặp trung bình **12,6 lần**.

Ba vấn đề cụ thể:

| Vấn đề | Ví dụ |
|---|---|
| **Lặp dữ liệu** | An chuyển từ Hà Nội vào Sài Gòn → phải sửa 3 dòng, sót 1 dòng là dữ liệu mâu thuẫn |
| **Đếm sai** | `COUNT(hạng = 'Vàng')` ra 3 thay vì 1 — đúng lỗi ở [L1 §1.1](/ly-thuyet/l1-foundation#grain) |
| **Mất thực thể không phát sinh** | Khách đăng ký nhưng chưa mua **không tồn tại** trong bảng — không thể trả lời "bao nhiêu khách chưa mua lần nào" |

Vấn đề thứ ba là nghiêm trọng nhất và ít người để ý: bảng phẳng chỉ chứa **những gì đã xảy ra**, nên mọi câu hỏi về "cái không xảy ra" đều không trả lời được.

### Tách ra

```sql
CREATE TABLE dim_khach AS SELECT DISTINCT khach, hang, thanh_pho FROM phang;      -- 3 dong
CREATE TABLE dim_sp    AS SELECT DISTINCT sp, danh_muc FROM phang;                -- 3 dong
CREATE TABLE fact_ban  AS SELECT don_id, khach, sp, tien, loi_nhuan FROM phang;   -- 5 dong
```

```
                 dim_khach (3 dong)
                        │
   dim_ngay  ──── fact_ban (5 dong) ──── dim_sp (3 dong)
                        │
                   dim_vung
```

**Kiểm chứng bắt buộc sau khi tách:** tổng ở fact phải bằng tổng ở bảng gốc.

```sql
SELECT SUM(tien) FROM fact_ban;   -- 5.500, khop voi bang phang
```

Nếu `dim_khach` ra nhiều hơn 3 dòng → cùng một khách có nhiều giá trị `hạng` hoặc `thành phố` khác nhau. Đó là **dữ liệu bẩn cần xử lý**, không phải lỗi câu lệnh. Với Superstore thật, chuyện này xảy ra — phải chọn bản ghi mới nhất và **ghi quyết định đó vào README**.

### Vì sao BI thích cấu trúc này

| Lợi ích | Cụ thể |
|---|---|
| Bộ lọc nhanh | Dropdown "Thành phố" quét bảng 3 dòng thay vì 9.994 dòng |
| Sửa một chỗ | An đổi địa chỉ → sửa 1 dòng ở `dim_khach` |
| Trả lời được câu hỏi phủ định | `dim_khach LEFT JOIN fact` → thấy ngay ai chưa mua |
| Chart tự gom đúng | Công cụ hiểu quan hệ, không phải đoán |

### Date dimension — bảng dim quan trọng nhất

Vì sao cần bảng lịch riêng thay vì dùng thẳng cột ngày:

| Muốn có | Có sẵn trong cột `DATE` không? |
|---|---|
| Tuần thứ mấy trong năm | phải tính lại ở mọi query |
| Quý, nửa năm | phải tính lại |
| Có phải ngày lễ không | **không có cách nào** trừ khi tự tạo bảng |
| Cùng kỳ năm trước | phải tính lại |
| **Tháng không phát sinh đơn vẫn hiện ra** | **không** — dòng đó biến mất |

Điểm cuối là lý do mạnh nhất, và chính là chuyện đã gặp ở [L2 §2.7](/ly-thuyet/l2-sql#date-case-null): tháng 2 không có đơn thì biến mất khỏi biểu đồ, đường nối thẳng từ tháng 1 sang tháng 3.

### Star vs Snowflake

| | Star | Snowflake |
|---|---|---|
| Dim | phẳng, chấp nhận lặp | chuẩn hóa nhiều tầng |
| Ví dụ | `dim_sp(sp, danh_muc, nhom_lon)` | `dim_sp → dim_danh_muc → dim_nhom_lon` |
| JOIN cần | 1 lần | nhiều lần |
| Dùng khi | **hầu hết trường hợp BI** | dim rất lớn, thay đổi thường xuyên |

Với công việc DA, gần như luôn chọn **star**. Snowflake tiết kiệm dung lượng nhưng làm query phức tạp hơn — đánh đổi không đáng ở quy mô thường gặp.

### Bài tập 3.3

1. Tách bảng phẳng 5 dòng thành star schema. `dim_khach` phải có mấy dòng? Kiểm chứng `SUM(tien)`.
2. Với star schema đó, viết query trả lời *"khách nào chưa từng mua gì?"* — thêm 1 khách vào `dim_khach` trước.
3. Tách `superstore` thành `dim_customer`, `dim_product`, `fact_sales`. Kiểm: `SUM(sales)` phải đúng **2.297.201**.
4. Nếu `dim_product` ra nhiều dòng hơn `COUNT(DISTINCT "Product ID")` thì nguyên nhân là gì, xử lý thế nào?

<details>
<summary>Đáp án 3.3</summary>

1. `dim_khach` = **3 dòng**. `SUM(tien)` ở fact vẫn 5.500.
2. ```sql
   INSERT INTO dim_khach VALUES ('Dung','Bac','Hue');
   SELECT d.khach FROM dim_khach d LEFT JOIN fact_ban f ON f.khach = d.khach WHERE f.don_id IS NULL;
   -- ra Dung
   ```
   Đây chính là câu hỏi bảng phẳng **không** trả lời được.
3. ```sql
   CREATE TABLE dim_customer AS SELECT DISTINCT "Customer ID", "Customer Name", Segment, Country, City, State, Region FROM superstore;
   CREATE TABLE dim_product  AS SELECT DISTINCT "Product ID", "Product Name", Category, "Sub-Category" FROM superstore;
   CREATE TABLE fact_sales   AS SELECT "Order ID", "Order Date", "Customer ID", "Product ID", Sales, Quantity, Discount, Profit FROM superstore;
   SELECT ROUND(SUM(Sales),0) FROM fact_sales;   -- 2297201
   ```
4. Cùng một `Product ID` có nhiều `Product Name` khác nhau (lỗi nhập liệu tích lũy qua thời gian). Xử lý: chọn tên xuất hiện gần nhất hoặc phổ biến nhất, **ghi rõ quyết định vào README**, và báo cho người quản lý dữ liệu để sửa từ gốc. Không im lặng chọn bừa.

</details>

## 3.4 — Filter context: vì sao tổng các phần khác tổng chung {#filter-context}

**Định nghĩa.** Mỗi biểu đồ tính toán trong phạm vi bộ lọc đang áp lên nó (filter dashboard + filter riêng của chart + phạm vi ngày).

### Bàn tập 5 dòng

Cửa hàng bán 3 tháng đầu năm:

| thang | khach | tien |
|---|---|---|
| 01 | An | 100 |
| 01 | Bình | 50 |
| 02 | An | 80 |
| 02 | Chi | 30 |
| 03 | An | 60 |

Dashboard có 2 thành phần: một **card** ở trên (cả kỳ) và một **bảng** ở dưới (chia theo tháng). Đoán trước xem hai bên có khớp nhau không:

```sql
-- Bang theo thang
SELECT thang, COUNT(DISTINCT khach) AS so_khach, SUM(tien) AS doanh_thu FROM ban GROUP BY 1;
-- Card ca ky
SELECT COUNT(DISTINCT khach) AS khach, SUM(tien) AS doanh_thu FROM ban;
```

| | Tháng 01 | Tháng 02 | Tháng 03 | **Cộng 3 tháng** | **Card cả kỳ** | Khớp? |
|---|---|---|---|---|---|---|
| Doanh thu | 150 | 110 | 60 | **320** | **320** | ✅ |
| Số khách | 2 | 2 | 1 | **5** | **3** | ❌ |

Cùng một bảng, cùng một dashboard: doanh thu khớp, số khách lệch. Không phải lỗi.

**Vì sao:** An mua cả 3 tháng nên được đếm ở cả 3 dòng của bảng, nhưng ở card chỉ tính **1 người**. Cửa hàng có đúng 3 khách: An, Bình, Chi.

### Measure cộng được và measure không cộng được {#non-additive}

| Loại | Ví dụ | Cộng các kỳ lại được? |
|---|---|---|
| **Additive** | doanh thu, số đơn, số lượng | ✅ Tổng 12 tháng = cả năm |
| **Non-additive** | số khách duy nhất, số user hoạt động | ❌ Tổng 12 tháng > cả năm |
| **Tỷ số** | biên lợi nhuận, tỷ lệ chuyển đổi | ❌ Phải tính lại từ tử/mẫu, không lấy trung bình |

Đây là cùng một chuyện với [grain ở Lesson 1](/ly-thuyet/l1-foundation#grain): khách là thực thể ở grain cao hơn dòng bán hàng, nên đếm thẳng là đếm trùng.

**Ba nguyên nhân khiến số trên dashboard "không khớp":**
1. Khác bộ lọc — chart A lọc 2017, card B lấy toàn bộ thời gian
2. Measure non-additive — trường hợp vừa xem
3. Làm tròn — mỗi chart tự làm tròn rồi mới hiển thị

### Bài tập 3.4

1. Vẫn bảng 5 dòng: "doanh thu trung bình mỗi khách mỗi tháng" — tính thế nào? Ra bao nhiêu?
2. Biên lợi nhuận tháng 01 là 10%, tháng 02 là 20%. Biên lợi nhuận cả kỳ có phải 15% không?
3. Dashboard hiện "Khách hàng: 793" trên card, nhưng cộng cột "số khách" của 12 tháng ra 2.184. Giải thích cho sếp trong 3 câu, không dùng thuật ngữ kỹ thuật.

<details>
<summary>Đáp án 3.4</summary>

1. Cần nói rõ định nghĩa trước khi tính. Hiểu theo "trung bình của (doanh thu tháng ÷ số khách tháng đó)": (150/2 + 110/2 + 60/1) / 3 = (75 + 55 + 60)/3 = **63,3**. Hiểu theo "tổng doanh thu ÷ tổng lượt khách-tháng": 320/5 = **64**. Hai con số khác nhau, đều "đúng" — nên khi sếp hỏi, phải hỏi lại ý nào trước khi trả lời.
2. **Không.** Biên lợi nhuận là tỷ số nên phải tính lại: `tổng lợi nhuận / tổng doanh thu`. Nếu tháng 01 doanh thu 1.000 (lãi 100) và tháng 02 doanh thu 100 (lãi 20) thì biên cả kỳ = 120/1.100 = **10,9%**, không phải 15%. Trung bình cộng của hai tỷ số bỏ qua chênh lệch quy mô.
3. *"Card đếm số người khác nhau đã mua trong cả kỳ — mỗi người chỉ tính một lần dù mua nhiều tháng. Cột theo tháng đếm số người mua trong từng tháng, nên ai mua 3 tháng sẽ được tính ở cả 3 tháng. Vì vậy cộng 12 tháng luôn lớn hơn con số tổng, và đó là hành vi đúng chứ không phải lỗi."*

</details>

## 3.5 — Thiết kế: bố cục, màu, mật độ thông tin {#thiet-ke}

### Bàn tập — bài kiểm tra 5 giây

Đưa dashboard cho một người chưa từng xem, cho họ nhìn **5 giây**, rồi hỏi: *"doanh thu đang tăng hay giảm?"*

Không trả lời được → lỗi ở **bố cục**, không phải ở màu sắc hay font chữ. Đây là bài test rẻ nhất và hiệu quả nhất, làm được ngay trong văn phòng.

### Bố cục theo hướng đọc

Mắt người đọc trái→phải, trên→dưới. Đặt thứ quan trọng nhất ở nơi mắt chạm đầu tiên:

```
┌───────────────────────────────────────────────────────────┐
│ Tieu de: cau hoi chinh + khoang thoi gian + cap nhat luc  │
├───────────────────────────────────────────────────────────┤
│ [Doanh thu]  [So don]  [AOV]  [Bien LN]                   │  <- 3-5 so quan trong nhat
│  45.2K -12%   116 -2%   389 -10%   12,5% -1,2pp           │     LUON kem % so ky truoc
├──────────────────────────────┬────────────────────────────┤
│ Line: xu huong theo thang    │ Bar: theo Region           │  <- xu huong trai, so sanh phai
├──────────────────────────────┴────────────────────────────┤
│ Table: top/bottom 10 san pham (sap xep duoc)              │  <- chi tiet o duoi
├───────────────────────────────────────────────────────────┤
│ Ghi chu: nguon du lieu · cach tinh metric · han che        │
└───────────────────────────────────────────────────────────┘
```

Nguyên tắc: **tổng quan trước, chi tiết sau**. Người xem quyết định có cần đào sâu hay không dựa vào hàng card trên cùng.

### Màu

| Quy tắc | Vì sao |
|---|---|
| Một màu nhấn + xám cho phần còn lại | Màu là để **hướng sự chú ý**, không phải để trang trí |
| Đỏ/xanh chỉ dành cho tốt/xấu | Dùng đỏ cho "Nội thất" chỉ vì đẹp → người xem tưởng Nội thất đang có vấn đề |
| Tối đa 5–6 màu trên một chart | Nhiều hơn thì không ai phân biệt được trong chú thích |

**Cách kiểm:** in đen trắng. Vẫn đọc được thông điệp → màu dùng đúng. Mất hết ý nghĩa → đang dùng màu để mang thông tin, phải sửa.

### Mật độ

Tối đa **5–7 thành phần** một trang. Nhiều hơn thì tách trang, đặt tên trang theo câu hỏi ("Tổng quan", "Phễu", "Cohort") chứ không theo loại chart.

### Chart junk — bỏ hết

3D, gradient, viền đậm, bóng đổ, hình nền, biểu tượng nhấp nháy. Không thứ nào giúp đọc số nhanh hơn. Mọi pixel không mang thông tin đều đang cạnh tranh với pixel mang thông tin.

### Áp lên Superstore

Phát hiện đáng giá nhất của dataset này:

```
Furniture: 742.000 doanh thu (32% tong) nhung bien loi nhuan chi 2,5%
  trong do sub-category Tables LO 17.725
```

Dashboard **tốt** làm phát hiện đó nổi lên trong 5 giây: scatter doanh thu × lợi nhuận với chấm âm tô đỏ, hoặc bar biên lợi nhuận theo sub-category sắp tăng dần với cột âm màu đỏ nằm ngay đầu.

Dashboard **xấu** chôn nó trong bảng 17 dòng không sắp xếp, để người xem tự tìm.

Cùng dữ liệu, cùng công cụ. Khác nhau ở chỗ người làm có **biết mình muốn nói gì** hay không.

### Bài tập 3.5

1. Vẽ tay bố cục Portfolio #1 ra giấy **trước khi** mở Looker Studio. Mỗi ô ghi: câu hỏi nó trả lời · chart type · dimension · measure · filter áp lên nó.
2. Tìm một dashboard công khai bất kỳ trên mạng, làm bài test 5 giây với nó. Ghi lại nó vi phạm nguyên tắc nào.
3. Dashboard của bạn có bao nhiêu thành phần? Nếu quá 7, bỏ cái nào và vì sao?

<details>
<summary>Gợi ý câu 1 — mẫu điền</summary>

| Ô | Câu hỏi | Chart | Dimension | Measure | Filter |
|---|---|---|---|---|---|
| Card 1 | Doanh thu kỳ này bao nhiêu, so kỳ trước? | Scorecard + delta | — | `SUM(Sales)` | thời gian, region, category |
| Line | Xu hướng đang lên hay xuống? | Line | `Order Date` (tháng) | `SUM(Sales)`, `SUM(Profit)` | như trên |
| Bar | Vùng nào mạnh nhất? | Bar ngang giảm dần | `Region` | `SUM(Sales)` | như trên |
| Scatter | Nhóm nào bán chạy mà vẫn lỗ? | Scatter | `Sub-Category` | `SUM(Sales)` × `SUM(Profit)` | như trên |
| Table | Cụ thể sản phẩm nào? | Table sắp xếp được | `Product Name` | `SUM(Sales)`, `SUM(Profit)`, biên | như trên |

Vẽ tay trước tiết kiệm rất nhiều thời gian — sửa bố cục trên giấy mất 2 phút, sửa trên Looker Studio mất nửa buổi.

</details>

## 3.6 — Looker Studio và Metabase: chọn cái nào cho việc gì {#looker-metabase}

| | Looker Studio | Metabase |
|---|---|---|
| Cài đặt | trình duyệt, 0 phút | Docker, ~10 phút |
| Nguồn dữ liệu | Sheets, BigQuery, CSV | mọi DB qua JDBC (DuckDB, Postgres) |
| Chia sẻ | **link public** — nhà tuyển dụng xem được ngay | chạy local, phải chụp ảnh/quay video |
| Điểm mạnh | làm portfolio, dashboard cho người ngoài | SQL question có tham số, lớp model |
| Dùng cho | **Portfolio #1 và capstone** | tập khái niệm model/fact-dim, dùng nội bộ |

```bash
docker run -d -p 3000:3000 -v metabase-data:/metabase.db --name metabase metabase/metabase
# doi log hien "Metabase Initialization COMPLETE" roi mo http://localhost:3000
```

### Nguyên tắc quan trọng nhất của tầng BI

**Tính nặng làm ở tầng SQL, không làm ở tầng BI.**

| Việc | Làm ở đâu |
|---|---|
| JOIN nhiều bảng, tính cohort, funnel | **SQL** (hoặc view/model) |
| Lọc theo thời gian, region | BI |
| Tính `SUM(Profit)/SUM(Sales)` | BI (calculated field đơn giản) |
| Logic phân khúc RFM 5 tầng | **SQL** |

Dấu hiệu đang làm sai: blend 3–4 nguồn trong Looker Studio, hoặc calculated field dài 15 dòng. Lúc đó nên lùi lại viết một query/view rồi trỏ BI vào đó.

Vì sao: logic nằm trong BI thì **không ai đọc được, không version control được, không tái sử dụng được**. Logic nằm trong SQL thì commit lên Git, người khác đọc được, dùng lại được ở notebook.

Đây cũng là khác biệt giữa "người kéo thả chart" và analyst.

### Blend data — và giới hạn của nó

Blend trong Looker Studio ≈ `LEFT JOIN`, nhưng hạn chế hơn:

| SQL JOIN | Blend |
|---|---|
| mọi kiểu join | chủ yếu left |
| join nhiều điều kiện | 1 khóa |
| lồng nhiều tầng | tối đa 5 nguồn, khó debug |
| thấy được số dòng trước/sau | **không thấy** → fan-out xảy ra âm thầm |

Dòng cuối là rủi ro lớn nhất: [fan-out](/ly-thuyet/l2-sql#fan-out) trong BI khó phát hiện hơn nhiều so với trong SQL, vì không có chỗ để `COUNT(*)` kiểm tra.

### Power BI

Không chạy native trên macOS. Nếu nhắm ngân hàng/doanh nghiệp lớn ở VN thì bổ sung sau W16 bằng máy ảo Windows.

Tin tốt: mọi khái niệm ở lesson này — measure, dimension, filter context, star schema, additive/non-additive — **chuyển sang Power BI gần như nguyên vẹn**. Chỉ khác cú pháp DAX. Học chắc khái niệm ở đây thì học Power BI sau chỉ mất 2–3 tuần.

## 3.7 — Spec Portfolio #1 và tiêu chí chấm {#spec-portfolio-1}

Câu hỏi chính của dashboard: **"Doanh thu và lợi nhuận đang diễn biến ra sao, nhóm nào kéo tăng, nhóm nào kéo giảm, và nên làm gì?"**

### Thành phần bắt buộc

| Thành phần | Chi tiết | Trả lời phần nào của câu hỏi |
|---|---|---|
| 4 card | Doanh thu · Số đơn · AOV · Biên lợi nhuận — **mỗi cái kèm % so kỳ trước** | "diễn biến ra sao" |
| Line | Doanh thu + lợi nhuận theo tháng (48 tháng) | "diễn biến ra sao" |
| Bar | Doanh thu theo Region, sắp giảm dần | "nhóm nào kéo tăng" |
| Scatter | Doanh thu × Lợi nhuận theo sub-category, chấm âm tô đỏ | "nhóm nào kéo giảm" |
| Table | Top 10 lãi nhất và Top 10 lỗ nặng nhất | "nên làm gì" |
| Filter | Khoảng thời gian · Region · Category | |
| Ghi chú | Nguồn dữ liệu · công thức từng metric · ngày cập nhật | |

Mỗi thành phần phải trả lời được câu hỏi *"nó phục vụ phần nào của câu hỏi chính?"*. Không trả lời được thì bỏ.

### Insight — đạt và không đạt

Ba tiêu chí của một insight đạt chuẩn: **có số · có so sánh · có hàm ý hành động**.

| Câu | Đánh giá |
|---|---|
| "Doanh thu tăng qua các năm" | ❌ không số, không so sánh, không hàm ý |
| "Furniture có biên lợi nhuận thấp" | ❌ có so sánh ngầm nhưng thiếu số |
| "Furniture chiếm 32% doanh thu (742.000$) nhưng chỉ 6,4% lợi nhuận, biên 2,5% so với 17,4% của Technology. Mỗi đồng doanh thu Furniture tạo lợi nhuận chỉ bằng 1/7 Technology." | ✅ |

Ba insight mẫu đạt chuẩn cho Superstore:

1. *"Furniture chiếm 32% doanh thu (742.000$) nhưng chỉ 6,4% lợi nhuận, biên 2,5% so với 17,4% của Technology."*
2. *"Sub-category Tables lỗ 17.725$ trên doanh thu 206.966$ — biên −8,6%. Đây là nhóm duy nhất lỗ ở quy mô lớn."*
3. *"Từ mức chiết khấu 30% trở lên, lợi nhuận trung bình mỗi dòng chuyển sang âm (−45,7$ ở mức 30%, −111,9$ ở mức 40%). Hiện có 471 dòng nằm trong vùng này."*

### Đề xuất — đạt và không đạt

| Câu | Đánh giá |
|---|---|
| "Nên cải thiện trải nghiệm khách hàng" | ❌ không ai biết phải làm gì sáng mai |
| "Nên xem lại Furniture" | ❌ xem lại cái gì, ai xem, đo bằng gì |
| "Đặt trần chiết khấu 25% cho nhóm Furniture, thử trong 1 quý trên vùng West, đo bằng biên lợi nhuận nhóm và số đơn — nếu số đơn giảm quá 15% thì dừng." | ✅ |

Đề xuất đạt chuẩn có 4 phần: **hành động cụ thể · phạm vi thử · metric đo · điều kiện dừng**.

### README kèm theo

```markdown
# Sales Dashboard — [kết luận chính có số]

[Ảnh dashboard]
**TL;DR:** 3 dòng.

## Câu hỏi kinh doanh
## Dữ liệu (nguồn · khoảng thời gian · số dòng · grain)
## Cách tính từng metric (đủ 5 trường)
## 3 insight (mỗi cái có số)
## 2 đề xuất (có metric đo)
## Hạn chế (dữ liệu KHÔNG trả lời được gì)
## Link dashboard
```

Mục **Hạn chế** với Superstore: không có giá vốn thật (`Profit` đã tính sẵn, không kiểm chứng được) · không có dữ liệu marketing · không có lý do trả hàng · không biết vì sao khách chọn mức chiết khấu đó. Xem [L1 §1.8](/ly-thuyet/l1-foundation#doc-dataset-la).

### Tiêu chí đạt — tự chấm nghiêm

- [ ] Người lạ nhìn **5 giây** nói được "doanh thu tăng hay giảm"
- [ ] Mọi con số đều có mốc so sánh
- [ ] Phát hiện Furniture/Tables lỗ **nổi lên rõ**, không phải đào mới thấy
- [ ] Filter chạy đúng trên tất cả chart (test: chọn 1 region, cộng tay xem có khớp)
- [ ] Có ít nhất 1 đề xuất sếp ra quyết định được ngay
- [ ] README nêu được **2 điều dữ liệu không trả lời được**
- [ ] Biên lợi nhuận tính bằng `SUM(Profit)/SUM(Sales)`, không phải `AVG(margin)`
- [ ] AOV chia cho **số đơn duy nhất**, không phải số dòng

Hai gạch cuối là hai lỗi kỹ thuật hay gặp nhất và cũng dễ bị người phỏng vấn kiểm tra nhất.

### Bài tập 3.7

1. Viết 3 insight cho dashboard của mình theo đúng 3 tiêu chí. Tự chấm từng cái.
2. Viết 2 đề xuất theo đủ 4 phần (hành động · phạm vi · metric · điều kiện dừng).
3. Nhờ một người không làm dữ liệu xem dashboard 5 giây rồi hỏi họ 2 câu. Ghi lại họ trả lời sai chỗ nào — đó là chỗ cần sửa.

## Checklist trước khi sang Stage 4

- [ ] Phân biệt measure và dimension, giải thích vì sao margin không cộng được
- [ ] Giải thích được vì sao tổng 12 tháng số khách ≠ số khách cả năm
- [ ] Vẽ được sơ đồ star schema của Superstore
- [ ] Dashboard public trên Looker Studio, link đã dán vào README
- [ ] 3 insight có số + 2 đề xuất hành động
- [ ] Trình bày dashboard trong 3 phút không vấp

**Tiếp theo:** [L4 — Python & Pandas →](./l4-python.md)

Làm bài tập tự chấm tương ứng: [Bài tập Stage 3](../bai-tap/stage-3.mdx)
