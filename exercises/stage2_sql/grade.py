"""Cham diem tu dong bai tap SQL Stage 2.

Cach dung:
    python setup_db.py                    # tao DB (chi can chay 1 lan)
    python stage2_sql/grade.py            # cham tat ca
    python stage2_sql/grade.py q05        # cham 1 cau
    python stage2_sql/grade.py --init     # tao san file answers/qNN.sql rong

Bai lam dat trong stage2_sql/answers/qNN.sql
So sanh ket qua truy van cua ban voi ket qua tham chieu:
  - Sai so cot / ten cot        -> bao ro
  - Sai so dong                 -> bao ro
  - Sai gia tri                 -> chi ra dong dau tien lech
Cham theo KET QUA, khong cham cach viet — nhieu cach viet khac nhau deu duoc diem.
"""

from __future__ import annotations

import sys
from pathlib import Path

import duckdb
import pandas as pd

sys.path.insert(0, str(Path(__file__).parent))
from questions import QUESTIONS, Question  # noqa: E402

HERE = Path(__file__).parent
DB_PATH = HERE.parent / "practice.duckdb"
ANSWER_DIR = HERE / "answers"

GREEN, RED, YELLOW, GREY, BOLD, RESET = (
    "\033[92m", "\033[91m", "\033[93m", "\033[90m", "\033[1m", "\033[0m",
)


def fmt(v: object) -> str:
    """Hien thi gia tri gon gang trong thong bao loi."""
    if v is None or (isinstance(v, float) and pd.isna(v)):
        return "NULL"
    if isinstance(v, float):
        return f"{v:,.2f}"
    if hasattr(v, "item"):
        inner = v.item()
        return f"{inner:,.2f}" if isinstance(inner, float) else str(inner)
    return str(v)


def normalize(df: pd.DataFrame, ordered: bool) -> pd.DataFrame:
    """Chuan hoa de so sanh: ten cot thuong, lam tron so, sap xep neu bai khong cham thu tu."""
    out = df.copy()
    out.columns = [str(c).strip().lower() for c in out.columns]
    for col in out.columns:
        if pd.api.types.is_float_dtype(out[col]):
            out[col] = out[col].round(2)
        if pd.api.types.is_datetime64_any_dtype(out[col]):
            out[col] = out[col].astype(str)
    if not ordered:
        out = out.sort_values(by=list(out.columns), kind="stable", na_position="last")
    return out.reset_index(drop=True)


def compare(student: pd.DataFrame, ref: pd.DataFrame, ordered: bool) -> tuple[bool, str]:
    s = normalize(student, ordered)
    r = normalize(ref, ordered)

    if len(s.columns) != len(r.columns):
        return False, (
            f"So cot khong khop: bai lam {len(s.columns)} cot {list(s.columns)}, "
            f"can {len(r.columns)} cot {list(r.columns)}"
        )
    if list(s.columns) != list(r.columns):
        return False, (
            f"Ten cot khong khop.\n     Bai lam: {list(s.columns)}\n     Can:     {list(r.columns)}\n"
            f"     (dat alias bang AS cho dung ten yeu cau)"
        )
    if len(s) != len(r):
        return False, (
            f"So dong khong khop: bai lam {len(s)} dong, can {len(r)} dong. "
            f"Kiem tra dieu kien loc, JOIN co lam mat/nhan dong khong."
        )
    if s.empty:
        return True, "OK (ket qua rong dung nhu tham chieu)"

    try:
        pd.testing.assert_frame_equal(s, r, check_dtype=False, rtol=1e-3, atol=0.02)
    except AssertionError:
        for i in range(len(r)):
            row_s, row_r = s.iloc[i], r.iloc[i]
            for col in r.columns:
                a, b = row_s[col], row_r[col]
                if pd.isna(a) and pd.isna(b):
                    continue
                mismatch = (
                    abs(float(a) - float(b)) > 0.02
                    if isinstance(b, (int, float)) and not pd.isna(b) and not pd.isna(a)
                    else str(a) != str(b)
                )
                if mismatch:
                    return False, (
                        f"Lech gia tri tai dong {i + 1}, cot '{col}': "
                        f"bai lam = {fmt(a)}, can = {fmt(b)}"
                    )
        return False, "Ket qua khac tham chieu (khong xac dinh duoc dong lech cu the)"
    return True, "OK"


