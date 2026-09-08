---
id: l5-stats
title: "Lý thuyết 5 — Thống kê suy diễn & A/B test"
sidebar_label: "L5 — Thống kê"
sidebar_position: 6
description: "CLT, khoang tin cay, p-value, power, MDE, co mau, doc ket qua A/B, 4 bay: peeking, SRM, novelty, Simpson."
format: md
---

# LESSON 5 — Thống kê suy diễn & A/B Test (W17–W19)

Bổ trợ cho [Stage 5 — Thống kê & A/B](../stages/stage-5-statistics-abtest.md). Mục tiêu thật của 3 tuần này: **biết khi nào KHÔNG được kết luận**. Đó mới là thứ phân biệt analyst với người chạy công thức.

Mọi con số ví dụ dưới đây đã được tính thật bằng `scipy.stats` — công thức kèm theo để tự chạy lại.

---

## 5.1 — Tổng thể, mẫu, và vì sao có sai số {#mau-sai-so}

**Định nghĩa.** **Tổng thể (population)** = toàn bộ đối tượng quan tâm (tất cả khách hàng). **Mẫu (sample)** = phần quan sát được (1.000 khách được khảo sát). Thống kê suy diễn = dùng mẫu nói về tổng thể, kèm mức độ không chắc chắn.

**Standard error (sai số chuẩn)** = `SD / √n`. Hệ quả trực tiếp:

| n | SE (với SD = 100) | Muốn giảm sai số một nửa |
|---|---|---|
| 100 | 10,0 | |
| 400 | 5,0 | phải tăng mẫu **gấp 4** |
| 1.600 | 2,5 | gấp 4 lần nữa |

Đây là lý do A/B test cần rất nhiều người và tại sao "chạy thêm 2 ngày nữa cho chắc" thường không giải quyết được gì.

**Sampling bias quan trọng hơn cỡ mẫu.** Mẫu lệch thì n lớn chỉ làm ta **tự tin hơn vào con số sai**. Ví dụ kinh điển: khảo sát mức độ hài lòng bằng popup trong app → chỉ những người còn dùng app mới trả lời được, người đã bỏ đi không có mặt → điểm hài lòng luôn đẹp.

**Bài tập 5.1.** Ba tình huống, chỉ ra thiên lệch:
a) Đánh giá tính năng mới bằng khảo sát gửi cho người dùng đã bật tính năng đó.
b) Đo thời gian giao hàng trung bình chỉ trên đơn đã giao thành công.
c) Phân tích lý do hủy dịch vụ dựa trên form khảo sát lúc hủy (điền tự nguyện).

<details>
<summary>Đáp án 5.1</summary>

a) Self-selection: người bật tính năng vốn dĩ đã thích nó. So sánh đúng phải là ngẫu nhiên hóa ai được thấy tính năng.
b) Survivorship: đơn thất lạc/hủy — nhóm tệ nhất — bị loại khỏi mẫu, thời gian giao trung bình trông đẹp hơn thực tế.
c) Non-response: người quá bực thường bỏ đi im lặng, không điền form. Lý do phổ biến nhất có thể hoàn toàn vắng mặt trong dữ liệu.

</details>

---

## 5.2 — CLT: vì sao dùng được phân phối chuẩn cho dữ liệu lệch {#clt}

**Định nghĩa (CLT).** Dù tổng thể lệch thế nào, **phân phối của trung bình mẫu** sẽ tiệm cận phân phối chuẩn khi n đủ lớn.

Điều này giải thích một nghịch lý người mới hay hỏi: doanh thu lệch phải cực mạnh (L1: mean 230 vs median 54), sao vẫn dùng t-test được? Vì t-test làm việc trên **trung bình mẫu**, không phải trên từng giá trị.

