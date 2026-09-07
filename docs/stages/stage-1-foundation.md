---
id: stage-1-foundation
title: "Stage 1 — Nền tảng dữ liệu & Spreadsheet"
sidebar_label: "Stage 1 — Nền tảng"
sidebar_position: 2
description: "Tuan 1-2: grain, kieu du lieu, pivot table, thong ke mo ta, chon dung loai chart."
format: md
---

# STAGE 1 — Nền tảng: Tư duy dữ liệu, Spreadsheet, Thống kê mô tả

| | |
|---|---|
| **Thời lượng** | 2 tuần (W1–W2), ~30h |
| **Prerequisite** | Stage 0 đã qua cổng ra |
| **Mục tiêu** | Nhìn một bảng dữ liệu lạ và biết phải hỏi gì, đo gì, vẽ gì |
| **Output** | 1 sheet pivot phân tích + 1 summary sheet thống kê mô tả |
| **Checkpoint** | CHECKPOINT 1 |

---

## Dataset dùng cho Stage này

**Sample Superstore** — [tải trên Kaggle](https://www.kaggle.com/datasets/vivek468/superstore-dataset-final)
~10.000 dòng, mỗi dòng = 1 dòng đơn hàng. Có cột ngày, region, category, sales, profit, discount → đủ đa dạng để tập pivot và phát hiện outlier.

```bash
# Tải về, để trong data/ (đã gitignore)
mv ~/Downloads/Sample*Superstore*.csv ~/Documents/Study/DA/da-portfolio/data/superstore.csv

# BAT BUOC: file goc ma hoa Windows-1252, KHONG phai UTF-8.
# Khong chuyen thi DuckDB bao loi o dong 13, pandas bao UnicodeDecodeError.
cd ~/Documents/Study/DA/da-portfolio/data
iconv -f WINDOWS-1252 -t UTF-8 superstore.csv > superstore_utf8.csv
```

:::warning Bẫy đầu tiên gần như ai cũng gặp
File Superstore trên Kaggle mã hóa **Windows-1252**, không phải UTF-8 (chứa byte `0xa0`, `0x93`, `0x94`). Đọc thẳng bằng DuckDB sẽ lỗi ngay dòng 13. Trong Python đọc được bằng `pd.read_csv(..., encoding="cp1252")`.
:::

:::tip Lý thuyết đi kèm
Định nghĩa từng khái niệm + ví dụ đã chạy thật + bài tập có đáp án: [L1 — Nền tảng dữ liệu](../ly-thuyet/l1-foundation.md) · tra từ: [Từ điển thuật ngữ](../glossary.md)
:::

---

# TUẦN 1 — Tư duy dữ liệu + Spreadsheet

## W1.1 — Khái niệm nền (T2, 2h)

| ID | Việc | Cách làm | Xong |
|---|---|---|---|
| W1.1.1 | Hiểu cấu trúc bảng | Viết ra giấy: 1 dòng trong `superstore.csv` đại diện cho cái gì? | ☐ |
| W1.1.2 | Xác định **grain** (độ mịn) | Grain = "1 dòng = 1 sản phẩm trong 1 đơn hàng". Ghi vào note | ☐ |
| W1.1.3 | Liệt kê kiểu dữ liệu từng cột | Bảng 3 cột: tên cột · kiểu (số/text/ngày/boolean) · ví dụ giá trị | ☐ |
| W1.1.4 | Hiểu khóa chính / khóa ngoại | `Order ID` có duy nhất không? Vì sao không? | ☐ |
| W1.1.5 | Hiểu NULL | Đếm ô trống mỗi cột. NULL ≠ 0 ≠ chuỗi rỗng — ghi lại khác biệt | ☐ |

**Vì sao grain quan trọng:** đếm `Order ID` khi grain là dòng-sản-phẩm sẽ ra số đơn hàng sai (đếm trùng). Sai grain là nguồn lỗi số 1 của người mới, và nó âm thầm — không báo lỗi, chỉ ra số sai.

**Output W1.1:** file `notes/w1-data-basics.md` trong repo, có bảng kiểu dữ liệu + câu trả lời 5 câu trên.

## W1.2 — Hàm spreadsheet cốt lõi (T3, 2h)

| ID | Hàm | Bài tập trên Superstore | Xong |
|---|---|---|---|
| W1.2.1 | `SUM`, `AVERAGE`, `COUNT`, `COUNTA`, `MAX`, `MIN` | Tổng doanh thu, đơn giá TB, số dòng, số ô trống | ☐ |
| W1.2.2 | `SUMIFS`, `COUNTIFS`, `AVERAGEIFS` | Doanh thu region West năm 2017; số đơn category Furniture | ☐ |
| W1.2.3 | `VLOOKUP` / `XLOOKUP` | Tạo bảng phụ mã region → tên vùng, tra ngược vào bảng chính | ☐ |
| W1.2.4 | `IF`, `IFS`, `IFERROR` | Cột phân loại: profit > 0 → "Lãi", = 0 → "Hòa", < 0 → "Lỗ" | ☐ |
| W1.2.5 | Hàm ngày: `YEAR`, `MONTH`, `EOMONTH`, `TEXT` | Tạo cột `year_month` dạng `2017-03` | ☐ |
| W1.2.6 | `UNIQUE`, `SORT`, `FILTER` (Sheets) | Liệt kê danh sách category duy nhất | ☐ |

## W1.3 — Pivot Table (T4, 2h)

| ID | Việc | Xong |
|---|---|---|
| W1.3.1 | Pivot 1 chiều: doanh thu theo category | ☐ |
| W1.3.2 | Pivot 2 chiều: doanh thu theo tháng (dòng) × region (cột) | ☐ |
| W1.3.3 | Thêm measure thứ 2: profit bên cạnh sales | ☐ |
| W1.3.4 | Tính cột `profit_margin = profit / sales` trong pivot | ☐ |
| W1.3.5 | Thêm % growth so tháng trước (MoM) | ☐ |
| W1.3.6 | Dùng slicer/filter: lọc theo năm | ☐ |
| W1.3.7 | Sắp xếp giảm dần, lấy top 10 sản phẩm | ☐ |

**Công thức MoM:** `(tháng_này - tháng_trước) / tháng_trước`. Bẫy: tháng trước = 0 → chia 0 → bọc `IFERROR`.

## W1.4 — Làm sạch dữ liệu trong sheet (T5, 2h)

| ID | Việc | Xong |
|---|---|---|
| W1.4.1 | Tìm dòng trùng lặp hoàn toàn (`Remove duplicates`) — ghi lại số dòng bỏ | ☐ |
| W1.4.2 | `TRIM`, `PROPER`, `UPPER` chuẩn hóa cột text | ☐ |
| W1.4.3 | Split cột (Text to Columns) | ☐ |
| W1.4.4 | Conditional formatting: tô đỏ dòng profit âm | ☐ |
| W1.4.5 | Data validation: tạo dropdown cho cột phân loại | ☐ |

## W1.5 — Project buổi tối T6 + T7 (5h)

**Deliverable W1:** Google Sheet tên `W1 — Superstore Sales Overview`, gồm 3 tab:

| Tab | Nội dung bắt buộc |
|---|---|
| `raw` | Dữ liệu gốc, không sửa |
| `clean` | Dữ liệu đã làm sạch + cột dẫn xuất (`year_month`, `profit_margin`, phân loại lãi/lỗ) |
| `pivot` | 4 pivot: doanh thu theo tháng · theo region × category · top 10 sản phẩm · top 10 sản phẩm lỗ nặng nhất |

Thêm ô ghi chú: **5 câu nhận xét**, mỗi câu phải có số kèm theo. Ví dụ dạng cần đạt: "Category X chiếm __% doanh thu nhưng chỉ __% lợi nhuận, biên lợi nhuận __%, thấp hơn trung bình __%."

## W1.6 — Review (CN, 2h)

- [ ] Cập nhật `tracker.csv` dòng week 1
- [ ] Viết đoạn 150 từ: "Tuần này học được gì" vào `notes/weekly-log.md`
- [ ] Liệt kê 3 thứ chưa hiểu → đưa vào đầu tuần sau

---

# TUẦN 2 — Thống kê mô tả + Chọn chart

## W2.1 — Đo lường trung tâm và phân tán (T2, 2h)

| ID | Khái niệm | Bài tập trên cột `Sales` | Xong |
|---|---|---|---|
| W2.1.1 | Mean (trung bình cộng) | `AVERAGE(Sales)` | ☐ |
| W2.1.2 | Median (trung vị) | `MEDIAN(Sales)` — so với mean, chênh bao nhiêu? | ☐ |
| W2.1.3 | Mode (giá trị hay gặp) | `MODE(Sales)` | ☐ |
| W2.1.4 | Range, Min, Max | | ☐ |
| W2.1.5 | Percentile / Quartile | `PERCENTILE(Sales, 0.25/0.5/0.75/0.9)` | ☐ |
| W2.1.6 | Standard deviation, Variance | `STDEV`, `VAR` | ☐ |
| W2.1.7 | Coefficient of variation | `STDEV / AVERAGE` — dùng so sánh độ biến động giữa nhóm khác đơn vị | ☐ |

**Câu hỏi phải trả lời được cuối buổi:** mean của `Sales` cao hơn median bao nhiêu %? Điều đó nói gì về hình dạng phân phối?

> Doanh thu gần như luôn lệch phải: nhiều đơn nhỏ, vài đơn rất lớn. Mean bị vài đơn lớn kéo lên nên không đại diện cho "đơn hàng điển hình". Báo cáo "doanh thu trung bình mỗi đơn" bằng mean là cách nhanh nhất để stakeholder ra quyết định sai. Đây là câu hỏi phỏng vấn rất hay gặp.

## W2.2 — Phân phối và outlier (T3, 2h)

| ID | Việc | Xong |
|---|---|---|
| W2.2.1 | Vẽ histogram cột `Sales` (chia 20 bin) | ☐ |
| W2.2.2 | Nhận diện hình dạng: lệch phải / lệch trái / chuẩn / hai đỉnh | ☐ |
| W2.2.3 | Tính IQR = Q3 − Q1 | ☐ |
| W2.2.4 | Ngưỡng outlier: dưới `Q1 − 1.5×IQR`, trên `Q3 + 1.5×IQR` | ☐ |
| W2.2.5 | Đếm số outlier, xem 10 dòng outlier — chúng là lỗi nhập liệu hay đơn hàng thật? | ☐ |
| W2.2.6 | Viết kết luận: giữ hay loại outlier, **kèm lý do** | ☐ |

**Nguyên tắc:** không loại outlier chỉ vì nó lớn. Loại khi chứng minh được đó là lỗi dữ liệu (ngày 2099, giá âm). Đơn hàng B2B 20.000$ là dữ liệu thật — loại đi là bóp méo thực tế.

## W2.3 — Tương quan cơ bản (T4, 2h)

| ID | Việc | Xong |
|---|---|---|
| W2.3.1 | Vẽ scatter `Discount` vs `Profit` | ☐ |
| W2.3.2 | Tính `CORREL(Discount, Profit)` | ☐ |
| W2.3.3 | Diễn giải hệ số: dấu (+/−) và độ mạnh | ☐ |
| W2.3.4 | Viết 3 giả thuyết giải thích mối quan hệ đó | ☐ |
| W2.3.5 | Viết 1 lý do vì sao **không** kết luận "giảm giá gây lỗ" từ con số này | ☐ |

**Correlation ≠ causation.** Có thể mặt hàng khó bán vốn dĩ biên lợi nhuận thấp mới hay bị giảm giá — biến ẩn (confounder) là "loại mặt hàng", không phải discount gây ra lỗ. Ghi nhớ cách diễn đạt này, dùng lại trong phỏng vấn.

## W2.4 — Chọn đúng loại chart (T5, 2h)

| ID | Mục đích | Chart đúng | Bài tập |
|---|---|---|---|
| W2.4.1 | Xu hướng theo thời gian | Line | Doanh thu 48 tháng | ☐ |
| W2.4.2 | So sánh giữa hạng mục | Bar ngang (nhãn dài) | Doanh thu theo sub-category | ☐ |
| W2.4.3 | Phân phối 1 biến | Histogram / Box plot | `Sales` | ☐ |
| W2.4.4 | Quan hệ 2 biến số | Scatter | `Discount` vs `Profit` | ☐ |
| W2.4.5 | Cấu phần trong tổng | Stacked bar (**không dùng pie quá 4 lát**) | Doanh thu theo category qua các năm | ☐ |
| W2.4.6 | Một con số quan trọng | Card/Big number kèm % so kỳ trước | Tổng doanh thu YTD | ☐ |

**Ba lỗi chart phải tránh:** trục Y không bắt đầu từ 0 ở bar chart (phóng đại khác biệt) · pie chart nhiều hơn 5 lát · dùng 2 trục Y khác thang mà không ghi rõ.

Đọc: *Storytelling with Data* chương 2 và 3.

## W2.5 — Deliverable Stage 1 (T6 + T7, 5h)

**Tab thứ 4 trong sheet W1, đặt tên `stats-summary`:**

| Phần | Yêu cầu |
|---|---|
| Bảng thống kê mô tả | 8 chỉ số (count, mean, median, std, min, Q1, Q3, max) cho `Sales` và `Profit` |
| Phân tích outlier | Ngưỡng IQR, số lượng, quyết định giữ/loại + lý do |
| 4 chart | Line (xu hướng) · Bar (so sánh) · Histogram (phân phối) · Scatter (tương quan) |
| Diễn giải | Mỗi chart 1 câu, có số cụ thể |
| Kết luận | 3 phát hiện + 2 đề xuất hành động |
| Hạn chế | Ít nhất 2 điều dữ liệu này **không** trả lời được |

Push link sheet (share chế độ "ai có link đều xem được") vào README repo.

## W2.6 — CHECKPOINT 1 (CN, 2h)

**Pass khi làm được cả 4 điều sau, không tra cứu:**

- [ ] Tạo pivot 2 chiều + cột % growth so kỳ trước trong ≤ 10 phút
- [ ] Giải thích khi nào dùng mean, khi nào dùng median, kèm ví dụ từ Superstore
- [ ] Cho 1 câu hỏi business bất kỳ → chọn đúng loại chart và nói được lý do
- [ ] Chỉ ra grain của dataset và giải thích hậu quả nếu đếm sai grain

Chưa pass → dành thêm 1 tuần luyện phần yếu, **không** nhảy sang Stage 2. SQL sẽ khó gấp đôi nếu tư duy bảng chưa vững.

---

## Bẫy thường gặp

| Bẫy | Hậu quả | Cách tránh |
|---|---|---|
| Đếm `COUNT(Order ID)` để ra số đơn hàng | Đếm trùng vì grain là dòng-sản-phẩm | Dùng `COUNTUNIQUE` |
| Báo cáo mean cho dữ liệu lệch | Số không đại diện thực tế | Báo cả median, hoặc dùng median |
| Loại outlier cho "đẹp biểu đồ" | Mất thông tin quan trọng nhất | Chỉ loại khi chứng minh là lỗi |
| Nhìn correlation rồi kết luận nhân quả | Đề xuất sai, mất uy tín | Luôn nêu biến ẩn khả dĩ |
| Học hàm Excel nâng cao (VBA, macro) lúc này | Tốn thời gian, chưa cần | Để sau, SQL quan trọng hơn nhiều |

**Tiếp theo:** [Stage 2 →](./stage-2-sql)
