import type { RubricItem } from '@site/src/components/Quiz/types';

/** Stage 1 — deliverable: Google Sheet phan tich Superstore */
export const rubricStage1: RubricItem[] = [
  { id: 'r1', label: 'Có đủ 4 tab: raw / clean / pivot / stats-summary', points: 10 },
  { id: 'r2', label: 'Tab raw giữ nguyên dữ liệu gốc, không sửa trực tiếp', points: 5, hint: 'Sửa trên raw là mất khả năng đối chiếu' },
  { id: 'r3', label: 'Đã ghi rõ grain của dataset (1 dòng = cái gì)', points: 10 },
  { id: 'r4', label: 'Có cột dẫn xuất: year_month, profit_margin, phân loại lãi/lỗ', points: 10 },
  { id: 'r5', label: 'Pivot 2 chiều (tháng × region) có cả sales và profit', points: 10 },
  { id: 'r6', label: 'Có cột % growth so kỳ trước, bọc IFERROR', points: 10 },
  { id: 'r7', label: 'Bảng thống kê mô tả đủ 8 chỉ số cho Sales và Profit', points: 10 },
  { id: 'r8', label: 'Phân tích outlier: ngưỡng IQR, số lượng, quyết định giữ/loại + lý do', points: 10 },
  { id: 'r9', label: 'Đủ 4 chart: line, bar, histogram, scatter — chọn đúng loại', points: 10 },
  { id: 'r10', label: 'Mỗi chart có tiêu đề là kết luận, không phải nhãn trung tính', points: 5 },
  { id: 'r11', label: '5 nhận xét, mỗi câu đều có số cụ thể', points: 5 },
  { id: 'r12', label: 'Có mục Hạn chế — ít nhất 2 điều dữ liệu không trả lời được', points: 5 },
];

/** Stage 2 — CHECKPOINT 2 */
export const rubricStage2: RubricItem[] = [
  { id: 'r1', label: 'Auto-grader SQL: đạt 15/15 câu', points: 25, hint: 'python stage2_sql/grade.py' },
  { id: 'r2', label: 'Đã giải ≥ 125 bài trên LeetCode / StrataScratch, có link profile', points: 15 },
  { id: 'r3', label: 'Giải được 1 bài Medium window function trong ≤ 15 phút', points: 15 },
  { id: 'r4', label: 'Viết "top 3 sản phẩm mỗi tháng" từ đầu, không tra cứu', points: 10 },
  { id: 'r5', label: 'Giải thích được vì sao LEFT JOIN + điều kiện ở WHERE thành INNER JOIN', points: 10 },
  { id: 'r6', label: 'Giải thích được fan-out và cách xử lý', points: 10 },
  { id: 'r7', label: 'Có 6 metric definition đủ 5 trường trong notes/metrics.md', points: 10 },
  { id: 'r8', label: 'Bộ 12 query báo cáo tháng đã commit lên GitHub', points: 5 },
];

/** Stage 3 — Portfolio #1: Sales Dashboard */
export const rubricStage3: RubricItem[] = [
  { id: 'r1', label: 'Dashboard có link public, xem được không cần đăng nhập', points: 10 },
  { id: 'r2', label: 'Đủ 2 trang: Tổng quan + Sản phẩm/Lợi nhuận', points: 10 },
  { id: 'r3', label: '4 scorecard, mỗi cái kèm % MoM', points: 10 },
  { id: 'r4', label: 'Mọi con số đều có mốc so sánh (kỳ trước hoặc target)', points: 10 },
  { id: 'r5', label: 'Tiêu đề mỗi chart là một kết luận có số', points: 10 },
  { id: 'r6', label: 'Có filter: thời gian, region, category — hoạt động đúng', points: 5 },
  { id: 'r7', label: 'Số đơn tính bằng COUNT DISTINCT order_id, không phải đếm dòng', points: 10, hint: 'Bẫy grain' },
  { id: 'r8', label: 'README có bảng "cách tính metric" cho từng chỉ số', points: 10 },
  { id: 'r9', label: 'README đủ 6 mục: Câu hỏi → Dữ liệu → Metric → Findings → Hạn chế → Đề xuất', points: 10 },
  { id: 'r10', label: 'Mỗi finding có con số cụ thể kèm ảnh chart', points: 10 },
  { id: 'r11', label: 'Không có chart thừa (tối đa 5–7 chart/trang)', points: 5 },
];

