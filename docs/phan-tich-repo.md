---
id: phan-tich-repo
title: Phân tích repo gốc
sidebar_label: Phân tích repo gốc
sidebar_position: 2
slug: /phan-tich-repo
description: Phân tích repo data-road-map-by-roles — có gì, thiếu gì cho người bắt đầu từ 0, và 8 điểm đã điều chỉnh.
---

# Phân tích repo `data-road-map-by-roles`

Nguồn: [github.com/tunguyenn99/data-road-map-by-roles](https://github.com/tunguyenn99/data-road-map-by-roles) — file `roadmap_viet/ROADMAP-DA.md` và thư mục `techstack/`.

---

## 1. Repo có gì

| Thành phần | Nội dung | Đánh giá cho người mới |
|---|---|---|
| `roadmap_viet/ROADMAP-DA.md` | 11 mục: skill matrix 5 level, 4 phase learning path, resources, portfolio, interview prep, salary VN, market VN, schedule template | Khung xương tốt. Chi tiết cao ở phần "học gì", thấp ở phần "học thế nào" |
| `ROADMAP-{AE,BI,BI-ENGINEER}.md` | Roadmap các role lân cận | Hữu ích để chọn hướng nhánh sau 1–2 năm, chưa cần lúc mới bắt đầu |
| `ROADMAP-SWITCH-DA-TO-AE.md` | Đường chuyển DA → Analytics Engineer | Để dành sau |
| `techstack/` (24 file) | Guide theo tầng: fundamentals (SQL/Python/Git), ingestion, storage, transformation (dbt), orchestration, bi-tools, governance, infrastructure | Kho tài liệu tốt — mỗi file chia Level 1/2/3 kèm bài tập và link free |
| `roadmap_eng/` | Bản tiếng Anh tương ứng | Dùng luyện đọc tài liệu tiếng Anh |

**Điểm mạnh:** skill matrix theo 5 level rất cụ thể (biết mình đang ở đâu) · resources đã lọc, đa số free · benchmark lương và danh sách công ty tuyển DA tại VN · techstack chia đúng theo tầng kiến trúc data hiện đại.

---

## 2. Tám khoảng trống khi áp dụng cho người bắt đầu từ 0

| # | Khoảng trống | Ảnh hưởng | Cách vá |
|---|---|---|---|
| 1 | Không có "Tuần 0" — vào thẳng Excel, giả định môi trường đã sẵn sàng | Mất 1–2 tuần loay hoay cài đặt, dễ bỏ cuộc ngay đầu | Thêm [Stage 0](./stages/stage-0-setup) với lệnh cài cụ thể cho macOS |
| 2 | `techstack/` không được link vào từng tuần của roadmap | Không biết trong 24 file nên mở file nào, lúc nào | Cột "Tài liệu repo" gắn vào từng tuần |
| 3 | Mặc định Power BI | **Power BI Desktop không chạy native trên macOS** | Đổi trục chính sang Looker Studio + Metabase; Power BI học sau bằng VM nếu nhắm banking |
| 4 | Portfolio project chỉ có tên, không có dataset và spec deliverable | Làm xong không biết "đủ" chưa | Mỗi project có: dataset link, câu hỏi business, deliverable, tiêu chí đạt |
| 5 | Tracking dùng thang "Confidence 1–5" (chủ quan) | Tự đánh giá lệch, học ảo | Thay bằng checkpoint pass/fail đo được |
| 6 | Nặng công cụ, nhẹ phần đặt câu hỏi business và định nghĩa metric | Biết SQL nhưng không biết phân tích — chỗ rớt phổ biến nhất ở vòng case study | Chèn metric drill hàng tuần từ W5 + 6 case study |
| 7 | Statistics gói trong 4 tuần ở Phase 1, trong khi mục Interview Prep hỏi p-value, sample size, khi nào dừng test | Lệch giữa nội dung học và yêu cầu phỏng vấn | Tách 2 lớp: mô tả (W2) và suy diễn/A-B test (W17–19) |
| 8 | Không có DuckDB — cách dựng sân tập SQL local nhanh nhất hiện nay | Phải cài Postgres/Docker mới có DB để tập | Stage 0 dùng DuckDB, Postgres để sau |

---

## 3. Điều chỉnh thứ tự so với gốc

| Chủ đề | Repo gốc (Phase 1) | Lộ trình này | Lý do |
|---|---|---|---|
| BI tool / dashboard | Tuần 17–20 | **Tuần 10–12** | Cần artifact nhìn thấy được sớm để giữ động lực, và đó là thứ nhà tuyển dụng entry-level xem đầu tiên |
| Python | Tuần 9–12 | **Tuần 13–16** | SQL phải vững trước; phần lớn việc DA fresher ở VN là SQL + BI |
| Statistics | Tuần 13–16 | **W2 + W17–19** | Học stat suy diễn khi chưa có dữ liệu thật để áp dụng thì quên ngay |
| Interview prep | Không có tuần riêng | **Tuần 23–24** | Repo có nội dung nhưng không có slot thời gian |

---

## 4. Phần giữ nguyên từ repo gốc

Không phải mọi thứ đều cần sửa. Những phần dưới đây dùng lại trực tiếp:

- **Skill matrix 5 level** — dùng để tự định vị mỗi 3 tháng
- **Nhịp học Template A** (2h/ngày, T7 3h, CN review) — áp dụng nguyên
- **Danh sách công ty tuyển DA tại VN** theo tier (banking, fintech, e-commerce, tech, consulting, MNC)
- **Bộ câu hỏi phỏng vấn theo level** — dùng làm giáo trình ôn ở W23–24
- **Khung case study 5 bước** Clarify → Structure → Analyze → Recommend → Measure
- **Career path sau DA** — Analytics Manager, Analytics Engineer, Data Scientist, PM, BI Engineer

---

## 5. Ghi chú về số liệu thị trường

Repo gốc đưa các con số: Junior DA 12–22 triệu/tháng, Mid 20–40 triệu, Senior 35–70 triệu; demand Data/AI/ML tại VN tăng 64% YoY; Python-related jobs tăng 70% YoY — dẫn nguồn ITViec Q2/2025.

**Những số này chưa được kiểm chứng độc lập trong lộ trình này.** Chúng được giữ lại làm tham khảo định hướng, nhưng ở tuần 22 có task riêng: tự lọc 30 JD thật trên ITViec/TopDev/VietnamWorks tại thời điểm ứng tuyển và lập bảng so sánh. Lương thay đổi theo ngành (ngân hàng/fintech thường cao hơn bán lẻ), quy mô công ty và khu vực.

Không dùng con số của người khác để đàm phán lương của mình mà không kiểm lại.

---

## 6. Kết luận

Repo gốc là **bản đồ tốt ở tầm chiến lược** — biết đích đến, biết các chặng, biết cần kỹ năng gì ở mỗi level. Nó thiếu **tầng thực thi**: task cụ thể theo buổi, tiêu chí đạt đo được, và xử lý các ràng buộc thực tế của người học (hệ điều hành, thời gian, tiền).

Lộ trình trên trang này bổ sung đúng tầng đó, giữ nguyên khung chiến lược của repo gốc.

👉 Bắt đầu tại [Stage 0 — Dựng môi trường](./stages/stage-0-setup)
