---
id: l1-foundation
title: "Lý thuyết 1 — Nền tảng dữ liệu"
sidebar_label: "L1 — Nền tảng"
sidebar_position: 2
description: "Grain, kieu du lieu, NULL, mean vs median, IQR outlier, tuong quan vs nhan qua, chon chart, pivot MoM. Dinh nghia + vi du da chay that + bai tap co dap an."
format: md
---

# LESSON 1 — Nền tảng dữ liệu (W1–W2)

:::tip Cách đọc trang này
Từ khóa **in đậm có gạch chân** là thuật ngữ — bấm vào để nhảy sang [Từ điển](/glossary) xem định nghĩa kèm ví dụ.
Cuối mỗi mục có khối **Chốt lại** tóm tắt điều quan trọng nhất. Đọc lướt các khối đó là nắm được xương sống của bài.
:::

Bổ trợ cho [Stage 1 — Nền tảng](../stages/stage-1-foundation.md). Stage file nói **làm gì**; file này nói **là gì, ví dụ ra sao, tự kiểm tra thế nào**.

Mỗi mục có 4 phần: **Định nghĩa** → **Ví dụ thật** (số lấy từ `data/superstore.csv`, đã chạy kiểm chứng) → **Bài tập** → **Đáp án** (bấm mở sau khi tự làm).

:::tip Cách học hiệu quả nhất với phần này
**Đoán trước, chạy sau.** Đọc câu hỏi → viết con số mình đoán ra giấy → mới chạy query → so hai bên.

Chỗ lệch giữa *đoán* và *thực tế* chính là chỗ mình đang hiểu sai. Chạy query trước rồi đọc đáp án thì não không phản kháng, học xong quên ngay.

Mỗi khái niệm ở đây đều bắt đầu bằng **bảng nhỏ 3 dòng nhìn hết bằng mắt**, rồi mới áp lên dữ liệu 10.000 dòng. Đừng đảo thứ tự.
:::

Số nền của dataset — kiểm chứng bằng lệnh ở cuối file: 9.994 dòng · 5.009 đơn · 793 khách · 1.862 sản phẩm · 2014-01-03 → 2017-12-30 · tổng Sales 2.297.201.

---

## 1.1 — [Grain](/glossary#grain) (độ mịn): khái niệm quan trọng nhất {#grain}

**Định nghĩa.** Grain là câu trả lời cho câu hỏi *"một dòng trong bảng này đại diện cho cái gì?"*. Viết ra bằng **một câu đầy đủ** trước khi tính bất cứ thứ gì.

Nghe đơn giản. Nhưng trả lời sai thì mọi con số sau đó sai — và không có thông báo lỗi nào.

### Bàn tập 3 dòng {#ban-tap}

Học grain bằng bảng 10.000 dòng là học ngược. Bắt đầu bằng bảng nhỏ tới mức nhìn hết bằng mắt.

**Chuyện đời thực:** chị An mua 1 lần gồm 2 hộp sữa + 1 gói bánh. Anh Bình mua 1 lần gồm 1 hộp sữa. Vậy là **2 tờ hóa đơn**.

Nhập vào bảng thì thành 3 dòng:

| order_id | khach | mon | sl | tien |
|---|---|---|---|---|
| HD-01 | An | Sữa | 2 | 60 |
| HD-01 | An | Bánh | 1 | 30 |
| HD-02 | Bình | Sữa | 1 | 30 |

**3 dòng, nhưng chỉ 2 đơn hàng.** Grain ở đây = *"1 dòng = 1 món hàng trong 1 hóa đơn"* — không phải "1 dòng = 1 hóa đơn".

Tự dựng bàn tập này để nghịch:

```sql
CREATE TABLE hd(order_id VARCHAR, khach VARCHAR, mon VARCHAR, sl INT, tien INT, ship INT);
INSERT INTO hd VALUES
  ('HD-01','An','Sua',2,60,15),
  ('HD-01','An','Banh',1,30,15),
  ('HD-02','Binh','Sua',1,30,20);
```

### Hậu quả bằng số

Sếp hỏi 3 câu, cùng một bảng đó:

| Câu hỏi | Làm đúng | Kết quả | Làm sai | Kết quả sai |
|---|---|---|---|---|
| Bán được mấy đơn? | đếm `order_id` **duy nhất** | **2** | đếm dòng | 3 |
| Doanh thu bao nhiêu? | cộng cột `tien` | **120** | — | — |
| Đơn trung bình bao nhiêu tiền? | 120 ÷ **2** | **60** | 120 ÷ 3 | **40** |

Câu 3 lệch 33%. Query chạy ngon, chart vẫn đẹp, sếp ra quyết định dựa trên số sai.

Chú ý câu 2 vẫn đúng: cột `tien` được ghi **đúng ở grain dòng-món** nên cộng thoải mái.

### Cột không thuộc grain — cái bẫy đi kèm

Thêm cột phí ship. Phí này tính **theo đơn**, không theo món:

| order_id | mon | tien | ship |
|---|---|---|---|
| HD-01 | Sữa | 60 | 15 |
| HD-01 | Bánh | 30 | **15** ← chép lại |
| HD-02 | Sữa | 30 | 20 |

`SUM(ship)` = 50. **Sai.** Thực thu chỉ 15 + 20 = **35**. Phí ship của HD-01 bị lặp 2 lần vì bảng ở grain dòng-món.

Tương tự với hạng thành viên (thuộc về **khách**):

| order_id | khach | hạng | mon |
|---|---|---|---|
| HD-01 | An | Vàng | Sữa |
| HD-01 | An | **Vàng** | Bánh |
| HD-02 | Bình | Bạc | Sữa |

Đếm dòng có chữ "Vàng" ra **2**. Nhưng khách hạng Vàng chỉ có **1** người. Cột `hạng` bị chép lại theo số món An mua.

**Quy tắc: chỉ cộng/đếm thẳng được cột nằm đúng ở grain của bảng.**

| Cột thuộc grain | Cách xử lý |
|---|---|
| Đúng grain của bảng (`tien`, `sl`) | Cộng thẳng, an toàn |
| Grain cao hơn — đơn (`ship`) | Khử trùng theo `order_id` trước |
| Grain cao hơn — khách (`hạng`) | Khử trùng theo `khach` trước |

Kiểm chứng cả 3 trường hợp bằng một query:

```sql
SELECT SUM(tien)                                   AS doanh_thu_dung,   -- 120
       SUM(ship)                                   AS ship_SAI,         -- 50
       (SELECT SUM(ship) FROM (SELECT DISTINCT order_id, ship FROM hd)) AS ship_dung,  -- 35
       ROUND(SUM(tien)*1.0/COUNT(DISTINCT order_id),1) AS aov_dung,     -- 60.0
       ROUND(SUM(tien)*1.0/COUNT(*),1)                 AS aov_SAI       -- 40.0
FROM hd;
```

### Mẹo nhận biết trong 5 giây {#meo-5-giay}

Không cần query. Lấy 2 dòng **cùng một đơn**, so từng cột:

