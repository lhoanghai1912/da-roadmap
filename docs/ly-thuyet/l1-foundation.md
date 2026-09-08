---
id: l1-foundation
title: "Lý thuyết 1 — Nền tảng dữ liệu"
sidebar_label: "L1 — Nền tảng"
sidebar_position: 2
description: "Grain, kieu du lieu, NULL, mean vs median, IQR outlier, tuong quan vs nhan qua, chon chart, pivot MoM. Dinh nghia + vi du da chay that + bai tap co dap an."
format: md
---

# LESSON 1 — Nền tảng dữ liệu (W1–W2)

Bổ trợ cho [Stage 1 — Nền tảng](../stages/stage-1-foundation.md). Stage file nói **làm gì**; file này nói **là gì, ví dụ ra sao, tự kiểm tra thế nào**.

Mỗi mục có 4 phần: **Định nghĩa** → **Ví dụ thật** (số lấy từ `data/superstore.csv`, đã chạy kiểm chứng) → **Bài tập** → **Đáp án** (bấm mở sau khi tự làm).

:::tip Cách học hiệu quả nhất với phần này
**Đoán trước, chạy sau.** Đọc câu hỏi → viết con số mình đoán ra giấy → mới chạy query → so hai bên.

Chỗ lệch giữa *đoán* và *thực tế* chính là chỗ mình đang hiểu sai. Chạy query trước rồi đọc đáp án thì não không phản kháng, học xong quên ngay.

Mỗi khái niệm ở đây đều bắt đầu bằng **bảng nhỏ 3 dòng nhìn hết bằng mắt**, rồi mới áp lên dữ liệu 10.000 dòng. Đừng đảo thứ tự.
:::

Số nền của dataset — kiểm chứng bằng lệnh ở cuối file: 9.994 dòng · 5.009 đơn · 793 khách · 1.862 sản phẩm · 2014-01-03 → 2017-12-30 · tổng Sales 2.297.201.

---

## 1.1 — Grain (độ mịn): khái niệm quan trọng nhất {#grain}

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
5. Tính AOV của Superstore — mẫu số là 9.994 hay 5.009?
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

## 1.3 — Mean vs Median: câu phỏng vấn xuất hiện nhiều nhất {#mean-median}

**Định nghĩa.** Mean = tổng / số lượng. Median = giá trị đứng giữa khi đã sắp xếp. Mean bị giá trị cực đoan kéo, median thì không.

**Ví dụ thật (đã chạy trên `Sales`).**

| Chỉ số | Giá trị |
|---|---|
| mean | 229,86 |
| median | 54,49 |
| SD | 623,25 |
| min | 0,44 |
| Q1 | 17,28 |
| Q3 | 209,94 |
| max | 22.638,48 |

Mean gấp **4,2 lần** median. Nghĩa là: một nhóm nhỏ đơn hàng rất lớn đang kéo mean lên. Một nửa số dòng có giá trị dưới 55$. Nếu báo cáo với sếp "giá trị trung bình mỗi dòng bán hàng là 230$", sếp sẽ hình dung sai hoàn toàn về khách hàng điển hình.

Cách nói đúng: *"Phân phối lệch phải mạnh — median 54$, mean 230$. Phần lớn giao dịch nhỏ, doanh thu tập trung vào nhóm ít giao dịch giá trị cao. Nên theo dõi bằng median cộng thêm P90, và tách riêng nhóm đơn lớn."*

**Bài tập 1.3.**
1. Tính mean và median của `Profit`. Dấu của chúng nói lên điều gì?
2. Trường hợp nào mean tốt hơn median?
3. Lương 5 người: 10, 11, 12, 13, 300 (triệu). Mean? Median? Nên báo cáo cái nào và vì sao?

<details>
<summary>Đáp án 1.3</summary>

1. Tự chạy bằng lệnh ở cuối file. Điểm cần thấy: `Profit` có giá trị âm (đơn lỗ), min âm sâu. Median dương trong khi vẫn tồn tại đuôi âm dài → phần lớn giao dịch có lãi nhỏ, một số ít lỗ rất nặng kéo mean xuống.
2. Khi cần **cộng dồn**: doanh thu tổng = mean × số đơn (median không có tính chất này). Khi dữ liệu phân phối gần đối xứng, không có outlier. Khi cần so sánh với ngân sách/tổng.
3. Mean = 69,2 · Median = 12. Báo median vì mean bị 1 giá trị 300 kéo lệch, không ai trong nhóm có lương gần 69. Cách chuẩn: báo cả hai + khoảng (min–max) và nêu rõ có outlier.

