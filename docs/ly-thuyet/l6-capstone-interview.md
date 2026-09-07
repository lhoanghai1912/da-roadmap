---
id: l6-capstone-interview
title: "Lý thuyết 6 — Capstone & Phỏng vấn"
sidebar_label: "L6 — Capstone & PV"
sidebar_position: 7
description: "Funnel/cohort/RFM, README chuan, ke chuyen 5 phut, khung case study 5 buoc, 20 cau phong van, CV DA fresher."
format: md
---

# LESSON 6 — Capstone, CV & Phỏng vấn (W20–W24)

Bổ trợ cho [Stage 6 — Capstone & Job prep](../stages/stage-6-capstone-jobprep.md). Giai đoạn này không học thêm công cụ mới. Việc duy nhất: **biến những gì đã làm thành thứ người khác tin được trong 5 phút**.

---

## 6.1 — Định nghĩa 3 dạng phân tích của capstone

### Funnel (phễu)
**Định nghĩa.** Chuỗi bước bắt buộc dẫn tới mục tiêu, đo số người còn lại sau mỗi bước.

*Ví dụ (thelook_ecommerce):* xem sản phẩm → thêm giỏ → vào thanh toán → mua.

Ba quyết định phải nêu rõ khi trình bày (không nêu là bị hỏi ngay):
1. **Cửa sổ thời gian** — user phải hoàn tất trong 1 phiên hay được tính cả 7 ngày sau?
2. **Có ép thứ tự không** — user mua mà không có bản ghi "xem" thì tính vào đâu?
3. **Đơn vị đếm** — user duy nhất hay session? Hai cách cho hai con số khác nhau, cả hai đều "đúng" tùy câu hỏi.

### Cohort retention
**Định nghĩa.** Nhóm người dùng theo tháng bắt đầu, theo dõi % còn quay lại ở tháng 1, 2, 3…

Vì sao cần: doanh thu tổng tăng có thể chỉ vì đổ tiền mua người dùng mới, trong khi sản phẩm giữ chân ngày càng kém. Cohort tách được hai hiệu ứng đó.

Cách đọc bảng cohort:
- **Đọc ngang** = một nhóm người theo thời gian → sản phẩm giữ chân tốt dần hay tệ dần?
- **Đọc dọc** = so các nhóm ở cùng tuổi → chất lượng người dùng mới có tốt lên không?
- Cột tháng 0 luôn 100% (theo định nghĩa) — đừng khoe con số đó.

### RFM
**Định nghĩa.** Chấm điểm mỗi khách theo 3 chiều: **R**ecency (mua gần đây chưa), **F**requency (mua bao nhiêu lần), **M**onetary (chi bao nhiêu tiền). Chia mỗi chiều thành 5 bậc bằng `NTILE(5)`.

Phân khúc thường dùng: Champions (555) · Loyal (R cao, F cao) · At risk (F, M cao nhưng R thấp — **nhóm đáng cứu nhất**) · Lost · New.

Giá trị thật của RFM nằm ở chỗ nó nối thẳng sang hành động: nhóm "At risk" gửi ưu đãi giữ chân, nhóm "Champions" mời chương trình thành viên. Phân khúc không dẫn tới hành động khác nhau thì phân khúc vô nghĩa.

**Bài tập 6.1.** Sau khi chạy RFM trên thelook, viết bảng: mỗi phân khúc = số khách · % doanh thu đóng góp · **1 hành động đề xuất** · metric để đo hành động đó có hiệu quả.

---

## 6.2 — Cấu trúc README mà nhà tuyển dụng đọc trong 3 phút

Roadmap gốc nói đúng một điều: CV được đọc 30 giây, portfolio được xem 5 phút. Cấu trúc bắt buộc:

```markdown
# [Tên project] — [kết luận chính, có số]

**TL;DR** (3 dòng): tìm ra gì, quan trọng ra sao, đề xuất gì.
[Ảnh dashboard hoặc chart quan trọng nhất — hiện ngay đầu README]

## Câu hỏi kinh doanh
## Dữ liệu (nguồn · khoảng thời gian · số dòng · grain · bộ lọc)
## Phương pháp (các bước, vì sao chọn cách đó)
## Findings (mỗi finding: 1 chart + 1 câu có số)
## Hạn chế (dữ liệu không nói được gì)
## Đề xuất (2-3 hành động, ai làm, đo bằng gì)
## Cách chạy lại (lệnh cụ thể)
```

**Tiêu đề README phải là kết luận, không phải nhãn:**
- ❌ "E-commerce Funnel Analysis"
- ✅ "62% người dùng rời ở bước thanh toán trên mobile — cao gấp 2 lần desktop"

**Ba lỗi README làm mất điểm ngay:** không có ảnh (phải click vào code mới hiểu) · không nêu hạn chế (trông như không biết mình đang giả định gì) · đề xuất chung chung kiểu "nên cải thiện trải nghiệm người dùng".

