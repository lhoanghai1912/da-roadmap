---
id: l4-python
title: "Lý thuyết 4 — Python & Pandas"
sidebar_label: "L4 — Python"
sidebar_position: 5
description: "DataFrame, bang chuyen doi SQL sang pandas, loc/iloc, lam sach co log, visualization, quy trinh EDA 6 buoc."
format: md
---

# LESSON 4 — Python & Pandas cho phân tích (W13–W16)

Bổ trợ cho [Stage 4 — Python](../stages/stage-4-python.md). Nguyên tắc học: **không học Python như lập trình viên**. Chỉ học đủ phần phục vụ phân tích: đọc dữ liệu → làm sạch → nhóm → vẽ → viết kết luận.

Mọi số trong file này đã chạy thật trên `superstore.csv` (đọc bằng `encoding='cp1252'`).

---

## 4.0 — Chạy được ngay {#chay-ngay}

```bash
cd ~/Documents/Study/DA/lab
uv run jupyter lab
```
```python
import pandas as pd
df = pd.read_csv("../da-portfolio/data/superstore.csv",
                 encoding="cp1252",                       # BAT BUOC: file khong phai UTF-8
                 parse_dates=["Order Date", "Ship Date"])  # doc thang ra kieu ngay
df.shape        # (9994, 21)
```
> Quên `encoding="cp1252"` sẽ gặp `UnicodeDecodeError: 'utf-8' codec can't decode byte 0xa0`. Đây là lỗi đầu tiên gần như ai cũng gặp với dataset này.

---

## 4.1 — DataFrame: bảng SQL trong bộ nhớ {#dataframe}

**Định nghĩa.** `DataFrame` = bảng 2 chiều có tên cột và **chỉ mục dòng** (index). `Series` = một cột.

Điểm khác SQL quan trọng nhất: **DataFrame có index**, bảng SQL thì không. Đây là nguồn của phần lớn nhầm lẫn (xem §4.3).

### Bảy lệnh khám phá — luôn chạy theo thứ tự này

```python
df.shape                       # (9994, 21)  - bao nhieu dong, cot
df.head(3)                     # du lieu that trong nhu the nao
df.dtypes                      # kieu tung cot - phat hien doc sai kieu ngay
df.isna().sum()                # thieu bao nhieu moi cot
df.describe()                  # thong ke mo ta cot so
df.describe(include="object")  # so gia tri khac nhau cua cot text
df.duplicated().sum()          # trung hoan toan
```

Bảy lệnh, khoảng 3 phút, và bạn biết dataset này có dùng được không.

### Bàn tập — cột ID nhân tạo che giấu dòng trùng

Chạy trên Superstore:

```python
df.duplicated().sum()                              # 0  -> "sach"?
df.drop(columns=["Row ID"]).duplicated().sum()     # 1  -> co trung that
```

Có **1 cặp trùng thật**: Row ID 3406 và 3407 — cùng `Order ID` US-2014-150119, cùng `Product ID` FUR-CH-10002965, cùng Sales 281,372, Quantity 2, Profit −12,0588.

`Row ID` là số thứ tự nhân tạo, mỗi dòng một giá trị khác nhau → nó làm **mọi dòng trông như duy nhất**.

**Quy tắc: kiểm tra trùng theo khóa nghiệp vụ, không theo toàn bộ cột.**

```python
df.duplicated(subset=["Order ID","Product ID"]).sum()    # 8 dong
```