</details>

---

## 1.4 — Outlier và quy tắc IQR {#iqr-outlier}

**Định nghĩa.** IQR = Q3 − Q1. Ngưỡng ngoại lai: dưới `Q1 − 1,5×IQR`, trên `Q3 + 1,5×IQR`. Đây là quy ước, không phải chân lý.

**Ví dụ thật.** IQR = 209,94 − 17,28 = **192,66** → ngưỡng trên = 209,94 + 1,5×192,66 = **498,93**. Số dòng vượt ngưỡng: **1.167 dòng = 11,7%** dữ liệu.

Diễn giải: 11,7% là quá nhiều để gọi là "bất thường". Kết luận đúng không phải "có 1.167 lỗi dữ liệu" mà là *"phân phối lệch phải mạnh nên quy tắc IQR gắn cờ quá nhiều điểm; đây là đặc tính tự nhiên của doanh thu, không phải lỗi"*. Hành động: giữ nguyên dữ liệu, đổi cách báo cáo (median, P90), và nếu cần lọc thì lọc theo ngưỡng nghiệp vụ (ví dụ đơn > 5.000$ tách nhóm B2B) chứ không theo IQR.

**Nguyên tắc loại outlier.** Chỉ loại khi **chứng minh được là lỗi**: ngày 2099, giá âm, số lượng 99.999, khách tên "test". Không loại vì "chart nhìn xấu".

**Bài tập 1.4.**
1. Tính ngưỡng IQR cho `Profit`, đếm số outlier hai phía.
2. Mở 10 dòng `Sales` lớn nhất. Chúng là lỗi hay đơn thật? Căn cứ vào đâu để kết luận?
3. Viết 3 câu quyết định giữ/loại kèm lý do, theo đúng giọng đưa cho sếp đọc.

<details>
<summary>Đáp án 1.4</summary>

1–2. Chạy lệnh ở cuối file. Kiểm tra: đơn lớn có `Quantity` hợp lý không, `Product Name` có phải hàng đắt tiền thật không (máy photocopy, tủ), khách có phải segment Corporate/Home Office không. Nếu số lượng và loại hàng khớp nhau → đơn thật.
3. Mẫu: *"Giữ toàn bộ 1.167 điểm vượt ngưỡng IQR. Kiểm tra 10 giá trị lớn nhất cho thấy đều là máy móc văn phòng giá cao mua với số lượng hợp lý, không có dấu hiệu lỗi nhập liệu. Do phân phối lệch phải, tôi báo cáo bằng median kèm P90 thay vì mean, và tách riêng nhóm đơn > 5.000$ để theo dõi vì nhóm này chiếm phần lớn biến động doanh thu."*

</details>

---

## 1.5 — Tương quan và bẫy nhân quả {#tuong-quan}

**Định nghĩa.** Hệ số tương quan r ∈ [−1, 1] đo mức độ hai biến **số** đi cùng nhau theo quan hệ tuyến tính. |r| < 0,3 yếu · 0,3–0,7 vừa · > 0,7 mạnh (quy ước thô).

**Ví dụ thật.** corr(`Discount`, `Profit`) = **−0,219** → nhìn qua thì "yếu, chắc không quan trọng". Nhưng cắt theo mức chiết khấu thì bức tranh khác hẳn:

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

Bài học kép:
1. **r thấp không có nghĩa là không có quan hệ.** Quan hệ ở đây có ngưỡng (dưới 20% vẫn lãi, từ 30% trở lên lỗ) — dạng phi tuyến mà r tuyến tính không bắt được. Luôn vẽ chart / cắt nhóm trước khi tin vào r.
2. **Vẫn chưa được kết luận "chiết khấu gây lỗ".** Biến ẩn khả dĩ: loại mặt hàng. Bàn ghế (Furniture) vốn biên lợi nhuận chỉ 2,5% và cũng là nhóm hay bị giảm giá sâu để đẩy hàng tồn. Chiết khấu và lỗ có thể cùng là *hậu quả* của "hàng khó bán", chứ không phải cái này gây ra cái kia.