| Cột | Dòng 1 | Dòng 2 | Giống nhau? | Kết luận |
|---|---|---|---|---|
| `order_id` | HD-01 | HD-01 | ✅ | thuộc grain **đơn** |
| `khach` | An | An | ✅ | thuộc grain **khách** |
| `hạng` | Vàng | Vàng | ✅ | thuộc grain **khách** |
| `mon` | Sữa | Bánh | ❌ | thuộc grain **dòng** |
| `sl` | 2 | 1 | ❌ | thuộc grain **dòng** |
| `tien` | 60 | 30 | ❌ | thuộc grain **dòng** |

**Cột bị chép lại giống hệt → thuộc grain cao hơn → không cộng/đếm thẳng được.**
**Cột khác nhau từng dòng → đúng grain → cộng thoải mái.**

### Cách xác định grain bằng máy

```
COUNT(*) == COUNT(DISTINCT cột)  →  cột đó là khóa, grain nằm ở mức đó
COUNT(*) >  COUNT(DISTINCT cột)  →  grain THẤP HƠN, cần thêm cột nữa mới đủ khóa
```

Thử tăng dần: 1 cột → chưa bằng thì thử cặp 2 cột → vẫn chưa thì 3.

### Áp vào Superstore

```sql
SELECT COUNT(*)                                        AS so_dong,          -- 9.994
       COUNT(DISTINCT "Order ID")                      AS don,              -- 5.009
       COUNT(DISTINCT "Product ID")                    AS san_pham,         -- 1.862
       COUNT(DISTINCT ("Order ID", "Product ID"))      AS cap_don_sanpham   -- 9.986
FROM superstore;
```

Đọc bốn con số này theo đúng thứ tự suy luận:

1. `Order ID` chỉ có 5.009 giá trị khác nhau trên 9.994 dòng → **không phải khóa**, grain thấp hơn mức đơn hàng.
2. `Product ID` có 1.862 → càng không phải khóa. Nói *"1 dòng = 1 sản phẩm"* là **sai**: một sản phẩm được bán trong nhiều đơn khác nhau nên xuất hiện ở nhiều dòng.
3. Cặp `(Order ID, Product ID)` cho 9.986 — **gần bằng** 9.994. Đây mới là khóa.

→ Grain: **1 dòng = 1 sản phẩm trong 1 đơn hàng.**

Chú ý cách viết. Câu *"1 dòng = 1 sản phẩm"* thiếu ngữ cảnh nên sai. Grain phải nêu đủ: sản phẩm đó **nằm trong đơn nào**.

Còn 8 dòng lệch (9.994 − 9.986) thì sao? Đó là 8 dòng trùng cặp — cùng đơn, cùng sản phẩm, xuất hiện 2 lần. Không làm sai grain, mà là **dữ liệu bẩn**. Việc của analyst là ghi vào mục Hạn chế và hỏi người vận hành: *"khách mua cùng sản phẩm 2 lần trong 1 đơn, hay nhập liệu bị lặp?"* — không tự ý xóa, cũng không im lặng bỏ qua.

### Bài tập 1.1

Dùng **bàn tập 3 dòng** ở trên, trả lời bằng lời, không chạy query:

1. "Trung bình mỗi **khách** chi bao nhiêu?" — tử số là gì, mẫu số là gì, ra bao nhiêu?
2. "Có bao nhiêu khách hạng Vàng?" — đếm thế nào cho đúng?
3. "Bán ra tổng cộng bao nhiêu **món hàng**?" (cột `sl`) — cộng thẳng được không, vì sao?

Rồi chuyển sang dữ liệu thật:

