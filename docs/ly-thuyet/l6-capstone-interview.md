---
id: l6-capstone-interview
title: "Lý thuyết 6 — Capstone & Phỏng vấn"
sidebar_label: "L6 — Capstone & PV"
sidebar_position: 7
description: "Funnel/cohort/RFM, README chuan, ke chuyen 5 phut, khung case study 5 buoc, 20 cau phong van, CV DA fresher."
format: md
---

# LESSON 6 — Capstone, CV & Phỏng vấn (W20–W24)

:::tip Cách đọc trang này
Từ khóa **in đậm có gạch chân** là thuật ngữ — bấm vào để nhảy sang [Từ điển](/glossary) xem định nghĩa kèm ví dụ.
Cuối mỗi mục có khối **Chốt lại** tóm tắt điều quan trọng nhất. Đọc lướt các khối đó là nắm được xương sống của bài.
:::

Bổ trợ cho [Stage 6 — Capstone & Job prep](../stages/stage-6-capstone-jobprep.md). Giai đoạn này không học thêm công cụ mới. Việc duy nhất: **biến những gì đã làm thành thứ người khác tin được trong 5 phút**.

---

## 6.1 — Ba dạng phân tích của capstone {#ba-dang-phan-tich}

Ba dạng này đã học kỹ thuật ở [L2 §2.8](/ly-thuyet/l2-sql#funnel-cohort-rfm). Ở đây học cách **đọc kết quả và biến thành đề xuất** — phần quyết định điểm số của capstone.

### [Funnel](/glossary#funnel) — đọc số rơi rụng

Giả sử chạy xong ra:

```
xem      100.000 user
gio       35.000 user   (35%)
thanh toan 12.000 user   (34%)
mua        10.800 user   (90%)
```

**Người mới đọc:** *"Conversion tổng 10,8%."* Hết. Không ai làm gì được với câu đó.

**Analyst đọc:** tìm bước **rơi bất thường nhất**, không phải bước rơi nhiều nhất.

| Bước | Tỷ lệ qua | Đánh giá |
|---|---|---|
| xem → giỏ | 35% | bình thường với e-commerce |
| giỏ → thanh toán | 34% | **bất thường** — người đã bỏ vào giỏ là người có ý định mua |
| thanh toán → mua | 90% | tốt |

Rơi nhiều nhất về **số tuyệt đối** là bước 1 (65.000 người). Nhưng bước đáng sửa là **bước 2**: 23.000 người đã thể hiện ý định mua rồi vẫn bỏ đi. Sửa bước 2 rẻ hơn và hiệu quả hơn nhiều so với cố kéo thêm người xem.

**Câu hỏi tiếp theo tự động phát sinh:** bước 2 rơi mạnh ở thiết bị nào? Kênh nào? Nhóm khách mới hay cũ? Đó là lúc cắt lát dữ liệu.

### Cohort — đọc theo hai chiều

| Cohort | Tháng 0 | Tháng 1 | Tháng 2 | Tháng 3 |
|---|---|---|---|---|
| 2024-01 | 100% | 42% | 31% | 28% |
| 2024-02 | 100% | 45% | 33% | — |
| 2024-03 | 100% | 38% | — | — |
| 2024-04 | 100% | 31% | — | — |

**Đọc ngang** (một nhóm theo thời gian): [retention](/glossary#retention) giảm mạnh ở tháng 1 rồi **phẳng dần** từ tháng 2 — dấu hiệu tốt, nghĩa là ai đã ở lại qua tháng 2 thì có xu hướng ở lại lâu.

**Đọc dọc** (cùng cột, các [cohort](/glossary#cohort) khác nhau): cột "Tháng 1" đi từ 42% → 45% → 38% → **31%**. Chất lượng user mới đang **xấu dần** qua từng tháng.

Đọc dọc là thứ mà báo cáo doanh thu tổng **không bao giờ cho thấy** — doanh thu vẫn có thể tăng đều trong khi chất lượng user mới đang sụp, vì tiền marketing bù vào.

Câu hỏi phát sinh: tháng 3 và 4 có thay đổi gì về kênh marketing không? Có chạy khuyến mãi thu hút nhóm săn giá không?

### RFM — phân khúc phải dẫn tới hành động

Sau khi chấm điểm R, F, M, bảng cuối cùng phải trông như thế này:

| Phân khúc | Số khách | % doanh thu | Hành động | Đo bằng |
|---|---|---|---|---|
| Champions (555) | 320 | 28% | mời chương trình thành viên | tỷ lệ tham gia, LTV sau 6 tháng |
| **At risk** (F,M cao · R thấp) | 480 | 22% | ưu đãi giữ chân cá nhân hóa | tỷ lệ quay lại trong 30 ngày |
| Loyal | 900 | 25% | upsell nhóm sản phẩm liên quan | doanh thu/khách |
| New | 1.500 | 8% | onboarding, khuyến khích mua lần 2 | tỷ lệ mua lần 2 trong 60 ngày |
| Lost | 2.100 | 3% | không đầu tư thêm | — |

**Nhóm At risk là nhóm đáng giá nhất**: họ từng chi nhiều (M cao), mua thường xuyên (F cao), nhưng dạo này im ắng (R thấp). Cứu được một khách ở nhóm này rẻ hơn nhiều so với tìm khách mới.

Nếu bảng của bạn không có 2 cột cuối (**Hành động**, **Đo bằng**) thì phân khúc đó chưa dùng được — mới chỉ là bài tập kỹ thuật.

### Bài tập 6.1

1. Funnel của bạn trên `thelook_ecommerce`: bước nào rơi bất thường nhất? Căn cứ vào đâu để nói "bất thường"?
2. Bảng cohort của bạn: đọc dọc cho thấy chất lượng user mới đang tốt lên hay xấu đi? Nêu con số.
3. Viết bảng RFM đủ 5 cột như mẫu trên, mỗi phân khúc một hành động **khác nhau**.


:::note Chốt lại
Chạy ra được funnel/cohort/RFM mới là nửa việc. Nửa còn lại là **đọc**: bước rơi nhiều nhất không phải bước đáng sửa nhất; đọc dọc bảng cohort để thấy chất lượng user mới; phân khúc không dẫn tới hành động khác nhau thì vô nghĩa.
:::

## 6.2 — README mà nhà tuyển dụng đọc trong 3 phút {#readme-chuan}

Repo gốc nói đúng một điều: **CV được đọc 30 giây, portfolio được xem 5 phút.** README là thứ quyết định 5 phút đó.

### Bàn tập — hai cái tiêu đề

```
❌  # E-commerce Funnel Analysis
✅  # 62% người dùng rời ở bước thanh toán trên mobile — cao gấp 2 lần desktop
```

Tiêu đề thứ nhất nói **bạn đã làm gì**. Tiêu đề thứ hai nói **bạn đã tìm ra gì**.

Nhà tuyển dụng xem 20 portfolio một buổi. Cái nào bắt họ phải đọc mới hiểu thì bị bỏ qua.

### Cấu trúc bắt buộc

```markdown
# [Tên project] — [kết luận chính, có số]

**TL;DR** (3 dòng): tìm ra gì · quan trọng ra sao · đề xuất gì
![dashboard](anh.png)          <- ANH NGAY DAU, truoc moi thu khac


:::note Chốt lại
Tiêu đề README nói **bạn tìm ra gì**, không phải bạn đã làm gì. Ảnh đặt ngay đầu. Và mục Hạn chế không phải chỗ thừa nhận yếu kém — người có kinh nghiệm đọc nó **đầu tiên** để đánh giá bạn có hiểu dữ liệu của mình không.
:::

## Câu hỏi kinh doanh
## Dữ liệu (nguồn · khoảng thời gian · số dòng · grain · bộ lọc)
## Phương pháp (các bước, vì sao chọn cách đó)
## Findings (mỗi finding: 1 chart + 1 câu có số)
## Hạn chế (dữ liệu KHÔNG nói được gì)
## Đề xuất (2-3 hành động: ai làm, đo bằng gì)
## Cách chạy lại (lệnh cụ thể)
```

### Ba lỗi làm mất điểm ngay

| Lỗi | Vì sao chết |
|---|---|
| **Không có ảnh** | Phải mở notebook/click vào code mới hiểu → không ai làm |
| **Không nêu hạn chế** | Trông như không biết mình đang giả định gì → thiếu tin cậy |
| **Đề xuất chung chung** | "Nên cải thiện trải nghiệm người dùng" — không ai làm gì được |

Lỗi thứ hai đáng nói thêm: người mới nghĩ nêu hạn chế là "thừa nhận yếu kém". Ngược lại — người có kinh nghiệm đọc phần Hạn chế **đầu tiên** để đánh giá bạn có hiểu dữ liệu của mình không.

### Bàn tập — viết lại một finding

```
❌  "Doanh thu Furniture thấp hơn Technology."

⚠️  "Furniture đạt 742.000$ doanh thu, Technology đạt 836.154$."
    (co so nhung chi la mo ta, chua co y nghia)

✅  "Furniture chiếm 32% doanh thu nhưng chỉ 6,4% lợi nhuận — biên 2,5%
    so với 17,4% của Technology. Mỗi đồng doanh thu Furniture tạo lợi nhuận
    chỉ bằng 1/7 Technology, trong đó riêng sub-category Tables lỗ 17.725$."
```

Ba tầng: nhận định → có số → **có so sánh và hàm ý**.

### Bài tập 6.2

1. Viết lại tiêu đề của 4 project theo kiểu "tiêu đề là kết luận có số".
2. Với mỗi project, viết mục Hạn chế — tối thiểu 2 điều dữ liệu **không** trả lời được.
3. Đưa README cho một người không làm dữ liệu đọc 3 phút, rồi hỏi họ 3 câu: vấn đề là gì · con số chính là bao nhiêu · nên làm gì tiếp. Trả lời sai chỗ nào thì sửa chỗ đó.

## 6.3 — Kể chuyện với dữ liệu: khung 5 phút {#ke-chuyen}

### Bàn tập — hai cách mở đầu

Cùng một project, hai cách bắt đầu buổi trình bày:

```
❌ "Em dùng dataset thelook_ecommerce trên BigQuery, có 7 bảng, khoảng 100 nghìn
    đơn hàng. Đầu tiên em làm sạch dữ liệu, loại 3% dòng thiếu ngày. Sau đó em
    viết query funnel bằng CTE..."

✅ "62% người dùng bỏ giỏ hàng ở bước thanh toán trên mobile — gấp đôi desktop.
    Nếu kéo tỷ lệ này về ngang desktop, doanh thu tăng khoảng 8%.
    Em sẽ trình bày cách tìm ra và đề xuất xử lý."
```

Cách 1: sau 30 giây người nghe vẫn chưa biết bạn tìm ra gì. Nếu sếp phải ra khỏi phòng ở phút thứ 2, buổi trình bày coi như thất bại.

Cách 2 dùng **BLUF** — Bottom Line Up Front: nói kết luận trước, giải thích sau.

### Khung 5 phút

| Phút | Nội dung | Bẫy |
|---|---|---|
| 0:00–0:30 | Bối cảnh + câu hỏi kinh doanh | kể lể dataset trước khi nói vấn đề |
| 0:30–1:00 | **Kết luận chính, nói ngay** | để dành kết luận đến cuối như phim trinh thám |
| 1:00–3:00 | 2–3 bằng chứng, mỗi cái 1 chart 1 số | trình bày 12 chart |
| 3:00–4:00 | Đề xuất + tác động ước tính | đề xuất không kèm con số |
| 4:00–5:00 | Hạn chế + bước tiếp theo | giấu hạn chế |

**Nguyên tắc: buổi trình bày phải chịu được việc bị ngắt bất cứ lúc nào.** Bị ngắt ở phút 2 mà người nghe vẫn nắm được kết luận → đạt.

### Quy tắc cho phần bằng chứng

Mỗi chart phải trả lời được: *"chart này chứng minh điều gì trong kết luận của tôi?"*. Không trả lời được → bỏ ra khỏi bài trình bày (đưa vào phụ lục nếu tiếc).

Ba chart tốt hơn mười hai chart. Người nghe không nhớ được mười hai thứ.

### Bàn tập — đề xuất có và không có con số

```
❌ "Nên tối ưu trang thanh toán trên mobile."

✅ "Đề xuất rút gọn form thanh toán mobile từ 8 trường xuống 4, thử A/B trong
    3 tuần trên 20% lưu lượng. Nếu tỷ lệ hoàn tất tăng 5 điểm phần trăm như
    kỳ vọng thì doanh thu tăng khoảng 8%/tháng. Dừng thử nếu tỷ lệ đơn lỗi
    thanh toán tăng quá 1%."
```

Đề xuất tốt có 4 phần: **hành động cụ thể · phạm vi thử · tác động ước tính · điều kiện dừng**.

Phần "tác động ước tính" là thứ phân biệt analyst với người báo cáo — nó buộc bạn phải quy đổi phát hiện ra tiền.

### Bài tập 6.3

1. Viết 3 câu mở đầu cho capstone theo kiểu BLUF. Đọc to, bấm giờ — phải dưới 30 giây.
2. Quay video 5 phút trình bày capstone. Xem lại và đếm: bao nhiêu lần nói "ừm" · có nói kết luận trong 60 giây đầu không · có câu nào không kèm số không.
3. Chọn 3 chart giữ lại, viết lý do vì sao bỏ những cái còn lại.


:::note Chốt lại
Nói kết luận trong 60 giây đầu (BLUF). Buổi trình bày phải chịu được việc **bị ngắt bất cứ lúc nào**. Ba chart tốt hơn mười hai chart, và đề xuất phải quy đổi ra tác động bằng số.
:::

## 6.4 — Khung trả lời case study (5 bước) {#case-study}

Vòng case study là chỗ rớt nhiều nhất, vì ứng viên nhảy thẳng vào SQL.

**Đề mẫu:** *"Doanh thu tháng này giảm 15% so tháng trước. Bạn làm gì?"*

### Trước khi đọc tiếp: tự làm thử

Đề: *"Doanh thu tháng này giảm 15% so tháng trước. Bạn làm gì?"*

Đừng đọc xuống. Viết ra giấy trong 2 phút: **câu đầu tiên bạn nói ra là gì?**

Phần lớn người mới viết một trong ba câu sau:
- *"Em sẽ query dữ liệu doanh thu 12 tháng gần nhất..."* → nhảy vào công cụ
- *"Có thể do mùa vụ..."* → đoán nguyên nhân khi chưa biết gì
- *"Em sẽ vẽ biểu đồ xem xu hướng..."* → làm việc trước khi hiểu việc

Cả ba đều trượt cùng một chỗ: **chưa biết con số 15% đó nghĩa là gì đã đi giải quyết nó.**

**Bước 1 — Clarify (hỏi lại trước khi phân tích).** 15% so với tháng trước hay cùng kỳ năm trước? Doanh thu gộp hay đã trừ hoàn hàng? Giảm ở toàn bộ hay một mảng? Có thay đổi gì về sản phẩm/giá/marketing trong tháng không? Số liệu đã chốt hay còn đang cập nhật?

*Riêng bước này đã lọc được phần lớn ứng viên. Người mới nhảy vào phân tích ngay; người có kinh nghiệm hỏi trước. Trong việc thật cũng vậy — một nửa số "vấn đề" tan biến ngay ở bước hỏi lại.*

**Bước 2 — Structure (chia bài toán).** Doanh thu = số đơn × [AOV](/glossary#aov). Số đơn = số khách × tần suất. Cứ mỗi nhánh, hỏi: giảm ở đâu?
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

**Bài tập 6.3.** Viết đầy đủ 5 bước cho 3 đề: (a) [tỷ lệ chuyển đổi](/glossary#conversion-rate) giảm từ 3% xuống 2,4% trong 1 tuần; (b) sếp muốn biết có nên mở rộng sang thị trường mới; (c) tính năng mới ra 1 tháng, cần đánh giá thành công hay thất bại.

---


:::note Chốt lại
Bước **Clarify** là chỗ lọc phần lớn ứng viên — hỏi lại trước khi phân tích. Và luôn kiểm khả năng **lỗi dữ liệu** trước khi kết luận vấn đề kinh doanh: một tag tracking hỏng cũng làm doanh thu "giảm 15%".
:::

## 6.5 — 20 câu phỏng vấn kỹ thuật {#cau-hoi-phong-van}

Mỗi câu ≤ 90 giây. Cột "Ý bắt buộc phải nêu" là thứ người phỏng vấn thật sự chấm.

### SQL

| # | Câu hỏi | Ý bắt buộc phải nêu |
|---|---|---|
| 1 | `WHERE` vs `HAVING`? | lọc dòng trước gom / lọc nhóm sau gom · dùng được `WHERE` thì ưu tiên vì lọc sớm chạy nhanh hơn |
| 2 | `COUNT(*)` vs `COUNT(col)`? | đếm dòng / bỏ NULL · **ví dụ số**: Chinook 3.503 vs 2.526 |
| 3 | `INNER` vs `LEFT JOIN`? | kèm bẫy điều kiện ở `WHERE` biến LEFT thành INNER · **số 412/35/89** |
| 4 | [Fan-out](/glossary#fan-out) là gì, xử lý sao? | **2.328,60 → 20.848,62** · 3 cách sửa |
| 5 | Window khác `GROUP BY` chỗ nào? | giữ nguyên số dòng · ví dụ 2 dòng vs 3 dòng |
| 6 | `ROW_NUMBER` / `RANK` / `DENSE_RANK`? | 1,2,3 · 1,1,3 · 1,1,2 |
| 7 | Vì sao không lọc window ở `WHERE`? | thứ tự thực thi · bọc [CTE](/glossary#cte) hoặc `QUALIFY` |
| 8 | `NOT IN` vs `NOT EXISTS`? | NULL làm `NOT IN` trả **rỗng hoàn toàn** |
| 9 | Viết top-N mỗi nhóm | CTE + `ROW_NUMBER` + lọc `rn <= N` |
| 10 | Viết cohort retention | 3 bước: `first_month` → `activity` → tỷ lệ |
| 11 | Tối ưu query chậm | chọn cột thay `SELECT *` · lọc [partition](/glossary#partition) · tổng hợp trước khi join · tránh correlated subquery · đọc query plan |
| 12 | Khử trùng giữ bản mới nhất | `ROW_NUMBER() ... ORDER BY updated_at DESC` rồi lọc `= 1` |

### Phân tích & metric

| # | Câu hỏi | Ý bắt buộc phải nêu |
|---|---|---|
| 13 | Định nghĩa DAU/retention | đủ **5 trường** · nêu điểm mơ hồ cần chốt với business ("D7 là đúng ngày 7 hay trong vòng 7 ngày") |
| 14 | Mean vs [median](/glossary#median)? | ví dụ số: doanh thu 230 vs 54 · lương 69,2 vs 12 |
| 15 | Correlation ≠ causation | ví dụ discount/profit · nêu **[confounder](/glossary#confounder)** cụ thể |
| 16 | Giải thích [p-value](/glossary#p-value) cho non-tech | bản ≤150 từ ở [§5.4](/ly-thuyet/l5-stats#p-value) · không dùng chữ "bác bỏ giả thuyết không" |
| 17 | Tính sample size | baseline · [MDE](/glossary#mde) · alpha · [power](/glossary#power) · **quy luật MDE giảm ½ → mẫu ×4** |
| 18 | Khi nào dừng A/B test? | ngày chốt trước · nêu **[peeking](/glossary#peeking-problem)** và con số 4,7% → 14,3% |
| 19 | Dashboard không khớp kế toán | 5 bước debug + 4 nguyên nhân ngoài kỹ thuật (kỳ, múi giờ, định nghĩa doanh thu, bộ lọc mặc định) |
| 20 | Sếp đòi con số bạn biết sẽ bị hiểu sai | đưa số **kèm ngữ cảnh** · nêu giới hạn · đề xuất cách đo tốt hơn · **không** từ chối, cũng không đưa số trần trụi |

### Cách luyện

1. Viết đáp án ra giấy — viết mới lộ chỗ mình chưa rõ
2. **Đọc to**, bấm giờ, ≤ 90 giây
3. Câu nào phải nhìn ghi chú = câu chưa thuộc, đánh dấu lại
4. Với câu 3, 4, 14, 15, 17, 18: **phải có con số cụ thể**. Trả lời chay bằng định nghĩa là mất điểm

### Bài tập 6.5

1. Tự trả lời 20 câu, bấm giờ. Ghi lại câu nào quá 90 giây.
2. Quay video trả lời 3 câu khó nhất (4, 16, 18). Xem lại: có dùng số không?
3. Nhờ người không biết SQL nghe câu 16. Họ hiểu không?


:::note Chốt lại
Mỗi câu ≤ 90 giây, và sáu câu bắt buộc phải có **con số cụ thể** — trả lời chay bằng định nghĩa là mất điểm. Cách luyện đúng: viết ra giấy, đọc to, bấm giờ.
:::

## 6.6 — CV cho DA fresher {#cv-fresher}

**Một trang.** Thứ tự: Liên hệ → 3 dòng tóm tắt → **Projects** → Kỹ năng → Học vấn → (Kinh nghiệm khác).

Projects đứng **trên** học vấn. Với người chuyển ngành hoặc mới ra trường, project là bằng chứng duy nhất bạn làm được việc.

### Bàn tập — viết lại một mục project

```
❌  Sales Dashboard
    Sử dụng Looker Studio và SQL để phân tích dữ liệu bán hàng.
    Có kinh nghiệm làm việc với dữ liệu lớn.
```

Vấn đề: không có số · không có link · "dữ liệu lớn" với 10 nghìn dòng là nói quá · không cho biết bạn **tìm ra** gì.

```
✅  Sales Performance Dashboard — Looker Studio, SQL          [link]
    Phân tích 9.994 dòng dữ liệu bán lẻ 4 năm (2014–2017).
    Phát hiện nhóm Furniture chiếm 32% doanh thu nhưng chỉ 6% lợi nhuận
    (biên 2,5% so với 17,4% của Technology).
    Đề xuất rà soát chính sách chiết khấu trên 30% — ngưỡng mà lợi nhuận
    trung bình chuyển sang âm.
```

Ba dòng, mỗi dòng một chức năng: **làm gì** → **tìm ra gì (có số)** → **đề xuất gì**.

### Từ cần tránh

| Từ | Vì sao bỏ |
|---|---|
| "đam mê dữ liệu" · "ham học hỏi" · "chăm chỉ" | không kiểm chứng được, ai cũng viết |
| "tư duy logic" · "chịu được áp lực" | như trên |
| "dữ liệu lớn" khi làm với vài chục nghìn dòng | người phỏng vấn biết ngay là nói quá |
| "thành thạo" mọi thứ trong danh sách | sẽ bị hỏi sâu đúng cái mình yếu nhất |

Thay bằng: **số và link**. Một dòng "giải 150 bài SQL, link profile LeetCode" đáng giá hơn cả đoạn văn về đam mê.

### Kỹ năng — ghi theo mức trung thực

```
SQL         JOIN, CTE, window function, cohort/funnel analysis
Python      pandas, matplotlib, scipy
BI          Looker Studio, Metabase
Thống kê    kiểm định giả thuyết, thiết kế A/B test, tính cỡ mẫu
```

Quy tắc: **không liệt kê thứ mình không dám bị hỏi sâu.** Ghi "Machine Learning" vì học 1 khóa online rồi bị hỏi về overfitting là mất điểm toàn bộ phần còn lại.

### Bài tập 6.6

1. Viết 4 mục project theo mẫu 3 dòng. Mỗi mục phải có ít nhất 2 con số.
2. Đọc lại CV, gạch bỏ mọi từ không kiểm chứng được. Còn lại bao nhiêu chữ?
3. **Đọc 30 JD Junior DA thật** trên ITViec/TopDev/LinkedIn. Lập bảng: kỹ năng nào xuất hiện ≥ 15/30 lần. Đối chiếu với CV mình.

Bài 3 làm được hai việc: biết thị trường thật cần gì, và **tự kiểm chứng lại phần thị trường** mà lộ trình này thừa nhận là lấy từ repo gốc, chưa xác minh độc lập.


:::note Chốt lại
Projects đứng trên học vấn, mỗi project ba dòng: **làm gì → tìm ra gì (có số) → đề xuất gì**. Bỏ mọi từ không kiểm chứng được. Và không liệt kê kỹ năng mình không dám bị hỏi sâu.
:::

## 6.7 — CHECKPOINT 4: sẵn sàng ứng tuyển {#checkpoint-4}

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

:::note Chốt lại
Nộp hồ sơ là **một phần của việc học**, không phải bước sau khi học xong. Vòng phỏng vấn đầu tiên dạy nhiều hơn hai tuần tự ôn.
:::