Cách nói đúng trong báo cáo: *"Có liên hệ rõ giữa mức chiết khấu và lợi nhuận: từ ngưỡng 30% trở lên, lợi nhuận trung bình mỗi dòng chuyển sang âm. Chưa thể khẳng định quan hệ nhân quả vì loại mặt hàng có thể là biến gây nhiễu. Đề xuất kiểm chứng bằng thử nghiệm có kiểm soát trên một nhóm sản phẩm."*

**Bài tập 1.5.**
1. Tính corr(`Sales`, `Profit`) và corr(`Quantity`, `Profit`). Giải thích dấu và độ lớn.
2. Tìm 1 cặp biến trong Superstore có tương quan nhưng chắc chắn không nhân quả.
3. Viết lại kết luận về Discount theo cách chỉ dùng số, không dùng từ "gây ra", "khiến cho", "dẫn đến".

<details>
<summary>Đáp án 1.5</summary>

1. corr(Sales, Profit) dương nhưng không sát 1 vì có đơn doanh thu cao mà lỗ (chiết khấu sâu). corr(Quantity, Profit) rất yếu — bán nhiều không đồng nghĩa lãi nhiều, vì đơn giá và chiết khấu mới là yếu tố quyết định.
2. Ví dụ: `Ship Date` và `Order Date` tương quan gần hoàn hảo — nhưng là quan hệ định nghĩa (ship luôn sau order), không phải nhân quả kinh doanh. Hoặc: doanh thu theo tháng và số đơn theo tháng — cả hai cùng bị chi phối bởi mùa vụ.
3. Mẫu: *"Nhóm đơn chiết khấu 0–20% có lợi nhuận trung bình +24,7 đến +96,1 mỗi dòng. Nhóm chiết khấu từ 30% trở lên có lợi nhuận trung bình −45,7 đến −226,6. Chênh lệch tồn tại nhất quán qua 4 mức chiết khấu, trên 471 dòng thuộc nhóm chiết khấu sâu."*

</details>

---

## 1.6 — Chọn đúng loại chart {#chon-chart}

**Định nghĩa.** Chart không chọn theo "đẹp" mà theo **loại câu hỏi**.

| Câu hỏi | Chart | Ví dụ Superstore | Lỗi hay gặp |
|---|---|---|---|
| Thay đổi theo thời gian? | Line | doanh thu 48 tháng | dùng bar cho 48 điểm → rối |
| So sánh giữa hạng mục? | Bar (ngang nếu nhãn dài) | doanh thu 17 sub-category | trục Y không từ 0 → phóng đại |
| Phân phối một biến? | Histogram / Box | `Sales` | dùng bar → sai khái niệm |
| Quan hệ hai biến số? | Scatter | `Discount` vs `Profit` | vẽ line nối các điểm |
| Cấu phần trong tổng? | Stacked bar / 100% stacked | category qua 4 năm | pie > 5 lát |
| Một con số then chốt? | Card + % so kỳ trước | doanh thu YTD | card không có mốc so sánh |
| Hai chiều cùng lúc? | Heatmap | region × tháng | quá nhiều màu |

**Ba lỗi cấm.** (1) Bar chart trục Y không bắt đầu từ 0. (2) Pie chart quá 5 lát. (3) Hai trục Y khác thang mà không chú thích — có thể vẽ ra bất kỳ "mối liên hệ" nào mình muốn.

**Bài tập 1.6.** Chọn chart cho 6 câu hỏi sau, ghi lý do 1 dòng:
a) Tháng nào doanh thu cao nhất năm 2017? b) Region nào lãi nhất? c) Đơn hàng thường có giá trị bao nhiêu? d) Giảm giá nhiều có lãi hơn không? e) Tỷ trọng 3 category thay đổi qua các năm? f) Tháng này so tháng trước tăng bao nhiêu %?

<details>
<summary>Đáp án 1.6</summary>