4. Viết grain của bảng `Invoice` và `InvoiceLine` (Chinook).
5. Tính [AOV](/glossary#aov) của Superstore — mẫu số là 9.994 hay 5.009?
6. "Trung bình mỗi khách mua bao nhiêu đơn?" — tử số, mẫu số lấy ở grain nào?

<details>
<summary>Đáp án 1.1</summary>

1. **60.** Tử số = tổng tiền 120. Mẫu số = **2 khách** (An, Bình), không phải 3 dòng — An chiếm 2 dòng nhưng vẫn là 1 khách. Chia cho 3 ra 40, con số đó không trả lời câu hỏi nào cả.
2. **1 khách.** Có 2 dòng mang giá trị "Vàng" nhưng đều là An. Phải `COUNT(DISTINCT khach)` sau khi lọc hạng, vì `hạng` thuộc grain khách chứ không thuộc grain dòng.
3. **Cộng thẳng được, ra 4 món.** Vì `sl` được ghi đúng ở grain dòng-món: mỗi dòng một giá trị riêng, không phải giá trị bị chép lại.
4. `Invoice`: 1 dòng = 1 hóa đơn (412 dòng, `InvoiceId` là khóa). `InvoiceLine`: 1 dòng = 1 track trong 1 hóa đơn. Quan hệ 1-nhiều.
5. **5.009.** AOV = 2.297.201 / 5.009 = **458,6**. Chia cho 9.994 ra 229,9 — đó là trung bình mỗi *dòng*, không phải mỗi *đơn*. Cả hai đều đúng số học, chỉ một cái đúng câu hỏi.
6. Tử số = `COUNT(DISTINCT "Order ID")` = 5.009. Mẫu số = `COUNT(DISTINCT "Customer ID")` = 793 → 6,3 đơn/khách trong 4 năm.

</details>


:::note Chốt lại
Grain là câu hỏi đầu tiên với mọi bảng, không phải câu hỏi phụ. Trả lời sai thì mọi con số sau đó sai và **không có lỗi nào báo ra**. Viết grain thành một câu đầy đủ, nêu đủ ngữ cảnh, trước khi tính bất cứ thứ gì.
:::

## 1.2 — Kiểu dữ liệu và NULL {#kieu-du-lieu-null}

**Định nghĩa.** Kiểu dữ liệu quy định giá trị nào hợp lệ và phép tính nào được phép. Công cụ **tự đoán** kiểu khi đọc file — và đoán sai thường xuyên.

### Cùng một file, hai công cụ đoán khác nhau

Đọc `superstore_utf8.csv` bằng hai công cụ, so cột `Postal Code`:

| Công cụ | Kiểu đoán ra | Kết quả |
|---|---|---|
| DuckDB `read_csv_auto` | `VARCHAR` | giữ nguyên `06824` ✅ |
| pandas `read_csv` | `int64` | thành `6824` ❌ |

Kiểm chứng:

```python
df = pd.read_csv("superstore_utf8.csv")
df["Postal Code"].astype(str).str.len().min()   # 4  -> ma chi con 4 ky tu
df.loc[df["Postal Code"].astype(str).str.len() < 5, "Postal Code"].head(3).tolist()
# [6824, 7090, 7960]
```

Mã bưu chính Mỹ luôn 5 chữ số. `6824` thật ra là **`06824`** (Fairfield, Connecticut). **Số 0 đầu đã bị nuốt mất.**

Sửa: `pd.read_csv(..., dtype={"Postal Code": str})`.

### Vì sao mất một số 0 lại nghiêm trọng

| Tình huống | Hậu quả |
|---|---|
| JOIN với bảng tra cứu mã bưu chính → bang | `6824` không khớp `06824` → dòng đó **rơi khỏi kết quả**, doanh thu vùng đó biến mất khỏi báo cáo |
| Lọc `WHERE postal_code = '06824'` | Trả 0 dòng → tưởng vùng đó không có khách |
| Xuất file cho bộ phận giao hàng | Hệ thống bưu chính từ chối định dạng |

Trường hợp đầu là nguy hiểm nhất: **không báo lỗi, chỉ âm thầm mất dòng** — cùng loại nguy hiểm với sai grain.

### Số nào cộng được, số nào không

Không phải cứ kiểu số là cộng được. Ba loại khác nhau:

| Loại | Ví dụ trong Superstore | Cộng được? | Vì sao |
|---|---|---|---|
| **Số đo** | `Sales`, `Profit`, `Quantity` | ✅ | `SUM(Profit)` = tổng lợi nhuận = 286.397, có ý nghĩa rõ |
| **Số định danh** | `Row ID`, `Postal Code` | ❌ | Cộng `Row ID` ra 49.950.015 — không trả lời câu hỏi nào |
| **Tỷ lệ** | `Discount` | ❌ | 20% + 30% = 50% là vô nghĩa |

Cách tự kiểm: *"cộng cả cột này lên ra một con số — con số đó trả lời câu hỏi kinh doanh nào?"* Không trả lời được câu nào → không cộng được.

Riêng `Discount` còn một tầng nữa: **trung bình cũng phải cẩn thận**. `AVG(Discount)` gán trọng số bằng nhau cho đơn 5$ và đơn 20.000$. Muốn đúng phải tính trung bình có trọng số theo doanh thu.

### NULL

**Định nghĩa.** NULL = "không có giá trị / không biết". Khác `0`, khác chuỗi rỗng `''`.

| Giá trị | Ý nghĩa | Ví dụ |
|---|---|---|
| `0` | Có đo, kết quả bằng không | Khách không được giảm giá → `Discount = 0` |
| `''` | Có ô, nội dung rỗng | Ghi chú để trống |
| `NULL` | Không biết / không áp dụng | 977/3.503 track Chinook không ghi tên nhạc sĩ |

**Hàm tổng hợp bỏ qua NULL.** Đây là chỗ hay sai:

```sql
-- Cot profit co 100 o NULL tren 9.994 dong
SELECT AVG(profit) FROM s;   -- chia cho 9.894, KHONG phai 9.994
```

Nếu 100 ô NULL đó thực chất là "lợi nhuận bằng 0" thì trung bình bị **thổi lên**. Muốn coi NULL là 0 phải nói rõ: `AVG(COALESCE(profit, 0))`.

Google Sheets hành xử giống hệt: `AVERAGE` của 3 ô `10 / trống / 20` ra **15**, không phải 10.

### Bài tập 1.2

1. Trong Superstore, `Discount = 0` và `Discount = NULL` khác nhau thế nào về mặt **nghiệp vụ**?
2. Chạy `DESCRIBE` bằng DuckDB, rồi đọc lại cùng file bằng pandas. Cột nào hai bên đoán khác nhau, ngoài `Postal Code`?
3. Ngoài `Row ID`, `Postal Code`, `Discount` — còn cột nào trong Superstore mà cộng lên thì vô nghĩa không? Giải thích.

<details>
<summary>Đáp án 1.2</summary>

1. `0` = đơn này **thực sự không có** chiết khấu. `NULL` = **không biết** đơn này có chiết khấu hay không. Khi tính "chiết khấu trung bình": NULL bị loại khỏi mẫu số, còn 0 thì được tính vào → hai kết quả khác nhau. Trước khi xử lý phải hỏi: dữ liệu thiếu vì lý do gì?
2. `Order Date` và `Ship Date`: DuckDB nhận ra là `DATE`, pandas để `str` nếu không truyền `parse_dates=[...]`. Hậu quả: sắp xếp theo ngày sẽ ra thứ tự chữ cái — `1/10/2015` đứng trước `2/1/2014`.
3. Không còn cột số nào khác. Nhưng `Customer ID` và `Product ID` cũng là **mã định danh** — ở đây may mắn được lưu dạng text nên không ai cộng nhầm. Trong nhiều dataset khác, ID lưu dạng số và đó là bẫy quen thuộc.

</details>


:::note Chốt lại
Công cụ **đoán** kiểu dữ liệu, và đoán sai thường xuyên — cùng một file, DuckDB và pandas cho hai kết quả khác nhau. Luôn soát lại `dtypes` trước khi phân tích. Và nhớ: không phải cứ kiểu số là cộng được — số định danh và tỷ lệ thì không.
:::

## 1.3 — Mean vs [Median](/glossary#median): câu phỏng vấn xuất hiện nhiều nhất {#mean-median}

**Định nghĩa.** Mean = tổng ÷ số lượng. Median = giá trị đứng giữa khi đã sắp xếp. Mean bị giá trị cực đoan kéo, median thì không.

### Bàn tập lương 5 người

Một phòng ban 5 người, lương (triệu/tháng):

```
10   11   12   13   300
```

Người thứ 5 là giám đốc. Đoán trước hai con số rồi tính:

```python
mean   = (10+11+12+13+300) / 5 = 69,2
median = 12          (gia tri dung giua khi sap xep)
```

**Không ai trong phòng có lương gần 69,2.** Bốn người dưới 14, một người 300. Mean rơi vào khoảng trống không có ai.

Giờ hình dung tin tuyển dụng ghi *"lương trung bình phòng 69 triệu"*. Không sai về số học. Nhưng ứng viên vào làm sẽ nhận 10–13.

### Vì sao chuyện này quan trọng với dữ liệu doanh thu

Doanh thu, thu nhập, thời gian chờ — gần như **luôn lệch phải**: rất nhiều giá trị nhỏ, vài giá trị rất lớn. Đúng hình dạng của bàn tập lương trên.

Superstore, cột `Sales`:

| Chỉ số | Giá trị |
|---|---|
| mean | **229,86** |
| median | **54,49** |
| SD | 623,25 |
| min | 0,44 |
| Q1 | 17,28 |
| Q3 | 209,94 |
| max | 22.638,48 |

Mean gấp **4,2 lần** median. Nửa số dòng có giá trị dưới 55$, nhưng mean nói 230$.

**Cách kiểm nhanh độ lệch:** so mean với median.

| Quan hệ | Hình dạng | Nên báo cáo bằng |
|---|---|---|
| mean ≈ median | đối xứng | mean được |
| mean > median | **lệch phải** (đuôi dài bên phải) | median + P90 |
| mean < median | lệch trái | median |

### Cách nói đúng trong báo cáo

❌ *"Giá trị trung bình mỗi dòng bán hàng là 230$."*

✅ *"Phân phối lệch phải mạnh — median 54$, mean 230$. Phần lớn giao dịch nhỏ, doanh thu tập trung ở nhóm ít giao dịch giá trị cao. Nên theo dõi bằng median kèm P90, và tách riêng nhóm đơn lớn để phân tích."*

### Khi nào mean lại tốt hơn

Mean không phải lúc nào cũng xấu:

| Tình huống | Dùng | Vì sao |
|---|---|---|
| Cần cộng dồn / lập ngân sách | **mean** | `mean × số đơn = tổng doanh thu`. Median không có tính chất này |
| Mô tả "khách điển hình" | **median** | không bị vài đơn lớn kéo |
| Dữ liệu đối xứng, ít [outlier](/glossary#outlier) | mean | đơn giản, quen thuộc |
| So sánh giữa các nhóm lệch | **median** hoặc cả hai | tránh kết luận ngược |

### Bài tập 1.3

Trên bàn tập lương:

1. Nếu giám đốc tăng lương từ 300 lên 600, mean đổi bao nhiêu? Median đổi bao nhiêu?
2. Thêm 1 nhân viên lương 11 vào phòng. Median mới là bao nhiêu?

Trên Superstore:

3. Tính mean và median của `Profit`. Dấu của chúng nói lên điều gì?
4. Sếp hỏi *"đơn hàng điển hình của mình đáng bao nhiêu tiền?"* — trả lời bằng con số nào, kèm câu giải thích 2 dòng?

<details>
<summary>Đáp án 1.3</summary>

1. Mean tăng từ 69,2 lên **129,2** (+60). Median **không đổi**, vẫn 12. Đó chính là ý nghĩa của "median không bị outlier kéo" — thay đổi ở đuôi không ảnh hưởng giá trị giữa.
2. Sáu người: `10, 11, 11, 12, 13, 300`. Median = trung bình 2 giá trị giữa = (11+12)/2 = **11,5**.
3. `Profit` có cả giá trị âm (đơn lỗ). Median dương trong khi vẫn tồn tại đuôi âm dài → phần lớn giao dịch lãi nhỏ, một số ít lỗ rất nặng kéo mean xuống. Nếu chỉ báo mean sẽ che mất chuyện "đa số đơn vẫn có lãi".
4. **458,6$** — nhưng đó là AOV (doanh thu ÷ số đơn duy nhất), không phải mean của cột `Sales`. Câu trả lời đầy đủ: *"Giá trị trung bình một đơn hàng là 458$. Tuy nhiên phân phối rất lệch: nửa số dòng bán hàng dưới 55$, trong khi đơn lớn nhất tới 22.638$. Nên xem thêm median và nhóm đơn lớn riêng."* Chú ý câu này dùng đúng grain — nếu trả lời 229,9$ là đã nhầm sang grain dòng.

</details>


:::note Chốt lại
So mean với median là cách kiểm độ lệch rẻ nhất. Chênh nhiều = phân phối lệch = **mean không đại diện cho cái điển hình**. Với dữ liệu doanh thu, mặc định báo median kèm P90; dùng mean khi cần cộng dồn.
:::

## 1.4 — Outlier và quy tắc IQR {#iqr-outlier}

**Định nghĩa.** IQR = Q3 − Q1, đo độ phân tán của **phần giữa** dữ liệu. Ngưỡng ngoại lai: ngoài khoảng `[Q1 − 1,5×IQR ; Q3 + 1,5×IQR]`. Đây là **quy ước**, không phải chân lý.

### Bàn tập 8 số

Thời gian xử lý đơn hàng (phút):

```
12   15   14   13   16   15   14   90
```

Bảy đơn quanh 12–16 phút, một đơn **90 phút**. Tính tay:

```
Q1  = 13,75        Q3 = 15,25        IQR = 1,50
Nguong duoi = 13,75 - 1,5x1,50 = 11,50
Nguong tren = 15,25 + 1,5x1,50 = 17,50
-> 90 vuot nguong  ->  bi gan co outlier
```

Ảnh hưởng của một điểm đó lên các chỉ số:

| Chỉ số | Có outlier | Bỏ outlier | Chênh |
|---|---|---|---|
| mean | **23,6** | 14,1 | 67% |
| median | 14,5 | 14,5 | **0%** |

Một điểm duy nhất kéo mean lên 67%. Median không nhúc nhích. Đây là lý do §1.3 tồn tại.

### Nhưng đừng vội xóa

Câu hỏi đúng không phải *"loại hay giữ?"* mà là **"90 phút đó là cái gì?"**:

| Nếu là | Thì |
|---|---|
| Lỗi nhập liệu (gõ nhầm 9 thành 90) | **Sửa hoặc loại**, ghi lại |
| Đơn hàng đặc biệt (hàng cồng kềnh, giao tỉnh xa) | **Giữ** — đây là thực tế kinh doanh |
| Sự cố hệ thống hôm đó | **Giữ**, và đó chính là phát hiện đáng báo cáo |

**Nguyên tắc: chỉ loại khi chứng minh được là lỗi.** Ngày 2099, giá âm, số lượng 99.999, khách tên "test" — loại được. "Nhìn xấu trên biểu đồ" — không phải lý do.

### Áp lên Superstore

```
Q1 = 17,28      Q3 = 209,94      IQR = 192,66
Nguong tren = 209,94 + 1,5 x 192,66 = 498,93
So dong vuot nguong: 1.167  =  11,7% du lieu
```

**11,7% là quá nhiều để gọi là "bất thường".** Nếu hơn 1/10 dữ liệu bị gắn cờ ngoại lai thì vấn đề không nằm ở dữ liệu, mà nằm ở **quy tắc**.

Vì sao? Quy tắc 1,5×IQR được thiết kế cho phân phối gần chuẩn. Doanh thu lệch phải mạnh nên quy tắc này gắn cờ quá tay.

Kết luận đúng: *"Phân phối lệch phải là đặc tính tự nhiên của doanh thu, không phải lỗi. Giữ toàn bộ dữ liệu, đổi cách báo cáo sang median + P90. Nếu cần tách nhóm giá trị lớn thì dùng **ngưỡng nghiệp vụ** (ví dụ đơn > 5.000$ = nhóm B2B) chứ không dùng ngưỡng IQR."*

### Ba cách xử lý outlier

| Cách | Khi nào | Rủi ro |
|---|---|---|
| **Giữ nguyên** | Dữ liệu thật, phản ánh thực tế | Chỉ số trung bình bị kéo |
| **Loại bỏ** | Chứng minh được là lỗi | Mất thông tin nếu đoán sai |
| **Tách nhóm** | Nhóm lớn có hành vi khác hẳn | Phải giải thích tiêu chí tách |

Cách thứ ba thường tốt nhất trong thực tế: không xóa, không trộn, mà **phân tích riêng** — "đơn bán lẻ" và "đơn doanh nghiệp" là hai câu chuyện khác nhau.

### Bài tập 1.4

Trên bàn tập 8 số:

1. Thêm một đơn 100 phút nữa. Ngưỡng IQR có đổi không? Vì sao?
2. Nếu 6/8 đơn đều trên 60 phút thì quy tắc IQR còn gắn cờ 90 không?

Trên Superstore:

3. Tính ngưỡng IQR cho `Profit`, đếm outlier **hai phía**. Phía nào nhiều hơn, nói lên điều gì?
4. Mở 10 dòng `Sales` lớn nhất. Chúng là lỗi hay đơn thật? Căn cứ vào đâu?
5. Viết 3 câu quyết định giữ/loại, giọng đưa cho sếp đọc.

<details>
<summary>Đáp án 1.4</summary>

1. Ngưỡng **gần như không đổi** (Q1, Q3 chỉ dịch nhẹ) vì IQR dựa trên phân vị, không dựa trên giá trị cực đoan. Đây là ưu điểm của IQR so với "mean ± 3×SD" — cách sau bị chính outlier làm hỏng ngưỡng.
2. **Không.** Nếu phần lớn đơn đều 60–90 phút thì Q1, Q3 dịch lên theo, 90 nằm trong khoảng bình thường. Outlier là khái niệm **tương đối so với phần còn lại**, không phải ngưỡng tuyệt đối.
3. Chạy trên dữ liệu. Điểm cần thấy: `Profit` có outlier **cả hai phía** — đơn lãi rất lớn và đơn lỗ rất nặng. Phía âm đáng chú ý hơn vì đó là tiền đang mất, và đó là đầu mối dẫn tới phát hiện về `Tables` (lỗ 17.725) và chiết khấu ≥30%.
4. Kiểm tra: `Quantity` có hợp lý không · `Product Name` có phải hàng đắt tiền thật không (máy photocopy, tủ) · khách thuộc segment Corporate/Home Office không. Số lượng và loại hàng khớp nhau → đơn thật.
5. *"Giữ toàn bộ 1.167 điểm vượt ngưỡng IQR. Kiểm tra 10 giá trị lớn nhất cho thấy đều là thiết bị văn phòng giá cao mua với số lượng hợp lý, không có dấu hiệu lỗi nhập liệu. Do phân phối lệch phải, tôi báo cáo bằng median kèm P90 thay vì mean, và tách riêng nhóm đơn trên 5.000$ để theo dõi vì nhóm này chiếm phần lớn biến động doanh thu."*

</details>


:::note Chốt lại
Quy tắc 1,5×IQR là **quy ước**, không phải chân lý — nó gắn cờ 11,7% dữ liệu Superstore. Khi quá nhiều điểm bị gắn cờ thì vấn đề nằm ở quy tắc, không ở dữ liệu. Chỉ loại outlier khi **chứng minh được là lỗi**; còn lại thì tách nhóm phân tích riêng.
:::

## 1.5 — Tương quan và bẫy nhân quả {#tuong-quan}

**Định nghĩa.** Hệ số tương quan r ∈ [−1, 1] đo mức độ hai biến **số** đi cùng nhau theo quan hệ **tuyến tính**. Chữ "tuyến tính" là chỗ hầu hết người mới bỏ qua, và nó gây ra sai lầm lớn nhất.

### Bàn tập — r thấp nhưng quan hệ rất mạnh

Hiệu suất làm việc theo số giờ làm liên tục trong ngày:

| Giờ thứ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Hiệu suất | 30 | 55 | 75 | 88 | 90 | 86 | 70 | 45 |

Nhìn dãy số: tăng mạnh tới giờ thứ 5 rồi giảm mạnh — quan hệ **rõ như ban ngày**.

Tính hệ số tương quan:

```python
np.corrcoef(gio, hieu_suat)[0,1]    # 0.284
```

**r = 0,284.** Theo quy ước thì đó là "tương quan yếu, gần như không liên quan". Sai hoàn toàn.

Tách làm hai nửa:

```
Nua dau (gio 1-4):  r = +0,991
Nua sau (gio 5-8):  r = -0,955
```

Cả hai nửa đều **gần như hoàn hảo**, chỉ là ngược chiều nhau nên triệt tiêu khi tính chung.

**Bài học 1: r thấp KHÔNG có nghĩa là không có quan hệ.** Nó chỉ có nghĩa là *không có quan hệ tuyến tính*. Luôn vẽ scatter trước khi tin hệ số.

### Áp lên Superstore — cùng một bẫy

`corr(Discount, Profit)` = **−0,219**. Nhìn qua: "yếu, chắc không quan trọng".

Cắt theo mức chiết khấu:

| Discount | Số dòng | Lợi nhuận TB |
|---|---|---|
| 0% | 4.798 | **+66,9** |
| 10% | 94 | +96,1 |
| 15% | 52 | +27,3 |
| 20% | 3.657 | +24,7 |
| 30% | 227 | **−45,7** |
| 32% | 27 | −88,6 |
| 40% | 206 | **−111,9** |
| 45% | 11 | −226,6 |

Quan hệ **có ngưỡng**: dưới 20% vẫn lãi, từ 30% trở lên lỗ. Đó là dạng phi tuyến mà r không bắt được — y hệt bàn tập hiệu suất.

### Bài học 2: có quan hệ vẫn chưa phải nhân quả

Ngay cả khi đã thấy rõ ngưỡng 30%, **vẫn chưa được kết luận "chiết khấu gây lỗ"**.

Biến ẩn khả dĩ: **loại mặt hàng**. Furniture có biên lợi nhuận chỉ 2,5% (so với Technology 17,4%) và cũng là nhóm hay bị giảm giá sâu để đẩy hàng tồn.

```
Hang kho ban  ──►  bien loi nhuan von da thap  ──►  LO
      │
      └──────────►  hay bi chiet khau sau     ──►  CHIET KHAU CAO
```

Chiết khấu và lỗ có thể **cùng là hậu quả** của "hàng khó bán", chứ không phải cái này gây ra cái kia. Biến gây nhiễu đó gọi là **[confounder](/glossary#confounder)**.

### Ba câu hỏi trước khi nói "A gây ra B"

1. **Có biến thứ ba nào tác động lên cả hai không?** (confounder)
2. **Chiều ngược lại có hợp lý không?** — biết đâu lỗ mới dẫn tới chiết khấu (hàng ế → giảm giá), chứ không phải ngược lại
3. **Có cách nào kiểm chứng bằng thí nghiệm không?** — chỉ ngẫu nhiên hóa mới cho phép nói nhân quả (xem [L5](/ly-thuyet/l5-stats#p-value))

### Cách viết kết luận đúng

❌ *"Chiết khấu cao gây lỗ. Đề xuất bỏ chiết khấu."*

✅ *"Có liên hệ rõ giữa mức chiết khấu và lợi nhuận: từ ngưỡng 30% trở lên, lợi nhuận trung bình mỗi dòng chuyển sang âm (−45,7$ ở mức 30%, −111,9$ ở mức 40%), nhất quán qua 4 mức chiết khấu trên 471 dòng. Chưa thể khẳng định quan hệ nhân quả vì loại mặt hàng có thể là biến gây nhiễu — nhóm biên lợi nhuận thấp cũng chính là nhóm hay được giảm giá sâu. Đề xuất kiểm chứng bằng thử nghiệm có kiểm soát trên một nhóm sản phẩm."*

### Bài tập 1.5

1. Trên bàn tập hiệu suất: nếu chỉ lấy dữ liệu giờ 1–4 rồi kết luận "làm càng lâu càng hiệu quả", sai ở đâu?
2. Tính `corr(Sales, Profit)` và `corr(Quantity, Profit)` trên Superstore. Giải thích dấu và độ lớn.
3. Tìm 1 cặp biến trong Superstore có tương quan nhưng **chắc chắn** không nhân quả.
4. Viết lại kết luận về Discount mà **không dùng** các từ "gây ra", "khiến cho", "dẫn đến".

<details>
<summary>Đáp án 1.5</summary>

1. Sai vì **ngoại suy ra ngoài khoảng dữ liệu**. Trong khoảng 1–4 giờ thì kết luận đúng, nhưng áp cho giờ thứ 8 thì ngược hoàn toàn. Đây là lỗi rất hay gặp: lấy một đoạn của quan hệ phi tuyến rồi khái quát thành quy luật chung.
2. `corr(Sales, Profit)` dương nhưng không sát 1 — vì có đơn doanh thu cao mà vẫn lỗ (chiết khấu sâu). `corr(Quantity, Profit)` rất yếu — bán nhiều không đồng nghĩa lãi nhiều; đơn giá và chiết khấu mới quyết định.
3. `Ship Date` và `Order Date` tương quan gần như hoàn hảo — nhưng là quan hệ **định nghĩa** (ship luôn sau order), không phải nhân quả kinh doanh. Hoặc: doanh thu theo tháng và số đơn theo tháng — cả hai cùng bị chi phối bởi mùa vụ.
4. Xem đoạn "Cách viết kết luận đúng" ở trên. Điểm mấu chốt: mô tả **cái quan sát được** (số liệu theo nhóm, [cỡ mẫu](/glossary#sample-size), mức nhất quán), nêu **biến gây nhiễu khả dĩ**, rồi đề xuất **cách kiểm chứng** — thay vì tuyên bố nhân quả.

</details>


:::note Chốt lại
Hệ số r chỉ bắt quan hệ **tuyến tính** — r = 0,284 vẫn có thể che một quan hệ gần như hoàn hảo. Luôn vẽ chart và cắt nhóm trước khi tin hệ số. Và kể cả khi quan hệ đã rõ, vẫn phải nêu biến gây nhiễu trước khi nói tới nhân quả.
:::

## 1.6 — Chọn đúng loại chart {#chon-chart}

**Định nghĩa.** Chart không chọn theo thẩm mỹ mà theo **loại câu hỏi**. Sai loại chart = người đọc phải tự dịch trong đầu, và họ sẽ dịch sai.

### Cùng một dữ liệu, ba cách vẽ

Doanh thu 4 vùng: West 250, East 213, Central 147, South 123.

| Cách vẽ | Người đọc thấy gì | Đánh giá |
|---|---|---|
| **Bar ngang, sắp giảm dần** | Thứ hạng rõ ràng, so sánh độ dài dễ | ✅ đúng |
| **Pie chart** | Phải so diện tích các múi — mắt người rất kém việc này | ❌ tránh |
| **Line chart** | Ngụ ý có xu hướng theo thứ tự — nhưng vùng không có thứ tự tự nhiên | ❌ sai khái niệm |

Line chart chỉ dùng khi trục X có **thứ tự tự nhiên** (thời gian). Vùng miền không có thứ tự — nối chúng bằng đường là bịa ra một xu hướng không tồn tại.

### Bảng tra: câu hỏi → chart

| Câu hỏi | Chart | Ví dụ Superstore | Lỗi hay gặp |
|---|---|---|---|
| Thay đổi theo thời gian? | **Line** | doanh thu 48 tháng | dùng bar cho 48 điểm → rối |
| So sánh giữa hạng mục? | **Bar** (ngang nếu nhãn dài) | 17 sub-category | trục Y không từ 0 |
| Phân phối một biến? | **Histogram / Box** | `Sales` | dùng bar → sai khái niệm |
| Quan hệ hai biến số? | **Scatter** | `Discount` vs `Profit` | nối các điểm bằng đường |
| Cấu phần trong tổng? | **Stacked bar** | category qua 4 năm | pie quá 5 lát |
| Một con số then chốt? | **Card + % so kỳ trước** | doanh thu YTD | card không có mốc so sánh |
| Hai chiều cùng lúc? | **Heatmap** | region × tháng | quá nhiều màu |

### Ba lỗi cấm

**1. Bar chart trục Y không bắt đầu từ 0.**

Doanh thu 2 vùng: 250 và 213 (chênh 17%). Vẽ trục Y từ 200 → cột 250 trông **cao gấp 4 lần** cột 213. Cùng dữ liệu, cùng "đúng sự thật", nhưng người xem rút ra kết luận sai hoàn toàn.

Line chart thì **được phép** cắt trục — vì line đọc theo độ dốc, không đọc theo chiều cao cột.

**2. Pie chart quá 5 lát.** Mắt người so được độ dài, so rất kém diện tích và góc. 17 sub-category vẽ pie = 17 múi không ai đọc nổi. Dùng bar sắp giảm dần.

**3. Hai trục Y khác thang không ghi rõ.** Với hai trục tự do, có thể làm bất kỳ hai đường nào trông như "đi cùng nhau". Đây là cách tạo tương quan giả bằng đồ họa.

### Tiêu đề chart là câu kết luận

❌ *"Doanh thu theo Category"* — đó là nhãn, người đọc phải tự tìm ý nghĩa.

✅ *"Furniture chiếm 32% doanh thu nhưng chỉ 6% lợi nhuận"* — người đọc nhận thông điệp ngay.

Quy tắc: **đọc tiêu đề là biết chart nói gì, không cần nhìn chart.** Chart chỉ để chứng minh.

### Bài tập 1.6

Chọn chart cho 6 câu hỏi, ghi lý do 1 dòng:

a) Tháng nào doanh thu cao nhất năm 2017?
b) Region nào lãi nhất?
c) Đơn hàng thường có giá trị bao nhiêu?
d) Giảm giá nhiều có lãi hơn không?
e) Tỷ trọng 3 category thay đổi qua các năm?
f) Tháng này so tháng trước tăng bao nhiêu %?

Rồi:

g) Viết lại tiêu đề cho chart (b) và (d) theo kiểu "tiêu đề là kết luận".

