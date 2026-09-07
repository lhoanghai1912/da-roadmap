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

**Định nghĩa.** `DataFrame` = bảng 2 chiều có tên cột và chỉ mục dòng. `Series` = một cột.

**7 lệnh khám phá đầu tiên, luôn chạy theo thứ tự này:**
```python
df.shape           # (9994, 21) - bao nhieu dong, cot
df.head(3)         # 3 dong dau, xem du lieu that trong nhu the nao
df.dtypes          # kieu tung cot - phat hien ngay bi doc sai kieu
df.isna().sum()    # thieu bao nhieu moi cot  -> Superstore: 0 o tat ca cot
df.describe()      # thong ke mo ta cot so
df.describe(include="object")   # so gia tri khac nhau cua cot text
df.duplicated().sum()           # trung hoan toan -> 0
```

**Ví dụ thật, và điều nó dạy.** Superstore **không thiếu ô nào** và **không có dòng trùng hoàn toàn**. Nhưng bỏ cột `Row ID` (số thứ tự nhân tạo) rồi kiểm tra lại:
```python
df.drop(columns=["Row ID"]).duplicated().sum()   # 1
```
Có **1 cặp trùng thật**: Row ID 3406 và 3407 — cùng `Order ID` US-2014-150119, cùng `Product ID` FUR-CH-10002965, cùng Sales 281,372, Quantity 2, Profit −12,0588.

Bài học: cột định danh nhân tạo che giấu trùng lặp. Luôn kiểm tra trùng theo **khóa nghiệp vụ**, không phải toàn bộ cột.

Và câu hỏi tiếp theo mới là phần analyst: đây là lỗi nhập liệu đôi hay khách thật sự mua cùng sản phẩm 2 lần trong 1 đơn? Không có cách nào biết chắc từ dữ liệu này → phải hỏi người vận hành. **Ghi lại câu hỏi đó vào phần Hạn chế của notebook** thay vì tự quyết im lặng.

**Bài tập 4.1.** Chạy 7 lệnh trên với Olist `orders.csv`. Viết 5 dòng nhận xét: grain, khoảng thời gian, cột nào thiếu nhiều nhất, cột nào đọc sai kiểu.

---

## 4.2 — Bảng chuyển đổi SQL ↔ Pandas (học thuộc bảng này) {#sql-pandas}

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

**Định nghĩa.** `.loc[dòng, cột]` chọn theo **nhãn**. `.iloc[dòng, cột]` chọn theo **vị trí số** (0-based, không bao gồm cận phải).

```python
df.loc[0, "Sales"]                      # gia tri o dong nhan 0, cot Sales
df.loc[df.Region=="West", ["Sales","Profit"]]   # loc dieu kien + chon cot
df.iloc[0:5, 0:3]                       # 5 dong dau, 3 cot dau
```

**Bẫy SettingWithCopyWarning** — cảnh báo hay bị bỏ qua nhưng có thể làm dữ liệu không được cập nhật:
```python
sub = df[df.Region == "West"]
sub["flag"] = 1          # CANH BAO: sub co the la ban sao, gan gia tri co the khong an
sub = df[df.Region == "West"].copy()    # DUNG: noi ro day la ban sao
sub["flag"] = 1
```

**Bài tập 4.3.** Lấy 10 dòng có `Profit` âm nặng nhất, chỉ 4 cột: Order ID, Product Name, Sales, Profit. Làm 2 cách (loc và sort_values).

---

## 4.4 — Làm sạch dữ liệu (phần chiếm nhiều thời gian nhất khi đi làm) {#lam-sach}

**Định nghĩa.** Làm sạch = đưa dữ liệu về trạng thái tin được, và **ghi lại mọi thay đổi**. Quy tắc vàng: mỗi bước xóa/sửa phải in ra "trước → sau".