```python
import numpy as np, matplotlib.pyplot as plt
pop = np.random.exponential(scale=100, size=100_000)      # tong the lech phai manh
for n in (5, 30, 100):
    means = [np.random.choice(pop, size=n).mean() for _ in range(2000)]
    print(f"n={n:3d}  mean={np.mean(means):6.1f}  sd={np.std(means):5.1f}")
```
Quan sát: `sd` giảm theo đúng tỷ lệ `1/√n`, và hình dạng ngày càng giống chuông.

**Giới hạn của CLT** — phải nói được khi phỏng vấn: n cần lớn hơn nhiều nếu phân phối cực lệch hoặc có outlier nặng. Với dữ liệu doanh thu có vài đơn 20.000$, n = 30 là hoàn toàn không đủ. Khi nghi ngờ: dùng bootstrap hoặc kiểm định phi tham số (Mann-Whitney).

---

## 5.3 — Khoảng tin cậy: cách báo cáo đúng {#khoang-tin-cay}

**Định nghĩa.** CI 95% = khoảng ước lượng được tạo bằng một quy trình mà, nếu lặp lại việc lấy mẫu nhiều lần, khoảng đó sẽ chứa giá trị thật khoảng 95% số lần.

| Cách nói | Đúng/Sai |
|---|---|
| "Có 95% xác suất giá trị thật nằm trong khoảng này" | ❌ Sai (rất phổ biến) |
| "Nếu lặp lại cách đo này nhiều lần, 95% số khoảng tính được sẽ chứa giá trị thật" | ✅ Đúng |
| "Ta khá chắc giá trị thật nằm trong khoảng này, và khoảng hẹp thì càng chắc" | ✅ Chấp nhận được khi nói với người không chuyên |

**Vì sao bắt buộc kèm CI.** So sánh hai cách báo cáo cùng một kết quả:
- "Conversion tăng 0,6 điểm phần trăm" → sếp duyệt triển khai.
- "Conversion tăng 0,6 điểm phần trăm (CI 95%: **−0,02% đến +1,22%**)" → sếp thấy khoảng chứa cả số âm, hỏi thêm trước khi quyết.

Con số thứ hai mới là sự thật đầy đủ. (Số này lấy từ ví dụ 5.6 bên dưới, tính thật.)

---

## 5.4 — p-value: định nghĩa đúng và cách giải thích cho sếp {#p-value}

**Định nghĩa.** p-value = xác suất quan sát được kết quả **ít nhất cực đoan như dữ liệu hiện có**, giả sử H0 (không có khác biệt) là đúng.

### Bàn tập đồng xu

Bỏ qua marketing và conversion một lát. Chỉ có một đồng xu.

Nghi ngờ: *"đồng xu này có bị lệch không?"* Tung thử 10 lần, ra **7 mặt ngửa**. 70% ngửa — nghe như lệch thật. Nhưng đồng xu **hoàn toàn công bằng** cũng ra 7/10 khá thường xuyên.

Câu hỏi đúng phải là: **"nếu đồng xu công bằng, khả năng ra kết quả lệch ít nhất như thế này là bao nhiêu?"** Đó chính là p-value.

```python
from scipy import stats
stats.binomtest(7,  10,  0.5).pvalue     # 0.3438
stats.binomtest(70, 100, 0.5).pvalue     # 0.000079
```

| Thí nghiệm | Tỷ lệ ngửa | p-value | Kết luận |
|---|---|---|---|
| 10 lần, 7 ngửa | 70% | **0,344** | Đồng xu công bằng cũng ra thế này 34% số lần → **không kết luận được gì** |
| 100 lần, 70 ngửa | 70% | **0,000079** | Gần như không thể xảy ra nếu công bằng → **có bằng chứng đồng xu lệch** |

**Cùng một tỷ lệ 70%, hai kết luận trái ngược.** Khác biệt duy nhất: cỡ mẫu.

Đây là toàn bộ ý nghĩa của p-value — nó không đo "lệch bao nhiêu", nó đo **"bằng chứng có đủ mạnh chưa"**. Và cũng là lý do phải tính cỡ mẫu **trước** khi chạy A/B test: 10 lần tung thì dù kết quả thế nào cũng không kết luận được.