<details>
<summary>Đáp án 1.6</summary>

a) **Line** (12 điểm theo thời gian). Bar cũng chấp nhận được nếu muốn nhấn so sánh từng tháng, nhưng line thể hiện xu hướng tốt hơn.
b) **Bar ngang sắp giảm dần** — 4 hạng mục, không có thứ tự tự nhiên.
c) **Histogram + box plot.** Phải thấy được độ lệch phải, và đây là chỗ mean/median chênh nhau 4,2 lần.
d) **Scatter** `Discount` vs `Profit`, **tô màu theo Category** — màu sẽ lộ ra biến gây nhiễu (§1.5).
e) **100% stacked bar** theo năm nếu quan tâm tỷ trọng; **stacked bar thường** nếu quan tâm cả quy mô tuyệt đối. Nói rõ mình chọn cái nào và vì sao.
f) **Card lớn + delta %** kèm mũi tên. Không cần chart. Chú ý: nếu tháng trước bằng 0 thì hiện "—", không hiện ∞ (xem §1.7).
g) (b) *"West dẫn đầu lợi nhuận với 108K$, gấp 2,4 lần South"* — (d) *"Từ mức chiết khấu 30%, lợi nhuận trung bình chuyển sang âm"*.

</details>


:::note Chốt lại
Chart chọn theo **loại câu hỏi**, không theo thẩm mỹ. Dùng sai loại là bắt người đọc tự dịch, và họ sẽ dịch sai. Tiêu đề chart phải là câu kết luận có số — đọc tiêu đề là hiểu, không cần nhìn chart.
:::

