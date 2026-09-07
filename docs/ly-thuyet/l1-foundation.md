---
id: l1-foundation
title: "Lý thuyết 1 — Nền tảng dữ liệu"
sidebar_label: "L1 — Nền tảng"
sidebar_position: 2
description: "Grain, kieu du lieu, NULL, mean vs median, IQR outlier, tuong quan vs nhan qua, chon chart, pivot MoM. Dinh nghia + vi du da chay that + bai tap co dap an."
format: md
---

# LESSON 1 — Nền tảng dữ liệu (W1–W2)

Bổ trợ cho [Stage 1 — Nền tảng](../stages/stage-1-foundation.md). Stage file nói **làm gì**; file này nói **là gì, ví dụ ra sao, tự kiểm tra thế nào**.

Mỗi mục có 4 phần: **Định nghĩa** → **Ví dụ thật** (số lấy từ `data/superstore.csv`, đã chạy kiểm chứng) → **Bài tập** → **Đáp án** (bấm mở sau khi tự làm).

Số nền của dataset — kiểm chứng bằng lệnh ở cuối file: 9.994 dòng · 5.009 đơn · 793 khách · 1.862 sản phẩm · 2014-01-03 → 2017-12-30 · tổng Sales 2.297.201.

---

## 1.1 — Grain (độ mịn): khái niệm quan trọng nhất

**Định nghĩa.** Grain là câu trả lời cho câu hỏi *"một dòng trong bảng này đại diện cho cái gì?"*. Viết ra bằng một câu đầy đủ trước khi tính bất cứ thứ gì.

**Ví dụ thật.** Grain của Superstore = "1 dòng = 1 sản phẩm trong 1 đơn hàng". Hệ quả:

| Muốn biết | Cách tính đúng | Kết quả | Cách tính sai | Kết quả sai |
|---|---|---|---|---|
| Số dòng đơn hàng | đếm dòng | 9.994 | — | — |
| Số đơn hàng | đếm `Order ID` **duy nhất** | 5.009 | đếm dòng | 9.994 (phồng 2×) |
| Số khách | đếm `Customer ID` duy nhất | 793 | đếm `Customer Name` | sai nếu trùng tên |

Sai grain không báo lỗi. Query chạy ngon, ra số đẹp, và sai. Đó là lý do nó nguy hiểm.

**Bài tập 1.1.**
1. Viết ra grain của bảng `Invoice` (Chinook) và bảng `InvoiceLine`.
2. Nếu muốn tính "giá trị đơn trung bình" trên Superstore, mẫu số là 9.994 hay 5.009? Tính ra con số.
3. Câu "trung bình mỗi khách mua bao nhiêu đơn?" cần grain nào ở tử số, mẫu số?

<details>
<summary>Đáp án 1.1</summary>

1. `Invoice`: 1 dòng = 1 hóa đơn. `InvoiceLine`: 1 dòng = 1 track trong 1 hóa đơn. Quan hệ 1-nhiều.
2. Mẫu số là **5.009** (số đơn duy nhất). AOV = 2.297.201 / 5.009 = **458,6**. Nếu chia cho 9.994 sẽ ra 229,9 — đó là giá trị trung bình mỗi *dòng*, không phải mỗi *đơn*. Hai con số này đều "đúng" về mặt số học nhưng chỉ một cái trả lời đúng câu hỏi.
3. Tử số = số `Order ID` duy nhất (5.009), mẫu số = số `Customer ID` duy nhất (793) → 6,3 đơn/khách trong 4 năm.

</details>

---

## 1.2 — Kiểu dữ liệu và NULL

**Định nghĩa.** Kiểu dữ liệu quy định giá trị nào hợp lệ và phép tính nào được phép. NULL = "không có giá trị / không biết", khác `0`, khác chuỗi rỗng.