Khung chuẩn dùng lại được:
```python
log = []
def buoc(ten, df_truoc, df_sau):
    log.append({"buoc": ten, "truoc": len(df_truoc), "sau": len(df_sau),
                "bo": len(df_truoc) - len(df_sau)})
    return df_sau

d0 = df.copy()
d1 = buoc("bo trung theo khoa nghiep vu", d0,
          d0.drop_duplicates(subset=["Order ID","Product ID","Sales","Quantity"]))
d2 = buoc("bo don ngay giao truoc ngay dat", d1,
          d1[d1["Ship Date"] >= d1["Order Date"]])
pd.DataFrame(log)
```
Bảng `log` này dán thẳng vào notebook, phần "Làm sạch". Người đọc thấy ngay đã bỏ bao nhiêu dòng và vì sao — đây là thứ phân biệt notebook nghiệp dư và notebook chuyên nghiệp.

**Sáu nhóm vấn đề và cách xử lý:**

| Vấn đề | Phát hiện | Xử lý |
|---|---|---|
| Thiếu (missing) | `df.isna().mean().sort_values(ascending=False)` | thiếu < 5% và ngẫu nhiên → bỏ dòng; thiếu nhiều → giữ, tạo cột cờ `is_missing`; **không** điền mean một cách máy móc |
| Trùng | `df.duplicated(subset=khoa).sum()` | xác định khóa nghiệp vụ trước, rồi `drop_duplicates(subset=..., keep="first")` |
| Sai kiểu | `df.dtypes` | `pd.to_datetime`, `pd.to_numeric(errors="coerce")` |
| Text không chuẩn | `df.col.unique()` | `.str.strip().str.lower()`; gộp biến thể ("HCM", "Ho Chi Minh") |
| Ngoại lai | IQR hoặc ngưỡng nghiệp vụ | chỉ loại khi chứng minh là lỗi; luôn ghi lại |
| Logic mâu thuẫn | tự viết kiểm tra | ship < order, số lượng ≤ 0, giá âm |

**Ví dụ thật.** `(df["Ship Date"] - df["Order Date"]).dt.days.mean()` = **3,96 ngày**. Kiểm tra logic: có dòng nào âm không? (Không.) Có dòng nào > 30 ngày không? Nếu có thì là đơn đặt trước hay lỗi nhập? Câu hỏi đó thuộc về nghiệp vụ, không phải kỹ thuật.

**Nguyên tắc quan trọng nhất về missing:** trước khi điền giá trị, hỏi **vì sao thiếu**. Thiếu ngẫu nhiên (mất gói tin) khác hoàn toàn thiếu có hệ thống (chỉ đơn hủy mới không có ngày giao). Điền mean cho trường hợp thứ hai là bịa dữ liệu.

**Bài tập 4.4.** Trên Olist `orders.csv`: `order_delivered_customer_date` thiếu ở một số dòng. Tìm xem những dòng đó có `order_status` gì. Kết luận: nên bỏ, nên điền, hay nên giữ và tạo cột cờ?

<details>
<summary>Đáp án 4.4</summary>

Các dòng thiếu ngày giao gần như đều có `order_status` là `shipped`, `canceled`, `unavailable`, `processing` — nghĩa là **thiếu có hệ thống**, đúng nghiệp vụ: đơn chưa giao thì không có ngày giao. Xử lý đúng: **giữ nguyên**, khi tính "thời gian giao trung bình" thì lọc `order_status == 'delivered'`, và ghi rõ trong notebook rằng phân tích chỉ áp dụng cho đơn đã giao (nêu tỷ lệ % bị loại). Điền mean sẽ tạo ra những đơn "đã giao" không có thật.

</details>

---

## 4.5 — Visualization: vẽ để hiểu, rồi vẽ để kể {#visualization}

**Hai loại chart khác nhau hoàn toàn:**
- **Chart để khám phá** (cho mình): nhanh, xấu cũng được, vẽ 20 cái.
- **Chart để trình bày** (cho người khác): có tiêu đề nói ra kết luận, chú thích, chỉ giữ 3–5 cái.

```python
import matplotlib.pyplot as plt, seaborn as sns
sns.set_theme(style="whitegrid")

fig, ax = plt.subplots(figsize=(9,4))
sns.histplot(df["Sales"], bins=60, ax=ax)
ax.set_xlim(0, 2000)                                   # cat duoi de nhin duoc phan chinh
ax.axvline(df.Sales.median(), color="red", ls="--")    # danh dau median
ax.set_title("Phan phoi Sales lech phai manh: median 54$, mean 230$")  # tieu de = ket luan
```

