---
id: stage-6-capstone-jobprep
title: "Stage 6 — Capstone & Xin việc"
sidebar_label: "Stage 6 — Capstone"
sidebar_position: 7
description: "Tuan 20-24: capstone end-to-end, CV, 30 cau SQL phong van, case study, mock interview."
format: md
---

# STAGE 6 — Capstone & Xin việc

| | |
|---|---|
| **Thời lượng** | 5 tuần (W20–W24), ~75h |
| **Prerequisite** | Portfolio #1, #2, #3 đã public |
| **Mục tiêu** | 1 project end-to-end đủ sức nói chuyện với nhà tuyển dụng + sẵn sàng phỏng vấn |
| **Output** | **PORTFOLIO #4 — Capstone** · CV · 30 câu Q&A · 3 case study · 1 mock interview |
| **Checkpoint** | CHECKPOINT 4 — sẵn sàng ứng tuyển |

---

# TUẦN 20–21 — CAPSTONE

## Spec: E-commerce Funnel & Cohort Analysis

**Dataset:** `bigquery-public-data.thelook_ecommerce` (BigQuery Sandbox, free)
Bảng chính: `events`, `orders`, `order_items`, `users`, `products`, `inventory_items`, `distribution_centers`

**Bối cảnh giả định:** bạn là DA của sàn thương mại điện tử. Ban giám đốc hỏi: *"Chúng ta mất khách ở đâu, và nhóm khách nào đáng đầu tư giữ chân nhất?"*

**Câu hỏi phân tích:**
1. Người dùng rơi rụng ở bước nào trong phễu? Bước nào tệ nhất?
2. Tỷ lệ chuyển đổi khác nhau thế nào theo thiết bị / kênh traffic / vùng?
3. Nhóm cohort nào giữ chân tốt nhất? Xu hướng retention theo thời gian ra sao?
4. Phân khúc khách hàng nào đóng góp nhiều nhất? Nhóm nào đang rời bỏ?

---

## W20 — Tầng SQL (15h)

| ID | Việc | File | Xong |
|---|---|---|---|
| W20.1 | Khám phá schema, xác định grain từng bảng, vẽ sơ đồ star schema | `04-capstone-funnel/docs/data-model.md` | ☐ |
| W20.2 | Kiểm tra chất lượng dữ liệu: trùng, NULL, khoảng thời gian có sẵn, giá trị bất thường | `sql/00-data-quality.sql` | ☐ |
| W20.3 | Định nghĩa metric: viết trước 8 metric theo 5 trường (tên/công thức/nguồn/grain/owner) | `docs/metrics.md` | ☐ |
| W20.4 | Query funnel: user duy nhất theo từng bước + conversion từng bước + conversion tổng | `sql/01-funnel.sql` | ☐ |
| W20.5 | Funnel cắt theo chiều: thiết bị, kênh, vùng | `sql/02-funnel-segments.sql` | ☐ |
| W20.6 | Cohort retention: ma trận cohort_month × month_offset | `sql/03-cohort.sql` | ☐ |
| W20.7 | RFM: recency/frequency/monetary + NTILE(5) + nhãn phân khúc | `sql/04-rfm.sql` | ☐ |
| W20.8 | Query tổng quan cho dashboard trang 1 (doanh thu, đơn, AOV theo tháng) | `sql/05-overview.sql` | ☐ |
| W20.9 | Tối ưu: kiểm tra bytes scanned, bỏ `SELECT *`, lọc theo ngày | | ☐ |

**Yêu cầu chất lượng SQL:**
- Mỗi file có comment đầu: query trả lời câu hỏi gì, grain output là gì
- Dùng CTE đặt tên rõ nghĩa thay vì subquery lồng
- Đặt tên cột output nhất quán (`snake_case`)
- Không hardcode ngày — dùng tham số hoặc CTE khai báo ở đầu