**Ví dụ thật.** Cột `Postal Code` của Superstore nếu để kiểu số sẽ biến mã `02134` (Boston) thành `2134`. DuckDB đọc file này ra kiểu `VARCHAR` — đúng. Còn `Order Date` phải là `DATE`, không phải chuỗi, nếu không thì sắp xếp theo thời gian sẽ ra `1/10/2015` đứng trước `2/1/2014`.

Ba giá trị khác nhau hoàn toàn:

| Giá trị | Ý nghĩa | Ví dụ |
|---|---|---|
| `0` | có đo, kết quả bằng không | khách không được giảm giá → discount = 0 |
| `''` | có ô, nội dung rỗng | ghi chú để trống |
| `NULL` | không biết / không áp dụng | 977/3.503 track Chinook không ghi tên nhạc sĩ |

**Bài tập 1.2.**
1. Trong Superstore, `Discount = 0` và `Discount = NULL` khác nhau thế nào về mặt nghiệp vụ?
2. `AVERAGE` trong Sheets xử lý ô trống ra sao — coi là 0 hay bỏ qua? Tự kiểm chứng bằng 3 ô: 10, trống, 20.
3. Cột nào trong Superstore nên đổi kiểu ngay khi nạp? Vì sao?

<details>
<summary>Đáp án 1.2</summary>

1. `0` = đơn này thực sự không có chiết khấu. `NULL` = không biết đơn này có chiết khấu hay không. Khi tính "chiết khấu trung bình", NULL bị bỏ qua khỏi mẫu số còn 0 thì được tính → hai kết quả khác nhau.
2. `AVERAGE` **bỏ qua** ô trống → (10+20)/2 = 15, không phải 10. Đây là hành vi giống `AVG` của SQL. Muốn coi trống là 0 phải dùng `SUM/COUNTA` hoặc điền 0 rõ ràng.
3. `Postal Code` → text (giữ số 0 đầu). `Order Date`, `Ship Date` → date (để sắp xếp và tính chênh lệch ngày). `Row ID` → text hoặc bỏ (là số thứ tự, cộng nó lại là vô nghĩa).

</details>

---

## 1.3 — Mean vs Median: câu phỏng vấn xuất hiện nhiều nhất

**Định nghĩa.** Mean = tổng / số lượng. Median = giá trị đứng giữa khi đã sắp xếp. Mean bị giá trị cực đoan kéo, median thì không.

**Ví dụ thật (đã chạy trên `Sales`).**

| Chỉ số | Giá trị |
|---|---|
| mean | 229,86 |
| median | 54,49 |
| SD | 623,25 |
| min | 0,44 |
| Q1 | 17,28 |
| Q3 | 209,94 |
| max | 22.638,48 |

Mean gấp **4,2 lần** median. Nghĩa là: một nhóm nhỏ đơn hàng rất lớn đang kéo mean lên. Một nửa số dòng có giá trị dưới 55$. Nếu báo cáo với sếp "giá trị trung bình mỗi dòng bán hàng là 230$", sếp sẽ hình dung sai hoàn toàn về khách hàng điển hình.

Cách nói đúng: *"Phân phối lệch phải mạnh — median 54$, mean 230$. Phần lớn giao dịch nhỏ, doanh thu tập trung vào nhóm ít giao dịch giá trị cao. Nên theo dõi bằng median cộng thêm P90, và tách riêng nhóm đơn lớn."*

**Bài tập 1.3.**
1. Tính mean và median của `Profit`. Dấu của chúng nói lên điều gì?
2. Trường hợp nào mean tốt hơn median?
3. Lương 5 người: 10, 11, 12, 13, 300 (triệu). Mean? Median? Nên báo cáo cái nào và vì sao?

<details>
<summary>Đáp án 1.3</summary>

