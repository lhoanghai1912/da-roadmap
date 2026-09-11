---
id: l5-stats
title: "Lý thuyết 5 — Thống kê suy diễn & A/B test"
sidebar_label: "L5 — Thống kê"
sidebar_position: 6
description: "CLT, khoang tin cay, p-value, power, MDE, co mau, doc ket qua A/B, 4 bay: peeking, SRM, novelty, Simpson."
format: md
---

# LESSON 5 — Thống kê suy diễn & A/B Test (W17–W19)

:::tip Cách đọc trang này
Từ khóa **in đậm có gạch chân** là thuật ngữ — bấm vào để nhảy sang [Từ điển](/glossary) xem định nghĩa kèm ví dụ.
Cuối mỗi mục có khối **Chốt lại** tóm tắt điều quan trọng nhất. Đọc lướt các khối đó là nắm được xương sống của bài.
:::

Bổ trợ cho [Stage 5 — Thống kê & A/B](../stages/stage-5-statistics-abtest.md). Mục tiêu thật của 3 tuần này: **biết khi nào KHÔNG được kết luận**. Đó mới là thứ phân biệt analyst với người chạy công thức.

Mọi con số ví dụ dưới đây đã được tính thật bằng `scipy.stats` — công thức kèm theo để tự chạy lại.

---

## 5.1 — Tổng thể, mẫu, và vì sao có sai số {#mau-sai-so}

**Định nghĩa.** **Tổng thể** = toàn bộ đối tượng quan tâm. **Mẫu** = phần quan sát được. Thống kê suy diễn = từ mẫu nói về tổng thể, **kèm mức độ không chắc chắn**.

Vế cuối là điểm khác với thống kê mô tả ở L1. Mô tả nói về dữ liệu đang có. Suy diễn nói về dữ liệu **chưa thấy**.

### Standard error — vì sao mẫu lớn thì chính xác hơn

`SE = SD / √n`. Dấu căn là chi tiết quan trọng nhất:

| n | SE (với SD = 100) | Muốn giảm sai số một nửa |
|---|---|---|
| 100 | 10,0 | |
| 400 | 5,0 | phải tăng mẫu **gấp 4** |
| 1.600 | 2,5 | gấp 4 lần nữa |

Đây là lý do A/B test cần rất nhiều người, và là lý do "chạy thêm 2 ngày cho chắc" thường vô ích — muốn giảm một nửa sai số phải chạy **gấp 4 thời gian**.

### Sampling bias quan trọng hơn [cỡ mẫu](/glossary#sample-size)

Mẫu lệch thì n lớn chỉ làm ta **tự tin hơn vào con số sai**.

Ví dụ: đo mức độ hài lòng bằng popup trong app. Chỉ những người **còn dùng app** mới trả lời được. Người đã bỏ đi — nhóm không hài lòng nhất — hoàn toàn vắng mặt. Thu 50.000 phản hồi vẫn ra điểm đẹp, và vẫn sai.

### Bài tập 5.1

Ba tình huống, chỉ ra thiên lệch và cách sửa:

a) Đánh giá tính năng mới bằng khảo sát gửi cho người dùng **đã bật** tính năng đó
b) Đo thời gian giao hàng trung bình chỉ trên đơn **đã giao thành công**
c) Phân tích lý do hủy dịch vụ dựa trên form khảo sát lúc hủy (điền tự nguyện)

<details>
<summary>Đáp án 5.1</summary>

a) **Self-selection.** Người bật tính năng vốn dĩ đã thích nó. Sửa: ngẫu nhiên hóa ai được thấy tính năng — đó chính là A/B test.
b) **Survivorship bias.** Đơn thất lạc, hủy, kẹt kho — nhóm tệ nhất — bị loại khỏi mẫu nên thời gian giao trung bình trông đẹp hơn thực tế. Sửa: báo cáo kèm tỷ lệ đơn chưa giao. Đây đúng là tình huống ở [L4 §4.4](/ly-thuyet/l4-python#lam-sach).
c) **Non-response bias.** Người quá bực thường bỏ đi im lặng, không điền form. Lý do phổ biến nhất có thể hoàn toàn vắng mặt trong dữ liệu. Sửa: chủ động liên hệ mẫu ngẫu nhiên trong nhóm đã rời.

</details>

---


