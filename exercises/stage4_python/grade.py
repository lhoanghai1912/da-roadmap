"""Cham diem tu dong bai tap Pandas Stage 4.

Cach dung:
    python setup_db.py                      # tao DB (o thu muc exercises/)
    python stage4_python/grade.py           # cham tat ca
    python stage4_python/grade.py t5 t8     # cham vai bai

Cham theo KET QUA tra ve cua tung ham, khong cham cach viet.
"""

from __future__ import annotations

import sys
import traceback
from pathlib import Path
from typing import Callable

import pandas as pd

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import solution_reference as ref  # noqa: E402
import tasks  # noqa: E402

GREEN, RED, YELLOW, GREY, BOLD, RESET = (
    "\033[92m", "\033[91m", "\033[93m", "\033[90m", "\033[1m", "\033[0m",
)

TASK_INFO: dict[str, tuple[str, str]] = {
    "t1": ("W14", "Tao cot tinh toan"),
    "t2": ("W14", "Loc nhieu dieu kien (nho ngoac)"),
    "t3": ("W14", "merge + groupby + agg"),
    "t4": ("W14", "nunique — tuong duong COUNT(DISTINCT)"),
    "t5": ("W14", "Ty trong % — tuong duong SUM() OVER ()"),
    "t6": ("W14", "Gom theo thang"),
    "t7": ("W14", "shift — tuong duong LAG()"),
    "t8": ("W14", "Top N moi nhom"),
    "t9": ("W15", "Outlier theo IQR"),
    "t10": ("W16", "Phieu chuyen doi"),
    "t11": ("W15", "Pipeline lam sach co log"),
    "t12": ("W14", "LEFT JOIN + fillna"),
}


def norm(obj: object) -> object:
    """Chuan hoa ket qua de so sanh."""
    if isinstance(obj, pd.DataFrame):
        df = obj.copy()
        df.columns = [str(c).strip().lower() for c in df.columns]
        for col in df.columns:
            if pd.api.types.is_float_dtype(df[col]):
                df[col] = df[col].round(2)
            elif pd.api.types.is_period_dtype(df[col]):
                df[col] = df[col].astype(str)
            elif pd.api.types.is_datetime64_any_dtype(df[col]):
                df[col] = df[col].astype(str)
        return df.reset_index(drop=True)
    return obj


def same(a: object, b: object) -> tuple[bool, str]:
    if isinstance(b, tuple) and isinstance(a, tuple):
        if len(a) != len(b):
            return False, f"tra ve tuple {len(a)} phan tu, can {len(b)}"
        for i, (x, y) in enumerate(zip(a, b)):
            ok, msg = same(x, y)
            if not ok:
                return False, f"phan tu thu {i + 1} cua tuple: {msg}"
        return True, "OK"

    if isinstance(b, dict):
        if not isinstance(a, dict):
            return False, f"can tra ve dict, nhan duoc {type(a).__name__}"
        missing = set(b) - set(a)
        if missing:
            return False, f"dict thieu key: {sorted(missing)}"
        for k, v in b.items():
            if a[k] != v:
                return False, f"log['{k}'] = {a[k]}, can {v}"
        return True, "OK"

    if isinstance(b, pd.DataFrame):
        if not isinstance(a, pd.DataFrame):
            return False, f"can tra ve DataFrame, nhan duoc {type(a).__name__}"
        sa, sb = norm(a), norm(b)
        if list(sa.columns) != list(sb.columns):
            extra = [c for c in sa.columns if c not in sb.columns]
            miss = [c for c in sb.columns if c not in sa.columns]
            detail = ""
            if miss:
                detail += f" Thieu cot: {miss}."
            if extra:
                detail += f" Thua cot: {extra}."
            return False, (
                f"Cot khong khop.\n     Bai lam: {list(sa.columns)}"
                f"\n     Can:     {list(sb.columns)}.{detail}"
            )
        if len(sa) != len(sb):
            return False, f"So dong: bai lam {len(sa)}, can {len(sb)}"
        for i in range(len(sb)):
            for col in sb.columns:
                x, y = sa.iloc[i][col], sb.iloc[i][col]
                if pd.isna(x) and pd.isna(y):
                    continue
                if isinstance(y, float) or isinstance(x, float):
                    try:
                        if abs(float(x) - float(y)) > 0.02:
                            return False, (
                                f"Dong {i + 1}, cot '{col}': bai lam = {x}, can = {y}"
                            )
                        continue
                    except (TypeError, ValueError):
                        pass
                if str(x) != str(y):
                    return False, f"Dong {i + 1}, cot '{col}': bai lam = {x!r}, can = {y!r}"
        return True, "OK"

    return (a == b), ("OK" if a == b else f"bai lam = {a!r}, can = {b!r}")