Đổi tên biến là ra ngay bài toán thật: đồng xu → phiên bản B, mặt ngửa → khách mua hàng, 50% → tỷ lệ chuyển đổi hiện tại.

| p-value KHÔNG phải là | Vì sao |
|---|---|
| Xác suất H0 đúng | p tính **với giả định** H0 đúng, không thể vừa giả định vừa kết luận về nó |
| Xác suất kết quả đúng khi lặp lại | đó là khái niệm khác (replicability) |
| Độ lớn tác động | mẫu đủ lớn thì chênh lệch bé xíu cũng cho p rất nhỏ |

**Bài viết ≤150 từ cho Giám đốc Marketing (mẫu đạt chuẩn):**

> *"Chúng ta thử phiên bản B so với A. Câu hỏi là: chênh lệch nhìn thấy có thật hay chỉ do may rủi khi chia nhóm?*
> *p-value trả lời đúng câu đó. p = 0,058 nghĩa là: nếu thực ra hai phiên bản như nhau, thì khoảng 6 lần trong 100 lần thử ta vẫn sẽ thấy chênh lệch lớn ít nhất như lần này chỉ vì ngẫu nhiên.*
> *Ngưỡng thông thường là 5%. Kết quả 5,8% nằm trên ngưỡng nên chưa đủ bằng chứng để khẳng định B tốt hơn — nhưng cũng không có nghĩa B vô dụng.*
> *Khoảng ước lượng cho mức tăng là từ −0,02% đến +1,22%. Nói cách khác: nhiều khả năng B tốt hơn một chút, nhưng dữ liệu hiện tại chưa loại trừ được khả năng không đổi. Muốn chắc, cần chạy thêm để tăng cỡ mẫu."*

Nhận xét: bài viết này không dùng chữ "giả thuyết không", không dùng "bác bỏ", và nói rõ hàm ý hành động. Đó là tiêu chuẩn.

---

## 5.5 — Sai lầm loại I/II, power, MDE {#power-mde}

| Khái niệm | Nghĩa | Giá trị chuẩn |
|---|---|---|
| Alpha (α) | xác suất báo động giả (kết luận có khác biệt trong khi không có) | 0,05 |
| Beta (β) | xác suất bỏ sót khác biệt thật | 0,20 |
| Power = 1−β | khả năng phát hiện được khác biệt thật | 0,80 |
| MDE | mức chênh lệch nhỏ nhất mà ta muốn phát hiện được | do **kinh doanh** quyết định |

**MDE là quyết định kinh doanh, không phải kỹ thuật.** Câu hỏi phải hỏi sếp: *"Tăng conversion bao nhiêu thì mới đáng để chúng ta triển khai và duy trì tính năng này?"* Nếu dưới 0,5% thì không đáng làm → MDE = 0,5%.

**Cỡ mẫu (đã tính thật, baseline 5%, α = 0,05, power = 0,80):**

| MDE (tuyệt đối) | Tương đối | n **mỗi nhóm** |
|---|---|---|
| +1,0 điểm % (5% → 6%) | +20% | **8.158** |
| +0,5 điểm % (5% → 5,5%) | +10% | **31.234** |
| +0,25 điểm % (5% → 5,25%) | +5% | **122.124** |

Quy luật cần thuộc: **MDE giảm một nửa → cỡ mẫu tăng gấp 4**.

Cách tính:
```python
import math
from scipy import stats
def n_per_group(p1, p2, alpha=0.05, power=0.8):
    z_a = stats.norm.ppf(1 - alpha/2); z_b = stats.norm.ppf(power); p = (p1 + p2)/2
    return math.ceil((z_a*math.sqrt(2*p*(1-p)) + z_b*math.sqrt(p1*(1-p1) + p2*(1-p2)))**2 / (p2-p1)**2)
n_per_group(0.05, 0.055)     # 31234
```