---

## 6.3 — Kể chuyện với dữ liệu: khung 5 phút

| Phút | Nội dung | Bẫy |
|---|---|---|
| 0:00–0:30 | Bối cảnh + câu hỏi kinh doanh | kể lể dataset trước khi nói vấn đề |
| 0:30–1:00 | Kết luận chính, **nói ngay từ đầu** | để dành kết luận đến cuối như phim trinh thám |
| 1:00–3:00 | 2–3 bằng chứng, mỗi cái 1 chart 1 số | trình bày 12 chart |
| 3:00–4:00 | Đề xuất + tác động ước tính | đề xuất không kèm con số |
| 4:00–5:00 | Hạn chế + bước tiếp theo | giấu hạn chế |

**Nguyên tắc BLUF (Bottom Line Up Front):** nói kết luận trước, giải thích sau. Sếp có thể ngắt bất cứ lúc nào; nếu bị ngắt ở phút thứ 2 mà chưa nói kết luận thì buổi trình bày coi như thất bại.

**Bài tập 6.2.** Quay video 5 phút trình bày capstone. Xem lại và đếm: bao nhiêu lần nói "ừm", có nói kết luận trong 60 giây đầu không, có câu nào không kèm số không.

---

## 6.4 — Khung trả lời case study (5 bước)

Vòng case study là chỗ rớt nhiều nhất, vì ứng viên nhảy thẳng vào SQL.

**Đề mẫu:** *"Doanh thu tháng này giảm 15% so tháng trước. Bạn làm gì?"*

**Bước 1 — Clarify (hỏi lại trước khi phân tích).** 15% so với tháng trước hay cùng kỳ năm trước? Doanh thu gộp hay đã trừ hoàn hàng? Giảm ở toàn bộ hay một mảng? Có thay đổi gì về sản phẩm/giá/marketing trong tháng không? Số liệu đã chốt hay còn đang cập nhật?

*Riêng bước này đã lọc được phần lớn ứng viên. Người mới nhảy vào phân tích ngay; người có kinh nghiệm hỏi trước.*

**Bước 2 — Structure (chia bài toán).** Doanh thu = số đơn × AOV. Số đơn = số khách × tần suất. Cứ mỗi nhánh, hỏi: giảm ở đâu?
```
Doanh thu ↓15%
├── Số đơn ↓?          ├── Khách mới ↓?  (marketing? mùa vụ?)
│                      └── Khách cũ ↓?   (giữ chân? chất lượng?)
└── AOV ↓?             ├── Giá ↓? (khuyến mãi?)
                       └── Số món/đơn ↓?
```

**Bước 3 — Analyze (nêu cách kiểm chứng từng nhánh).** Cắt theo thời gian (đột ngột hay dần dần — đột ngột thường là lỗi kỹ thuật/tracking), theo kênh, theo vùng, theo nhóm khách mới/cũ. Luôn kiểm tra khả năng **lỗi dữ liệu** trước khi kết luận vấn đề kinh doanh: một tag tracking hỏng cũng làm doanh thu "giảm" 15%.

**Bước 4 — Recommend.** Đề xuất kèm ước tính tác động và người chịu trách nhiệm.

**Bước 5 — Measure.** Đo bằng metric nào, trong bao lâu, ngưỡng nào coi là thành công.

**Bài tập 6.3.** Viết đầy đủ 5 bước cho 3 đề: (a) tỷ lệ chuyển đổi giảm từ 3% xuống 2,4% trong 1 tuần; (b) sếp muốn biết có nên mở rộng sang thị trường mới; (c) tính năng mới ra 1 tháng, cần đánh giá thành công hay thất bại.

---

## 6.5 — 20 câu phỏng vấn kỹ thuật và ý cần có trong câu trả lời

**SQL**
1. `WHERE` vs `HAVING` → lọc dòng trước gom nhóm / lọc nhóm sau gom.
2. `COUNT(*)` vs `COUNT(col)` → đếm dòng / bỏ NULL. Nêu ví dụ 3.503 vs 2.526 của Chinook.
3. `INNER` vs `LEFT JOIN` → kèm bẫy điều kiện ở WHERE biến LEFT thành INNER (số 412/35/89).
4. Fan-out là gì, xử lý sao → ví dụ 2.328,60 → 20.848,62.
5. Window function khác GROUP BY chỗ nào → giữ nguyên số dòng.
6. `ROW_NUMBER` vs `RANK` vs `DENSE_RANK` → 1,2,3 / 1,1,3 / 1,1,2.
7. Vì sao không lọc được window ở WHERE → thứ tự thực thi; bọc CTE hoặc QUALIFY.
8. `NOT IN` vs `NOT EXISTS` → NULL làm NOT IN trả rỗng.
9. Viết top-N mỗi nhóm → CTE + ROW_NUMBER.
10. Viết cohort retention → 3 bước: first_month → activity → tỷ lệ theo cohort.
11. Tối ưu query chậm → chọn cột thay vì `SELECT *`, lọc partition, tổng hợp trước khi join, tránh correlated subquery, đọc query plan.
12. Khử trùng lặp giữ bản ghi mới nhất → `ROW_NUMBER() ... ORDER BY updated_at DESC` rồi lọc `= 1`.