def grade_one(con: duckdb.DuckDBPyConnection, q: Question) -> tuple[str, str]:
    """Tra ve (trang_thai, thong_diep). Trang thai: PASS | FAIL | EMPTY | ERROR."""
    path = ANSWER_DIR / f"{q.id}.sql"
    if not path.exists():
        return "EMPTY", f"chua co file {path.relative_to(HERE.parent)}"

    sql = path.read_text(encoding="utf-8")
    stripped = "\n".join(
        line for line in sql.splitlines() if not line.strip().startswith("--")
    ).strip()
    if not stripped:
        return "EMPTY", "file rong"

    try:
        student = con.execute(stripped).fetchdf()
    except Exception as exc:  # noqa: BLE001
        return "ERROR", f"query loi: {type(exc).__name__}: {str(exc).splitlines()[0]}"

    ref = con.execute(q.reference).fetchdf()
    ok, msg = compare(student, ref, q.ordered)
    return ("PASS" if ok else "FAIL"), msg


def main() -> int:
    if not DB_PATH.exists():
        print(f"{RED}Chua co {DB_PATH.name}. Chay truoc: python setup_db.py{RESET}")
        return 1

    args = [a for a in sys.argv[1:]]
    if "--init" in args:
        ANSWER_DIR.mkdir(exist_ok=True)
        for q in QUESTIONS:
            p = ANSWER_DIR / f"{q.id}.sql"
            if not p.exists():
                p.write_text(
                    f"-- {q.id} [{q.week}] [{q.level}]\n"
                    f"-- {q.prompt}\n"
                    f"-- Goi y: {q.hint}\n\n",
                    encoding="utf-8",
                )
        print(f"Da tao {len(QUESTIONS)} file trong {ANSWER_DIR.relative_to(HERE.parent)}/")
        return 0

    only = [a for a in args if not a.startswith("-")]
    targets = [q for q in QUESTIONS if not only or q.id in only]
    if not targets:
        print(f"{RED}Khong tim thay cau hoi: {only}{RESET}")
        return 1

    con = duckdb.connect(str(DB_PATH), read_only=True)
    ANSWER_DIR.mkdir(exist_ok=True)

    passed = failed = empty = 0
    print(f"\n{BOLD}CHAM BAI SQL — STAGE 2{RESET}")
    print("=" * 72)

    for q in targets:
        status, msg = grade_one(con, q)
        if status == "PASS":
            passed += 1
            print(f"{GREEN}[PASS]{RESET} {q.id} {GREY}({q.week} · {q.level}){RESET}")
        elif status == "EMPTY":
            empty += 1
            print(f"{GREY}[----] {q.id} ({q.week} · {q.level}) — {msg}{RESET}")
        else:
            failed += 1
            tag = f"{RED}[FAIL]{RESET}" if status == "FAIL" else f"{YELLOW}[ERR ]{RESET}"
            print(f"{tag} {q.id} {GREY}({q.week} · {q.level}){RESET}")
            print(f"       {msg}")
            print(f"       {GREY}Goi y: {q.hint}{RESET}")

    con.close()

    total = len(targets)
    attempted = passed + failed
    print("=" * 72)
    print(f"{BOLD}Ket qua: {passed}/{total} dung{RESET}", end="")
    if empty:
        print(f"  {GREY}({empty} cau chua lam){RESET}", end="")
    print()

    if attempted:
        pct = passed * 100 // total
        bar = "█" * (pct // 5) + "░" * (20 - pct // 5)
        print(f"{bar} {pct}%")

    if passed == total:
        print(f"\n{GREEN}{BOLD}Dat toan bo. San sang cho CHECKPOINT 2.{RESET}")
    elif passed >= total * 0.8:
        print(f"\n{YELLOW}Gan dat. Sua not cac cau FAIL roi cham lai.{RESET}")
    else:
        print(f"\n{GREY}Doc lai muc tuong ung trong Stage 2 truoc khi lam tiep.{RESET}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