## 1.7 — Pivot table và tăng trưởng MoM {#pivot-mom}

**Định nghĩa.** Pivot table = gom nhóm dữ liệu theo 1–2 chiều rồi tính tổng hợp. Chính là `GROUP BY` phiên bản kéo thả. MoM growth = `(kỳ này − kỳ trước) / kỳ trước`.

### Bàn tập 3 tháng — bẫy nền nhỏ

Doanh thu (triệu): **T1 = 100 · T2 = 10 · T3 = 30**

Tính MoM:

```
T2:  (10 - 100) / 100  =  -90%
T3:  (30 -  10) /  10  = +200%
```

Báo cáo ghi *"tháng 3 tăng trưởng 200%"*. Nghe như bùng nổ.

Sự thật: tháng 3 vẫn chỉ bằng **30% của tháng 1**. Doanh thu đang ở mức thấp, chỉ là hồi phục nhẹ từ đáy.

**Quy tắc: % tăng trưởng trên nền nhỏ luôn phải kèm số tuyệt đối.**

❌ *"Tháng 3 tăng 200%"*
✅ *"Tháng 3 đạt 30 triệu, tăng 200% so tháng 2 (10 triệu) nhưng vẫn thấp hơn 70% so tháng 1 (100 triệu)"*

### Ba bẫy MoM