def main() -> int:
    db = HERE.parent / "practice.duckdb"
    if not db.exists():
        print(f"{RED}Chua co practice.duckdb. Chay truoc: python setup_db.py{RESET}")
        return 1

    t = tasks.load_tables()
    customers, products = t["customers"], t["products"]
    orders, order_items, events = t["orders"], t["order_items"], t["events"]

    monthly_ref = ref.t6_monthly_revenue(order_items, orders)

    cases: list[tuple[str, Callable[[], object], Callable[[], object]]] = [
        ("t1", lambda: tasks.t1_line_revenue(order_items),
         lambda: ref.t1_line_revenue(order_items)),
        ("t2", lambda: tasks.t2_paid_orders(orders),
         lambda: ref.t2_paid_orders(orders)),
        ("t3", lambda: tasks.t3_revenue_by_category(order_items, orders, products),
         lambda: ref.t3_revenue_by_category(order_items, orders, products)),
        ("t4", lambda: tasks.t4_orders_per_customer(orders),
         lambda: ref.t4_orders_per_customer(orders)),
        ("t5", lambda: tasks.t5_category_share(order_items, orders, products),
         lambda: ref.t5_category_share(order_items, orders, products)),
        ("t6", lambda: tasks.t6_monthly_revenue(order_items, orders),
         lambda: ref.t6_monthly_revenue(order_items, orders)),
        ("t7", lambda: tasks.t7_mom_growth(monthly_ref.copy()),
         lambda: ref.t7_mom_growth(monthly_ref.copy())),
        ("t8", lambda: tasks.t8_top_n_per_category(order_items, orders, products),
         lambda: ref.t8_top_n_per_category(order_items, orders, products)),
        ("t9", lambda: tasks.t9_iqr_outliers(order_items),
         lambda: ref.t9_iqr_outliers(order_items)),
        ("t10", lambda: tasks.t10_funnel(events), lambda: ref.t10_funnel(events)),
        ("t11", lambda: tasks.t11_clean_orders(orders),
         lambda: ref.t11_clean_orders(orders)),
        ("t12", lambda: tasks.t12_customer_summary(customers, orders, order_items),
         lambda: ref.t12_customer_summary(customers, orders, order_items)),
    ]

    only = [a for a in sys.argv[1:] if not a.startswith("-")]
    selected = [c for c in cases if not only or c[0] in only]

    print(f"\n{BOLD}CHAM BAI PANDAS — STAGE 4{RESET}")
    print("=" * 72)

    passed = todo = failed = 0
    for name, student_fn, ref_fn in selected:
        week, label = TASK_INFO[name]
        meta = f"{GREY}({week} · {label}){RESET}"
        try:
            got = student_fn()
        except NotImplementedError:
            todo += 1
            print(f"{GREY}[----] {name:<4} ({week} · {label}) — chua lam{RESET}")
            continue
        except Exception as exc:  # noqa: BLE001
            failed += 1
            print(f"{YELLOW}[ERR ]{RESET} {name:<4} {meta}")
            print(f"       {type(exc).__name__}: {exc}")
            tb = traceback.format_exc().strip().splitlines()
            frames = [ln.strip() for ln in tb if "tasks.py" in ln]
            if frames:
                print(f"       {GREY}{frames[-1]}{RESET}")
            continue

        ok, msg = same(got, ref_fn())
        if ok:
            passed += 1
            print(f"{GREEN}[PASS]{RESET} {name:<4} {meta}")
        else:
            failed += 1
            print(f"{RED}[FAIL]{RESET} {name:<4} {meta}")
            print(f"       {msg}")

    total = len(selected)
    print("=" * 72)
    print(f"{BOLD}Ket qua: {passed}/{total} dung{RESET}", end="")
    if todo:
        print(f"  {GREY}({todo} bai chua lam){RESET}", end="")
    print()
    pct = passed * 100 // total if total else 0
    print("█" * (pct // 5) + "░" * (20 - pct // 5) + f" {pct}%")

    if passed == total:
        print(f"\n{GREEN}{BOLD}Dat toan bo. San sang cho CHECKPOINT 3.{RESET}")
    elif passed >= total * 0.75:
        print(f"\n{YELLOW}Gan dat. Sua not cac bai FAIL.{RESET}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