1. Tự chạy bằng lệnh ở cuối file. Điểm cần thấy: `Profit` có giá trị âm (đơn lỗ), min âm sâu. Median dương trong khi vẫn tồn tại đuôi âm dài → phần lớn giao dịch có lãi nhỏ, một số ít lỗ rất nặng kéo mean xuống.
2. Khi cần **cộng dồn**: doanh thu tổng = mean × số đơn (median không có tính chất này). Khi dữ liệu phân phối gần đối xứng, không có outlier. Khi cần so sánh với ngân sách/tổng.
3. Mean = 69,2 · Median = 12. Báo median vì mean bị 1 giá trị 300 kéo lệch, không ai trong nhóm có lương gần 69. Cách chuẩn: báo cả hai + khoảng (min–max) và nêu rõ có outlier.

</details>

---

## 1.4 — Outlier và quy tắc IQR

**Định nghĩa.** IQR = Q3 − Q1. Ngưỡng ngoại lai: dưới `Q1 − 1,5×IQR`, trên `Q3 + 1,5×IQR`. Đây là quy ước, không phải chân lý.

**Ví dụ thật.** IQR = 209,94 − 17,28 = **192,66** → ngưỡng trên = 209,94 + 1,5×192,66 = **498,93**. Số dòng vượt ngưỡng: **1.167 dòng = 11,7%** dữ liệu.

Diễn giải: 11,7% là quá nhiều để gọi là "bất thường". Kết luận đúng không phải "có 1.167 lỗi dữ liệu" mà là *"phân phối lệch phải mạnh nên quy tắc IQR gắn cờ quá nhiều điểm; đây là đặc tính tự nhiên của doanh thu, không phải lỗi"*. Hành động: giữ nguyên dữ liệu, đổi cách báo cáo (median, P90), và nếu cần lọc thì lọc theo ngưỡng nghiệp vụ (ví dụ đơn > 5.000$ tách nhóm B2B) chứ không theo IQR.

**Nguyên tắc loại outlier.** Chỉ loại khi **chứng minh được là lỗi**: ngày 2099, giá âm, số lượng 99.999, khách tên "test". Không loại vì "chart nhìn xấu".

**Bài tập 1.4.**
1. Tính ngưỡng IQR cho `Profit`, đếm số outlier hai phía.
2. Mở 10 dòng `Sales` lớn nhất. Chúng là lỗi hay đơn thật? Căn cứ vào đâu để kết luận?
3. Viết 3 câu quyết định giữ/loại kèm lý do, theo đúng giọng đưa cho sếp đọc.

<details>
<summary>Đáp án 1.4</summary>

1–2. Chạy lệnh ở cuối file. Kiểm tra: đơn lớn có `Quantity` hợp lý không, `Product Name` có phải hàng đắt tiền thật không (máy photocopy, tủ), khách có phải segment Corporate/Home Office không. Nếu số lượng và loại hàng khớp nhau → đơn thật.
3. Mẫu: *"Giữ toàn bộ 1.167 điểm vượt ngưỡng IQR. Kiểm tra 10 giá trị lớn nhất cho thấy đều là máy móc văn phòng giá cao mua với số lượng hợp lý, không có dấu hiệu lỗi nhập liệu. Do phân phối lệch phải, tôi báo cáo bằng median kèm P90 thay vì mean, và tách riêng nhóm đơn > 5.000$ để theo dõi vì nhóm này chiếm phần lớn biến động doanh thu."*

</details>

---

## 1.5 — Tương quan và bẫy nhân quả

**Định nghĩa.** Hệ số tương quan r ∈ [−1, 1] đo mức độ hai biến **số** đi cùng nhau theo quan hệ tuyến tính. |r| < 0,3 yếu · 0,3–0,7 vừa · > 0,7 mạnh (quy ước thô).

**Ví dụ thật.** corr(`Discount`, `Profit`) = **−0,219** → nhìn qua thì "yếu, chắc không quan trọng". Nhưng cắt theo mức chiết khấu thì bức tranh khác hẳn:

| Discount | Số dòng | Lợi nhuận TB |
|---|---|---|
| 0% | 4.798 | **+66,9** |
| 10% | 94 | +96,1 |
| 15% | 52 | +27,3 |
| 20% | 3.657 | +24,7 |
| 30% | 227 | **−45,7** |
| 32% | 27 | −88,6 |
| 40% | 206 | **−111,9** |
| 45% | 11 | −226,6 |