**Tiêu đề chart phải là câu kết luận, không phải nhãn.** So sánh:
- ❌ "Doanh thu theo Category"
- ✅ "Furniture chiếm 32% doanh thu nhưng chỉ 6% lợi nhuận"

**Bộ 5 chart cho mọi EDA:**
```python
df["Sales"].plot.hist(bins=60)                                  # 1. phan phoi
df.groupby("Category")["Sales"].sum().sort_values().plot.barh()  # 2. so sanh nhom
df.set_index("Order Date").resample("ME")["Sales"].sum().plot()  # 3. xu huong thoi gian
df.plot.scatter(x="Discount", y="Profit", alpha=0.3)             # 4. quan he 2 bien
sns.heatmap(df[["Sales","Quantity","Discount","Profit"]].corr(), annot=True, cmap="RdBu_r", center=0)  # 5. tuong quan
```

**Bẫy heatmap tương quan:** ma trận tương quan chỉ bắt quan hệ **tuyến tính**. Ví dụ Superstore: corr(Discount, Profit) = −0,219 trông yếu, nhưng cắt theo mức chiết khấu thì thấy rõ ngưỡng đảo dấu ở 30% (xem L1 mục 1.5). **Luôn vẽ scatter trước khi tin heatmap.**

**Bài tập 4.5.** Vẽ scatter Discount vs Profit, tô màu theo Category. Viết 3 câu nhận xét về việc màu sắc tiết lộ điều gì mà hệ số tương quan không tiết lộ.

---

## 4.6 — Quy trình EDA chuẩn (dùng cho Portfolio #2) {#quy-trinh-eda}

Sáu bước, đúng thứ tự, viết thành 6 phần trong notebook:

1. **Câu hỏi & giả thuyết** — viết TRƯỚC khi mở dữ liệu. Ví dụ: "Đơn giao chậm có làm điểm đánh giá thấp đi không? Giả thuyết: có, và mức ảnh hưởng lớn hơn giá tiền."
2. **Dữ liệu** — bảng nào, khoảng thời gian, số dòng, grain, bộ lọc đã áp.
3. **Làm sạch** — bảng log "trước → sau" từng bước, kèm lý do.
4. **Findings** — mỗi finding = 1 chart + 1 câu diễn giải **có số**.
5. **Hạn chế** — dữ liệu không nói được gì; ở đâu mình đang suy đoán.
6. **Đề xuất** — 2–3 hành động cụ thể, ai làm, đo bằng metric nào.

**Tiêu chuẩn kỹ thuật bắt buộc:** Kernel → Restart & Run All phải chạy sạch từ đầu đến cuối, không lỗi. Notebook chạy được lần đầu nhưng không chạy lại được là notebook hỏng.

**Bài tập 4.6.** Viết phần 1 (Câu hỏi & giả thuyết) cho Portfolio #2 trên Olist trước khi viết dòng code nào. Tối thiểu 3 câu hỏi, mỗi câu kèm giả thuyết và cách sẽ kiểm chứng.

<details>
<summary>Ví dụ đạt chuẩn</summary>

| Câu hỏi | Giả thuyết | Cách kiểm chứng |
|---|---|---|
| Giao hàng chậm ảnh hưởng điểm đánh giá thế nào? | Đơn giao trễ hơn dự kiến có điểm trung bình thấp hơn ≥ 1 sao | So sánh `review_score` trung bình theo nhóm (đúng hạn / trễ), kèm phân phối và cỡ mẫu từng nhóm |
| Bang nào đóng góp doanh thu lớn nhưng dịch vụ kém nhất? | SP dẫn đầu doanh thu nhưng thời gian giao dài do khoảng cách | Bảng: doanh thu × thời gian giao trung bình × điểm đánh giá theo bang |
| Danh mục nào hay bị đánh giá 1 sao? | Đồ nội thất/hàng cồng kềnh, do vỡ và giao chậm | Tỷ lệ đơn 1 sao theo `product_category`, chỉ lấy nhóm có ≥ 100 đơn để tránh nhiễu mẫu nhỏ |

</details>

---

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