**Từ cỡ mẫu ra thời gian chạy:** `số ngày = n mỗi nhóm × 2 / lượng người dùng đủ điều kiện mỗi ngày`. Ví dụ: 31.234 × 2 / 5.000 = 12,5 ngày → **làm tròn lên bội số của 7** (14 ngày) để phủ đủ chu kỳ tuần, vì hành vi cuối tuần khác ngày thường.

---

## 5.6 — Đọc kết quả A/B test: một ví dụ đầy đủ {#doc-ket-qua-ab}

**Dữ liệu:** A: 10.000 người, 500 chuyển đổi (5,00%). B: 10.000 người, 560 chuyển đổi (5,60%).

**Kết quả tính thật:**

| Chỉ số | Giá trị |
|---|---|
| Chênh lệch tuyệt đối | +0,60 điểm phần trăm |
| Chênh lệch tương đối | **+12,0%** |
| z | 1,894 |
| **p-value** | **0,0582** |
| CI 95% của chênh lệch | **[−0,02% ; +1,22%]** |
| Chi-square (kiểm chứng chéo) | χ² = 3,468 · p = 0,0626 |

```python
import math; from scipy import stats
p1, p2, n1, n2 = 0.05, 0.056, 10000, 10000
se = math.sqrt(p1*(1-p1)/n1 + p2*(1-p2)/n2)
z  = (p2-p1)/se
print(z, 2*(1-stats.norm.cdf(abs(z))), (p2-p1)-1.96*se, (p2-p1)+1.96*se)
```

**Cách kết luận đúng:**

> *"B cho conversion 5,60% so với 5,00% của A — cao hơn tương đối 12%. Tuy nhiên p = 0,058 (trên ngưỡng 0,05) và khoảng tin cậy 95% cho mức tăng là từ −0,02% đến +1,22%, tức vẫn bao gồm khả năng không có cải thiện. Chưa đủ bằng chứng để triển khai. Hai lựa chọn: (1) chạy thêm ~5 ngày để đạt cỡ mẫu cần cho MDE 0,5%, hoặc (2) dừng nếu chi phí duy trì thí nghiệm lớn hơn giá trị kỳ vọng."*

**Ba cách kết luận SAI ở tình huống này:**
1. "p = 0,058 gần 0,05 rồi, coi như có ý nghĩa" → ngưỡng phải chốt trước, không co giãn sau khi nhìn số.
2. "Không có ý nghĩa thống kê nghĩa là hai phiên bản như nhau" → sai: không có bằng chứng khác biệt ≠ có bằng chứng không khác biệt. CI cho thấy mức tăng tới 1,22% vẫn hoàn toàn khả dĩ.
3. "Chạy thêm đến khi p < 0,05" → đây là peeking, làm hỏng toàn bộ tính hợp lệ (mục 5.7).

---

## 5.7 — Bốn cái bẫy phá hỏng A/B test {#bon-bay}

**1. Peeking (nhìn lén và dừng khi thấy đẹp).** Kiểm tra kết quả mỗi ngày và dừng ngay khi p < 0,05 làm tỷ lệ báo động giả tăng từ 5% lên **20–30%**. Cách tránh: chốt ngày dừng trước khi chạy; nếu bắt buộc phải theo dõi liên tục thì dùng sequential testing (alpha spending).

**2. SRM (Sample Ratio Mismatch).** Thiết kế 50/50 nhưng thực tế 10.000 vs 9.400 → hệ thống chia nhóm có lỗi (bot, cache, redirect hỏng). **Kiểm tra đầu tiên, trước cả metric chính.** Có SRM thì toàn bộ kết quả vứt đi, không cứu được bằng thống kê.

**3. Novelty effect.** Người dùng bấm nhiều vì thấy lạ; hiệu ứng tan sau 1–2 tuần. Cách phát hiện: vẽ chênh lệch theo ngày, nếu thu hẹp dần thì nghi novelty. Cách xử lý: chạy đủ dài, hoặc tách riêng nhóm người dùng mới.

**4. Simpson's paradox.** Ví dụ số thật:

