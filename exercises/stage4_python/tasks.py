"""Bai tap Pandas — Stage 4.

Cach dung:
    1. Cai dat: pip install duckdb pandas pytest
    2. Tao du lieu: python setup_db.py   (o thu muc exercises/)
    3. Viet code vao cac ham duoi day, thay `raise NotImplementedError`
    4. Cham diem: python stage4_python/grade.py

Moi ham co docstring mo ta ro dau vao / dau ra. Grader so sanh KET QUA,
khong cham cach viet.
"""

from __future__ import annotations

from pathlib import Path

import duckdb
import pandas as pd

DB_PATH = Path(__file__).resolve().parent.parent / "practice.duckdb"


def load_tables() -> dict[str, pd.DataFrame]:
    """Nap 5 bang tu practice.duckdb thanh dict cua DataFrame. (Da viet san.)"""
    con = duckdb.connect(str(DB_PATH), read_only=True)
    tables = {
        name: con.execute(f"SELECT * FROM {name}").fetchdf()
        for name in ["customers", "products", "orders", "order_items", "events"]
    }
    con.close()
    return tables


# ---------------------------------------------------------------- T1
def t1_line_revenue(order_items: pd.DataFrame) -> pd.DataFrame:
    """Them cot `line_revenue` = quantity * unit_price * (1 - discount).

    Tra ve DataFrame MOI (khong sua ban goc), giu nguyen so dong va cac cot cu,
    them 1 cot line_revenue.
    """
    raise NotImplementedError


# ---------------------------------------------------------------- T2
def t2_paid_orders(orders: pd.DataFrame) -> pd.DataFrame:
    """Loc cac don co status == 'paid' VA customer_id khong phai NULL.

    Tra ve DataFrame moi, giu nguyen tat ca cac cot.
    """
    raise NotImplementedError


# ---------------------------------------------------------------- T3
def t3_revenue_by_category(
    order_items: pd.DataFrame, orders: pd.DataFrame, products: pd.DataFrame
) -> pd.DataFrame:
    """Doanh thu theo category, chi tinh don 'paid'.

    Tra ve DataFrame 2 cot: category, revenue (lam tron 2 so).
    Sap xep revenue giam dan, index da reset (0,1,2,...).
    """
    raise NotImplementedError


# ---------------------------------------------------------------- T4
def t4_orders_per_customer(orders: pd.DataFrame) -> pd.DataFrame:
    """Dem so don DUY NHAT theo khach (chi don 'paid', bo customer_id NULL).

    Tra ve DataFrame 2 cot: customer_id (int), n_orders (int).
    Sap xep n_orders giam dan roi customer_id tang dan. Index da reset.
    """
    raise NotImplementedError


# ---------------------------------------------------------------- T5
def t5_category_share(
    order_items: pd.DataFrame, orders: pd.DataFrame, products: pd.DataFrame
) -> pd.DataFrame:
    """Ty trong % doanh thu cua moi category tren tong (don 'paid').

    Tra ve DataFrame 3 cot: category, revenue (lam tron 2), pct (lam tron 2).
    Tong cot pct xap xi 100. Sap xep pct giam dan. Index da reset.
    Goi y: dung .transform("sum") hoac chia cho tong — tuong duong SUM() OVER ().
    """
    raise NotImplementedError


# ---------------------------------------------------------------- T6
def t6_monthly_revenue(order_items: pd.DataFrame, orders: pd.DataFrame) -> pd.DataFrame:
    """Doanh thu theo thang (don 'paid').

    Tra ve DataFrame 2 cot: month (kieu pd.Period hoac string 'YYYY-MM'), revenue (lam tron 2).
    Sap xep month tang dan. Index da reset.
    Grader chap nhan ca Period lan string.
    """
    raise NotImplementedError


# ---------------------------------------------------------------- T7
def t7_mom_growth(monthly: pd.DataFrame) -> pd.DataFrame:
    """Nhan ket qua cua t6, them cot `mom_pct` = % tang truong so thang truoc.

    mom_pct = (revenue - revenue_thang_truoc) / revenue_thang_truoc * 100, lam tron 2.
    Thang dau tien de NaN. Tra ve DataFrame 3 cot: month, revenue, mom_pct.
    Goi y: .shift(1) tuong duong LAG() trong SQL.
    """
    raise NotImplementedError


# ---------------------------------------------------------------- T8
def t8_top_n_per_category(
    order_items: pd.DataFrame, orders: pd.DataFrame, products: pd.DataFrame, n: int = 3
) -> pd.DataFrame:
    """Top n san pham doanh thu cao nhat TRONG MOI category (don 'paid').

    Tra ve DataFrame 3 cot: category, product_id, revenue (lam tron 2).
    Sap xep category tang dan roi revenue giam dan. Index da reset.
    Goi y: groupby(...).head(n) sau khi sort, hoac dung .rank().
    """
    raise NotImplementedError


# ---------------------------------------------------------------- T9
def t9_iqr_outliers(order_items: pd.DataFrame) -> pd.DataFrame:
    """Tim cac dong co unit_price la outlier theo quy tac IQR.

    Nguong: unit_price < Q1 - 1.5*IQR hoac > Q3 + 1.5*IQR (tinh tren toan bo cot).
    Tra ve DataFrame chua nguyen cac dong outlier (giu moi cot goc),
    sap xep unit_price giam dan, index da reset.
    """
    raise NotImplementedError


# ---------------------------------------------------------------- T10
def t10_funnel(events: pd.DataFrame) -> pd.DataFrame:
    """Phieu chuyen doi: so user DUY NHAT o moi buoc.

    Tra ve DataFrame 3 cot: event_type, n_users (int), pct_of_view (lam tron 2)
    trong do pct_of_view = n_users / n_users_cua_buoc_'view' * 100.
    Sap xep n_users giam dan. Index da reset.
    Goi y: .nunique() tuong duong COUNT(DISTINCT ...).
    """
    raise NotImplementedError


# ---------------------------------------------------------------- T11
def t11_clean_orders(orders: pd.DataFrame) -> tuple[pd.DataFrame, dict[str, int]]:
    """Pipeline lam sach co log.

    Cac buoc, theo dung thu tu:
      1. Bo dong trung lap hoan toan theo order_id (giu ban dau tien)
      2. Bo don co status == 'cancelled'
      3. Bo don co shipping_fee < 0 (neu co)

    Tra ve (df_da_lam_sach, log) voi log la dict:
      {"rows_before": int, "dup_removed": int, "cancelled_removed": int,
       "negative_fee_removed": int, "rows_after": int}
    """
    raise NotImplementedError


# ---------------------------------------------------------------- T12
def t12_customer_summary(
    customers: pd.DataFrame, orders: pd.DataFrame, order_items: pd.DataFrame
) -> pd.DataFrame:
    """Bang tong hop moi khach 1 dong — GIU CA khach chua tung mua.

    Tra ve DataFrame 4 cot:
      customer_id (int), country (str), n_orders (int), total_spent (float, lam tron 2)
    Khach chua mua: n_orders = 0, total_spent = 0.0.
    Chi tinh don 'paid'. Sap xep total_spent giam dan roi customer_id tang dan.
    Index da reset.
    Goi y: merge how="left" tu customers, roi fillna(0).
    """
    raise NotImplementedError
