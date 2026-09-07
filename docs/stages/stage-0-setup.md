---
id: stage-0-setup
title: "Stage 0 — Dựng môi trường"
sidebar_label: "Stage 0 — Setup"
sidebar_position: 1
description: "Cai dat DuckDB, DBeaver, Python, Docker, repo GitHub tren macOS. 4h, 5 nhom task co lenh verify."
format: md
---

# STAGE 0 — Dựng môi trường

| | |
|---|---|
| **Thời lượng** | 1 buổi, ~4h (Week 0) |
| **Prerequisite** | Không. Đây là điểm bắt đầu. |
| **Mục tiêu** | Có đủ công cụ chạy được trên máy để 24 tuần sau không phải dừng lại cài đặt |
| **Output** | Môi trường chạy được + repo GitHub trống + 6 tài khoản |

---

## S0.1 — Cài công cụ dòng lệnh (60 phút)

| ID | Việc | Lệnh | Xong |
|---|---|---|---|
| S0.1.1 | Kiểm tra Homebrew đã có chưa | `brew --version` — nếu lỗi, cài tại [brew.sh](https://brew.sh) | ☐ |
| S0.1.2 | Cài DBeaver (SQL client GUI) | `brew install --cask dbeaver-community` | ☐ |
| S0.1.3 | Cài DuckDB (DB analytics local) | `brew install duckdb` | ☐ |
| S0.1.4 | Cài Git | `brew install git` | ☐ |
| S0.1.5 | Cài VS Code | `brew install --cask visual-studio-code` | ☐ |
| S0.1.6 | Cài Docker Desktop (dùng từ Stage 3) | `brew install --cask docker` | ☐ |

**Verify S0.1:**
```bash
duckdb -c "SELECT 'moi truong ok' AS status;"
git --version
code --version
```
Cả 3 lệnh phải trả kết quả, không lỗi.

> **DuckDB là gì:** database phân tích chạy trong 1 file, không cần server, không cần cấu hình. Dùng nó làm sân tập SQL suốt Stage 2 thay vì mất buổi tối đầu tiên để debug cài Postgres.

---

## S0.2 — Cài Python (45 phút)

| ID | Việc | Lệnh | Xong |
|---|---|---|---|
| S0.2.1 | Cài uv (quản lý Python + package) | `brew install uv` | ☐ |
| S0.2.2 | Tạo thư mục lab | `mkdir -p ~/Documents/Study/DA/lab` | ☐ |
| S0.2.3 | Khởi tạo project | `cd ~/Documents/Study/DA/lab && uv init` | ☐ |
| S0.2.4 | Cài thư viện | `uv add pandas jupyter matplotlib seaborn duckdb openpyxl scipy` | ☐ |
| S0.2.5 | Mở Jupyter thử | `uv run jupyter lab` | ☐ |

**Verify S0.2:** trong Jupyter, chạy cell:
```python
import pandas as pd, matplotlib, seaborn, scipy, duckdb
print(pd.__version__)
pd.DataFrame({"a": [1, 2, 3]}).describe()
```
Ra bảng thống kê → đạt.

---

## S0.3 — Tạo tài khoản (30 phút)

| ID | Dịch vụ | Dùng cho | Link | Xong |
|---|---|---|---|---|
| S0.3.1 | GitHub | Lưu portfolio, nhà tuyển dụng xem | [github.com](https://github.com) | ☐ |
| S0.3.2 | Kaggle | Dataset + notebook mẫu | [kaggle.com](https://www.kaggle.com) | ☐ |
| S0.3.3 | Google account | Sheets, Looker Studio, BigQuery | có sẵn thì dùng lại | ☐ |
| S0.3.4 | BigQuery Sandbox | Query 1TB/tháng free, **không cần thẻ** | [console.cloud.google.com/bigquery](https://console.cloud.google.com/bigquery) | ☐ |
| S0.3.5 | LeetCode | Luyện SQL (Database section) | [leetcode.com](https://leetcode.com) | ☐ |
| S0.3.6 | StrataScratch | Luyện SQL sát đề phỏng vấn thật | [stratascratch.com](https://www.stratascratch.com) | ☐ |

**Verify S0.3:** vào BigQuery console, chạy query sau — phải ra 10 dòng:
```sql
SELECT name, number, state
FROM `bigquery-public-data.usa_names.usa_1910_current`
WHERE year = 2020
ORDER BY number DESC
LIMIT 10;
```

---

## S0.4 — Dựng repo portfolio (45 phút)

| ID | Việc | Xong |
|---|---|---|
| S0.4.1 | Tạo repo `da-portfolio` trên GitHub (public) | ☐ |
| S0.4.2 | Cấu hình Git local (tên + email) | ☐ |
| S0.4.3 | Clone về `~/Documents/Study/DA/` | ☐ |
| S0.4.4 | Tạo cấu trúc thư mục | ☐ |
| S0.4.5 | Viết `README.md` giới thiệu | ☐ |
| S0.4.6 | Tạo `.gitignore` | ☐ |
| S0.4.7 | Commit + push lần đầu | ☐ |

```bash
git config --global user.name "Ten Cua Ban"
git config --global user.email "email@cua.ban"

cd ~/Documents/Study/DA
git clone https://github.com/<username>/da-portfolio.git
cd da-portfolio
mkdir -p 01-sales-dashboard 02-eda-olist 03-ab-test 04-capstone-funnel sql notebooks data

cat > .gitignore <<'EOF'
data/
*.csv
*.duckdb
*.sqlite
.ipynb_checkpoints/
.venv/
__pycache__/
.DS_Store
EOF

git add .
git commit -m "chore: khoi tao cau truc portfolio"
git push
```

> **Vì sao `data/` vào `.gitignore`:** file dữ liệu thường nặng và đôi khi chứa thông tin nhạy cảm. Trong README ghi link tải dataset, không commit file gốc lên. Đây là thói quen chuyên nghiệp mà nhà tuyển dụng để ý.

**Nội dung `README.md` khởi tạo:**
```markdown
# Data Analyst Portfolio — [Tên bạn]

Lộ trình 24 tuần từ số 0. Bắt đầu: [ngày].

| # | Project | Kỹ năng | Trạng thái |
|---|---|---|---|
| 1 | Sales Dashboard | Sheets, Looker Studio | ⏳ Tuần 12 |
| 2 | EDA — Olist E-commerce | Python, Pandas | ⏳ Tuần 16 |
| 3 | A/B Test Analysis | Statistics, scipy | ⏳ Tuần 19 |
| 4 | Capstone — Funnel & Cohort | SQL, BigQuery, BI | ⏳ Tuần 21 |

**Liên hệ:** email · LinkedIn
```

---

## S0.5 — Chuẩn bị nhịp học (30 phút)

| ID | Việc | Xong |
|---|---|---|
| S0.5.1 | Đặt lịch lặp trên calendar: T2–T6 20:00–22:00, T7 09:00–12:00, CN 09:00–11:00 | ☐ |
| S0.5.2 | Mở `tracker.csv`, điền `hours_actual` cho week 0 | ☐ |
| S0.5.3 | Bookmark 4 link: [SQLBolt](https://sqlbolt.com) · [Mode SQL Tutorial](https://mode.com/sql-tutorial/) · [Khan Academy Stats](https://www.khanacademy.org/math/statistics-probability) · [LeetCode Database](https://leetcode.com/problemset/database/) | ☐ |
| S0.5.4 | Tải sách *Storytelling with Data* + *Naked Statistics* (mua hoặc mượn) | ☐ |

---

## ✅ Cổng ra Stage 0

Chỉ sang Stage 1 khi **cả 5** điều sau đúng:

- [ ] `duckdb -c "SELECT 1;"` chạy được
- [ ] `uv run jupyter lab` mở được và import pandas thành công
- [ ] Query BigQuery public dataset trả về kết quả
- [ ] Repo `da-portfolio` đã public và có ít nhất 1 commit
- [ ] Lịch học đã nằm trên calendar

---

## Bẫy thường gặp

| Bẫy | Cách xử lý |
|---|---|
| Mất 2 ngày cài Postgres/Anaconda | Không cài. DuckDB + uv là đủ cho 24 tuần |
| Cài Docker rồi mở ngay | Docker chỉ cần từ Stage 3 (tuần 11). Cài rồi để đó |
| Đăng ký BigQuery bị hỏi thẻ | Chọn đúng **Sandbox**, không bật billing account |
| Repo để private | Để public — nhà tuyển dụng phải xem được |

**Tiếp theo:** [Stage 1 →](./stage-1-foundation)