Bài học kép:
1. **r thấp không có nghĩa là không có quan hệ.** Quan hệ ở đây có ngưỡng (dưới 20% vẫn lãi, từ 30% trở lên lỗ) — dạng phi tuyến mà r tuyến tính không bắt được. Luôn vẽ chart / cắt nhóm trước khi tin vào r.
2. **Vẫn chưa được kết luận "chiết khấu gây lỗ".** Biến ẩn khả dĩ: loại mặt hàng. Bàn ghế (Furniture) vốn biên lợi nhuận chỉ 2,5% và cũng là nhóm hay bị giảm giá sâu để đẩy hàng tồn. Chiết khấu và lỗ có thể cùng là *hậu quả* của "hàng khó bán", chứ không phải cái này gây ra cái kia.

Cách nói đúng trong báo cáo: *"Có liên hệ rõ giữa mức chiết khấu và lợi nhuận: từ ngưỡng 30% trở lên, lợi nhuận trung bình mỗi dòng chuyển sang âm. Chưa thể khẳng định quan hệ nhân quả vì loại mặt hàng có thể là biến gây nhiễu. Đề xuất kiểm chứng bằng thử nghiệm có kiểm soát trên một nhóm sản phẩm."*

**Bài tập 1.5.**
1. Tính corr(`Sales`, `Profit`) và corr(`Quantity`, `Profit`). Giải thích dấu và độ lớn.
2. Tìm 1 cặp biến trong Superstore có tương quan nhưng chắc chắn không nhân quả.
3. Viết lại kết luận về Discount theo cách chỉ dùng số, không dùng từ "gây ra", "khiến cho", "dẫn đến".

<details>
<summary>Đáp án 1.5</summary>

1. corr(Sales, Profit) dương nhưng không sát 1 vì có đơn doanh thu cao mà lỗ (chiết khấu sâu). corr(Quantity, Profit) rất yếu — bán nhiều không đồng nghĩa lãi nhiều, vì đơn giá và chiết khấu mới là yếu tố quyết định.
2. Ví dụ: `Ship Date` và `Order Date` tương quan gần hoàn hảo — nhưng là quan hệ định nghĩa (ship luôn sau order), không phải nhân quả kinh doanh. Hoặc: doanh thu theo tháng và số đơn theo tháng — cả hai cùng bị chi phối bởi mùa vụ.
3. Mẫu: *"Nhóm đơn chiết khấu 0–20% có lợi nhuận trung bình +24,7 đến +96,1 mỗi dòng. Nhóm chiết khấu từ 30% trở lên có lợi nhuận trung bình −45,7 đến −226,6. Chênh lệch tồn tại nhất quán qua 4 mức chiết khấu, trên 471 dòng thuộc nhóm chiết khấu sâu."*

</details>

---

## 1.6 — Chọn đúng loại chart

**Định nghĩa.** Chart không chọn theo "đẹp" mà theo **loại câu hỏi**.

| Câu hỏi | Chart | Ví dụ Superstore | Lỗi hay gặp |
|---|---|---|---|
| Thay đổi theo thời gian? | Line | doanh thu 48 tháng | dùng bar cho 48 điểm → rối |
| So sánh giữa hạng mục? | Bar (ngang nếu nhãn dài) | doanh thu 17 sub-category | trục Y không từ 0 → phóng đại |
| Phân phối một biến? | Histogram / Box | `Sales` | dùng bar → sai khái niệm |
| Quan hệ hai biến số? | Scatter | `Discount` vs `Profit` | vẽ line nối các điểm |
| Cấu phần trong tổng? | Stacked bar / 100% stacked | category qua 4 năm | pie > 5 lát |
| Một con số then chốt? | Card + % so kỳ trước | doanh thu YTD | card không có mốc so sánh |
| Hai chiều cùng lúc? | Heatmap | region × tháng | quá nhiều màu |

