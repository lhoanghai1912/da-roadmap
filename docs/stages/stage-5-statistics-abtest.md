---
id: stage-5-statistics-abtest
title: "Stage 5 — Thống kê suy diễn & A/B Test"
sidebar_label: "Stage 5 — Stats & A/B"
sidebar_position: 6
description: "Tuan 17-19: CLT, khoang tin cay, kiem dinh gia thuyet, thiet ke A/B test. Portfolio #3."
format: md
---

# STAGE 5 — Thống kê suy diễn & A/B Testing

| | |
|---|---|
| **Thời lượng** | 3 tuần (W17–W19), ~45h |
| **Prerequisite** | CHECKPOINT 3 đã pass |
| **Mục tiêu** | Kết luận được từ mẫu ra tổng thể, và biết khi nào **không** được kết luận |
| **Output** | **PORTFOLIO #3 — A/B Test Analysis** |

Đây là phần phân biệt "người kéo dashboard" và "người phân tích". Repo gốc liệt kê câu hỏi phỏng vấn Mid: *"A/B test: sample size calculation, khi nào dừng test?"* và *"Explain p-value cho non-technical stakeholder"* — 3 tuần này chuẩn bị cho đúng những câu đó.

**Tài liệu chính:** [Khan Academy Statistics & Probability](https://www.khanacademy.org/math/statistics-probability) (free, đủ dùng) · *The Art of Statistics* — David Spiegelhalter · *Naked Statistics* chương 5–10.

---

# TUẦN 17 — Nền tảng suy diễn

## W17.1 — Phân phối (T2, 2h)

| ID | Chủ đề | Nội dung cần nắm | Xong |
|---|---|---|---|
| W17.1.1 | Phân phối chuẩn | Hình chuông, quy tắc 68–95–99.7 | ☐ |
| W17.1.2 | Phân phối lệch | Doanh thu, thời gian chờ thường lệch phải | ☐ |
| W17.1.3 | Phân phối nhị thức | Dùng cho tỷ lệ chuyển đổi (mua/không mua) | ☐ |
| W17.1.4 | Phân phối Poisson | Đếm sự kiện trong khoảng thời gian | ☐ |
| W17.1.5 | Vẽ và nhận diện phân phối trong Python | `sns.histplot` + `scipy.stats` | ☐ |

## W17.2 — Population, Sample, CLT (T3, 2h)

| ID | Chủ đề | Xong |
|---|---|---|
| W17.2.1 | Tổng thể vs mẫu, tham số vs thống kê | ☐ |
| W17.2.2 | Sampling bias — mẫu không đại diện thì cỡ mẫu lớn cũng vô nghĩa | ☐ |
| W17.2.3 | **Định lý giới hạn trung tâm (CLT)**: trung bình mẫu tiệm cận phân phối chuẩn dù tổng thể lệch | ☐ |
| W17.2.4 | Standard error = `std / sqrt(n)` — vì sao mẫu lớn thì ước lượng chính xác hơn | ☐ |
| W17.2.5 | **Mô phỏng CLT bằng Python** | ☐ |

**Bài tập W17.2.5 — mô phỏng CLT:**
```python
import numpy as np, matplotlib.pyplot as plt

pop = np.random.exponential(scale=100, size=100_000)   # tong the lech phai manh
means = [np.random.choice(pop, size=n).mean() for _ in range(2000)]  # thu n = 5, 30, 100

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].hist(pop, bins=50);   axes[0].set_title("Tong the (lech phai)")
axes[1].hist(means, bins=50); axes[1].set_title("Phan phoi trung binh mau")
```
Chạy với n = 5, 30, 100 → quan sát phân phối trung bình mẫu ngày càng giống chuông và ngày càng hẹp. Viết 3 câu giải thích ý nghĩa thực tế.

## W17.3 — Khoảng tin cậy (T4, 2h)

| ID | Chủ đề | Xong |
|---|---|---|
| W17.3.1 | Confidence interval 95% — nghĩa là gì và **không** nghĩa là gì | ☐ |
| W17.3.2 | Tính CI cho trung bình | ☐ |
| W17.3.3 | Tính CI cho tỷ lệ (conversion rate) | ☐ |
| W17.3.4 | Margin of error, ảnh hưởng của cỡ mẫu | ☐ |
| W17.3.5 | Bootstrap CI (không giả định phân phối) | ☐ |

**Diễn giải đúng:** "Nếu lặp lại việc lấy mẫu nhiều lần, khoảng tính theo cách này sẽ chứa giá trị thật khoảng 95% số lần." **Diễn giải sai** (rất phổ biến): "Có 95% xác suất giá trị thật nằm trong khoảng này."

Trong báo cáo thực tế, luôn kèm CI thay vì chỉ đưa 1 con số. "Conversion tăng 2.1%" khác hẳn "Conversion tăng 2.1% (CI 95%: −0.4% đến 4.6%)" — cái sau cho thấy có thể thực chất là giảm.

## W17.4 — Tương quan & biến gây nhiễu (T5 + T6, 4h)

| ID | Chủ đề | Xong |
|---|---|---|
| W17.4.1 | Pearson (tuyến tính) vs Spearman (thứ hạng, chịu được outlier) | ☐ |
| W17.4.2 | Hệ số r: dấu, độ mạnh, r² là gì | ☐ |
| W17.4.3 | Tương quan mạnh nhưng quan hệ phi tuyến → r thấp | ☐ |
| W17.4.4 | **Bộ tứ Anscombe** — 4 dataset cùng thống kê, khác hẳn hình dạng | ☐ |
| W17.4.5 | Confounder (biến gây nhiễu) | ☐ |
| W17.4.6 | Selection bias, survivorship bias | ☐ |
| W17.4.7 | **Simpson's paradox** — xu hướng đảo ngược khi gộp nhóm | ☐ |

**Bài tập:** vẽ Anscombe's quartet bằng `sns.load_dataset("anscombe")`, tính r cho từng nhóm — cả 4 gần bằng nhau nhưng hình dạng hoàn toàn khác. Kết luận: **luôn vẽ chart trước khi tin vào hệ số**.

**Deliverable W17:** `notebooks/w17-stats-foundation.ipynb` — mô phỏng CLT + 5 ví dụ tương quan giả (có cái từ dữ liệu thật của Olist) + Anscombe + 1 ví dụ Simpson's paradox tự dựng.

---

# TUẦN 18 — Kiểm định giả thuyết

## W18.1 — Khung kiểm định (T2, 2h)

| ID | Khái niệm | Nội dung | Xong |
|---|---|---|---|
| W18.1.1 | H0 (giả thuyết không) | Mặc định: "không có khác biệt" | ☐ |
| W18.1.2 | H1 (giả thuyết đối) | Điều bạn muốn chứng minh | ☐ |
| W18.1.3 | Một đuôi vs hai đuôi | Mặc định dùng hai đuôi | ☐ |
| W18.1.4 | Alpha (mức ý nghĩa) | Thường 0.05 — **chọn trước khi chạy test** | ☐ |
| W18.1.5 | p-value | Xác suất quan sát được kết quả này (hoặc cực đoan hơn) **nếu H0 đúng** | ☐ |
| W18.1.6 | Lỗi loại I (false positive) | Kết luận có khác biệt trong khi không có | ☐ |
| W18.1.7 | Lỗi loại II (false negative) | Bỏ lỡ khác biệt thật sự | ☐ |
| W18.1.8 | Power (1 − β) | Khả năng phát hiện khác biệt khi nó có thật. Chuẩn: 0.8 | ☐ |

**p-value KHÔNG phải:** xác suất H0 đúng · xác suất kết quả do may rủi · thước đo độ lớn hiệu ứng. p = 0.04 với hiệu ứng 0.01% là "có ý nghĩa thống kê" nhưng vô nghĩa với kinh doanh.

## W18.2 — Các loại test (T3, 2h)

| ID | Test | Dùng khi | Hàm scipy | Xong |
|---|---|---|---|---|
| W18.2.1 | One-sample t-test | So trung bình mẫu với 1 giá trị | `ttest_1samp` | ☐ |
| W18.2.2 | Two-sample t-test | So trung bình 2 nhóm độc lập | `ttest_ind` | ☐ |
| W18.2.3 | Welch's t-test | 2 nhóm phương sai khác nhau (**mặc định nên dùng**) | `ttest_ind(equal_var=False)` | ☐ |
| W18.2.4 | Paired t-test | Cùng đối tượng đo 2 lần | `ttest_rel` | ☐ |
| W18.2.5 | Chi-square | So tỷ lệ giữa các nhóm phân loại | `chi2_contingency` | ☐ |
| W18.2.6 | Z-test cho tỷ lệ | So 2 conversion rate | `proportions_ztest` | ☐ |
| W18.2.7 | Mann-Whitney U | Phi tham số, dữ liệu lệch mạnh | `mannwhitneyu` | ☐ |
| W18.2.8 | ANOVA | So trung bình 3+ nhóm | `f_oneway` | ☐ |

**Cây quyết định chọn test:**
```
Đo gì?
├─ Tỷ lệ (conversion, click) → 2 nhóm: z-test tỷ lệ / chi-square
│                             → 3+ nhóm: chi-square
└─ Số liên tục (doanh thu, thời gian)
   ├─ Phân phối gần chuẩn hoặc n lớn → 2 nhóm: Welch's t-test | 3+ nhóm: ANOVA
   └─ Lệch mạnh, n nhỏ → Mann-Whitney U
```

## W18.3 — Effect size & vấn đề so sánh bội (T4, 2h)

| ID | Chủ đề | Xong |
|---|---|---|
| W18.3.1 | Cohen's d — độ lớn hiệu ứng cho trung bình | ☐ |
| W18.3.2 | Lift tuyệt đối vs lift tương đối | ☐ |
| W18.3.3 | Ý nghĩa thống kê ≠ ý nghĩa kinh doanh | ☐ |
| W18.3.4 | Multiple comparison problem — test 20 metric ở alpha 5% thì trung bình 1 cái "có ý nghĩa" do ngẫu nhiên | ☐ |
| W18.3.5 | Hiệu chỉnh Bonferroni / FDR | ☐ |
| W18.3.6 | p-hacking, HARKing — vì sao phải chốt giả thuyết trước | ☐ |

## W18.4 — Bài tập viết (T5 + T6, 4h)

**Bài 1 — Giải thích p-value cho Giám đốc Marketing** (≤ 150 từ, không dùng công thức):

Khung gợi ý: *"Giả sử phiên bản mới thực ra không tốt hơn phiên bản cũ chút nào. Trong tình huống đó, xác suất chúng ta vẫn thấy chênh lệch lớn như đã đo được là bao nhiêu? Con số đó là p-value. p = 0.03 nghĩa là chênh lệch cỡ này khá hiếm khi hai phiên bản thực sự như nhau — nên ta nghiêng về kết luận phiên bản mới có khác biệt. Nhưng nó không cho biết khác biệt **lớn cỡ nào** — đó là câu hỏi riêng, và thường quan trọng hơn với quyết định kinh doanh."*

Viết bản của bạn vào `notes/explain-pvalue.md`. Đây là câu phỏng vấn Mid-level trong repo gốc — luyện nói trơn trong 60 giây.

**Bài 2 — Chạy 5 test trên dữ liệu Olist:**
1. Điểm review trung bình giữa 2 phương thức thanh toán khác nhau không? (t-test)
2. Tỷ lệ đơn giao trễ có khác nhau giữa các bang? (chi-square)
3. Giá trị đơn có khác nhau giữa 3 danh mục lớn nhất? (ANOVA)
4. Đơn giao trễ có điểm review thấp hơn không? (t-test + effect size)
5. Lặp lại bài 4 bằng Mann-Whitney, so sánh kết luận

Mỗi test viết đủ: H0, H1, test chọn và lý do, kết quả (statistic, p-value, CI), **kết luận bằng ngôn ngữ business**.

---

# TUẦN 19 — A/B Testing + PORTFOLIO #3

## W19.1 — Thiết kế thí nghiệm (T2, 2h)

| ID | Thành phần | Nội dung | Xong |
|---|---|---|---|
| W19.1.1 | Hypothesis | "Nếu [thay đổi X] thì [metric Y] sẽ [tăng/giảm] vì [lý do]" | ☐ |
| W19.1.2 | Primary metric | Đúng 1 metric quyết định. Nhiều primary = không có primary | ☐ |
| W19.1.3 | Secondary metrics | Để hiểu cơ chế | ☐ |
| W19.1.4 | **Guardrail metrics** | Không được xấu đi (tỷ lệ lỗi, tốc độ tải, churn) | ☐ |
| W19.1.5 | Đơn vị phân bổ | User / session / device — chọn sai gây nhiễm chéo | ☐ |
| W19.1.6 | Randomization | Ngẫu nhiên thật, kiểm tra cân bằng giữa 2 nhóm | ☐ |
| W19.1.7 | MDE (Minimum Detectable Effect) | Mức chênh lệch nhỏ nhất đáng để phát hiện — do business quyết | ☐ |

## W19.2 — Tính cỡ mẫu (T3, 2h)

| ID | Việc | Xong |
|---|---|---|
| W19.2.1 | Hiểu 4 tham số liên hệ nhau: alpha, power, MDE, n | ☐ |
| W19.2.2 | Tính n bằng `statsmodels` | ☐ |
| W19.2.3 | Đối chiếu với [Evan Miller calculator](https://www.evanmiller.org/ab-testing/sample-size.html) | ☐ |
| W19.2.4 | Từ n suy ra số ngày cần chạy dựa trên lưu lượng thực tế | ☐ |
| W19.2.5 | Hiểu quan hệ: MDE giảm một nửa → n tăng khoảng 4 lần | ☐ |

```python
from statsmodels.stats.power import NormalIndPower
from statsmodels.stats.proportion import proportion_effectsize

baseline, mde = 0.10, 0.02          # conversion hien tai 10%, muon phat hien +2pp
es = proportion_effectsize(baseline + mde, baseline)
n = NormalIndPower().solve_power(effect_size=es, alpha=0.05, power=0.8, ratio=1)
print(f"Can ~{n:,.0f} user MOI NHOM")
```

## W19.3 — Chạy và đọc kết quả (T4, 2h)

| ID | Chủ đề | Nội dung | Xong |
|---|---|---|---|
| W19.3.1 | **Peeking problem** | Nhìn kết quả liên tục rồi dừng khi thấy p < 0.05 → tỷ lệ false positive tăng vọt | ☐ |
| W19.3.2 | Chốt thời gian trước | Chạy đủ n và đủ số ngày đã định, không dừng sớm | ☐ |
| W19.3.3 | Chạy tối thiểu trọn 1–2 tuần | Để phủ hết chu kỳ ngày trong tuần | ☐ |
| W19.3.4 | Novelty effect | Người dùng phản ứng với "cái mới", hiệu ứng phai dần | ☐ |
| W19.3.5 | Sample Ratio Mismatch | Tỷ lệ phân bổ lệch khỏi 50/50 → hệ thống có lỗi, kết quả không tin được | ☐ |
| W19.3.6 | Kiểm tra cân bằng nhóm trước khi đọc kết quả | ☐ |
| W19.3.7 | Kết quả không có ý nghĩa ≠ không có khác biệt | Có thể do thiếu power | ☐ |
| W19.3.8 | Segment analysis — cẩn thận multiple comparison | ☐ |

**Vì sao peeking nguy hiểm:** với alpha 5%, nếu chỉ kiểm tra 1 lần ở cuối thì tỷ lệ báo động giả là 5%. Nếu kiểm tra mỗi ngày trong 2 tuần và dừng ngay khi thấy p < 0.05, tỷ lệ báo động giả cao hơn nhiều lần. Đây là lỗi phổ biến nhất trong A/B test ngoài đời — và là câu hỏi phỏng vấn "khi nào dừng test?".

## W19.4 — PORTFOLIO #3 (T5–T7, 7h)

### Spec: A/B Test Analysis

**Dataset:** [Mobile Games A/B Testing — Cookie Cats](https://www.kaggle.com/datasets/yufengsui/mobile-games-ab-testing) (gate_30 vs gate_40, metric retention D1/D7) hoặc [Marketing A/B Testing](https://www.kaggle.com/datasets/faviovaz/marketing-ab-testing).

**Cấu trúc notebook:**

| Mục | Nội dung bắt buộc |
|---|---|
| 1. Bối cảnh & Hypothesis | Thay đổi gì, kỳ vọng gì, **vì sao** kỳ vọng thế |
| 2. Thiết kế | Primary metric (retention D7) · secondary · guardrail · đơn vị phân bổ |
| 3. Sanity check | Kiểm tra cân bằng nhóm (SRM), trùng user, dữ liệu thiếu |
| 4. Cỡ mẫu | Tính n cần thiết cho MDE đã chọn — dữ liệu hiện có đủ power không? |
| 5. EDA | Phân phối metric ở 2 nhóm, chart so sánh |
| 6. Kiểm định | Test đã chọn + **lý do chọn** + statistic + p-value + **CI của chênh lệch** |
| 7. Effect size | Lift tuyệt đối và tương đối, có đủ lớn để đáng triển khai không |
| 8. Kết luận | Ngôn ngữ business: nên triển khai / không / cần test thêm |
| 9. Hạn chế | Thời gian chạy, novelty effect, cách phân bổ, tính khái quát |
| 10. Bước tiếp theo | Nếu triển khai thì theo dõi metric nào |

**Tiêu chí đạt:**
- [ ] Kết luận có **khoảng tin cậy**, không chỉ p-value
- [ ] Có tính cỡ mẫu và bàn về power
- [ ] Có sanity check trước khi đọc kết quả
- [ ] Nêu rõ ít nhất 3 hạn chế
- [ ] Kết luận viết được cho người không chuyên hiểu
- [ ] Notebook chạy `Restart & Run All` không lỗi

```bash
git add 03-ab-test/
git commit -m "feat: portfolio #3 - a/b test analysis"
git push
```

---

## Bẫy thường gặp

| Bẫy | Hậu quả | Cách tránh |
|---|---|---|
| Peeking rồi dừng khi p < 0.05 | Báo động giả cao | Chốt n và ngày dừng trước khi chạy |
| Chỉ báo p-value | Không biết hiệu ứng lớn cỡ nào | Luôn kèm effect size + CI |
| Test nhiều metric, chọn cái đẹp | p-hacking | Chốt primary metric trước |
| Chạy 3 ngày rồi kết luận | Thiếu chu kỳ tuần | Tối thiểu 1–2 tuần trọn |
| "p > 0.05 nên hai bên như nhau" | Sai logic | "Chưa đủ bằng chứng kết luận có khác biệt" |
| Quên guardrail metric | Tăng conversion nhưng tăng churn | Định nghĩa guardrail từ đầu |
| Bỏ qua SRM | Kết quả vô nghĩa | Kiểm tra tỷ lệ phân bổ trước |
| Nói "A gây ra B" từ dữ liệu quan sát | Kết luận sai | Chỉ thí nghiệm ngẫu nhiên mới cho phép nói nhân quả |

**Tiếp theo:** [Stage 6 →](./stage-6-capstone-jobprep)
