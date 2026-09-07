#!/usr/bin/env bash
# Import stage markdown tu ~/Documents/Study/DA vao docs/ va them frontmatter Docusaurus.
# Chay lai duoc nhieu lan (idempotent).
set -euo pipefail

SRC="${1:-$HOME/Documents/Study/DA}"
SITE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$SITE/docs/stages"

if [ ! -d "$SRC/stages" ]; then
  echo "ERROR: khong tim thay $SRC/stages"
  echo "Dung: bash scripts/import-docs.sh /duong/dan/toi/DA"
  exit 1
fi

mkdir -p "$DEST" "$SITE/static"

# file_goc|slug|title|sidebar_label|position|description
MAP="
STAGE-0-SETUP.md|stage-0-setup|Stage 0 — Dựng môi trường|Stage 0 — Setup|1|Cai dat DuckDB, DBeaver, Python, Docker, repo GitHub tren macOS. 4h, 5 nhom task co lenh verify.
STAGE-1-FOUNDATION.md|stage-1-foundation|Stage 1 — Nền tảng dữ liệu & Spreadsheet|Stage 1 — Nền tảng|2|Tuan 1-2: grain, kieu du lieu, pivot table, thong ke mo ta, chon dung loai chart.
STAGE-2-SQL.md|stage-2-sql|Stage 2 — SQL: trục xương sống|Stage 2 — SQL|3|Tuan 3-9: SELECT, JOIN, CTE, window function, cohort, funnel. 62 query tu viet, 125+ bai tap.
STAGE-3-BI-DASHBOARD.md|stage-3-bi-dashboard|Stage 3 — BI & Dashboard|Stage 3 — BI|4|Tuan 10-12: Looker Studio, Metabase, star schema, nguyen tac thiet ke. Portfolio #1.
STAGE-4-PYTHON.md|stage-4-python|Stage 4 — Python cho phân tích|Stage 4 — Python|5|Tuan 13-16: Python co ban, Pandas, lam sach du lieu, visualization. Portfolio #2.
STAGE-5-STATISTICS-ABTEST.md|stage-5-statistics-abtest|Stage 5 — Thống kê suy diễn & A/B Test|Stage 5 — Stats & A/B|6|Tuan 17-19: CLT, khoang tin cay, kiem dinh gia thuyet, thiet ke A/B test. Portfolio #3.
STAGE-6-CAPSTONE-JOBPREP.md|stage-6-capstone-jobprep|Stage 6 — Capstone & Xin việc|Stage 6 — Capstone|7|Tuan 20-24: capstone end-to-end, CV, 30 cau SQL phong van, case study, mock interview.
"

count=0
while IFS='|' read -r file slug title label pos desc; do
  [ -z "${file// }" ] && continue
  src_file="$SRC/stages/$file"
  if [ ! -f "$src_file" ]; then
    echo "  bo qua (khong co): $file"
    continue
  fi

  {
    printf -- '---\n'
    printf 'id: %s\n' "$slug"
    printf 'title: "%s"\n' "$title"
    printf 'sidebar_label: "%s"\n' "$label"
    printf 'sidebar_position: %s\n' "$pos"
    printf 'description: "%s"\n' "$desc"
    printf 'format: md\n'
    printf -- '---\n\n'
    cat "$src_file"
  } > "$DEST/$slug.md"

  count=$((count + 1))
  echo "  ✓ $file -> docs/stages/$slug.md"
done <<< "$MAP"

# Sua link noi bo giua cac stage: [X](./STAGE-2-SQL.md) -> [X](./stage-2-sql)
for f in "$DEST"/*.md; do
  perl -0pi -e '
    s{\(\./STAGE-([0-9])-([A-Z0-9\-]+)\.md\)}{
      "(./stage-" . lc($1) . "-" . lc($2) . ")"
    }ge;
  ' "$f"
done

# Copy tracker cho nguoi doc tai ve
[ -f "$SRC/tracker.csv" ] && cp "$SRC/tracker.csv" "$SITE/static/tracker.csv" && echo "  ✓ tracker.csv -> static/"

echo ""
echo "Xong: $count file stage."
