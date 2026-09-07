# DA Roadmap — Lộ trình học Data Analyst từ số 0

**🌐 Trang web: https://lhoanghai1912.github.io/da-roadmap/**

Lộ trình 24 tuần (~360h, 15h/tuần) từ con số 0 lên Junior Data Analyst. Xây dựng từ phân tích repo [tunguyenn99/data-road-map-by-roles](https://github.com/tunguyenn99/data-road-map-by-roles), điều chỉnh cho người mới bắt đầu trên macOS.

## Nội dung

| Stage | Tuần | Chủ đề | Deliverable |
|---|---|---|---|
| 0 | W0 | Dựng môi trường macOS | Môi trường + repo GitHub |
| 1 | W1–2 | Tư duy dữ liệu, Sheets, thống kê mô tả | Sheet pivot + summary |
| 2 | W3–9 | SQL: JOIN → CTE → window → cohort/funnel | 125+ bài, 12 query báo cáo |
| 3 | W10–12 | Looker Studio, Metabase, star schema | Portfolio #1 — Dashboard |
| 4 | W13–16 | Python, Pandas, làm sạch, viz | Portfolio #2 — EDA |
| 5 | W17–19 | Thống kê suy diễn, A/B test | Portfolio #3 — A/B Test |
| 6 | W20–24 | Capstone, CV, phỏng vấn | Portfolio #4 + CV |

4 checkpoint pass/fail · 4 portfolio project · chi phí tối thiểu 0đ.

## Chạy local

```bash
npm install
npm start          # dev server http://localhost:3000/da-roadmap/
npm run build      # build production vào build/
npm run serve      # serve bản build
```

## Cập nhật nội dung

Sửa trực tiếp file trong `docs/`, hoặc import lại từ thư mục nguồn:

```bash
bash scripts/import-docs.sh ~/Documents/Study/DA
```

Push lên `main` → GitHub Actions tự build và deploy.

## Stack

Docusaurus 3.10 · TypeScript · local search (`@easyops-cn/docusaurus-search-local`) · Mermaid · GitHub Pages

## Nguồn

Nội dung dựa trên phân tích [data-road-map-by-roles](https://github.com/tunguyenn99/data-road-map-by-roles). Số liệu lương và thị trường trích từ repo gốc (dẫn nguồn ITViec Q2/2025), chưa kiểm chứng độc lập.