| Kênh | A | B |
|---|---|---|
| Mobile | 50/1.000 = **5,0%** | 540/9.000 = **6,0%** |
| Desktop | 900/9.000 = **10,0%** | 120/1.000 = **12,0%** |
| **Gộp chung** | 950/10.000 = **9,5%** | 660/10.000 = **6,6%** |

B thắng ở **cả hai** kênh nhưng thua khi gộp — vì B có tới 90% lưu lượng từ Mobile (kênh vốn conversion thấp) còn A thì ngược lại. Nguyên nhân: phân bổ nhóm không cân bằng theo kênh.

Bài học: **luôn tách theo các chiều chính (thiết bị, kênh, người dùng mới/cũ) trước khi báo cáo**. Nếu kết luận đảo chiều khi tách nhóm, con số gộp là con số dối.

**Bài tập 5.7.** Tự dựng một ví dụ Simpson's paradox bằng dữ liệu Superstore (gợi ý: biên lợi nhuận theo Region, tách theo Category). Viết 3 câu giải thích cho người không chuyên.

---

## 5.8 — Checklist thiết kế A/B test (dùng cho Portfolio #3) {#checklist-ab}

**Trước khi chạy** — thiếu bất kỳ mục nào thì chưa được chạy:
- [ ] Giả thuyết viết dạng: "Nếu [thay đổi] thì [metric] sẽ [tăng/giảm] khoảng [MDE] vì [lý do]"
- [ ] Metric chính: **đúng 1 cái**
- [ ] Guardrail metric: 2–3 cái không được xấu đi (tỷ lệ hoàn hàng, thời gian tải, hủy dịch vụ)
- [ ] MDE chốt cùng bộ phận kinh doanh
- [ ] Cỡ mẫu tính ra số cụ thể
- [ ] Thời gian chạy = bội số của 7 ngày
- [ ] Đơn vị ngẫu nhiên hóa (user? session? thiết bị?) và cách chống rò rỉ giữa hai nhóm
- [ ] Ngày dừng chốt trước

**Sau khi chạy:**
- [ ] Kiểm tra SRM **trước tiên**
- [ ] Metric chính kèm **CI**, không chỉ p-value
- [ ] Kiểm tra guardrail
- [ ] Tách nhóm theo thiết bị/kênh/người mới-cũ (bắt Simpson)
- [ ] Vẽ chênh lệch theo ngày (bắt novelty)
- [ ] Kết luận rõ: triển khai / không triển khai / chạy tiếp — kèm lý do kinh doanh, không chỉ lý do thống kê

**Spec Portfolio #3** (dataset gợi ý: Cookie Cats trên Kaggle — retention D1/D7 khi đổi cổng chặn từ level 30 sang 40):
1. Nêu giả thuyết và metric chính (retention D7)
2. Kiểm tra SRM
3. Tính cỡ mẫu **cần thiết** và so với cỡ mẫu **thực có**
4. Kiểm định + **CI**, không chỉ p
5. Tách nhóm kiểm tra
6. Kết luận kèm hạn chế: thời gian chạy, novelty, khả năng dữ liệu bị nhiễu bởi người chơi nhiều thiết bị

---

## Checklist trước khi sang Stage 6

- [ ] Giải thích p-value trong ≤150 từ, không dùng thuật ngữ thống kê
- [ ] Nói được 3 điều p-value **không** phải
- [ ] Tính cỡ mẫu từ baseline + MDE + alpha + power
- [ ] Giải thích quy luật "MDE giảm một nửa → mẫu gấp 4"
- [ ] Đọc kết quả có p = 0,058 và kết luận đúng (không làm tròn thành "có ý nghĩa")
- [ ] Giải thích Simpson's paradox bằng ví dụ số tự dựng
- [ ] Nêu được 4 bẫy: peeking, SRM, novelty, Simpson

**Tiếp theo:** [L6 — Capstone & Phỏng vấn →](./l6-capstone-interview.md)

Làm bài tập tự chấm tương ứng: [Bài tập Stage 5](../bai-tap/stage-5.mdx)
