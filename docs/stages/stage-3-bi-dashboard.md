---
id: stage-3-bi-dashboard
title: "Stage 3 — BI & Dashboard"
sidebar_label: "Stage 3 — BI"
sidebar_position: 4
description: "Tuan 10-12: Looker Studio, Metabase, star schema, nguyen tac thiet ke. Portfolio #1."
format: md
---

# STAGE 3 — BI & Dashboard

| | |
|---|---|
| **Thời lượng** | 3 tuần (W10–W12), ~45h |
| **Prerequisite** | CHECKPOINT 2 đã pass |
| **Mục tiêu** | Dựng được dashboard mà người khác nhìn vào hiểu ngay và ra được quyết định |
| **Output** | **PORTFOLIO #1 — Sales Performance Dashboard** (public link) |

**Lưu ý macOS:** Power BI Desktop không chạy native trên macOS. Stage này dùng **Looker Studio** (trình duyệt, free) + **Metabase** (Docker, free). Khái niệm học được — data model, measure, filter context, star schema — chuyển thẳng sang Power BI/Tableau sau này. Xem mục cuối file về lộ trình bổ sung Power BI nếu nhắm banking.

---

# TUẦN 10 — Looker Studio

## W10.1 — Kết nối và làm quen (T2, 2h)

| ID | Việc | Xong |
|---|---|---|
| W10.1.1 | Mở [lookerstudio.google.com](https://lookerstudio.google.com), tạo report trống | ☐ |
| W10.1.2 | Kết nối nguồn 1: Google Sheets (file Superstore từ Stage 1) | ☐ |
| W10.1.3 | Kết nối nguồn 2: BigQuery (`thelook_ecommerce`) | ☐ |
| W10.1.4 | Hiểu Dimension (chiều, dạng text/ngày) vs Metric (số đo, tính tổng được) | ☐ |
| W10.1.5 | Đổi kiểu dữ liệu 1 trường sai kiểu về đúng | ☐ |
| W10.1.6 | Đặt aggregation mặc định cho metric (Sum/Average/Count Distinct) | ☐ |

**Phân biệt phải nắm chắc:** Dimension trả lời "chia theo cái gì" (region, tháng, category). Metric trả lời "đo cái gì" (doanh thu, số đơn). Một trường số như `discount` có thể là metric (trung bình discount) hoặc dimension (nhóm theo mức discount) tùy cách dùng.

## W10.2 — Các loại chart (T3, 2h)

| ID | Chart | Bài tập trên Superstore | Xong |
|---|---|---|---|
| W10.2.1 | Scorecard | Tổng doanh thu, tổng đơn, AOV | ☐ |
| W10.2.2 | Scorecard có so sánh | Thêm % thay đổi so kỳ trước | ☐ |
| W10.2.3 | Time series | Doanh thu theo tháng | ☐ |
| W10.2.4 | Bar chart | Doanh thu theo sub-category (ngang, sắp giảm dần) | ☐ |
| W10.2.5 | Stacked bar | Doanh thu theo category qua các năm | ☐ |
| W10.2.6 | Table có heatmap | Top 10 sản phẩm, cột profit tô màu | ☐ |
| W10.2.7 | Scatter | Sales vs Profit theo sản phẩm | ☐ |
| W10.2.8 | Geo map | Doanh thu theo bang/vùng | ☐ |

## W10.3 — Calculated field & Filter (T4, 2h)

| ID | Việc | Công thức mẫu | Xong |
|---|---|---|---|
| W10.3.1 | Field tính toán cơ bản | `Profit / Sales` → profit margin | ☐ |
| W10.3.2 | `CASE` trong Looker Studio | `CASE WHEN Profit < 0 THEN "Lỗ" ELSE "Lãi" END` | ☐ |
| W10.3.3 | Hàm ngày | `TODATE`, trích năm/tháng | ☐ |
| W10.3.4 | Date range control | Thanh chọn khoảng thời gian | ☐ |
| W10.3.5 | Drop-down filter | Lọc theo region, category | ☐ |
| W10.3.6 | Filter ở cấp chart vs cấp trang vs cấp report | Hiểu 3 cấp khác nhau | ☐ |
| W10.3.7 | Chart interaction (cross-filter) | Click bar → các chart khác lọc theo | ☐ |

## W10.4 — Blend data (T5, 2h)

| ID | Việc | Xong |
|---|---|---|
| W10.4.1 | Blend 2 nguồn theo khóa chung (tương đương LEFT JOIN) | ☐ |
| W10.4.2 | Hiểu giới hạn của blend so với JOIN trong SQL | ☐ |
| W10.4.3 | Tạo custom query trực tiếp trong connector BigQuery (dùng query đã viết ở W8) | ☐ |

**Nguyên tắc quan trọng:** làm phép tính nặng ở tầng SQL, không ở tầng BI. Dashboard chỉ nên hiển thị dữ liệu đã được chuẩn bị sẵn. Đây là khác biệt giữa "người kéo thả chart" và "analyst".

## W10.5 — Deliverable W10 (T6 + T7, 5h)

Dashboard 1 trang gồm: 3 scorecard (doanh thu, số đơn, AOV — mỗi cái có % MoM) · 1 time series · 1 bar theo region · 1 table top 10 · 2 filter (thời gian, category). Share link "ai có link đều xem được".

---

# TUẦN 11 — Metabase + Data Modeling

## W11.1 — Dựng Metabase (T2, 2h)

```bash
# Bật Docker Desktop trước
docker run -d -p 3000:3000 -v metabase-data:/metabase.db --name metabase metabase/metabase

# Xem log tới khi thấy "Metabase Initialization COMPLETE"
docker logs -f metabase
# Mở http://localhost:3000 → tạo tài khoản admin
```

| ID | Việc | Xong |
|---|---|---|
| W11.1.1 | Chạy container thành công | ☐ |
| W11.1.2 | Tạo tài khoản admin | ☐ |
| W11.1.3 | Kết nối tới file DuckDB/Postgres đã dựng ở Stage 2 | ☐ |
| W11.1.4 | Đọc `techstack/bi-tools/METABASE.md` Level 1 | ☐ |

> Nếu Metabase không kết nối được DuckDB (driver phụ thuộc phiên bản), thay bằng Postgres:
> ```bash
> docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=devpass --name pg postgres:16
> ```
> rồi nạp CSV vào Postgres bằng DBeaver. Không mất quá 1 buổi cho việc này — nếu tắc, dùng dữ liệu mẫu có sẵn của Metabase và đi tiếp.

## W11.2 — Question & Dashboard trong Metabase (T3, 2h)

| ID | Việc | Xong |
|---|---|---|
| W11.2.1 | Tạo Question bằng giao diện kéo thả (không viết SQL) | ☐ |
| W11.2.2 | Tạo Question bằng SQL editor | ☐ |
| W11.2.3 | SQL question có tham số `{{start_date}}` | ☐ |
| W11.2.4 | Tạo Model (dataset đã curated) từ 1 query phức tạp | ☐ |
| W11.2.5 | Gom 6 question vào 1 Dashboard | ☐ |
| W11.2.6 | Thêm dashboard filter, map filter vào từng card | ☐ |
| W11.2.7 | Tổ chức Collection theo chủ đề | ☐ |
| W11.2.8 | Tạo Pulse/Subscription gửi email định kỳ | ☐ |

## W11.3 — Star schema (T4, 2h)

| ID | Khái niệm | Nội dung | Xong |
|---|---|---|---|
| W11.3.1 | Fact table | Bảng sự kiện, nhiều dòng, chứa số đo + khóa ngoại (orders, events) | ☐ |
| W11.3.2 | Dimension table | Bảng mô tả, ít dòng, chứa thuộc tính (customer, product, date) | ☐ |
| W11.3.3 | Star vs Snowflake | Star: dim phẳng. Snowflake: dim chuẩn hóa nhiều tầng | ☐ |
| W11.3.4 | Grain của fact table | Quyết định trước tiên khi thiết kế | ☐ |
| W11.3.5 | Date dimension | Vì sao cần bảng lịch riêng thay vì dùng cột date | ☐ |
| W11.3.6 | Vẽ sơ đồ star schema cho `thelook_ecommerce` | Trên giấy hoặc draw.io | ☐ |

**Vì sao cần bảng date riêng:** để có được "tuần thứ mấy", "quý", "có phải ngày lễ không", "cùng kỳ năm trước" mà không phải viết logic lặp lại ở mọi query. Và để tháng không có giao dịch vẫn xuất hiện trên biểu đồ (thay vì bị mất dòng).

## W11.4 — Deliverable W11 (T5 + T6, 4h)

Metabase chạy local, có: 1 Model curated · 6 Question (2 GUI, 4 SQL) · 1 Dashboard có filter thời gian và filter phân loại. Chụp màn hình lưu vào `01-sales-dashboard/screenshots/`.

---

# TUẦN 12 — Thiết kế + PORTFOLIO #1

## W12.1 — Nguyên tắc thiết kế (T2 + T3, 4h)

Đọc *Storytelling with Data* chương 3–6. Ghi lại 10 nguyên tắc áp dụng được.

| ID | Nguyên tắc | Áp dụng cụ thể | Xong |
|---|---|---|---|
| W12.1.1 | 1 dashboard = 1 câu hỏi chính | Viết câu hỏi đó lên tiêu đề dashboard | ☐ |
| W12.1.2 | Thứ tự đọc: trái→phải, trên→dưới | Đặt số quan trọng nhất ở góc trên trái | ☐ |
| W12.1.3 | Luôn có mốc so sánh | Mỗi số phải kèm % so kỳ trước hoặc so target | ☐ |
| W12.1.4 | Giảm nhiễu thị giác | Bỏ đường lưới thừa, viền, hiệu ứng 3D, gradient | ☐ |
| W12.1.5 | Màu có mục đích | Xám cho nền, 1 màu nhấn cho thứ cần chú ý | ☐ |
| W12.1.6 | Nhãn trực tiếp thay vì legend | Ghi tên ngay cạnh đường line | ☐ |
| W12.1.7 | Sắp xếp có ý nghĩa | Bar chart sắp theo giá trị, không theo bảng chữ cái | ☐ |
| W12.1.8 | Tiêu đề chart là câu kết luận | "Doanh thu miền Tây giảm 3 tháng liên tiếp" thay vì "Doanh thu theo miền" | ☐ |
| W12.1.9 | Tối đa 5–7 chart mỗi trang | Nhiều hơn thì tách trang | ☐ |
| W12.1.10 | Ghi rõ nguồn + thời điểm cập nhật | Cuối trang | ☐ |

**Bài tập:** lấy dashboard làm ở W10, áp dụng 10 nguyên tắc, chụp ảnh trước/sau đặt cạnh nhau.

## W12.2 — PORTFOLIO #1 (T4–T7, 9h)

### Spec: Sales Performance Dashboard

**Câu hỏi cần trả lời:**
1. Doanh thu tháng này so tháng trước và so cùng kỳ năm trước thế nào?
2. Vùng/danh mục nào kéo tăng, vùng nào kéo giảm?
3. Sản phẩm nào bán chạy nhưng đang lỗ?

**Trang 1 — Tổng quan**

| Vị trí | Thành phần | Chi tiết |
|---|---|---|
| Trên cùng | 4 scorecard | Doanh thu · Số đơn · AOV · Biên lợi nhuận — mỗi cái kèm % MoM |
| Giữa trái | Time series | Doanh thu 24 tháng + đường moving average 3 tháng |
| Giữa phải | Bar ngang | Doanh thu theo region, sắp giảm dần |
| Dưới | Stacked bar | Cơ cấu category theo quý |
| Đầu trang | Filter | Khoảng thời gian, region, category |

**Trang 2 — Sản phẩm & Lợi nhuận**

| Vị trí | Thành phần | Chi tiết |
|---|---|---|
| Trái | Scatter | Sales (trục X) vs Profit (trục Y), mỗi điểm 1 sản phẩm, chia màu theo category |
| Phải trên | Table | Top 10 doanh thu |
| Phải dưới | Table | Top 10 lỗ nặng nhất, kèm mức discount trung bình |
| Dưới cùng | Bar | Biên lợi nhuận theo sub-category |

**README bắt buộc** (`01-sales-dashboard/README.md`) — theo đúng 6 mục:

```markdown
# Sales Performance Dashboard

**Link dashboard:** [xem tại đây](...)  |  **Ảnh chụp:** ./screenshots/

## 1. Câu hỏi & giả thuyết
[3 câu hỏi business + giả thuyết ban đầu của bạn]

## 2. Dữ liệu
- Nguồn: Sample Superstore (link Kaggle)
- Khoảng thời gian: [từ - đến]
- Grain: 1 dòng = 1 sản phẩm trong 1 đơn hàng
- Bộ lọc áp dụng: [nêu rõ]
- Số dòng: trước làm sạch [x] → sau [y], loại [z] dòng vì [lý do]

## 3. Cách tính metric
| Metric | Công thức | Ghi chú |
|---|---|---|
| Doanh thu | SUM(Sales) | |
| Số đơn | COUNT(DISTINCT Order ID) | Không dùng COUNT(*) vì grain là dòng-sản-phẩm |
| AOV | Doanh thu / Số đơn | |
| Biên lợi nhuận | SUM(Profit) / SUM(Sales) | |

## 4. Findings
[3 phát hiện, MỖI cái phải có: con số cụ thể + diễn giải + ảnh chart]

## 5. Hạn chế
[Ít nhất 2 điều dữ liệu này không trả lời được]

## 6. Đề xuất
[2 hành động cụ thể, gắn với finding nào, và đo bằng metric gì]
```

### Tiêu chí đạt Portfolio #1

- [ ] Dashboard có link public xem được, không cần đăng nhập
- [ ] Mọi con số đều có mốc so sánh
- [ ] Tiêu đề mỗi chart là một kết luận, không phải nhãn trung tính
- [ ] README đủ 6 mục, phần Findings có số cụ thể
- [ ] Có mục Hạn chế (thiếu mục này = chưa đạt — nó cho thấy bạn hiểu giới hạn của phân tích)
- [ ] Người ngoài đọc README trong 3 phút hiểu được vấn đề, con số, và nên làm gì

```bash
git add 01-sales-dashboard/
git commit -m "feat: portfolio #1 - sales performance dashboard"
git push
```

---

## Bổ sung Power BI (tùy chọn, sau W16)

Cần nếu nhắm banking/enterprise VN (VPBank, Techcombank, MBBank…) — nơi Power BI là chuẩn.

| Cách | Chi phí | Ghi chú |
|---|---|---|
| Parallels Desktop + Windows | ~$100/năm | Mượt nhất trên Apple Silicon |
| UTM (free) + Windows ARM | 0đ | Chậm hơn, đủ để học |
| Máy công ty / máy mượn | 0đ | Thực tế nhất |
| Power BI Service (web) | 0đ | Xem và chỉnh nhẹ, **không** build model được |

Lộ trình rút gọn (2 tuần, sau khi đã nắm khái niệm BI): Power Query (làm sạch) → quan hệ bảng → DAX cơ bản (`SUM`, `CALCULATE`, `DIVIDE`, `SAMEPERIODLASTYEAR`) → filter context → publish. Tài liệu: `techstack/bi-tools/POWERBI.md`. Cert PL-300 nếu nhắm ngân hàng.

**Khái niệm DAX quan trọng nhất:** `CALCULATE` thay đổi filter context. Hiểu filter context là hiểu 80% DAX.

---

## Bẫy thường gặp

| Bẫy | Cách tránh |
|---|---|
| Nhồi 15 chart lên 1 trang | Tách trang, mỗi trang 1 câu hỏi |
| Pie chart 8 lát | Dùng bar ngang |
| Số không có mốc so sánh | Luôn kèm % kỳ trước hoặc target |
| Tính toán nặng trong BI tool | Đẩy về SQL |
| Dashboard đẹp nhưng không ai dùng | Hỏi trước: ai xem, xem để quyết định gì |
| Quên ghi thời điểm cập nhật dữ liệu | Footer ghi rõ |

**Tiếp theo:** [Stage 4 →](./stage-4-python)