| Bẫy | Ví dụ | Cách tránh |
|---|---|---|
| **Nền nhỏ** | 10 → 30 = +200% | luôn kèm số tuyệt đối |
| **Chia cho 0** | tháng trước = 0 | `IFERROR(...)` / `NULLIF(prev, 0)` → hiện "—", không hiện 0% hay ∞ |
| **Mùa vụ** | tháng 2 luôn thấp vì Tết | dùng **YoY** thay vì MoM cho ngành có mùa vụ |

### Áp lên Superstore, năm 2017

| Tháng | Doanh thu | Số đơn | MoM |
|---|---|---|---|
| 2017-01 | 43.971 | 69 | — |
| 2017-02 | 20.301 | 53 | **−53,8%** |
| 2017-03 | 58.872 | 118 | **+190,0%** |
| 2017-04 | 36.522 | 116 | −38,0% |

Đọc như một analyst, không chỉ đọc số:

- Tháng 3 tăng 190% — nhưng nền tháng 2 thấp bất thường (53 đơn, thấp nhất) nên con số bị thổi phồng
- Số đơn tăng 2,2× (53 → 118) trong khi doanh thu tăng 2,9× → **giá trị đơn trung bình cũng tăng**, không chỉ tăng số lượng
- Tháng 4 giảm 38% nhưng số đơn gần như không đổi (118 → 116) → **giảm do giá trị đơn**, không phải do mất khách