**Khung funnel:**
```sql
WITH step_users AS (
  SELECT
    COUNT(DISTINCT CASE WHEN event_type = 'product'  THEN user_id END) AS s1_view,
    COUNT(DISTINCT CASE WHEN event_type = 'cart'     THEN user_id END) AS s2_cart,
    COUNT(DISTINCT CASE WHEN event_type = 'purchase' THEN user_id END) AS s3_purchase
  FROM `bigquery-public-data.thelook_ecommerce.events`
  WHERE created_at BETWEEN '2023-01-01' AND '2023-12-31'
)
SELECT
  s1_view, s2_cart, s3_purchase,
  ROUND(s2_cart     * 100.0 / NULLIF(s1_view, 0), 2)  AS pct_view_to_cart,
  ROUND(s3_purchase * 100.0 / NULLIF(s2_cart, 0), 2)  AS pct_cart_to_purchase,
  ROUND(s3_purchase * 100.0 / NULLIF(s1_view, 0), 2)  AS pct_overall
FROM step_users;
```

> Funnel đúng phải đảm bảo **thứ tự sự kiện** (user phải xem trước rồi mới thêm giỏ). Query trên đếm độc lập từng bước — đơn giản hơn nhưng có thể đếm cả user nhảy cóc. Bản nâng cao dùng window function so sánh timestamp giữa các bước. Ghi rõ giới hạn này trong README — nêu được giới hạn của chính phương pháp mình dùng là dấu hiệu của analyst tốt.

## W21 — Tầng Python + BI + Đóng gói (15h)

| ID | Việc | File | Xong |
|---|---|---|---|
| W21.1 | Kéo kết quả query về Python (`pandas-gbq` hoặc export CSV) | `notebooks/capstone.ipynb` | ☐ |
| W21.2 | Cohort heatmap bằng seaborn | | ☐ |
| W21.3 | Kiểm định: conversion giữa các nhóm thiết bị có khác nhau thật không (chi-square) | | ☐ |
| W21.4 | Biểu đồ phễu + biểu đồ phân khúc RFM | | ☐ |
| W21.5 | Dashboard 3 trang trên Looker Studio: Tổng quan · Funnel · Cohort/Segment | | ☐ |
| W21.6 | Chụp màn hình dashboard | `screenshots/` | ☐ |
| W21.7 | Viết README theo 6 mục | `README.md` | ☐ |
| W21.8 | Slide 5 trang cho stakeholder | `docs/presentation.pdf` | ☐ |

**Cấu trúc slide 5 trang:**

| Trang | Nội dung |
|---|---|
| 1 | **Kết luận trước** — 1 câu: vấn đề lớn nhất là gì, đề xuất gì. Không để kết luận ở cuối |
| 2 | Bối cảnh + câu hỏi + dữ liệu dùng |
| 3 | Finding chính: phễu rơi ở đâu (1 chart lớn + 1 dòng kết luận) |
| 4 | Finding phụ: cohort/segment (1 chart + kết luận) |
| 5 | Đề xuất hành động + metric để đo + hạn chế |

**Vì sao để kết luận lên trang 1:** lãnh đạo có thể rời cuộc họp sau 3 phút. Cấu trúc "dẫn dắt rồi mới kết luận" phù hợp bài giảng, không phù hợp báo cáo kinh doanh. Đây là khác biệt lớn nhất giữa cách trình bày của sinh viên và của analyst đi làm.

**Cấu trúc repo capstone:**
```
04-capstone-funnel/
├── README.md
├── sql/           00-data-quality → 05-overview
├── notebooks/     capstone.ipynb
├── docs/          data-model.md · metrics.md · presentation.pdf
└── screenshots/
```

**Tiêu chí đạt Capstone:**
- [ ] Người ngoài đọc README trong 3 phút hiểu vấn đề, con số, và nên làm gì
- [ ] Có tầng SQL + tầng Python + tầng dashboard, liên kết mạch lạc
- [ ] Mọi metric có định nghĩa rõ trong `docs/metrics.md`
- [ ] Có mục Hạn chế trung thực (kể cả hạn chế của phương pháp mình dùng)
- [ ] Đề xuất gắn với finding cụ thể và có metric đo kết quả
- [ ] Toàn bộ code chạy lại được

---

# TUẦN 22 — Đóng gói portfolio & CV

## W22.1 — Git chuyên nghiệp (T2, 2h)