/** Stage 4 — Portfolio #2: EDA notebook */
export const rubricStage4: RubricItem[] = [
  { id: 'r1', label: 'Auto-grader Pandas: đạt 12/12 bài', points: 20, hint: 'python stage4_python/grade.py' },
  { id: 'r2', label: 'Notebook chạy hết bằng Restart & Run All, không lỗi', points: 15 },
  { id: 'r3', label: 'Viết 3–5 câu hỏi business TRƯỚC phần phân tích', points: 10 },
  { id: 'r4', label: 'Ghi rõ grain, khoảng thời gian, bộ lọc của dữ liệu', points: 5 },
  { id: 'r5', label: 'Phần làm sạch có log số dòng trước/sau từng bước', points: 10 },
  { id: 'r6', label: 'Quyết định xử lý missing có nêu lý do, không fillna máy móc', points: 10 },
  { id: 'r7', label: 'Mỗi chart có tiêu đề kết luận + nhãn trục có đơn vị', points: 10 },
  { id: 'r8', label: 'Mỗi finding có ít nhất 1 con số cụ thể', points: 10 },
  { id: 'r9', label: 'Có ít nhất 1 chỗ nêu rõ "đây là tương quan, chưa phải nhân quả"', points: 5 },
  { id: 'r10', label: 'Có mục Hạn chế với ≥ 3 điều không kết luận được', points: 5 },
];

/** Stage 5 — Portfolio #3: A/B test */
export const rubricStage5: RubricItem[] = [
  { id: 'r1', label: 'Hypothesis viết đủ dạng: nếu [X] thì [Y] sẽ [tăng/giảm] vì [lý do]', points: 10 },
  { id: 'r2', label: 'Chốt đúng 1 primary metric, có secondary và guardrail', points: 10 },
  { id: 'r3', label: 'Có sanity check (SRM, trùng user, dữ liệu thiếu) TRƯỚC khi đọc kết quả', points: 15 },
  { id: 'r4', label: 'Có tính cỡ mẫu cần thiết cho MDE đã chọn', points: 15 },
  { id: 'r5', label: 'Bàn về power: dữ liệu hiện có đủ để phát hiện hiệu ứng không', points: 10 },
  { id: 'r6', label: 'Chọn test có nêu lý do (dữ liệu tỷ lệ hay liên tục, phân phối ra sao)', points: 10 },
  { id: 'r7', label: 'Kết luận có KHOẢNG TIN CẬY, không chỉ p-value', points: 15, hint: 'Thiếu CI là thiếu thông tin quan trọng nhất' },
  { id: 'r8', label: 'Có effect size (lift tuyệt đối và tương đối)', points: 5 },
  { id: 'r9', label: 'Kết luận viết cho người không chuyên hiểu được', points: 5 },
  { id: 'r10', label: 'Nêu ≥ 3 hạn chế (thời gian chạy, novelty effect, tính khái quát)', points: 5 },
];

/** Stage 6 — Capstone */
export const rubricCapstone: RubricItem[] = [
  { id: 'r1', label: 'Repo có đủ /sql, /notebooks, /docs, /screenshots', points: 5 },
  { id: 'r2', label: 'docs/data-model.md có sơ đồ star schema và grain từng bảng', points: 10 },
  { id: 'r3', label: 'docs/metrics.md định nghĩa 8 metric đủ 5 trường', points: 10 },
  { id: 'r4', label: 'Có query data quality chạy trước phân tích', points: 10 },
  { id: 'r5', label: 'Funnel + cohort + RFM đều có, chạy được', points: 15 },
  { id: 'r6', label: 'Mỗi file SQL có comment: trả lời câu hỏi gì, grain output là gì', points: 5 },
  { id: 'r7', label: 'Dùng CTE đặt tên rõ nghĩa thay vì subquery lồng nhiều tầng', points: 5 },
  { id: 'r8', label: 'Có tầng Python: kiểm định thống kê + cohort heatmap', points: 10 },
  { id: 'r9', label: 'Dashboard 3 trang có link public', points: 10 },
  { id: 'r10', label: 'Slide 5 trang, KẾT LUẬN Ở TRANG 1', points: 10, hint: 'Không để kết luận ở cuối' },
  { id: 'r11', label: 'Hạn chế có nêu giới hạn của chính phương pháp mình dùng', points: 5 },
  { id: 'r12', label: 'Người ngoài đọc README 3 phút hiểu vấn đề, số liệu, và nên làm gì', points: 5 },
];

/** Stage 6 — CHECKPOINT 4: san sang ung tuyen */
export const rubricJobReady: RubricItem[] = [
  { id: 'r1', label: '4 project public trên GitHub, mỗi cái có README đủ 6 mục', points: 20 },
  { id: 'r2', label: '≥ 150 bài SQL đã giải, có link profile', points: 10 },
  { id: 'r3', label: 'Giải bài SQL Medium trong ≤ 15 phút', points: 10 },
  { id: 'r4', label: 'Trình bày Capstone 5 phút không vấp, không đọc slide', points: 15 },
  { id: 'r5', label: 'Trả lời được 5 câu Mid-level: metric design, data anomaly, sample size, p-value', points: 10 },
  { id: 'r6', label: 'Giải thích p-value cho người không chuyên trong 60 giây', points: 5 },
  { id: 'r7', label: 'CV 1 trang, mỗi gạch đầu dòng project đều có số', points: 10 },
  { id: 'r8', label: 'Đã quét lịch sử git tìm secret trước khi để repo public', points: 5 },
  { id: 'r9', label: 'LinkedIn hoàn chỉnh, Featured gắn 2 project mạnh nhất', points: 5 },
  { id: 'r10', label: 'Đã nộp 10 hồ sơ đầu tiên', points: 10 },
];
