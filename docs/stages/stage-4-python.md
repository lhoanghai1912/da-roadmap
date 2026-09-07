---
id: stage-4-python
title: "Stage 4 — Python cho phân tích"
sidebar_label: "Stage 4 — Python"
sidebar_position: 5
description: "Tuan 13-16: Python co ban, Pandas, lam sach du lieu, visualization. Portfolio #2."
format: md
---

# STAGE 4 — Python cho phân tích dữ liệu

| | |
|---|---|
| **Thời lượng** | 4 tuần (W13–W16), ~60h |
| **Prerequisite** | Stage 3 xong, Portfolio #1 đã push |
| **Mục tiêu** | Từ file CSV thô → notebook có insight, tự làm trong ≤ 4h |
| **Output** | **PORTFOLIO #2 — EDA Notebook** |
| **Checkpoint** | CHECKPOINT 3 |

**Nếu đã biết lập trình:** rút W13 còn 2 buổi, dồn thời gian sang W15 (làm sạch dữ liệu) — đó mới là phần chiếm nhiều thời gian nhất trong công việc thật.

:::tip Lý thuyết đi kèm
Bảng chuyển đổi SQL ↔ pandas, làm sạch có log, quy trình EDA 6 bước — định nghĩa + ví dụ + bài tập có đáp án: [L4 — Python & Pandas](../ly-thuyet/l4-python.md) · tra từ: [Từ điển thuật ngữ](../glossary.md)
:::

---

## Dataset Stage này

**Olist Brazilian E-commerce** — [Kaggle](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)
9 file CSV có quan hệ thật: orders, order_items, payments, reviews, customers, sellers, products, geolocation, category_translation. Dữ liệu bẩn có thật (ngày thiếu, category tiếng Bồ, địa chỉ không chuẩn) → tập cleaning đúng nghĩa.

```bash
cd ~/Documents/Study/DA/da-portfolio/data
mkdir olist && cd olist
# giải nén file tải từ Kaggle vào đây
```

---

# TUẦN 13 — Python cơ bản

## Nội dung cần học — W13