**Phân tích & metric**
13. Định nghĩa DAU/MAU/retention → luôn kèm 5 trường và nêu điểm mơ hồ cần chốt với business.
14. Mean vs median → ví dụ doanh thu 230 vs 54.
15. Correlation ≠ causation → ví dụ discount/profit và biến gây nhiễu "loại mặt hàng".
16. Giải thích p-value cho người không chuyên → bản ≤150 từ ở L5.
17. Tính sample size → baseline, MDE, alpha, power; MDE giảm 1/2 → mẫu ×4.
18. Khi nào dừng A/B test → theo ngày chốt trước, không dừng khi thấy p đẹp; nêu peeking.
19. Số trên dashboard không khớp kế toán → 5 bước debug ở L2 mục 2.9.
20. Sếp yêu cầu một con số mà bạn biết sẽ bị hiểu sai → đưa số kèm ngữ cảnh, nêu rõ giới hạn, đề xuất cách đo tốt hơn; không từ chối, cũng không đưa số trần trụi.

**Cách luyện:** viết câu trả lời ra giấy, đọc to, bấm giờ. Mỗi câu ≤ 90 giây. Câu nào phải nhìn ghi chú là câu chưa thuộc.

---

## 6.6 — CV cho DA fresher

**Một trang.** Thứ tự: Thông tin liên hệ → 3 dòng tóm tắt → **Projects** → Kỹ năng → Học vấn → (Kinh nghiệm khác nếu có).

Projects đứng **trên** học vấn — vì đó là bằng chứng duy nhất bạn làm được việc.

Mỗi project 3 dòng, có số, có link:
```
Sales Performance Dashboard — Looker Studio, SQL  [link]
Phan tich 9.994 dong du lieu ban le 4 nam. Phat hien nhom Furniture chiem 32%
doanh thu nhung chi 6% loi nhuan (bien 2,5% so voi 17,4% cua Technology).
De xuat ra soat chinh sach chiet khau tren nguong 30% - nguong ma loi nhuan trung binh chuyen am.
```

**Từ cần tránh:** "đam mê dữ liệu", "ham học hỏi", "chăm chỉ", "tư duy logic". Không kiểm chứng được nên không có giá trị. Thay bằng số và link.

**Kỹ năng ghi theo mức độ trung thực:** SQL (JOIN, CTE, window function, cohort/funnel) · Python (pandas, matplotlib, scipy) · BI (Looker Studio, Metabase) · Thống kê (kiểm định giả thuyết, thiết kế A/B test). Không liệt kê thứ không dám bị hỏi sâu.

**Bài tập 6.4.** Đọc 30 JD Junior DA thật trên ITViec/TopDev/LinkedIn. Lập bảng: kỹ năng nào xuất hiện ≥ 15/30 lần. Đối chiếu với CV mình — đây cũng là cách tự kiểm chứng lại phần "thị trường" mà roadmap thừa nhận là lấy nguyên từ repo gốc, chưa xác minh độc lập.

---

## 6.7 — CHECKPOINT 4: sẵn sàng ứng tuyển

- [ ] 4 project public trên GitHub, mỗi cái có README đúng cấu trúc + ảnh
- [ ] ≥ 150 bài SQL, có link profile
- [ ] Giải bài SQL Medium trong ≤ 15 phút
- [ ] Trình bày capstone 5 phút không vấp, có video tự quay
- [ ] Trả lời được 20 câu ở mục 6.5, mỗi câu ≤ 90 giây
- [ ] CV 1 trang PDF, LinkedIn cập nhật
- [ ] 3 case study đã viết đủ 5 bước
- [ ] Đã nộp ≥ 10 hồ sơ (nộp là một phần của việc học, không phải bước sau khi học xong)

**Điều dễ bỏ nhất và tốn nhất:** không nộp hồ sơ vì "chưa sẵn sàng". Vòng phỏng vấn đầu tiên dạy nhiều hơn 2 tuần tự ôn. Nộp sớm, thất bại rẻ, sửa nhanh.

Làm bài tập tự chấm tương ứng: [Bài tập Stage 6](../bai-tap/stage-6.mdx)

Hết 6 lesson. Quay lại [Tổng quan lộ trình](../intro.md) để soát lại 4 checkpoint.