| ID | Việc | Xong |
|---|---|---|
| W22.1.1 | Ôn `techstack/fundamentals/GIT.md` | ☐ |
| W22.1.2 | Tạo branch cho thay đổi lớn, merge về main | ☐ |
| W22.1.3 | Conventional commits: `feat:` `fix:` `docs:` `chore:` `refactor:` | ☐ |
| W22.1.4 | Rà `.gitignore` — **không có file dữ liệu, không có credential** | ☐ |
| W22.1.5 | Rà lịch sử commit: không có API key, mật khẩu, đường dẫn cá nhân | ☐ |

**Kiểm tra bảo mật trước khi để repo public** — làm nghiêm túc, đây là thứ không sửa được sau khi đã push:
```bash
git log -p | grep -iE "api[_-]?key|password|secret|token|credential"
```
Nếu tìm thấy, không chỉ xóa file — phải viết lại lịch sử (`git filter-repo`) hoặc tạo repo mới, và **thu hồi key đó ngay**. Key đã lên GitHub public coi như đã lộ, kể cả khi đã xóa sau vài phút.

## W22.2 — README từng project (T3, 2h)

Mỗi project rà theo checklist:

- [ ] Tiêu đề + 1 câu tóm tắt project làm gì
- [ ] Ảnh chụp/GIF ngay đầu file (người xem nhìn thấy kết quả trước khi đọc)
- [ ] Link demo trực tiếp (dashboard/notebook nbviewer)
- [ ] Công cụ dùng (badge hoặc list)
- [ ] Đủ 6 mục: Câu hỏi → Dữ liệu → Cách tính metric → Findings → Hạn chế → Đề xuất
- [ ] Findings có số cụ thể
- [ ] Hướng dẫn chạy lại

## W22.3 — README gốc của repo (T4, 2h)

```markdown
# Data Analyst Portfolio — [Tên]

Chuyển hướng sang Data Analyst. 24 tuần tự học, 4 project end-to-end.
**Kỹ năng:** SQL (BigQuery, DuckDB) · Python (Pandas, scipy) · Looker Studio · Metabase · Thống kê & A/B testing

| # | Project | Câu hỏi kinh doanh | Kỹ năng | Link |
|---|---|---|---|---|
| 4 | **Capstone — Funnel & Cohort** | Mất khách ở đâu, giữ chân nhóm nào | SQL, BigQuery, Python, BI | [xem](./04-capstone-funnel) |
| 3 | A/B Test Analysis | Tính năng mới có cải thiện retention không | Thống kê, scipy | [xem](./03-ab-test) |
| 2 | EDA — Olist E-commerce | Yếu tố nào ảnh hưởng điểm review | Python, Pandas | [xem](./02-eda-olist) |
| 1 | Sales Dashboard | Doanh thu biến động ra sao, sản phẩm nào lỗ | Looker Studio | [xem](./01-sales-dashboard) |

**Liên hệ:** email · LinkedIn
```

Đặt Capstone lên đầu — người xem thường chỉ mở project đầu tiên.

## W22.4 — CV 1 trang (T5 + T6, 4h)

| Phần | Nội dung | Lưu ý |
|---|---|---|
| Header | Tên · vị trí ứng tuyển · email · điện thoại · GitHub · LinkedIn | Link phải bấm được |
| Tóm tắt | 2–3 dòng: nền tảng cũ + kỹ năng data + hướng nhắm | Không viết "đam mê dữ liệu" chung chung |
| Kỹ năng | SQL · Python (Pandas, scipy) · Looker Studio, Metabase · Thống kê, A/B testing · Excel/Sheets · Git | Chỉ ghi thứ trả lời được câu hỏi sâu |
| Projects | 3 project, mỗi cái 2–3 gạch đầu dòng | **Mỗi gạch phải có số** |
| Kinh nghiệm | Công việc trước + phần liên quan (làm việc với số liệu, quy trình, stakeholder) | Nêu chuyển giao được gì |
| Học vấn / Chứng chỉ | | |

**Cách viết gạch đầu dòng project** — công thức `Hành động + Công cụ + Kết quả có số`:
- ✅ "Phân tích phễu 12 tháng dữ liệu e-commerce (BigQuery, 3 triệu sự kiện), xác định bước rơi rụng lớn nhất chiếm __% tổng thất thoát; đề xuất 2 hành động kèm metric đo"
- ❌ "Sử dụng SQL để phân tích dữ liệu và tạo dashboard"