a) Line (thời gian, 12 điểm) — hoặc bar nếu muốn nhấn so sánh từng tháng. b) Bar ngang sắp giảm dần (4 hạng mục). c) Histogram + box plot (phân phối, và ở đây phải thấy được độ lệch phải). d) Scatter Discount vs Profit, thêm màu theo Category để lộ biến gây nhiễu. e) 100% stacked bar theo năm (quan tâm tỷ trọng) hoặc stacked bar thường (quan tâm cả quy mô). f) Card lớn + delta % kèm mũi tên, không cần chart.

</details>

---

## 1.7 — Pivot table và tăng trưởng MoM {#pivot-mom}

**Định nghĩa.** Pivot table = gom nhóm dữ liệu theo 1–2 chiều rồi tính tổng hợp. Chính là `GROUP BY` phiên bản kéo thả. MoM growth = `(kỳ này − kỳ trước) / kỳ trước`.

**Ví dụ thật (Superstore, năm 2017).**

| Tháng | Doanh thu | Số đơn | MoM |
|---|---|---|---|
| 2017-01 | 43.971 | 69 | — |
| 2017-02 | 20.301 | 53 | **−53,8%** |
| 2017-03 | 58.872 | 118 | **+190,0%** |
| 2017-04 | 36.522 | 116 | −38,0% |

Đọc bảng này như một analyst: tháng 3 tăng 190% nghe sốc, nhưng số đơn chỉ tăng từ 53 → 118 (2,2×) trong khi doanh thu tăng 2,9× → giá trị đơn trung bình cũng tăng. Và tháng 2 thấp bất thường (53 đơn, thấp nhất) → nền so sánh nhỏ khiến % tăng tháng 3 bị thổi phồng. Đây là lý do **% growth trên nền nhỏ luôn phải kèm số tuyệt đối**.

**Bẫy MoM.** Kỳ trước = 0 → chia cho 0. Bọc `IFERROR(...)` trong Sheets, `NULLIF(prev, 0)` trong SQL.

**Bài tập 1.7.**
1. Dựng pivot: dòng = tháng, cột = Region, giá trị = Sales, cho năm 2017.
2. Thêm cột MoM cho tổng, xử lý trường hợp chia 0.
3. Thêm measure thứ hai (Profit) và cột tính `profit_margin`. Vì sao không được lấy trung bình của cột margin từng dòng để ra margin tổng?

<details>
<summary>Đáp án 1.7</summary>

3. Vì margin là **tỷ số**. Trung bình của các tỷ số ≠ tỷ số của các tổng. Đúng: `SUM(Profit) / SUM(Sales)`. Sai: `AVERAGE(profit_margin_từng_dòng)` — cách sai gán trọng số bằng nhau cho đơn 5$ và đơn 20.000$. Đây là lỗi phổ biến trong cả Excel lẫn công cụ BI, và là một câu phỏng vấn hay gặp.

</details>

---

## 1.8 — Đọc một dataset lạ trong 15 phút {#doc-dataset-la}

Quy trình áp dụng cho mọi dataset, làm theo đúng thứ tự:

1. **Kích thước** — bao nhiêu dòng, bao nhiêu cột?
2. **Grain** — 1 dòng là gì? Viết thành câu.
3. **Khóa** — cột nào duy nhất? Cột nào lặp?
4. **Thời gian** — dữ liệu từ ngày nào đến ngày nào? Có lỗ hổng tháng nào không?
5. **Thiếu** — mỗi cột thiếu bao nhiêu %?
6. **Phân loại** — mỗi cột text có bao nhiêu giá trị khác nhau? Có giá trị lạ ('N/A', 'unknown', khoảng trắng thừa)?
7. **Số** — min/median/max mỗi cột số. Có số âm không? Có bằng 0 bất thường không?
8. **Trùng** — có dòng trùng hoàn toàn không?
9. **Câu hỏi** — dataset này trả lời được câu hỏi kinh doanh nào, và **không** trả lời được câu nào?

Bước 9 là bước phân biệt analyst với người biết dùng công cụ. *Ví dụ Superstore: không có giá vốn thật (chỉ có Profit tính sẵn), không có dữ liệu marketing, không có hành vi trước khi mua → không trả lời được "kênh nào hiệu quả nhất" hay "vì sao khách bỏ giỏ hàng".*

---

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