Tám dòng — khớp với con số ở [L1 §1.1](/ly-thuyet/l1-foundation#grain) (9.994 − 9.986).

### Và câu hỏi tiếp theo mới là phần analyst

Tìm ra 8 dòng trùng rồi thì làm gì? Ba lựa chọn, chọn sai là hỏng số:

| Giả thuyết | Xử lý đúng |
|---|---|
| Nhập liệu bị lặp | xóa bản trùng |
| Khách thật sự mua cùng sản phẩm 2 lần trong 1 đơn (2 màu khác nhau chẳng hạn) | **giữ nguyên** |
| Hệ thống ghi 2 lần khi thanh toán lỗi rồi thử lại | xóa, và báo cho team kỹ thuật |

**Không có cách nào biết chắc từ dữ liệu này.** Việc đúng: ghi vào mục Hạn chế của notebook và **đi hỏi người vận hành**. Tự ý xóa im lặng là hành vi nguy hiểm nhất của analyst mới.

### Bài tập 4.1

1. Chạy 7 lệnh trên Olist `orders.csv`. Viết 5 dòng nhận xét: grain, khoảng thời gian, cột nào thiếu nhiều nhất, cột nào đọc sai kiểu.
2. Trên Superstore, tìm 8 dòng trùng theo `(Order ID, Product ID)` và in ra xem chúng khác nhau ở cột nào.
3. `df.describe()` trên Superstore — cột nào có `min` hoặc `max` trông bất thường? Kiểm tra xem đó là lỗi hay dữ liệu thật.

<details>
<summary>Gợi ý câu 2</summary>

```python
key = ["Order ID","Product ID"]
dup = df[df.duplicated(subset=key, keep=False)].sort_values(key)
dup[key + ["Sales","Quantity","Discount","Profit"]]
```
Nếu hai dòng giống hệt **mọi cột** → nghiêng về lỗi nhập liệu lặp. Nếu khác `Quantity` hoặc `Discount` → nhiều khả năng là hai dòng hợp lệ của cùng sản phẩm trong một đơn.

</details>

## 4.2 — Bảng chuyển đổi SQL ↔ Pandas (học thuộc bảng này) {#sql-pandas}

**Nguyên tắc học pandas:** đừng học như ngôn ngữ mới. **Dịch từ SQL đã biết.** Mỗi khi bí, hỏi "câu này viết bằng SQL thì thế nào?" rồi tra sang.

### Bàn tập song song

Cùng một dữ liệu, viết cả hai bên, so kết quả. Đây là cách luyện nhanh nhất.

```python
import pandas as pd
don = pd.DataFrame({
    "don_id":   ["HD-01","HD-02","HD-03"],
    "khach_id": [1, 1, 2],
    "tien":     [90, 50, 30],
})
khach = pd.DataFrame({"id": [1,2,3], "ten": ["An","Binh","Chi"], "diem": [100,50,30]})
```

| Câu hỏi | SQL | Pandas | Kết quả |
|---|---|---|---|
| Đơn trên 40 | `SELECT * FROM don WHERE tien > 40` | `don[don.tien > 40]` | 2 dòng |
| Tổng tiền mỗi khách | `SELECT khach_id, SUM(tien) FROM don GROUP BY 1` | `don.groupby("khach_id")["tien"].sum()` | 1→140, 2→30 |
| Ghép tên khách | `... JOIN khach k ON k.id = d.khach_id` | `don.merge(khach, left_on="khach_id", right_on="id")` | 3 dòng |
| Giữ cả khách chưa mua | `LEFT JOIN` từ `khach` | `khach.merge(don, left_on="id", right_on="khach_id", how="left")` | **4 dòng** |
| Số khách duy nhất | `COUNT(DISTINCT khach_id)` | `don.khach_id.nunique()` | 2 |

Chú ý dòng thứ 4: `how="left"` giữ Chi lại với phần bên phải là `NaN` — **y hệt `LEFT JOIN` sinh NULL** trong [Lesson 2](/ly-thuyet/l2-sql#join). Và **fan-out xảy ra y hệt**:

```python
khach.merge(don, left_on="id", right_on="khach_id")["diem"].sum()   # 250 - SAI, diem cua An bi cong 2 lan
khach[khach.id.isin(don.khach_id)]["diem"].sum()                    # 150 - DUNG
```

Thói quen bắt buộc, giống hệt bên SQL: **đếm số dòng trước và sau mỗi `merge`**.

```python
print(len(khach), len(don))                       # 3 3
m = khach.merge(don, left_on="id", right_on="khach_id")
print(len(m))                                     # 3  <- kiem tra co dung ky vong khong
```

| Mục đích | SQL | Pandas |
|---|---|---|
| Chọn cột | `SELECT a, b` | `df[["a","b"]]` |
| Lọc dòng | `WHERE Sales > 500` | `df[df["Sales"] > 500]` |
| Nhiều điều kiện | `WHERE a>1 AND b='x'` | `df[(df.a>1) & (df.b=="x")]` — **bắt buộc có ngoặc** |
| Sắp xếp | `ORDER BY Sales DESC` | `df.sort_values("Sales", ascending=False)` |
| Giới hạn | `LIMIT 10` | `df.head(10)` |
| Giá trị duy nhất | `SELECT DISTINCT r` | `df["r"].unique()` |
| Đếm nhóm | `GROUP BY r` + `COUNT(*)` | `df.groupby("r").size()` |
| Tổng hợp nhiều hàm | `SUM(s), AVG(p)` | `df.groupby("r").agg(s=("Sales","sum"), p=("Profit","mean"))` |
| Lọc sau nhóm | `HAVING SUM(s)>100` | `.query("s > 100")` sau khi agg |
| Ghép bảng | `LEFT JOIN` | `pd.merge(a, b, on="id", how="left")` |
| Xoay bảng | `SUM(CASE WHEN ...)` | `df.pivot_table(index=, columns=, values=, aggfunc=)` |
| Cột mới | `SELECT x*2 AS y` | `df.assign(y=df.x*2)` |
| Đếm duy nhất | `COUNT(DISTINCT id)` | `df["id"].nunique()` |
| Window rank | `ROW_NUMBER() OVER (PARTITION BY g ORDER BY x DESC)` | `df.groupby("g")["x"].rank(method="first", ascending=False)` |
| Running total | `SUM(x) OVER (ORDER BY d)` | `df.sort_values("d")["x"].cumsum()` |
| LAG | `LAG(x) OVER (ORDER BY d)` | `df["x"].shift(1)` |

**Ví dụ đối chiếu (cùng kết quả, đã chạy):**
```python
df.groupby("Category")[["Sales","Profit"]].sum().assign(
    margin=lambda d: (d.Profit / d.Sales * 100).round(1))
```
```
                  Sales    Profit  margin
Furniture       742000.0   18451.0   2.5
Office Supplies 719047.0  122491.0  17.0
Technology      836154.0  145455.0  17.4
```
Giống hệt kết quả SQL ở Lesson 1. **Bài tập chuẩn của W14: làm lại 10 query SQL của W8 bằng pandas và so khớp từng con số.** Lệch một đồng cũng phải tìm ra vì sao — đó là lúc học được nhiều nhất.

**Bẫy `margin` lần nữa:** `d.Profit / d.Sales` áp dụng **sau khi** đã `sum()` → đúng. Nếu tính margin ở mức từng dòng rồi `.mean()` → sai (trung bình của tỷ số).

**Bài tập 4.2.** Viết bằng pandas: 5 sub-category lỗ nặng nhất. Đối chiếu với SQL.

<details>
<summary>Đáp án 4.2</summary>

```python
df.groupby("Sub-Category")[["Sales","Profit"]].sum().sort_values("Profit").head(5).round(0)
```
```
             Sales    Profit
Tables      206966.0 -17725.0
Bookcases   114880.0  -3473.0
Supplies     46674.0  -1189.0
```
Chỉ 3 nhóm lỗ trong 17 sub-category. Tables lỗ gấp 5 lần Bookcases → ưu tiên xử lý rõ ràng.

</details>

---

## 4.3 — loc / iloc: nguồn nhầm lẫn kinh điển {#loc-iloc}

**Định nghĩa.** `.loc[dòng, cột]` chọn theo **nhãn** (index). `.iloc[dòng, cột]` chọn theo **vị trí số** (0-based, không bao gồm cận phải).

Khi index là `0,1,2,3...` thì hai cái cho kết quả giống nhau — nên người mới tưởng chúng như nhau. Chúng khác nhau ngay khi lọc dữ liệu.

### Bàn tập — index không được đánh lại sau khi lọc

```python
df = pd.DataFrame({"don_id":["HD-01","HD-02","HD-03","HD-04"],
                   "khach":["An","An","Binh","Chi"],
                   "tien":[90,50,30,200]})
lon = df[df.tien > 40]
```

| index | don_id | khach | tien |
|---|---|---|---|
| 0 | HD-01 | An | 90 |
| 1 | HD-02 | An | 50 |
| **3** | HD-04 | Chi | 200 |

Index nhảy từ 1 sang **3** — dòng HD-03 bị lọc ra nhưng index của các dòng còn lại **giữ nguyên nhãn cũ**.

Giờ thử lấy "dòng cuối cùng":

```python
lon.iloc[2]     # HD-04  -> vi tri thu 3 trong ket qua      DUNG
lon.loc[3]      # HD-04  -> nhan index = 3                  DUNG
lon.iloc[3]     # IndexError: single positional indexer is out-of-bounds
lon.loc[2]      # KeyError: 2   (nhan 2 da bi loc mat)
```

Cùng con số `2` và `3` nhưng ý nghĩa hoàn toàn khác. Đây là lỗi hay gặp khi viết vòng lặp qua kết quả đã lọc.

**Cách tránh:** sau khi lọc, nếu định dùng vị trí thì `reset_index(drop=True)`.

```python
lon = df[df.tien > 40].reset_index(drop=True)
```

### Bảng dùng cái nào

| Muốn | Dùng |
|---|---|
| Lọc theo điều kiện | `df[df.tien > 40]` (boolean mask) |
| Lấy theo nhãn cụ thể | `.loc` |
| Lấy N dòng đầu/cuối | `.head()` / `.tail()` |
| Duyệt theo vị trí | `.iloc` + nhớ `reset_index` |
| Chọn cả dòng lẫn cột | `.loc[mask, ["a","b"]]` |

### Bẫy SettingWithCopyWarning

```python
sub = df[df.khach == "An"]
sub["flag"] = 1          # CANH BAO - sub co the la ban sao, gan gia tri co the khong an
```

Pandas không đảm bảo `sub` là bản sao hay là view. Cảnh báo này hay bị bỏ qua, và hậu quả là **dữ liệu không được cập nhật mà không báo lỗi**.

Sửa: nói rõ ý định.

```python
sub = df[df.khach == "An"].copy()    # ban sao doc lap
sub["flag"] = 1

df.loc[df.khach == "An", "flag"] = 1  # sua thang tren df goc
```

### Bài tập 4.3

Trên bàn tập 4 dòng:

1. `lon.iloc[0]` và `lon.loc[0]` cho kết quả giống hay khác? Vì sao?
2. Sau `reset_index(drop=True)`, `lon.loc[2]` ra gì?
3. Bỏ `drop=True` đi thì có gì khác?

Trên Superstore:

4. Lấy 10 dòng `Profit` âm nặng nhất, chỉ 4 cột: Order ID, Product Name, Sales, Profit. Làm 2 cách.

<details>
<summary>Đáp án 4.3</summary>

1. **Giống nhau** — cùng ra HD-01. Vì dòng đầu tiên tình cờ có nhãn index = 0 và vị trí = 0. Đây chính là lý do người mới tưởng hai cái như nhau.
2. HD-04 — sau khi reset, index thành 0,1,2 nên nhãn 2 = vị trí 2 = dòng cuối.
3. `reset_index()` không có `drop=True` sẽ **giữ index cũ thành một cột mới** tên `index`. Đôi khi hữu ích (muốn biết dòng gốc ở đâu), nhưng thường là rác trong DataFrame.
4. ```python
   df.nsmallest(10, "Profit")[["Order ID","Product Name","Sales","Profit"]]
   df.sort_values("Profit").head(10)[["Order ID","Product Name","Sales","Profit"]]
   ```
   `nsmallest` nhanh hơn với bảng lớn vì không phải sắp xếp toàn bộ.

</details>

## 4.4 — Làm sạch dữ liệu (phần chiếm nhiều thời gian nhất khi đi làm) {#lam-sach}

**Định nghĩa.** Làm sạch = đưa dữ liệu về trạng thái tin được, **và ghi lại mọi thay đổi**. Vế sau quan trọng ngang vế trước.

### Bàn tập — missing ngẫu nhiên vs missing có hệ thống

5 đơn hàng:

| đơn | trạng thái | ngày giao |
|---|---|---|
| 1 | giao | 2024-01-05 |
| 2 | giao | 2024-01-07 |
| 3 | **hủy** | **NULL** |
| 4 | **đang giao** | **NULL** |
| 5 | giao | 2024-01-09 |

Hai ô thiếu. Câu hỏi **không phải** "điền gì vào đó" mà là **"vì sao thiếu?"**

```python
o.groupby("trang_thai")["ngay_giao"].apply(lambda s: s.isna().sum())
# giao: 0   huy: 1   dang_giao: 1
```

Toàn bộ ô thiếu nằm ở đơn **chưa giao xong**. Đây là **missing có hệ thống** — đúng nghiệp vụ, không phải lỗi dữ liệu.

Ba cách xử lý, chỉ một cách đúng:

| Cách | Hậu quả |
|---|---|
| `fillna(mean)` | ❌ **Bịa dữ liệu** — tạo ra đơn "đã giao" không có thật |
| `dropna()` | ⚠️ Mất 2/5 đơn khỏi mọi phân tích, kể cả phân tích không liên quan tới ngày giao |
| **Giữ nguyên, lọc khi cần** | ✅ `df[df.trang_thai == "giao"]` khi tính thời gian giao, ghi rõ đã loại bao nhiêu % |

Với Olist, đúng tình huống này: `order_delivered_customer_date` thiếu ở các đơn `shipped`, `canceled`, `unavailable`, `processing`.

### Phân biệt hai loại missing

| Loại | Dấu hiệu | Xử lý |
|---|---|---|
| **Ngẫu nhiên** | thiếu rải đều, không liên quan cột nào | thiếu < 5% → bỏ dòng; nhiều hơn → điền + tạo cột cờ |
| **Có hệ thống** | thiếu tập trung ở một nhóm | **giữ nguyên**, lọc theo nghiệp vụ khi phân tích |

Cách kiểm nhanh: `df.groupby(cot_nghi_ngo)[cot_thieu].apply(lambda s: s.isna().mean())`. Tỷ lệ thiếu chênh lệch rõ giữa các nhóm → có hệ thống.

### Khung log — bắt buộc có

Mỗi bước xóa/sửa phải in ra "trước → sau":

```python
log = []
def buoc(ten, truoc, sau):
    log.append({"buoc": ten, "truoc": len(truoc), "sau": len(sau), "bo": len(truoc)-len(sau)})
    return sau

d0 = df.copy()
d1 = buoc("bo trung theo khoa nghiep vu", d0,
          d0.drop_duplicates(subset=["Order ID","Product ID","Sales","Quantity"]))
d2 = buoc("bo don ngay giao truoc ngay dat", d1,
          d1[d1["Ship Date"] >= d1["Order Date"]])
pd.DataFrame(log)
```

Bảng `log` dán thẳng vào notebook, mục "Làm sạch". Người đọc thấy ngay đã bỏ bao nhiêu dòng và vì sao.

Đây là thứ phân biệt notebook nghiệp dư với notebook chuyên nghiệp. Notebook không có log thì người đọc buộc phải tin, mà trong công việc thật thì **không ai tin số của người lạ**.

### Sáu nhóm vấn đề

| Vấn đề | Phát hiện | Xử lý |
|---|---|---|
| Thiếu | `df.isna().mean().sort_values(ascending=False)` | phân biệt ngẫu nhiên / có hệ thống trước |
| Trùng | `df.duplicated(subset=khoa).sum()` | xác định khóa nghiệp vụ trước (§4.1) |
| Sai kiểu | `df.dtypes` | `pd.to_datetime`, `pd.to_numeric(errors="coerce")` |
| Text không chuẩn | `df.col.value_counts()` | `.str.strip().str.lower()`, gộp biến thể |
| Ngoại lai | IQR hoặc ngưỡng nghiệp vụ | chỉ loại khi chứng minh là lỗi ([L1 §1.4](/ly-thuyet/l1-foundation#iqr-outlier)) |
| Logic mâu thuẫn | tự viết kiểm tra | ship < order, số lượng ≤ 0, giá âm |

Nhóm cuối phải tự nghĩ ra, không có hàm sẵn. Với mỗi dataset, viết ra 3–5 quy tắc "điều này không thể xảy ra" rồi kiểm tra.

### Bài tập 4.4

1. Trên bàn tập 5 đơn: tính "thời gian giao trung bình". Mẫu số là 5 hay 3? Viết câu ghi chú kèm theo con số.
2. Với Olist `orders.csv`: nhóm các đơn thiếu `order_delivered_customer_date` theo `order_status`. Kết luận nên bỏ, điền, hay giữ?
3. Viết 5 quy tắc "điều này không thể xảy ra" cho Superstore, rồi kiểm tra từng cái.

<details>
<summary>Đáp án 4.4</summary>

1. Mẫu số là **3** (chỉ đơn đã giao). Ghi chú bắt buộc: *"Thời gian giao trung bình 3,3 ngày, tính trên 3/5 đơn đã giao thành công (60%). Hai đơn còn lại đang giao hoặc đã hủy nên chưa có ngày giao."* Không có câu ghi chú này thì người đọc tưởng đó là con số của toàn bộ đơn hàng.
2. **Giữ nguyên.** Thiếu có hệ thống, đúng nghiệp vụ. Khi tính thời gian giao thì lọc `order_status == 'delivered'` và ghi rõ % bị loại.
3. Gợi ý: `Ship Date` ≥ `Order Date` · `Quantity` > 0 · `Sales` > 0 · `Discount` trong [0,1] · `Order Date` không vượt quá ngày hiện tại. Chạy thử — Superstore khá sạch nên phần lớn sẽ pass, nhưng thói quen viết ra quy tắc trước mới là thứ cần luyện.

</details>

## 4.5 — Visualization: vẽ để hiểu, rồi vẽ để kể {#visualization}

**Hai loại chart khác nhau hoàn toàn**, đừng lẫn lộn:

| | Chart để **khám phá** | Chart để **trình bày** |
|---|---|---|
| Cho ai | cho mình | cho người khác |
| Số lượng | vẽ 20 cái | giữ 3–5 cái |
| Chất lượng | xấu cũng được | có tiêu đề kết luận, chú thích |
| Mục đích | tìm ra cái đáng kể | chứng minh điều đã tìm ra |

Người mới hay bỏ qua giai đoạn 1 và đánh bóng ngay 3 chart đầu tiên nghĩ ra — nên bỏ lỡ phát hiện thật.

### Bộ 5 chart cho mọi EDA

```python
df["Sales"].plot.hist(bins=60)                                   # 1. phan phoi
df.groupby("Category")["Sales"].sum().sort_values().plot.barh()   # 2. so sanh nhom
df.set_index("Order Date").resample("ME")["Sales"].sum().plot()   # 3. xu huong thoi gian
df.plot.scatter(x="Discount", y="Profit", alpha=0.3)              # 4. quan he 2 bien
sns.heatmap(df[["Sales","Quantity","Discount","Profit"]].corr(), annot=True, cmap="RdBu_r", center=0)
```

### Bàn tập — vì sao heatmap tương quan đánh lừa

Lấy đúng dữ liệu hiệu suất hình chữ U ở [L1 §1.5](/ly-thuyet/l1-foundation#tuong-quan):

```python
gio        = [1,2,3,4,5,6,7,8]
hieu_suat  = [30,55,75,88,90,86,70,45]
np.corrcoef(gio, hieu_suat)[0,1]     # 0.284
```

Heatmap sẽ tô ô này màu **nhạt** — trông như "không liên quan". Nhưng vẽ scatter ra thì quan hệ rõ như ban ngày.

**Quy tắc: heatmap dùng để chọn cặp biến đáng xem, không dùng để kết luận.** Mọi ô đáng chú ý (kể cả ô nhạt bất ngờ) đều phải vẽ scatter kiểm chứng.

### Tiêu đề chart là câu kết luận

```python
fig, ax = plt.subplots(figsize=(9,4))
sns.histplot(df["Sales"], bins=60, ax=ax)
ax.set_xlim(0, 2000)                                   # cat duoi de nhin duoc phan chinh
ax.axvline(df.Sales.median(), color="red", ls="--")    # danh dau median
ax.set_title("Phan phoi Sales lech phai manh: median 54$, mean 230$")
```

❌ `"Doanh thu theo Category"` — nhãn, người đọc tự tìm ý nghĩa
✅ `"Furniture chiếm 32% doanh thu nhưng chỉ 6% lợi nhuận"` — thông điệp

Ba chi tiết nhỏ trong đoạn code trên tạo khác biệt lớn: **cắt trục** để thấy phần chính (không bị outlier kéo giãn), **vạch median** làm mốc đọc, **tiêu đề có số**.

### Bài tập 4.5

1. Vẽ scatter `Discount` vs `Profit`, tô màu theo `Category`. Viết 3 câu nhận xét về việc **màu sắc tiết lộ điều gì mà hệ số tương quan không tiết lộ**.
2. Vẽ histogram `Sales` không cắt trục, rồi cắt trục ở 2000. So sánh hai biểu đồ — cái nào dùng được để trình bày?
3. Lấy 5 chart trong notebook của mình, viết lại toàn bộ tiêu đề theo kiểu "tiêu đề là kết luận".

---

## 4.6 — Quy trình EDA chuẩn (dùng cho Portfolio #2) {#quy-trinh-eda}

Sáu bước, đúng thứ tự, viết thành 6 mục trong notebook:

| # | Mục | Nội dung bắt buộc |
|---|---|---|
| 1 | **Câu hỏi & giả thuyết** | Viết **trước khi** mở dữ liệu |
| 2 | **Dữ liệu** | bảng nào · khoảng thời gian · số dòng · grain · bộ lọc đã áp |
| 3 | **Làm sạch** | bảng log "trước → sau" từng bước, kèm lý do |
| 4 | **Findings** | mỗi finding = 1 chart + 1 câu diễn giải **có số** |
| 5 | **Hạn chế** | dữ liệu không nói được gì · chỗ nào đang suy đoán |
| 6 | **Đề xuất** | 2–3 hành động: ai làm, đo bằng metric nào |

### Vì sao bước 1 phải làm trước

Mở dữ liệu trước rồi mới nghĩ câu hỏi → sẽ chỉ hỏi những câu **dữ liệu sẵn sàng trả lời**. Đó là cách bỏ lỡ vấn đề quan trọng nhất.

Viết câu hỏi trước, rồi mới kiểm tra dữ liệu có trả lời được không. Câu nào không trả lời được thì đưa xuống mục **Hạn chế** — và bản thân danh sách đó đã là một phát hiện có giá trị ([L1 §1.8](/ly-thuyet/l1-foundation#doc-dataset-la)).

### Mẫu bước 1 đạt chuẩn (Olist)

| Câu hỏi | Giả thuyết | Cách kiểm chứng |
|---|---|---|
| Giao chậm ảnh hưởng điểm đánh giá thế nào? | Đơn trễ hơn dự kiến có điểm TB thấp hơn ≥ 1 sao | So `review_score` TB theo nhóm (đúng hạn / trễ), kèm phân phối và cỡ mẫu từng nhóm |
| Bang nào doanh thu lớn nhưng dịch vụ kém nhất? | SP dẫn đầu doanh thu nhưng giao lâu do khoảng cách | Bảng: doanh thu × thời gian giao TB × điểm đánh giá theo bang |
| Danh mục nào hay bị 1 sao? | Hàng cồng kềnh, do vỡ và giao chậm | Tỷ lệ đơn 1 sao theo `product_category`, chỉ lấy nhóm ≥ 100 đơn để tránh nhiễu mẫu nhỏ |

Chú ý cột 3: mỗi cách kiểm chứng đều nêu rõ **cỡ mẫu tối thiểu**. Không có điều đó thì sẽ gặp đúng lỗi "cohort 1 người ra retention 100%" ở [L2 §2.8](/ly-thuyet/l2-sql#funnel-cohort-rfm).

### Tiêu chuẩn kỹ thuật bắt buộc

**Kernel → Restart & Run All phải chạy sạch từ đầu đến cuối.**

Notebook chạy được lần đầu nhưng không chạy lại được là notebook hỏng — người khác mở ra sẽ thấy lỗi, và bản thân mình sau 2 tuần cũng không tái tạo được kết quả.

### Bài tập 4.6

1. Viết mục 1 (Câu hỏi & giả thuyết) cho Portfolio #2 **trước khi** viết dòng code nào. Tối thiểu 3 câu hỏi, mỗi câu kèm giả thuyết và cách kiểm chứng có nêu cỡ mẫu.
2. Với mỗi câu hỏi, kiểm tra dữ liệu Olist có trả lời được không. Câu nào không → viết vào mục Hạn chế ngay.
3. Chạy `Restart & Run All` trên notebook hiện tại. Lỗi ở đâu, sửa.

## Checklist trước khi sang Stage 5

- [ ] Đọc bảng SQL ↔ pandas không cần tra
- [ ] Làm lại 10 query SQL bằng pandas, số khớp 100%
- [ ] Giải thích được vì sao `Row ID` che mất dòng trùng
- [ ] Có khung log làm sạch "trước → sau" dùng lại được
- [ ] Notebook chạy sạch với Restart & Run All
- [ ] Từ CSV thô → notebook có insight trong ≤ 4h, không copy code mẫu
- [ ] Mọi tiêu đề chart đều là câu kết luận có số

**Tiếp theo:** [L5 — Thống kê suy diễn →](./l5-stats.md)

Làm bài tập tự chấm tương ứng: [Bài tập Stage 4](../bai-tap/stage-4.mdx)