Ba nhận xét trên đến từ việc **nhìn hai cột cùng lúc** (doanh thu và số đơn), không phải nhìn riêng cột MoM. Đó là khác biệt giữa đọc báo cáo và phân tích báo cáo.

### Bẫy tỷ số trong pivot

Thêm cột `profit_margin` vào pivot. Có hai cách tính, chỉ một cách đúng:

| Cách | Công thức | Đúng/Sai |
|---|---|---|
| Tỷ số của các tổng | `SUM(Profit) / SUM(Sales)` | ✅ |
| Trung bình của các tỷ số | `AVERAGE(margin từng dòng)` | ❌ |

Vì sao cách 2 sai: nó gán trọng số **bằng nhau** cho đơn 5$ và đơn 20.000$. Một đơn nhỏ lãi 100% sẽ kéo margin trung bình lên như thể nó quan trọng ngang đơn lớn.

Đây là cùng một chuyện với measure non-additive ở [L3 §3.4](/ly-thuyet/l3-bi#filter-context), và là câu phỏng vấn hay gặp.

### Bài tập 1.7

1. Trên bàn tập 3 tháng: viết một câu báo cáo về tháng 3 mà **không gây hiểu nhầm**.
2. Tháng 4 doanh thu 0, tháng 5 doanh thu 20. MoM tháng 5 bằng bao nhiêu? Hiển thị thế nào trên báo cáo?
3. Dựng pivot Superstore: dòng = tháng, cột = Region, giá trị = Sales, năm 2017.
4. Thêm cột MoM cho tổng, xử lý chia 0.
5. Thêm measure `Profit` và cột `profit_margin`. Kiểm chứng hai cách tính margin cho ra số khác nhau — chênh bao nhiêu?

<details>
<summary>Đáp án 1.7</summary>

1. *"Tháng 3 đạt 30 triệu, hồi phục từ đáy tháng 2 (10 triệu) nhưng vẫn thấp hơn 70% so với tháng 1 (100 triệu). Xu hướng 3 tháng vẫn là giảm."*
2. Không tính được — chia cho 0. Hiển thị **"—"** hoặc "n/a", kèm chú thích "tháng trước không có doanh thu". Tuyệt đối không hiện 0%, cũng không hiện ∞ hay một con số rất lớn. Nhiều dashboard hiển thị `+∞%` và làm người đọc hoảng.
3. Pivot 2 chiều tiêu chuẩn — dòng tháng, cột region, giá trị `SUM(Sales)`.
4. `IFERROR((tháng này − tháng trước)/tháng trước, "—")` trong Sheets; `NULLIF(prev, 0)` trong SQL.
5. Hai cách sẽ lệch nhau vài điểm phần trăm. Cách đúng là tỷ số của tổng. Trên toàn Superstore: `SUM(Profit)/SUM(Sales)` = 286.397/2.297.201 = **12,5%**. Trung bình các margin từng dòng sẽ ra con số khác vì đơn nhỏ có margin cực đoan (cả rất cao lẫn rất âm) được tính ngang hàng với đơn lớn.

</details>


:::note Chốt lại
Phần trăm tăng trưởng trên nền nhỏ luôn phải kèm **số tuyệt đối** — +200% có thể vẫn đang thấp hơn cùng kỳ 70%. Và tỷ số trong pivot phải tính bằng `SUM(tử)/SUM(mẫu)`, không bao giờ lấy trung bình của các tỷ số.
:::

## 1.8 — Đọc một dataset lạ trong 15 phút {#doc-dataset-la}

Quy trình áp dụng cho **mọi** dataset. Làm đúng thứ tự, đừng nhảy cóc.

| # | Bước | Câu hỏi | Lệnh |
|---|---|---|---|
| 1 | Kích thước | Bao nhiêu dòng, bao nhiêu cột? | `SELECT COUNT(*) FROM s;` |
| 2 | **Grain** | 1 dòng là cái gì? Viết thành câu | §1.1 |
| 3 | Khóa | Cột nào duy nhất? Cột nào lặp? | `COUNT(*)` vs `COUNT(DISTINCT ...)` |
| 4 | Thời gian | Từ ngày nào đến ngày nào? Có lỗ hổng tháng nào? | `MIN/MAX(ngay)` |
| 5 | Thiếu | Mỗi cột thiếu bao nhiêu %? | `COUNT(*) - COUNT(cot)` |
| 6 | Phân loại | Mỗi cột text có bao nhiêu giá trị? Có giá trị lạ? | `COUNT(DISTINCT)`, xem `value_counts` |
| 7 | Số | min/median/max mỗi cột số. Có số âm? Có 0 bất thường? | `DESCRIBE`, `QUANTILE` |
| 8 | Trùng | Có dòng trùng hoàn toàn? Trùng theo khóa nghiệp vụ? | §1.1 |
| 9 | **Giới hạn** | Dataset này **không** trả lời được câu nào? | tự nghĩ |

### Bước 9 là bước phân biệt analyst với người dùng công cụ

Tám bước đầu là kỹ thuật, ai cũng làm được. Bước 9 mới là phần khó và là phần được trả lương.

**Cách làm:** nhìn danh sách cột rồi hỏi ngược — *thiếu cái gì?*

Superstore có 21 cột. Những thứ **không có**:

| Thiếu | Nên không trả lời được câu hỏi |
|---|---|
| Giá vốn thật (chỉ có `Profit` tính sẵn) | "Nếu đàm phán giảm giá nhập 5% thì lợi nhuận đổi thế nào?" |
| Dữ liệu marketing (chi phí, kênh) | "Kênh nào hiệu quả nhất? ROI bao nhiêu?" |
| Hành vi trước khi mua | "Vì sao khách bỏ giỏ hàng?" |
| Thông tin đối thủ, giá thị trường | "Giá của mình có cạnh tranh không?" |
| Lý do trả hàng | "Vì sao nhóm hàng này hay bị hoàn?" |
| Chi phí vận hành, lương | "Cửa hàng này thực sự lãi hay lỗ?" |

Nêu được bảng này trong buổi phỏng vấn hoặc trong README đáng giá hơn nhiều so với thêm một biểu đồ.

### Vì sao bước 9 quan trọng đến vậy

Sếp hỏi *"vì sao doanh thu giảm?"*. Dữ liệu chỉ có đơn hàng. Có hai kiểu trả lời:

❌ Người mới: đào dữ liệu, tìm ra "giảm mạnh nhất ở Furniture vùng South", trình bày như thể đó là **nguyên nhân**.

✅ Analyst: *"Dữ liệu cho thấy phần giảm tập trung ở Furniture vùng South (−23%). Nhưng dữ liệu hiện có **không** cho biết vì sao — không có dữ liệu marketing, giá đối thủ, hay phản hồi khách. Để trả lời câu 'vì sao', cần thêm A và B. Trong lúc chờ, giả thuyết khả dĩ nhất là X, kiểm chứng bằng cách Y."*

Câu thứ hai nói ít hơn về dữ liệu nhưng cho sếp nhiều thông tin hơn để quyết định.

### Bài tập 1.8

1. Chạy đủ 9 bước trên Superstore, ghi vào `notes/w1-data-basics.md`.
2. Làm lại 9 bước với một bảng Chinook bất kỳ (gợi ý: `Invoice` hoặc `Track`).
3. Với Chinook, viết 3 câu hỏi kinh doanh mà dataset **không** trả lời được, kèm lý do thiếu dữ liệu gì.

<details>
<summary>Gợi ý câu 3</summary>

Chinook là cửa hàng nhạc số. Những thứ không có: chi phí bản quyền cho mỗi track (nên không tính được lợi nhuận thật) · hành vi nghe thử trước khi mua · lý do khách ngừng mua · dữ liệu khách hàng tiềm năng chưa mua lần nào · thời điểm nhân viên hỗ trợ tiếp xúc khách.

Một câu hỏi đắt giá mà Chinook **không** trả lời được: *"Bán 1 track thì thực sự lãi bao nhiêu?"* — vì `UnitPrice` là giá bán, không có giá vốn. Đây cũng là giới hạn của Superstore, nhưng ở Superstore người ta hay quên vì đã có sẵn cột `Profit` trông như thật.

</details>


:::note Chốt lại
Tám bước đầu là kỹ thuật, ai cũng làm được. **Bước 9 — dữ liệu này không trả lời được gì — mới là phần được trả lương.** Nêu được giới hạn trước khi bị hỏi là dấu hiệu của người hiểu dữ liệu của mình.
:::

## Lệnh tự kiểm chứng mọi con số trong file này

CSV Superstore gốc mã hóa Windows-1252, **không phải UTF-8** → phải chuyển trước, nếu không DuckDB báo lỗi ở dòng 13:

```bash
cd ~/Documents/Study/DA/da-portfolio/data
iconv -f WINDOWS-1252 -t UTF-8 superstore.csv > superstore_utf8.csv

duckdb -box -c "
CREATE TABLE s AS SELECT * FROM read_csv_auto('superstore_utf8.csv');
-- 1.1 grain
SELECT COUNT(*) rows, COUNT(DISTINCT \"Order ID\") orders, COUNT(DISTINCT \"Customer ID\") customers FROM s;
-- 1.3 mean vs median
SELECT ROUND(AVG(Sales),2) mean, ROUND(MEDIAN(Sales),2) median, ROUND(STDDEV(Sales),2) sd FROM s;
-- 1.4 IQR
SELECT ROUND(QUANTILE_CONT(Sales,0.25),2) q1, ROUND(QUANTILE_CONT(Sales,0.75),2) q3 FROM s;
-- 1.5 tuong quan + cat nhom
SELECT ROUND(CORR(Discount, Profit),3) r FROM s;
SELECT Discount, COUNT(*) n, ROUND(AVG(Profit),1) avg_profit FROM s GROUP BY 1 ORDER BY 1;
-- 1.7 MoM
SELECT strftime(\"Order Date\",'%Y-%m') ym, ROUND(SUM(Sales),0) sales, COUNT(DISTINCT \"Order ID\") orders
FROM s WHERE YEAR(\"Order Date\")=2017 GROUP BY 1 ORDER BY 1;
"
```

Dùng DuckDB để **kiểm tra lại** kết quả làm trên Google Sheets. Hai công cụ ra khác nhau → tìm ra chỗ mình hiểu sai. Đây là cách học nhanh nhất ở giai đoạn này.

---

## Checklist tự chấm trước khi sang Stage 2

- [ ] Nói được grain của Superstore và hậu quả nếu đếm sai — không nhìn tài liệu
- [ ] Giải thích mean vs median bằng số thật của dataset
- [ ] Tính được ngưỡng IQR và **giải thích tại sao không loại 1.167 điểm đó**
- [ ] Chọn đúng chart cho 6 câu hỏi ở bài 1.6
- [ ] Dựng pivot 2 chiều + cột MoM trong ≤ 10 phút
- [ ] Nêu được 2 câu hỏi mà dataset này **không** trả lời được

**Tiếp theo:** [L2 — SQL →](./l2-sql.md)

Làm bài tập tự chấm tương ứng: [Bài tập Stage 1](../bai-tap/stage-1.mdx)