**Ba lỗi cấm.** (1) Bar chart trục Y không bắt đầu từ 0. (2) Pie chart quá 5 lát. (3) Hai trục Y khác thang mà không chú thích — có thể vẽ ra bất kỳ "mối liên hệ" nào mình muốn.

**Bài tập 1.6.** Chọn chart cho 6 câu hỏi sau, ghi lý do 1 dòng:
a) Tháng nào doanh thu cao nhất năm 2017? b) Region nào lãi nhất? c) Đơn hàng thường có giá trị bao nhiêu? d) Giảm giá nhiều có lãi hơn không? e) Tỷ trọng 3 category thay đổi qua các năm? f) Tháng này so tháng trước tăng bao nhiêu %?

<details>
<summary>Đáp án 1.6</summary>

a) Line (thời gian, 12 điểm) — hoặc bar nếu muốn nhấn so sánh từng tháng. b) Bar ngang sắp giảm dần (4 hạng mục). c) Histogram + box plot (phân phối, và ở đây phải thấy được độ lệch phải). d) Scatter Discount vs Profit, thêm màu theo Category để lộ biến gây nhiễu. e) 100% stacked bar theo năm (quan tâm tỷ trọng) hoặc stacked bar thường (quan tâm cả quy mô). f) Card lớn + delta % kèm mũi tên, không cần chart.

</details>

---

## 1.7 — Pivot table và tăng trưởng MoM

**Định nghĩa.** Pivot table = gom nhóm dữ liệu theo 1–2 chiều rồi tính tổng hợp. Chính là `GROUP BY` phiên bản kéo thả. MoM growth = `(kỳ này − kỳ trước) / kỳ trước`.

**Ví dụ thật (Superstore, năm 2017).**

| Tháng | Doanh thu | Số đơn | MoM |
|---|---|---|---|
| 2017-01 | 43.971 | 69 | — |
| 2017-02 | 20.301 | 53 | **−53,8%** |
| 2017-03 | 58.872 | 118 | **+190,0%** |
| 2017-04 | 36.522 | 116 | −38,0% |

Đọc bảng này như một analyst: tháng 3 tăng 190% nghe sốc, nhưng số đơn chỉ tăng từ 53 → 118 (2,2×) trong khi doanh thu tăng 2,9× → giá trị đơn trung bình cũng tăng. Và tháng 2 thấp bất thường (53 đơn, thấp nhất) → nền so sánh nhỏ khiến % tăng tháng 3 bị thổi phồng. Đây là lý do **% growth trên nền nhỏ luôn phải kèm số tuyệt đối**.

**Bẫy MoM.** Kỳ trước = 0 → chia cho 0. Bọc `IFERROR(...)` trong Sheets, `NULLIF(prev, 0)` trong SQL.

**Bài tập 1.7.**
1. Dựng pivot: dòng = tháng, cột = Region, giá trị = Sales, cho năm 2017.
2. Thêm cột MoM cho tổng, xử lý trường hợp chia 0.
3. Thêm measure thứ hai (Profit) và cột tính `profit_margin`. Vì sao không được lấy trung bình của cột margin từng dòng để ra margin tổng?

<details>
<summary>Đáp án 1.7</summary>

3. Vì margin là **tỷ số**. Trung bình của các tỷ số ≠ tỷ số của các tổng. Đúng: `SUM(Profit) / SUM(Sales)`. Sai: `AVERAGE(profit_margin_từng_dòng)` — cách sai gán trọng số bằng nhau cho đơn 5$ và đơn 20.000$. Đây là lỗi phổ biến trong cả Excel lẫn công cụ BI, và là một câu phỏng vấn hay gặp.

</details>

---

## 1.8 — Đọc một dataset lạ trong 15 phút

Quy trình áp dụng cho mọi dataset, làm theo đúng thứ tự:

1. **Kích thước** — bao nhiêu dòng, bao nhiêu cột?
2. **Grain** — 1 dòng là gì? Viết thành câu.
3. **Khóa** — cột nào duy nhất? Cột nào lặp?
4. **Thời gian** — dữ liệu từ ngày nào đến ngày nào? Có lỗ hổng tháng nào không?
5. **Thiếu** — mỗi cột thiếu bao nhiêu %?
6. **Phân loại** — mỗi cột text có bao nhiêu giá trị khác nhau? Có giá trị lạ ('N/A', 'unknown', khoảng trắng thừa)?
7. **Số** — min/median/max mỗi cột số. Có số âm không? Có bằng 0 bất thường không?
8. **Trùng** — có dòng trùng hoàn toàn không?
9. **Câu hỏi** — dataset này trả lời được câu hỏi kinh doanh nào, và **không** trả lời được câu nào?

Bước 9 là bước phân biệt analyst với người biết dùng công cụ. *Ví dụ Superstore: không có giá vốn thật (chỉ có Profit tính sẵn), không có dữ liệu marketing, không có hành vi trước khi mua → không trả lời được "kênh nào hiệu quả nhất" hay "vì sao khách bỏ giỏ hàng".*

---

## Lệnh tự kiểm chứng mọi con số trong file này

CSV Superstore gốc mã hóa Windows-1252, **không phải UTF-8** → phải chuyển trước, nếu không DuckDB báo lỗi ở dòng 13:

```bash
cd ~/Documents/Study/DA/da-portfolio/data
iconv -f WINDOWS-1252 -t UTF-8 superstore.csv > superstore_utf8.csv

duckdb -box -c "
CREATE TABLE s AS SELECT * FROM read_csv_auto('superstore_utf8.csv');
-- 1.1 grain
SELECT COUNT(*) rows, COUNT(DISTINCT \"Order ID\") orders, COUNT(DISTINCT \"Customer ID\") customers FROM s;
-- 1.3 mean vs median
SELECT ROUND(AVG(Sales),2) mean, ROUND(MEDIAN(Sales),2) median, ROUND(STDDEV(Sales),2) sd FROM s;
-- 1.4 IQR
SELECT ROUND(QUANTILE_CONT(Sales,0.25),2) q1, ROUND(QUANTILE_CONT(Sales,0.75),2) q3 FROM s;
-- 1.5 tuong quan + cat nhom
SELECT ROUND(CORR(Discount, Profit),3) r FROM s;
SELECT Discount, COUNT(*) n, ROUND(AVG(Profit),1) avg_profit FROM s GROUP BY 1 ORDER BY 1;
-- 1.7 MoM
SELECT strftime(\"Order Date\",'%Y-%m') ym, ROUND(SUM(Sales),0) sales, COUNT(DISTINCT \"Order ID\") orders
FROM s WHERE YEAR(\"Order Date\")=2017 GROUP BY 1 ORDER BY 1;
"
```

Dùng DuckDB để **kiểm tra lại** kết quả làm trên Google Sheets. Hai công cụ ra khác nhau → tìm ra chỗ mình hiểu sai. Đây là cách học nhanh nhất ở giai đoạn này.

---

## Checklist tự chấm trước khi sang Stage 2

- [ ] Nói được grain của Superstore và hậu quả nếu đếm sai — không nhìn tài liệu
- [ ] Giải thích mean vs median bằng số thật của dataset
- [ ] Tính được ngưỡng IQR và **giải thích tại sao không loại 1.167 điểm đó**
- [ ] Chọn đúng chart cho 6 câu hỏi ở bài 1.6
- [ ] Dựng pivot 2 chiều + cột MoM trong ≤ 10 phút
- [ ] Nêu được 2 câu hỏi mà dataset này **không** trả lời được

**Tiếp theo:** [L2 — SQL →](./l2-sql.md)

Làm bài tập tự chấm tương ứng: [Bài tập Stage 1](../bai-tap/stage-1.mdx)