**LinkedIn:** headline = "Data Analyst | SQL · Python · Power BI/Looker Studio" · About 3 đoạn · Featured gắn link 2 project mạnh nhất · bật "Open to work".

## W22.5 — Nghiên cứu thị trường (T7 + CN, 5h)

| ID | Việc | Xong |
|---|---|---|
| W22.5.1 | Lọc 30 JD Junior/Fresher DA trên ITViec, TopDev, VietnamWorks, LinkedIn | ☐ |
| W22.5.2 | Lập bảng: công ty · ngành · yêu cầu kỹ năng · lương công bố | ☐ |
| W22.5.3 | Đếm tần suất kỹ năng xuất hiện → xác định 3 thứ cần bổ sung gấp | ☐ |
| W22.5.4 | Chọn 10 công ty mục tiêu, tìm người đang làm ở đó trên LinkedIn | ☐ |
| W22.5.5 | Đối chiếu mức lương thực tế với bảng benchmark trong repo gốc | ☐ |

> Repo gốc đưa Junior DA khoảng 12–22 triệu, nguồn dẫn từ ITViec Q2/2025. Đó là số tham khảo — tự kiểm chứng lại bằng 30 JD thật ở thời điểm ứng tuyển, vì mức này thay đổi theo ngành (ngân hàng/fintech thường cao hơn bán lẻ) và khu vực.

---

# TUẦN 23 — Luyện kỹ thuật

## W23.1 — 30 câu SQL (T2–T4, 6h)

Tự viết câu trả lời vào `notes/interview-sql.md`, **có giải thích chứ không chỉ code**.

**Nhóm khái niệm (10 câu):**
1. INNER JOIN vs LEFT JOIN khác nhau thế nào, khi nào dùng cái nào
2. WHERE vs HAVING
3. Thứ tự thực thi logic của một câu SQL
4. `COUNT(*)` vs `COUNT(col)` vs `COUNT(DISTINCT col)`
5. `UNION` vs `UNION ALL`, cái nào nhanh hơn và vì sao
6. `RANK` vs `DENSE_RANK` vs `ROW_NUMBER`
7. CTE vs subquery vs temp table
8. NULL hoạt động thế nào trong so sánh, aggregate, JOIN
9. Index là gì, vì sao query nhanh hơn
10. Fan-out là gì, phát hiện và xử lý ra sao

**Nhóm viết query (15 câu):**
11. Top 5 khách hàng theo doanh thu tháng trước
12. Doanh thu lũy kế theo ngày
13. Tăng trưởng MoM
14. Sản phẩm bán chạy thứ 2 trong mỗi danh mục
15. Khách hàng mua trong tháng 1 nhưng không mua tháng 2
16. Khử trùng lặp, giữ bản ghi mới nhất
17. Lương cao thứ N trong công ty
18. Tìm ngày không có giao dịch (cần calendar table)
19. Chuỗi ngày đăng nhập liên tiếp dài nhất (gaps and islands)
20. Retention D7 theo cohort
21. Tỷ lệ chuyển đổi từng bước phễu
22. Nhân viên có lương cao hơn quản lý (self join)
23. Median không dùng hàm median
24. Pivot doanh thu theo tháng ngang
25. Chia khách thành tứ phân vị theo chi tiêu

**Nhóm sửa lỗi (5 câu):** cho query sai → tìm lỗi và giải thích
26. `LEFT JOIN` bị điều kiện ở `WHERE` làm hỏng
27. Chia số nguyên ra 0
28. Fan-out làm doanh thu nhân đôi
29. `NOT IN` với subquery có NULL trả rỗng
30. `GROUP BY` thiếu cột

## W23.2 — Nói kỹ thuật bằng lời (T5 + T6, 4h)

Luyện giải thích **không dùng màn hình**, mỗi câu 60–90 giây:

| ID | Câu | Xong |
|---|---|---|
| W23.2.1 | Window function là gì, khác GROUP BY chỗ nào | ☐ |
| W23.2.2 | Giải thích p-value cho người không chuyên | ☐ |
| W23.2.3 | Vì sao correlation không phải causation, cho ví dụ | ☐ |
| W23.2.4 | Doanh thu đột ngột tăng 50% — bạn kiểm tra gì trước? | ☐ |
| W23.2.5 | Thiết kế metric cho tính năng thông báo đẩy | ☐ |
| W23.2.6 | Khi nào dừng một A/B test | ☐ |
| W23.2.7 | Giải thích 1 project của bạn trong 2 phút | ☐ |

**Khung trả lời "doanh thu tăng 50% đột ngột"** — nêu theo thứ tự: (1) Kiểm tra dữ liệu trước: pipeline có chạy trùng không, có đơn test không, đơn vị tiền có đổi không · (2) Nếu dữ liệu đúng: tăng ở đâu — vùng nào, kênh nào, sản phẩm nào, do số đơn tăng hay giá trị đơn tăng · (3) Đối chiếu sự kiện bên ngoài: campaign, mùa vụ, đối thủ, thay đổi sản phẩm · (4) Kiểm tra tính bền vững: một lần hay xu hướng. Trả lời "kiểm tra chất lượng dữ liệu trước" là điểm cộng lớn — người mới thường nhảy ngay vào phân tích.

---

# TUẦN 24 — Case study & Mock interview

## W24.1 — Khung case study 5 bước (T2, 2h)

Theo repo gốc §6:

| Bước | Việc làm | Câu mẫu |
|---|---|---|
| 1. Clarify | Hỏi lại phạm vi, định nghĩa, mục tiêu. **Không nhảy vào giải ngay** | "Khi nói 'người dùng hoạt động', mình tính theo ngày hay theo tháng?" |
| 2. Structure | Chia vấn đề thành nhánh, nói ra khung trước khi đi sâu | "Em sẽ chia thành 3 nhánh: dữ liệu, sản phẩm, bên ngoài" |
| 3. Analyze | Nêu nguồn dữ liệu, phương pháp, metric | "Em cần bảng events và users, cắt theo cohort đăng ký" |
| 4. Recommend | Đề xuất cụ thể, gắn với phát hiện | "Ưu tiên sửa bước thanh toán trên mobile vì chiếm __% thất thoát" |
| 5. Measure | Đo thành công bằng gì | "Theo dõi conversion bước đó trong 2 tuần, guardrail là tỷ lệ lỗi" |

**Sai lầm lớn nhất:** bỏ qua bước 1. Người phỏng vấn cố tình ra đề mơ hồ để xem bạn có hỏi lại không. Nhảy thẳng vào giải là mất điểm ngay.

## W24.2 — Viết 3 case (T3 + T4, 4h)

| Case | Đề | Xong |
|---|---|---|
| 1 | Tỷ lệ chuyển đổi giảm 15% tuần này. Điều tra thế nào? | ☐ |
| 2 | Thiết kế metric cho tính năng chat mới trong app | ☐ |
| 3 | Ban giám đốc muốn biết nên đầu tư vào kênh marketing nào. Bạn phân tích gì? | ☐ |

Mỗi case viết đủ 5 bước vào `notes/case-studies.md`, mỗi case 1–1.5 trang.

## W24.3 — Behavioral (T5, 2h)

Chuẩn bị theo khung **STAR** (Tình huống → Nhiệm vụ → Hành động → Kết quả):

| ID | Câu | Xong |
|---|---|---|
| W24.3.1 | Giới thiệu bản thân (90 giây, kết thúc bằng lý do chuyển sang DA) | ☐ |
| W24.3.2 | Vì sao chuyển hướng sang data | ☐ |
| W24.3.3 | Kể về một lần bạn tìm ra lỗi trong dữ liệu | ☐ |
| W24.3.4 | Kể về một lần phải giải thích thứ phức tạp cho người không chuyên | ☐ |
| W24.3.5 | Xử lý thế nào khi kết quả phân tích trái với kỳ vọng của sếp | ☐ |
| W24.3.6 | Câu hỏi bạn hỏi ngược nhà tuyển dụng (chuẩn bị 5 câu) | ☐ |