| Khái niệm | Là gì | Học ở đâu |
|---|---|---|
| **Kiểu dữ liệu Python** | `int/float/str/bool` · `list/dict/set/tuple` | [L4 §4.0](/ly-thuyet/l4-python#chay-ngay) |
| **Luồng điều khiển** | `if/for/while` · `enumerate` · `zip` | [Từ điển](/glossary) |
| **Hàm + type hint** | `def growth(cur: float, prev: float) -> float:` | [Từ điển](/glossary) |
| **Comprehension** | `[x for x in data if ...]` — thay cho vòng lặp dài | [Từ điển](/glossary) |
| **`try/except`** | Bắt `ZeroDivisionError`, `KeyError`, `ValueError` | [Từ điển](/glossary) |
| **Jupyter workflow** | Markdown cell xen kẽ · **`Restart & Run All` phải chạy sạch** | [L4 §4.1](/ly-thuyet/l4-python#dataframe) |

**Hướng đi trong tuần**

1. **Nếu đã biết lập trình** (React Native/TypeScript): rút W13 còn 2 buổi, dồn thời gian sang W15 — làm sạch dữ liệu mới là phần tốn công nhất khi đi làm.
2. **T2** — Kiểu dữ liệu. Học đủ dùng, không đào sâu OOP/decorator — không cần cho phân tích.
3. **T3** — Hàm + comprehension. Viết 1 hàm `growth(cur, prev)` xử lý được mẫu số bằng 0 — dùng lại suốt về sau.
4. **T4–T5** — 15 bài tập. Cố tình **chưa dùng pandas**: đọc CSV bằng module `csv` để hiểu pandas đang giúp mình cái gì.
5. **T6** — Kỷ luật Jupyter: mỗi phần có markdown cell giải thích, cuối buổi luôn `Restart & Run All`.

**Dấu hiệu đã hiểu:** notebook chạy lại từ đầu không lỗi, không cần chạy tay từng cell theo thứ tự riêng.

## W13.1 — Kiểu dữ liệu & biến (T2, 2h)

| ID | Chủ đề | Bài tập | Xong |
|---|---|---|---|
| W13.1.1 | `int`, `float`, `str`, `bool` | Ép kiểu qua lại, `type()` | ☐ |
| W13.1.2 | `list` | Thêm/xóa/cắt lát `[1:5]`, `[::-1]` | ☐ |
| W13.1.3 | `dict` | Truy cập, `.get()` có default, duyệt `.items()` | ☐ |
| W13.1.4 | `tuple`, `set` | Set khử trùng lặp, phép giao/hợp | ☐ |
| W13.1.5 | Chuỗi | `.strip()`, `.lower()`, `.split()`, `.replace()`, f-string | ☐ |

## W13.2 — Luồng điều khiển & hàm (T3, 2h)

| ID | Chủ đề | Bài tập | Xong |
|---|---|---|---|
| W13.2.1 | `if/elif/else` | Phân loại giá trị theo ngưỡng | ☐ |
| W13.2.2 | `for`, `while`, `enumerate`, `zip` | Duyệt list, duyệt song song 2 list | ☐ |
| W13.2.3 | `def` + tham số mặc định + type hint | `def growth(cur: float, prev: float) -> float:` | ☐ |
| W13.2.4 | List/dict comprehension | `[x for x in data if x["status"] == "active"]` | ☐ |
| W13.2.5 | `try/except` | Bắt `ZeroDivisionError`, `KeyError`, `ValueError` | ☐ |
| W13.2.6 | Đọc/ghi file, `with open()` | Đọc CSV bằng module `csv` (chưa dùng pandas) | ☐ |

## W13.3 — 15 bài tập (T4 + T5, 4h)

Theo `techstack/fundamentals/PYTHON.md` Level 1:

1. Đọc CSV, tính trung bình 1 cột (không dùng pandas)
2. Lọc list dict theo điều kiện
3. Hàm làm sạch số điện thoại (bỏ ký tự thừa, chuẩn hóa đầu số)
4. Đếm tần suất từ trong file text
5. Công cụ CLI: nhập → xử lý → xuất
6. Hàm tính growth rate, xử lý mẫu số = 0
7. Gom nhóm list dict theo 1 khóa (tự viết, tương đương GROUP BY)
8. Tìm top N phần tử theo giá trị
9. Merge 2 list dict theo khóa chung (tự viết, tương đương JOIN)
10. Chuẩn hóa chuỗi ngày về `YYYY-MM-DD`
11. Tính median không dùng thư viện
12. Phát hiện outlier bằng IQR, trả về danh sách
13. Đọc nhiều file CSV trong thư mục, gộp lại
14. Hàm nhận list số → trả dict thống kê mô tả
15. Ghi kết quả ra file CSV mới

Lưu vào `notebooks/w13-python-basics.ipynb`.

> Bài 7 và 9 (tự viết GROUP BY và JOIN) quan trọng nhất — làm xong sẽ hiểu bản chất pandas làm gì ở bên dưới, không chỉ học thuộc tên hàm.

## W13.4 — Jupyter workflow (T6, 2h)

| ID | Việc | Xong |
|---|---|---|
| W13.4.1 | Phím tắt: `Shift+Enter`, `Esc+A/B`, `Esc+DD`, `Esc+M` | ☐ |
| W13.4.2 | Markdown cell — dùng để viết diễn giải giữa các bước | ☐ |
| W13.4.3 | `Restart & Run All` — notebook phải chạy từ đầu đến cuối không lỗi | ☐ |
| W13.4.4 | `%%time` đo thời gian chạy cell | ☐ |

**Quy tắc:** notebook nộp cho người khác đọc **phải** chạy được bằng `Restart & Run All`. Notebook chạy lộn xộn theo thứ tự thủ công là dấu hiệu người mới.

---

# TUẦN 14 — Pandas

## Nội dung cần học — W14

| Khái niệm | Là gì | Học ở đâu |
|---|---|---|
| **DataFrame / Series** | Bảng SQL trong bộ nhớ / một cột | [L4 §4.1](/ly-thuyet/l4-python#dataframe) |
| **7 lệnh khám phá** | `shape · head · dtypes · isna · describe · value_counts · duplicated` | [L4 §4.1](/ly-thuyet/l4-python#dataframe) |
| **`loc` vs `iloc`** | Theo **nhãn** vs theo **vị trí** | [L4 §4.3](/ly-thuyet/l4-python#loc-iloc) |
| **Boolean mask** | `df[df.a > 1]` ↔ `WHERE`. Nhiều điều kiện **bắt buộc có ngoặc** | [L4 §4.2](/ly-thuyet/l4-python#sql-pandas) |
| **`groupby().agg()`** | ↔ `GROUP BY` | [L4 §4.2](/ly-thuyet/l4-python#sql-pandas) |
| **`transform`** | ↔ window function — giữ nguyên số dòng | [L4 §4.2](/ly-thuyet/l4-python#sql-pandas) |
| **`merge`** | ↔ `JOIN`, có `how=` — **fan-out xảy ra y hệt SQL** | [L4 §4.2](/ly-thuyet/l4-python#sql-pandas) · [L2 §2.4](/ly-thuyet/l2-sql#join) |
| **`pivot_table` / `melt`** | Xoay ngang / chuyển wide sang long | [L4 §4.2](/ly-thuyet/l4-python#sql-pandas) |

**Hướng đi trong tuần**

1. **Nguyên tắc xuyên suốt:** học pandas bằng cách **dịch từ SQL đã biết**, không học như ngôn ngữ mới. Mở [bảng chuyển đổi](/ly-thuyet/l4-python#sql-pandas) để cạnh bàn phím.
2. **T2** — 7 lệnh khám phá trên Olist. Kiểm tra grain bằng `duplicated(subset=[...])`.
3. **T3** — `loc/iloc` + boolean mask. Bẫy ngoặc: `df[(df.a>1) & (df.b<2)]`.
4. **T4** — `groupby` → `transform` → `rank/shift/rolling/cumsum`. Đối chiếu từng cái với window function đã học ở W7.
5. **T5** — `merge`. **Đếm số dòng trước và sau**, đúng thói quen của W5.
6. **T6–T7** — Làm lại 10 query SQL của W8 bằng pandas, **so khớp từng con số**. Lệch 1 đồng cũng phải tìm ra nguyên nhân — đây là buổi học được nhiều nhất cả stage.

**Dấu hiệu đã hiểu:** nhìn `df.groupby(...).agg(...)` là đọc ra ngay câu SQL tương đương và ngược lại.

## W14.1 — Nạp và khám phá (T2, 2h)

| ID | Việc | Cú pháp | Xong |
|---|---|---|---|
| W14.1.1 | Đọc CSV | `pd.read_csv(path, parse_dates=["col"])` | ☐ |
| W14.1.2 | Xem nhanh | `.head()`, `.tail()`, `.sample(5)` | ☐ |
| W14.1.3 | Cấu trúc | `.shape`, `.info()`, `.dtypes`, `.columns` | ☐ |
| W14.1.4 | Thống kê | `.describe()`, `.describe(include='object')` | ☐ |
| W14.1.5 | Giá trị duy nhất | `.nunique()`, `.value_counts()`, `.value_counts(normalize=True)` | ☐ |
| W14.1.6 | Kiểm tra grain | `df.duplicated(subset=["order_id"]).sum()` | ☐ |

**Việc đầu tiên với mọi dataset mới:** `.info()` → xem kiểu dữ liệu và số dòng thiếu · `.describe()` → xem khoảng giá trị bất thường · kiểm tra grain → xác nhận 1 dòng đại diện cho cái gì.

## W14.2 — Chọn lọc dữ liệu (T3, 2h)

| ID | Chủ đề | Xong |
|---|---|---|
| W14.2.1 | Chọn cột: `df["a"]` vs `df[["a","b"]]` | ☐ |
| W14.2.2 | `.loc[]` theo nhãn, `.iloc[]` theo vị trí | ☐ |
| W14.2.3 | Boolean mask: `df[df["sales"] > 100]` | ☐ |
| W14.2.4 | Nhiều điều kiện: `&`, `|`, `~` + **bắt buộc có ngoặc** | ☐ |
| W14.2.5 | `.isin()`, `.between()`, `.str.contains()` | ☐ |
| W14.2.6 | `.query("sales > 100 and region == 'West'")` | ☐ |
| W14.2.7 | `.sort_values()`, `.nlargest()`, `.nsmallest()` | ☐ |

**Bẫy:** `df[df.a > 1 & df.b < 2]` sai vì `&` ưu tiên cao hơn `>`. Phải viết `df[(df.a > 1) & (df.b < 2)]`.

## W14.3 — Biến đổi và tổng hợp (T4, 2h)

| ID | Chủ đề | Tương đương SQL | Xong |
|---|---|---|---|
| W14.3.1 | Tạo cột mới: `df["margin"] = df.profit / df.sales` | `SELECT ... AS` | ☐ |
| W14.3.2 | `.assign()` (nối chuỗi được) | | ☐ |
| W14.3.3 | `.groupby("col").agg({"sales":"sum"})` | `GROUP BY` | ☐ |
| W14.3.4 | Groupby nhiều cột, nhiều hàm | | ☐ |
| W14.3.5 | `.reset_index()` sau groupby | | ☐ |
| W14.3.6 | `.transform()` — giữ nguyên số dòng | Window function | ☐ |
| W14.3.7 | `.rank()`, `.shift()`, `.rolling(3).mean()`, `.cumsum()` | `RANK`, `LAG`, moving avg, running total | ☐ |
| W14.3.8 | `.pivot_table()` | `CASE WHEN` pivot | ☐ |
| W14.3.9 | `.melt()` — wide sang long | | ☐ |
| W14.3.10 | `.apply()` — dùng khi không có hàm sẵn (chậm) | | ☐ |

## W14.4 — Merge (T5, 2h)

| ID | Chủ đề | Xong |
|---|---|---|
| W14.4.1 | `pd.merge(a, b, on="key", how="inner/left/outer")` | ☐ |
| W14.4.2 | Merge nhiều khóa, khóa tên khác nhau (`left_on`/`right_on`) | ☐ |
| W14.4.3 | `indicator=True` để kiểm tra dòng nào khớp/không khớp | ☐ |
| W14.4.4 | Kiểm tra fan-out: so `len(df)` trước và sau merge | ☐ |
| W14.4.5 | `pd.concat()` nối dọc nhiều file | ☐ |
| W14.4.6 | `validate="one_to_many"` — pandas tự báo lỗi nếu quan hệ sai | ☐ |

> `validate=` là công cụ chống fan-out tốt nhất mà người mới hay bỏ qua. Viết `pd.merge(orders, items, on="order_id", validate="one_to_many")` — nếu quan hệ thực tế không đúng như bạn nghĩ, pandas báo lỗi ngay thay vì âm thầm nhân đôi dữ liệu.

## W14.5 — Bài tập đối chiếu (T6 + T7, 5h)

**Làm lại toàn bộ 12 query báo cáo tháng của W8 bằng pandas**, so khớp kết quả với SQL. Lưu `notebooks/w14-pandas-vs-sql.ipynb`, mỗi phần gồm: query SQL (markdown) → code pandas → so sánh kết quả.

Kết thúc buổi, viết bảng đối chiếu vào `notes/sql-pandas-map.md`:

| SQL | Pandas |
|---|---|
| `SELECT a, b` | `df[["a","b"]]` |
| `WHERE x > 1` | `df[df.x > 1]` |
| `GROUP BY a` | `df.groupby("a")` |
| `HAVING` | `.groupby().filter()` hoặc lọc sau agg |
| `JOIN` | `pd.merge()` |
| `ORDER BY x DESC` | `.sort_values("x", ascending=False)` |
| `LIMIT 10` | `.head(10)` |
| `COUNT(DISTINCT x)` | `.nunique()` |
| `LAG(x)` | `.shift(1)` |
| `SUM() OVER()` | `.transform("sum")` |
| `ROW_NUMBER()` | `.cumcount() + 1` |

---

# TUẦN 15 — Làm sạch dữ liệu

## Nội dung cần học — W15

| Khái niệm | Là gì | Học ở đâu |
|---|---|---|
| **Log làm sạch** | Bảng "trước → sau" từng bước — thứ phân biệt notebook nghiệp dư và chuyên nghiệp | [L4 §4.4](/ly-thuyet/l4-python#lam-sach) |
| **Missing: vì sao thiếu** | Thiếu ngẫu nhiên khác thiếu có hệ thống. Điền mean sai chỗ = bịa dữ liệu | [L4 §4.4](/ly-thuyet/l4-python#lam-sach) |
| **Trùng theo khóa nghiệp vụ** | Cột ID nhân tạo che mất dòng trùng thật | [L4 §4.1](/ly-thuyet/l4-python#dataframe) |
| **Chuẩn hóa text/ngày** | `.str.strip().str.lower()` · `pd.to_datetime` · gộp biến thể | [L4 §4.4](/ly-thuyet/l4-python#lam-sach) |
| **Outlier** | Chỉ loại khi **chứng minh được là lỗi** | [L1 §1.4](/ly-thuyet/l1-foundation#iqr-outlier) |
| **Kiểm tra logic** | Ship trước order · số lượng ≤ 0 · giá âm | [L4 §4.4](/ly-thuyet/l4-python#lam-sach) |

**Hướng đi trong tuần**

1. **T2** — Dựng khung `log` dùng lại được ([mẫu ở L4 §4.4](/ly-thuyet/l4-python#lam-sach)). Mọi bước xóa/sửa đều đi qua khung này.
2. **T3** — Missing. Với mỗi cột thiếu, **trả lời "vì sao thiếu" trước khi quyết định xử lý**. Ví dụ Olist: thiếu ngày giao vì đơn chưa giao → giữ nguyên, lọc theo `order_status` khi phân tích.
3. **T4** — Trùng lặp: xác định khóa nghiệp vụ trước, rồi mới `drop_duplicates(subset=...)`.
4. **T5** — Chuẩn hóa text và ngày. Kiểm tra bằng `value_counts()` để phát hiện biến thể ("HCM" vs "Ho Chi Minh").
5. **T6–T7** — Notebook cleaning hoàn chỉnh, kết bằng bảng log và **danh sách câu hỏi cần hỏi người vận hành** — thứ nên đưa vào mục Hạn chế thay vì tự quyết im lặng.

**Dấu hiệu đã hiểu:** không xóa dòng nào mà không ghi lại số lượng và lý do.

Đây là tuần quan trọng nhất Stage 4. Trong việc thật, làm sạch chiếm phần lớn thời gian.

## W15.1 — Missing data (T2, 2h)

| ID | Việc | Xong |
|---|---|---|
| W15.1.1 | Đếm thiếu: `df.isna().sum()`, `df.isna().mean()` (tỷ lệ %) | ☐ |
| W15.1.2 | Trực quan hóa thiếu: heatmap `sns.heatmap(df.isna())` | ☐ |
| W15.1.3 | Phân loại nguyên nhân thiếu: ngẫu nhiên hay có hệ thống | ☐ |
| W15.1.4 | `.dropna()` — chỉ khi thiếu ít và ngẫu nhiên | ☐ |
| W15.1.5 | `.fillna()` — 0, mean, median, mode, ffill/bfill | ☐ |
| W15.1.6 | Tạo cột cờ `is_missing` trước khi điền | ☐ |
| W15.1.7 | **Ghi log**: mỗi thao tác ghi rõ bỏ/điền bao nhiêu dòng, vì sao | ☐ |

**Nguyên tắc:** không điền missing một cách máy móc. Ngày giao hàng thiếu ở đơn chưa giao — đó là thông tin, không phải lỗi. Điền bằng median sẽ tạo ra "đơn đã giao" không có thật.

## W15.2 — Trùng lặp & kiểu dữ liệu (T3, 2h)

| ID | Việc | Xong |
|---|---|---|
| W15.2.1 | `.duplicated()` toàn dòng vs theo subset khóa | ☐ |
| W15.2.2 | `.drop_duplicates(subset=[...], keep="last")` | ☐ |
| W15.2.3 | Trùng "mềm": cùng khách nhưng tên viết khác nhau | ☐ |
| W15.2.4 | Ép kiểu: `.astype()`, `pd.to_numeric(errors="coerce")` | ☐ |
| W15.2.5 | Ngày: `pd.to_datetime(errors="coerce")`, xử lý nhiều định dạng | ☐ |
| W15.2.6 | `category` dtype để tiết kiệm bộ nhớ | ☐ |

## W15.3 — Chuẩn hóa & outlier (T4, 2h)

| ID | Việc | Xong |
|---|---|---|
| W15.3.1 | Text: `.str.strip().str.lower()`, bỏ dấu, `.str.replace(regex=True)` | ☐ |
| W15.3.2 | Chuẩn hóa danh mục: map giá trị về chuẩn chung | ☐ |
| W15.3.3 | Dịch category tiếng Bồ sang tiếng Anh (Olist có sẵn bảng dịch) | ☐ |
| W15.3.4 | Outlier bằng IQR | ☐ |
| W15.3.5 | Outlier bằng z-score, so sánh 2 phương pháp | ☐ |
| W15.3.6 | Kiểm tra logic: ngày giao < ngày đặt? giá âm? số lượng = 0? | ☐ |
| W15.3.7 | Quyết định giữ/loại/winsorize từng nhóm outlier, ghi lý do | ☐ |

## W15.4 — Pipeline làm sạch (T5 + T6, 4h)

Viết hàm làm sạch có thể chạy lại, mỗi bước in log:

```python
def clean_orders(df: pd.DataFrame) -> pd.DataFrame:
    """Lam sach bang orders. In log tung buoc."""
    n0 = len(df)
    df = df.drop_duplicates(subset=["order_id"])
    print(f"Bo trung lap: {n0 - len(df)} dong")

    n1 = len(df)
    df = df[df["order_status"] != "unavailable"]
    print(f"Bo don unavailable: {n1 - len(df)} dong")

    df["order_purchase_timestamp"] = pd.to_datetime(
        df["order_purchase_timestamp"], errors="coerce"
    )
    print(f"Ngay khong parse duoc: {df['order_purchase_timestamp'].isna().sum()} dong")

    print(f"Ket qua: {n0} -> {len(df)} dong ({len(df)/n0:.1%} giu lai)")
    return df
```

**Deliverable W15:** `notebooks/w15-cleaning.ipynb` — làm sạch đủ 9 bảng Olist, có log trước/sau từng bước, và bảng tóm tắt "dữ liệu đã thay đổi những gì".

---

# TUẦN 16 — Visualization + PORTFOLIO #2

## Nội dung cần học — W16

| Khái niệm | Là gì | Học ở đâu |
|---|---|---|
| **Chart khám phá vs chart trình bày** | Cho mình (nhanh, xấu cũng được) vs cho người khác (có kết luận, chú thích) | [L4 §4.5](/ly-thuyet/l4-python#visualization) |
| **Tiêu đề = câu kết luận** | "Furniture chiếm 32% doanh thu nhưng chỉ 6% lợi nhuận", không phải "Doanh thu theo Category" | [L4 §4.5](/ly-thuyet/l4-python#visualization) |
| **Bộ 5 chart EDA** | hist · barh · time series · scatter · heatmap tương quan | [L4 §4.5](/ly-thuyet/l4-python#visualization) |
| **Bẫy heatmap** | Chỉ bắt quan hệ tuyến tính — luôn vẽ scatter trước khi tin | [L1 §1.5](/ly-thuyet/l1-foundation#tuong-quan) |
| **Quy trình EDA 6 bước** | Câu hỏi → Dữ liệu → Làm sạch → Findings → Hạn chế → Đề xuất | [L4 §4.6](/ly-thuyet/l4-python#quy-trinh-eda) |

**Hướng đi trong tuần**

1. **T2** — Bộ 5 chart, vẽ nhanh 20 cái để **tìm** cái đáng kể. Giai đoạn này xấu không sao.
2. **T3** — Chuyển từ khám phá sang trình bày: giữ 3–5 chart, mỗi cái đặt tiêu đề là câu kết luận có số.
3. **T4** — **Viết phần 1 (Câu hỏi & giả thuyết) trước khi viết code** cho Portfolio #2. Tối thiểu 3 câu hỏi, mỗi câu kèm giả thuyết và cách kiểm chứng.
4. **T5–T7** — Ráp notebook theo đúng 6 mục. Phần **Hạn chế** không được bỏ trống — đó là chỗ nhà tuyển dụng đọc kỹ nhất.
5. **CN** — `Restart & Run All` + rà [CHECKPOINT 3](#checkpoint-3).

**Dấu hiệu đã hiểu:** từ CSV thô ra notebook có insight trong ≤ 4h mà không copy code mẫu.

## W16.1 — Matplotlib & Seaborn (T2 + T3, 4h)

| ID | Chart | Cú pháp | Dùng khi | Xong |
|---|---|---|---|---|
| W16.1.1 | Line | `sns.lineplot` | Xu hướng thời gian | ☐ |
| W16.1.2 | Bar | `sns.barplot`, `sns.countplot` | So sánh nhóm | ☐ |
| W16.1.3 | Histogram | `sns.histplot(bins=30)` | Phân phối 1 biến | ☐ |
| W16.1.4 | Box / Violin | `sns.boxplot` | Phân phối theo nhóm + outlier | ☐ |
| W16.1.5 | Scatter | `sns.scatterplot(hue=..., size=...)` | Quan hệ 2 biến | ☐ |
| W16.1.6 | Heatmap tương quan | `sns.heatmap(df.corr(numeric_only=True), annot=True)` | Quan hệ nhiều biến | ☐ |
| W16.1.7 | Subplot | `fig, axes = plt.subplots(2, 2, figsize=(14,10))` | Nhiều chart 1 khung | ☐ |
| W16.1.8 | Tùy chỉnh | Title, label có đơn vị, `plt.tight_layout()`, `sns.set_theme()` | Luôn luôn | ☐ |

**Quy tắc:** mỗi chart phải có tiêu đề là câu kết luận, nhãn trục có đơn vị, và không có phần tử thừa. Chart không có nhãn trục = chart chưa xong.

## W16.2 — Quy trình EDA chuẩn (T4, 2h)

| Bước | Nội dung |
|---|---|
| 1. Câu hỏi | Viết trước 3–5 câu hỏi business, **trước khi** mở dữ liệu |
| 2. Nạp & khảo sát | shape, dtypes, missing, grain |
| 3. Univariate | Từng biến: phân phối, outlier, giá trị bất thường |
| 4. Bivariate | Cặp biến: tương quan, so sánh nhóm |
| 5. Theo thời gian | Xu hướng, mùa vụ, điểm gãy |
| 6. Phân khúc | Cắt theo nhóm khách/vùng/kênh, tìm khác biệt |
| 7. Tổng hợp | Findings + hạn chế + đề xuất |

**Vì sao viết câu hỏi trước:** nếu mở dữ liệu rồi mới nghĩ, sẽ sa vào vẽ chart lung tung 3 tiếng mà không ra kết luận nào. Câu hỏi trước → phân tích có hướng.

## W16.3 — PORTFOLIO #2 (T5–T7, 7h)

### Spec: EDA — Olist Brazilian E-commerce

**Câu hỏi gợi ý (chọn 3–5):**
1. Yếu tố nào ảnh hưởng đến điểm đánh giá của khách?
2. Thời gian giao hàng có liên quan gì tới điểm review?
3. Bang nào có giá trị đơn cao nhất? Vì sao?
4. Phương thức thanh toán khác nhau có AOV khác nhau không?
5. Danh mục nào tăng trưởng nhanh nhất? Danh mục nào đang suy giảm?

**Cấu trúc notebook bắt buộc:**

| Mục | Nội dung |
|---|---|
| 1. Câu hỏi & giả thuyết | 3–5 câu hỏi + giả thuyết ban đầu |
| 2. Dữ liệu | Bảng nào, khoảng thời gian, grain, số dòng, bộ lọc |
| 3. Làm sạch | Từng bước có log, tóm tắt trước/sau |
| 4. Findings | Mỗi finding = 1 chart + 1 đoạn diễn giải **có số cụ thể** |
| 5. Hạn chế | Ít nhất 3 điều phân tích này không kết luận được |
| 6. Đề xuất | 2–3 hành động, gắn với finding, kèm metric để đo |

**Tiêu chí đạt:**
- [ ] `Restart & Run All` chạy hết không lỗi
- [ ] Mọi chart có title kết luận + nhãn trục có đơn vị
- [ ] Mỗi finding có ít nhất 1 con số
- [ ] Có ít nhất 1 chỗ nói rõ "đây là tương quan, chưa phải nhân quả"
- [ ] Có mục Hạn chế
- [ ] README riêng trong `02-eda-olist/` tóm tắt 1 trang

```bash
git add 02-eda-olist/ notebooks/
git commit -m "feat: portfolio #2 - EDA olist e-commerce"
git push
```

---

## ✅ CHECKPOINT 3 (cuối W16) {#checkpoint-3}

Pass khi **cả 5** điều đúng:

- [ ] Từ file CSV thô đi tới notebook có insight trong ≤ 4h, không copy code mẫu
- [ ] Giải thích được `groupby().agg()` tương ứng `GROUP BY` nào, `merge` tương ứng `JOIN` nào
- [ ] Biết dùng `.transform()` khi nào thay vì `.agg()`
- [ ] Notebook chạy được bằng `Restart & Run All`
- [ ] Portfolio #2 đã public trên GitHub

---

## Bẫy thường gặp

| Bẫy | Hậu quả | Cách tránh |
|---|---|---|
| `SettingWithCopyWarning` | Sửa không ăn vào df gốc | Dùng `.loc[]` hoặc `.copy()` khi tạo lát cắt |
| Quên ngoặc trong điều kiện kép | Lỗi hoặc kết quả sai | `(a) & (b)` |
| Dùng `.apply()` cho mọi thứ | Chậm gấp hàng chục lần | Ưu tiên hàm vectorized sẵn có |
| Điền missing bằng 0 vô tội vạ | Bóp méo trung bình | Xét nguyên nhân thiếu trước |
| Merge không kiểm tra số dòng | Fan-out âm thầm | `validate=` + so `len()` |
| Notebook chạy lộn xộn | Người khác không tái tạo được | `Restart & Run All` trước khi nộp |
| Vẽ 30 chart không kết luận | Tốn giờ, không ra insight | Viết câu hỏi trước khi mở dữ liệu |

**Tiếp theo:** [Stage 5 →](./stage-5-statistics-abtest)