:::note Chốt lại
Sai số giảm theo `1/√n` — muốn chính xác gấp đôi phải tăng mẫu **gấp 4**. Nhưng mẫu lệch thì n lớn chỉ làm ta tự tin hơn vào con số sai, nên **kiểm cách lấy mẫu trước khi quan tâm cỡ mẫu**.
:::

## 5.2 — [CLT](/glossary#clt): vì sao dùng được phân phối chuẩn cho dữ liệu lệch {#clt}

**Định nghĩa.** Dù tổng thể lệch thế nào, **phân phối của trung bình mẫu** sẽ tiệm cận phân phối chuẩn khi n đủ lớn.

### Bàn tập mô phỏng

Câu hỏi hay gặp: doanh thu lệch phải cực mạnh ([L1 §1.3](/ly-thuyet/l1-foundation#mean-median): mean 230 vs [median](/glossary#median) 54), sao vẫn dùng t-test được?

Vì t-test làm việc trên **trung bình mẫu**, không phải trên từng giá trị.

```python
import numpy as np
rng = np.random.default_rng(42)
pop = rng.exponential(scale=100, size=200_000)      # tong the lech phai rat manh
print(f"Tong the: mean={pop.mean():.1f}  median={np.median(pop):.1f}")

for n in (5, 30, 100):
    m = [rng.choice(pop, size=n).mean() for _ in range(3000)]
    print(f"n={n:3d}  mean cua trung binh mau={np.mean(m):6.1f}  sd={np.std(m):5.1f}")
```

```
Tong the: mean=99.9  median=69.1        <- lech phai ro (mean > median)

n=  5   mean cua trung binh mau=100.8   sd=44.7
n= 30   mean cua trung binh mau=100.1   sd=18.3
n=100   mean cua trung binh mau= 99.9   sd=10.1
```

Hai điều quan sát được:

1. **Trung bình mẫu luôn xoay quanh 100** — đúng giá trị thật của tổng thể, dù tổng thể lệch nặng
2. **`sd` giảm đúng theo `1/√n`**: 100/√5 = 44,7 · 100/√30 = 18,3 · 100/√100 = 10,0 — khớp chính xác công thức SE ở §5.1

### Giới hạn của CLT — phải nói được khi phỏng vấn

| Tình huống | n cần |
|---|---|
| Phân phối gần đối xứng | 30 là đủ |
| Lệch vừa | 100+ |
| **Lệch nặng, có [outlier](/glossary#outlier) lớn** (doanh thu có đơn 20.000$) | 1.000+, và vẫn nên kiểm tra |
| Đuôi rất nặng | CLT hội tụ **rất chậm** → dùng bootstrap |

Khi nghi ngờ: bootstrap (không giả định phân phối) hoặc kiểm định phi tham số (Mann-Whitney).

### Bài tập 5.2

1. Chạy mô phỏng với `n = 2`. Hình dạng có giống chuông không? Vì sao?
2. Thêm 10 giá trị bằng 100.000 vào tổng thể. Với n = 30, `sd` của trung bình mẫu đổi thế nào?
3. Giải thích cho người không chuyên trong 3 câu: vì sao trung bình của mẫu "ổn định" hơn từng giá trị riêng lẻ?

<details>
<summary>Đáp án 5.2</summary>

1. Không giống chuông — với n = 2, trung bình của 2 giá trị vẫn giữ phần lớn độ lệch của tổng thể gốc. CLT cần n đủ lớn để "trung bình hóa" đuôi dài.
2. `sd` **tăng vọt** và không còn khớp `1/√n` ổn định giữa các lần chạy, vì SD của tổng thể bị vài giá trị cực lớn thổi lên. Đây chính là tình huống "CLT hội tụ chậm".
3. *"Một khách có thể chi 10 nghìn hoặc 10 triệu — rất khó đoán. Nhưng trung bình của 100 khách thì ổn định hơn nhiều vì người chi nhiều và chi ít bù trừ nhau. Càng nhiều người thì con số trung bình càng ít nhảy, và mức nhảy giảm theo căn bậc hai của số người."*

</details>


:::note Chốt lại
CLT là lý do dùng được phân phối chuẩn cho dữ liệu doanh thu lệch phải — vì nó làm việc trên **trung bình mẫu**, không trên từng giá trị. Nhưng nó không phải phép màu: dữ liệu lệch nặng cần n lớn hơn nhiều, và khi nghi ngờ thì dùng bootstrap.
:::

## 5.3 — Khoảng tin cậy: cách báo cáo đúng {#khoang-tin-cay}

**Định nghĩa.** CI 95% = khoảng ước lượng được tạo bằng một quy trình mà, nếu lặp lại việc lấy mẫu nhiều lần, khoảng đó sẽ chứa giá trị thật khoảng 95% số lần.

### Bàn tập — cùng tỷ lệ, hai độ rộng khác hẳn

Đo [tỷ lệ chuyển đổi](/glossary#conversion-rate), cả hai lần đều ra đúng 5%:

```python
import math
def ci_ty_le(k, n):
    p = k/n
    se = math.sqrt(p*(1-p)/n)
    return p, p - 1.96*se, p + 1.96*se

ci_ty_le(5, 100)      # 5%, CI [0,73% ; 9,27%]
ci_ty_le(500, 10000)  # 5%, CI [4,57% ; 5,43%]
```

| Mẫu | Tỷ lệ | CI 95% | Độ rộng |
|---|---|---|---|
| 5/100 | 5% | **[0,73% ; 9,27%]** | 8,5 điểm % |
| 500/10.000 | 5% | **[4,57% ; 5,43%]** | 0,86 điểm % |

Cùng một con số 5%, nhưng mức tin cậy khác nhau **10 lần**. Báo cáo chỉ đưa "5%" thì hai trường hợp trông y hệt nhau — trong khi trường hợp đầu thực chất nói *"đâu đó từ gần 0% đến 9%"*.

Chú ý: mẫu gấp 100 lần chỉ làm khoảng hẹp lại 10 lần — đúng quy luật `1/√n` ở §5.1.

### Diễn giải đúng và sai

| Cách nói | Đúng/Sai |
|---|---|
| "Có 95% xác suất giá trị thật nằm trong khoảng này" | ❌ **Sai** (rất phổ biến) |
| "Nếu lặp lại cách đo này nhiều lần, 95% số khoảng tính được sẽ chứa giá trị thật" | ✅ Đúng |
| "Ta khá chắc giá trị thật nằm trong khoảng này; khoảng càng hẹp càng chắc" | ✅ Chấp nhận được khi nói với người không chuyên |

Vì sao cách 1 sai: giá trị thật là một con số **cố định**, nó không "có xác suất" nằm ở đâu cả. Cái ngẫu nhiên là **khoảng** ta tính ra từ mẫu, không phải giá trị thật.

Trong thực tế nói chuyện với sếp, dùng cách 3 — vừa không sai bản chất vừa không bắt sếp học thống kê.

### Vì sao bắt buộc kèm CI

So sánh hai cách báo cáo cùng một kết quả:

- *"Conversion tăng 0,6 điểm phần trăm"* → sếp duyệt triển khai
- *"Conversion tăng 0,6 điểm phần trăm (CI 95%: **−0,02% đến +1,22%**)"* → sếp thấy khoảng chứa cả số âm, hỏi thêm trước khi quyết

Con số thứ hai mới là sự thật đầy đủ. Số này lấy từ ví dụ ở §5.6.

**Quy tắc: mọi ước lượng đưa cho người ra quyết định đều phải kèm khoảng.** Một con số trần trụi giấu mất thông tin quan trọng nhất là "mình chắc đến đâu".

### Bài tập 5.3

1. Tính CI 95% cho tỷ lệ 30/300 và 300/3.000. Độ rộng chênh nhau bao nhiêu lần?
2. Một khảo sát 400 người cho tỷ lệ hài lòng 80%. Biên sai số bao nhiêu? Nếu muốn biên sai số còn một nửa thì cần bao nhiêu người?
3. Viết lại câu sau cho đúng: *"Chúng tôi 95% chắc chắn rằng tỷ lệ thật nằm giữa 4,57% và 5,43%."*

<details>
<summary>Đáp án 5.3</summary>

1. 30/300 = 10%, SE = √(0,1×0,9/300) = 1,73% → CI ≈ [6,6% ; 13,4%], rộng 6,8 điểm. 300/3.000 = 10%, SE = 0,55% → CI ≈ [8,9% ; 11,1%], rộng 2,2 điểm. Chênh khoảng **√10 ≈ 3,16 lần** — đúng quy luật căn bậc hai.
2. SE = √(0,8×0,2/400) = 2% → biên sai số = 1,96 × 2% ≈ **3,9 điểm %**. Muốn còn một nửa (≈2%) phải tăng mẫu **gấp 4** → 1.600 người.
3. *"Khoảng ước lượng 95% cho tỷ lệ là từ 4,57% đến 5,43%. Nếu lặp lại phép đo này nhiều lần, khoảng tính theo cách này sẽ chứa giá trị thật khoảng 95% số lần."* Hoặc bản cho sếp: *"Tỷ lệ vào khoảng 5%, sai số chừng ±0,4 điểm phần trăm."*

</details>


:::note Chốt lại
Cùng một tỷ lệ có thể đi kèm hai mức tin cậy khác nhau **10 lần** — con số trần trụi giấu mất thông tin quan trọng nhất là "mình chắc đến đâu". Mọi ước lượng đưa cho người ra quyết định đều phải kèm khoảng.
:::

## 5.4 — [p-value](/glossary#p-value): định nghĩa đúng và cách giải thích cho sếp {#p-value}

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


:::note Chốt lại
p-value đo **bằng chứng có đủ mạnh chưa**, không đo mức độ lớn của tác động. Cùng tỷ lệ 70%, 10 lần tung thì không kết luận được gì còn 100 lần thì kết luận chắc chắn — khác biệt duy nhất là cỡ mẫu. Đó cũng là lý do phải tính cỡ mẫu trước khi chạy.
:::

## 5.5 — Sai lầm loại I/II, [power](/glossary#power), [MDE](/glossary#mde) {#power-mde}

### Bàn tập — bảng 2×2 của mọi kiểm định

|  | Thực tế: **không** có khác biệt | Thực tế: **có** khác biệt |
|---|---|---|
| **Kết luận: có khác biệt** | ❌ Sai lầm loại I (báo động giả) — xác suất **α** | ✅ Đúng — xác suất **power** |
| **Kết luận: không có khác biệt** | ✅ Đúng | ❌ Sai lầm loại II (bỏ sót) — xác suất **β** |

Ví dụ đời thường để nhớ: máy báo cháy.

- **Loại I** = báo cháy khi không cháy → phiền, nhưng không chết ai
- **Loại II** = không báo khi đang cháy → chết người

Chọn α và power chính là chọn **loại sai lầm nào mình sợ hơn**. Chuẩn ngành: α = 0,05 (chấp nhận 5% báo động giả), power = 0,80 (chấp nhận bỏ sót 20%).

Chú ý sự bất đối xứng: ngành mặc định coi báo động giả nguy hiểm gấp 4 lần bỏ sót. Với sản phẩm, đó thường là lựa chọn hợp lý — triển khai nhầm một tính năng vô dụng tốn kém hơn là bỏ lỡ một cải tiến nhỏ.

### MDE là quyết định kinh doanh, không phải kỹ thuật

**MDE** (Minimum Detectable Effect) = mức chênh lệch nhỏ nhất mà mình **muốn** phát hiện được.

Câu phải hỏi sếp: *"Tăng conversion bao nhiêu thì mới đáng để triển khai và duy trì tính năng này?"*

Nếu câu trả lời là "dưới 0,5% thì không đáng làm" → MDE = 0,5%. Analyst không tự quyết con số này.

### Cỡ mẫu — đã tính thật

Baseline 5%, α = 0,05, power = 0,80:

| MDE (tuyệt đối) | Tương đối | n **mỗi nhóm** |
|---|---|---|
| +1,0 điểm % (5% → 6%) | +20% | **8.158** |
| +0,5 điểm % (5% → 5,5%) | +10% | **31.234** |
| +0,25 điểm % (5% → 5,25%) | +5% | **122.124** |

**Quy luật phải thuộc: MDE giảm một nửa → cỡ mẫu tăng gấp 4.** Cùng gốc `1/√n` với SE và CI.

```python
import math
from scipy import stats
def n_per_group(p1, p2, alpha=0.05, power=0.8):
    z_a = stats.norm.ppf(1 - alpha/2); z_b = stats.norm.ppf(power); p = (p1 + p2)/2
    return math.ceil((z_a*math.sqrt(2*p*(1-p)) + z_b*math.sqrt(p1*(1-p1) + p2*(1-p2)))**2 / (p2-p1)**2)

n_per_group(0.05, 0.055)     # 31234
```

### Từ cỡ mẫu ra thời gian chạy

```
so ngay = n moi nhom x 2 / luong user du dieu kien moi ngay
```

Ví dụ: 31.234 × 2 / 5.000 = 12,5 ngày → **làm tròn lên bội số của 7** (14 ngày).

Vì sao bội số của 7: hành vi cuối tuần khác ngày thường. Chạy 12 ngày sẽ có 2 cuối tuần cho nhóm này nhưng 1 cho nhóm kia nếu phân bổ lệch — tạo chênh lệch giả.

### Bài tập 5.5

1. Baseline 20% (thay vì 5%), MDE +2 điểm %. Cỡ mẫu mỗi nhóm bao nhiêu? So với baseline 5% cùng MDE tương đối, cái nào cần ít mẫu hơn?
2. Sản phẩm có 800 user đủ điều kiện/ngày, MDE 0,5 điểm % trên baseline 5%. Chạy bao lâu? Có khả thi không?
3. Sếp nói *"chạy 3 ngày xem sao"*. Trả lời thế nào?

<details>
<summary>Đáp án 5.5</summary>

1. `n_per_group(0.20, 0.22)` ≈ **6.500/nhóm** — ít hơn nhiều so với 31.234. Lý do: baseline càng gần 50% thì phương sai càng lớn, nhưng ở đây MDE tương đối là 10% giống nhau trong khi MDE tuyệt đối lớn hơn 4 lần (2 điểm vs 0,5 điểm). Bài học: **cùng % tương đối, baseline cao thì dễ đo hơn**.
2. 31.234 × 2 / 800 = 78 ngày ≈ **11 tuần**. Không khả thi cho phần lớn tổ chức. Lựa chọn: chấp nhận MDE lớn hơn (1 điểm % → 8.158×2/800 = 20 ngày), hoặc đổi sang metric nhạy hơn, hoặc bỏ thí nghiệm và quyết định bằng cách khác.
3. *"3 ngày cho khoảng 2.400 user mỗi nhóm. Với baseline 5%, cỡ mẫu đó chỉ phát hiện được chênh lệch từ khoảng 2 điểm phần trăm trở lên — tức B phải tốt hơn A tới 40% mới thấy được. Nếu anh kỳ vọng mức cải thiện nhỏ hơn thì kết quả sau 3 ngày sẽ không kết luận được gì, dù nó hiện ra con số nào."* Đây chính là bài học từ [bàn tập đồng xu](#p-value): 10 lần tung thì dù ra 7 ngửa cũng không kết luận được.

</details>


:::note Chốt lại
MDE là **quyết định kinh doanh**, không phải kỹ thuật — phải hỏi sếp "tăng bao nhiêu thì mới đáng triển khai". Từ MDE ra cỡ mẫu, từ cỡ mẫu ra thời gian chạy, làm tròn lên bội số 7 ngày. Nhớ quy luật: MDE giảm một nửa → mẫu gấp 4.
:::

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

> *"B cho conversion 5,60% so với 5,00% của A — cao hơn tương đối 12%. Tuy nhiên p = 0,058 (trên ngưỡng 0,05) và [khoảng tin cậy](/glossary#confidence-interval) 95% cho mức tăng là từ −0,02% đến +1,22%, tức vẫn bao gồm khả năng không có cải thiện. Chưa đủ bằng chứng để triển khai. Hai lựa chọn: (1) chạy thêm ~5 ngày để đạt cỡ mẫu cần cho MDE 0,5%, hoặc (2) dừng nếu chi phí duy trì thí nghiệm lớn hơn giá trị kỳ vọng."*

**Ba cách kết luận SAI ở tình huống này:**
1. "p = 0,058 gần 0,05 rồi, coi như có ý nghĩa" → ngưỡng phải chốt trước, không co giãn sau khi nhìn số.
2. "Không có ý nghĩa thống kê nghĩa là hai phiên bản như nhau" → sai: không có bằng chứng khác biệt ≠ có bằng chứng không khác biệt. CI cho thấy mức tăng tới 1,22% vẫn hoàn toàn khả dĩ.
3. "Chạy thêm đến khi p < 0,05" → đây là [peeking](/glossary#peeking-problem), làm hỏng toàn bộ tính hợp lệ (mục 5.7).

---


:::note Chốt lại
Kết luận phải kèm **khoảng tin cậy**, không chỉ p-value. "Không có ý nghĩa thống kê" **không** đồng nghĩa "hai phiên bản như nhau" — nó chỉ nghĩa là dữ liệu hiện có chưa đủ để phân biệt.
:::

## 5.7 — Bốn cái bẫy phá hỏng A/B test {#bon-bay}

### Bẫy 1 — Peeking (nhìn lén và dừng khi thấy đẹp)

**Mô phỏng thật.** Tạo hai nhóm A và B **hoàn toàn giống nhau** (cùng tỷ lệ 5%, không có khác biệt thật nào). Chạy 2.000 lần thí nghiệm, mỗi lần 2.000 user/nhóm:

```python
# Cach 1: chi xem ket qua MOT LAN o cuoi
# Cach 2: xem 10 lan trong qua trinh, dung ngay khi p < 0,05
```

```
Khong peek (chi xem cuoi):    bao dong gia = 4,7%     <- dung nhu alpha = 5%
Peek 10 lan trong qua trinh:  bao dong gia = 14,3%    <- gap 3 lan
```

**14,3%.** Cứ 7 thí nghiệm thì có 1 lần kết luận "B tốt hơn" trong khi B **không hề tốt hơn**.

Vì sao: mỗi lần nhìn là một cơ hội để nhiễu ngẫu nhiên tình cờ vượt ngưỡng. Nhìn 10 lần = 10 cơ hội. Xác suất "ít nhất một lần trúng" cao hơn nhiều so với "lần cuối trúng".

**Cách tránh:**
- Chốt ngày dừng **trước khi chạy**, chỉ đọc kết quả vào đúng ngày đó
- Nếu bắt buộc theo dõi liên tục: dùng sequential testing (alpha spending) — chia nhỏ ngân sách α cho mỗi lần nhìn
- Được phép xem **guardrail metric** hằng ngày (để dừng nếu có sự cố), nhưng **không** dùng nó để quyết định thắng thua

### Bẫy 2 — [SRM](/glossary#srm) (Sample Ratio Mismatch)

Thiết kế chia 50/50 nhưng thực tế ra 10.000 vs 9.400. Nghe như chuyện nhỏ. Không phải.

SRM nghĩa là **hệ thống chia nhóm có lỗi** — bot bị gán lệch, cache trả sai nhóm, redirect hỏng, hoặc một nhóm bị lỗi tải trang nên user thoát trước khi được ghi nhận. Khi đó hai nhóm **không còn so sánh được với nhau** dù dùng phương pháp thống kê nào.

**Kiểm tra đầu tiên, trước cả metric chính:**

```python
from scipy import stats
stats.chisquare([10000, 9400])    # p < 0,001 -> co SRM, dung phan tich ngay
```

Có SRM thì toàn bộ kết quả vứt đi. Không cứu được bằng thống kê. Đi tìm lỗi kỹ thuật rồi chạy lại.

### Bẫy 3 — Novelty effect

Người dùng phản ứng tích cực chỉ vì thấy **lạ**, không phải vì tính năng tốt hơn. Hiệu ứng tan sau 1–2 tuần.

**Cách phát hiện:** vẽ chênh lệch giữa hai nhóm **theo ngày**. Nếu khoảng cách thu hẹp dần thì nghi [novelty](/glossary#novelty-effect).

```
Ngay 1-3:   B hon A 15%
Ngay 4-7:   B hon A  8%
Ngay 8-14:  B hon A  2%    <- novelty, khong phai cai tien that
```

**Cách xử lý:** chạy đủ dài (tối thiểu 2 tuần), và tách riêng nhóm **user mới** (chưa từng thấy giao diện cũ nên không có cảm giác "lạ").

### Bẫy 4 — [Simpson](/glossary#simpson-s-paradox)'s paradox

Số thật:

| Kênh | A | B |
|---|---|---|
| Mobile | 50/1.000 = **5,0%** | 540/9.000 = **6,0%** |
| Desktop | 900/9.000 = **10,0%** | 120/1.000 = **12,0%** |
| **Gộp chung** | 950/10.000 = **9,5%** | 660/10.000 = **6,6%** |

B thắng ở **cả hai** kênh nhưng **thua khi gộp**.

Nguyên nhân: B có 90% lưu lượng từ Mobile (kênh vốn conversion thấp), A thì ngược lại. Con số gộp phản ánh **tỷ trọng kênh**, không phản ánh chất lượng phiên bản.

Trong A/B test, đây thường là dấu hiệu của **phân bổ nhóm không cân bằng theo một chiều quan trọng** — họ hàng gần với SRM.

**Bài học: luôn tách theo các chiều chính (thiết bị, kênh, user mới/cũ, khu vực) trước khi báo cáo.** Nếu kết luận đảo chiều khi tách nhóm, con số gộp là con số dối.

### Bảng tổng hợp

| Bẫy | Kiểm bằng | Khi nào kiểm |
|---|---|---|
| SRM | chi-square trên tỷ lệ chia nhóm | **đầu tiên**, trước mọi thứ |
| Simpson | tách theo 3–4 chiều chính | trước khi báo cáo |
| Novelty | vẽ chênh lệch theo ngày | trước khi kết luận |
| Peeking | chốt ngày dừng từ đầu | phòng ngừa, không chữa được |

### Bài tập 5.7

1. Chạy mô phỏng peeking với 20 lần nhìn thay vì 10. Tỷ lệ báo động giả tăng lên bao nhiêu?
2. Test chia 50/50, thực tế 5.100 vs 4.900 trên tổng 10.000. Có SRM không? Tính p.
3. Tự dựng một ví dụ Simpson's paradox bằng dữ liệu Superstore (gợi ý: biên lợi nhuận theo Region, tách theo Category). Viết 3 câu giải thích cho người không chuyên.

<details>
<summary>Đáp án 5.7</summary>

1. Tăng tiếp, khoảng **18–20%**. Càng nhìn nhiều càng tệ, nhưng mức tăng chậm dần vì các lần nhìn gần nhau có kết quả tương quan với nhau.
2. `stats.chisquare([5100, 4900])` → p ≈ 0,046. Dưới 0,05 nhưng không quá cực đoan. Với chênh lệch nhỏ như vậy, thực tế thường coi là **chấp nhận được** — ngưỡng cảnh báo SRM ở nhiều nơi đặt ở p < 0,001 vì test SRM rất nhạy khi n lớn. Điểm quan trọng: phải **kiểm và ghi lại**, không phải phớt lờ.
3. Gợi ý cấu trúc câu trả lời: *"Vùng X có biên lợi nhuận tổng thấp hơn vùng Y. Nhưng khi tách theo từng nhóm hàng thì vùng X lại lãi hơn ở cả 3 nhóm. Lý do: vùng X bán chủ yếu Nội thất — nhóm vốn có biên rất thấp — nên con số gộp bị kéo xuống bởi cơ cấu hàng, không phải do vùng X kinh doanh kém."*

</details>


:::note Chốt lại
Kiểm **SRM đầu tiên**, trước cả metric chính — có SRM thì mọi kết quả vứt đi. Peeking đẩy báo động giả từ 4,7% lên 14,3%, nên chốt ngày dừng từ đầu. Và luôn tách nhóm theo các chiều chính trước khi báo cáo, vì con số gộp có thể đảo ngược hoàn toàn.
:::

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

**Spec Portfolio #3** (dataset gợi ý: Cookie Cats trên Kaggle — [retention](/glossary#retention) D1/D7 khi đổi cổng chặn từ level 30 sang 40):
1. Nêu giả thuyết và metric chính (retention D7)
2. Kiểm tra SRM
3. Tính cỡ mẫu **cần thiết** và so với cỡ mẫu **thực có**
4. Kiểm định + **CI**, không chỉ p
5. Tách nhóm kiểm tra
6. Kết luận kèm hạn chế: thời gian chạy, novelty, khả năng dữ liệu bị nhiễu bởi người chơi nhiều thiết bị

---


:::note Chốt lại
Thiếu bất kỳ mục nào trong danh sách "trước khi chạy" thì **chưa được chạy**. Thí nghiệm thiết kế sai không cứu được bằng phân tích giỏi — mọi thứ quyết định ở khâu thiết kế.
:::

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