**5 câu nên hỏi ngược:** Team data hiện có bao nhiêu người, cấu trúc thế nào? · Stack đang dùng là gì? · Một tuần điển hình của vị trí này ra sao? · Yêu cầu phân tích thường đến từ đâu, quy trình ưu tiên thế nào? · Sau 6 tháng, thế nào là làm tốt ở vị trí này?

## W24.4 — Mock interview (T6 + T7, 5h)

| ID | Việc | Xong |
|---|---|---|
| W24.4.1 | Vòng 1: tự phỏng vấn có **ghi âm** — 10 câu SQL + 1 case | ☐ |
| W24.4.2 | Nghe lại bản ghi, ghi ra 5 điểm cần sửa (nói lan man, "ừm à", trả lời trước khi nghĩ) | ☐ |
| W24.4.3 | Vòng 2: nhờ người khác phỏng vấn (bạn bè, cộng đồng DataTalks.Club, group Data Analytics Vietnam) | ☐ |
| W24.4.4 | Trình bày Capstone trong 5 phút, không vấp | ☐ |
| W24.4.5 | Luyện phần khó nhất thêm 3 lần | ☐ |

## W24.5 — Bắt đầu ứng tuyển (CN, 2h)

| ID | Việc | Xong |
|---|---|---|
| W24.5.1 | Lập bảng theo dõi ứng tuyển: công ty · vị trí · ngày nộp · kênh · trạng thái · ghi chú | ☐ |
| W24.5.2 | Nộp 10 hồ sơ đầu tiên | ☐ |
| W24.5.3 | Nhắn kết nối với 5 người đang làm DA ở công ty mục tiêu | ☐ |
| W24.5.4 | Đặt lịch: mỗi tuần nộp 10 hồ sơ + 1 buổi ôn kỹ thuật | ☐ |

**Thực tế cần chuẩn bị tinh thần:** tỷ lệ phản hồi cho ứng viên entry-level không cao, và im lặng là chuyện bình thường chứ không phải đánh giá về năng lực bạn. Sau mỗi buổi phỏng vấn, ghi lại câu bị hỏi và câu trả lời chưa tốt — dùng nó làm giáo trình ôn cho buổi sau. Người trúng tuyển thường không phải người giỏi nhất từ đầu, mà là người sửa nhanh nhất sau mỗi lần trượt.

---

## ✅ CHECKPOINT 4 — Sẵn sàng ứng tuyển

- [ ] 4 project public trên GitHub, mỗi cái có README đủ 6 mục
- [ ] ≥ 150 bài SQL đã giải, có link profile
- [ ] Giải bài SQL Medium trong ≤ 15 phút
- [ ] Trình bày Capstone 5 phút không vấp, không đọc slide
- [ ] Trả lời được 5 câu Mid-level trong §6 của repo gốc
- [ ] Giải thích được p-value, correlation vs causation, khi nào dừng A/B test
- [ ] CV 1 trang, mỗi gạch đầu dòng project có số
- [ ] LinkedIn hoàn chỉnh, bật Open to work
- [ ] 10 hồ sơ đã nộp

---

## Sau W24 — Học tiếp gì

Theo §8 của repo gốc, các nhánh từ DA:

| Nhánh | Học gì tiếp | Tài liệu repo |
|---|---|---|
| **Analytics Engineer** | dbt, data modeling, testing, CI/CD | `techstack/transformation/DBT.md` · `ROADMAP-SWITCH-DA-TO-AE.md` |
| **Senior DA** | Causal inference, metric framework, mentoring | `ROADMAP-DA.md` Phase 4 |
| **BI Engineer** | Kiến trúc BI, semantic layer, governance | `ROADMAP-BI-ENGINEER.md` |
| **Data Scientist** | ML, feature engineering | ngoài phạm vi repo |
| **Product Manager** | Product sense, roadmap | ngoài phạm vi repo |

Chưa cần chọn bây giờ. Sau 6–12 tháng làm việc thật sẽ rõ hơn nhiều so với quyết định lúc này.

**Ưu tiên 3 tháng đầu đi làm:** hiểu dữ liệu và nghiệp vụ của công ty (quan trọng hơn mọi kỹ năng kỹ thuật) · học cách stakeholder ra quyết định · tìm 1 người mentor trong team · ghi lại mọi định nghĩa metric của công ty vì thường không ai viết ra.
