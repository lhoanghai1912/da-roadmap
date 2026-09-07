"""Loi giai tham chieu — grader dung file nay de sinh ket qua dung.

KHONG MO FILE NAY TRUOC KHI TU LAM. Mo ra la mat gia tri bai tap.
Sau khi cham xong, doi chieu de hoc them cach viet khac.
"""

from __future__ import annotations

import pandas as pd


def t1_line_revenue(order_items: pd.DataFrame) -> pd.DataFrame:
    df = order_items.copy()
    df["line_revenue"] = df["quantity"] * df["unit_price"] * (1 - df["discount"])
    return df


def t2_paid_orders(orders: pd.DataFrame) -> pd.DataFrame:
    return orders[(orders["status"] == "paid") & (orders["customer_id"].notna())].copy()


def _paid_items(
    order_items: pd.DataFrame, orders: pd.DataFrame, products: pd.DataFrame | None = None
) -> pd.DataFrame:
    items = t1_line_revenue(order_items)
    paid = orders[orders["status"] == "paid"][["order_id", "customer_id", "order_date"]]
    df = items.merge(paid, on="order_id", how="inner")
    if products is not None:
        df = df.merge(products[["product_id", "category"]], on="product_id", how="left")
    return df


def t3_revenue_by_category(
    order_items: pd.DataFrame, orders: pd.DataFrame, products: pd.DataFrame
) -> pd.DataFrame:
    df = _paid_items(order_items, orders, products)
    out = (
        df.groupby("category", as_index=False)["line_revenue"]
        .sum()
        .rename(columns={"line_revenue": "revenue"})
    )
    out["revenue"] = out["revenue"].round(2)
    return out.sort_values("revenue", ascending=False).reset_index(drop=True)


def t4_orders_per_customer(orders: pd.DataFrame) -> pd.DataFrame:
    paid = t2_paid_orders(orders)
    out = (
        paid.groupby("customer_id", as_index=False)["order_id"]
        .nunique()
        .rename(columns={"order_id": "n_orders"})
    )
    out["customer_id"] = out["customer_id"].astype(int)
    return out.sort_values(
        ["n_orders", "customer_id"], ascending=[False, True]
    ).reset_index(drop=True)


def t5_category_share(
    order_items: pd.DataFrame, orders: pd.DataFrame, products: pd.DataFrame
) -> pd.DataFrame:
    out = t3_revenue_by_category(order_items, orders, products)
    out["pct"] = (out["revenue"] / out["revenue"].sum() * 100).round(2)
    return out.sort_values("pct", ascending=False).reset_index(drop=True)


def t6_monthly_revenue(order_items: pd.DataFrame, orders: pd.DataFrame) -> pd.DataFrame:
    df = _paid_items(order_items, orders)
    df["month"] = pd.to_datetime(df["order_date"]).dt.to_period("M").astype(str)
    out = (
        df.groupby("month", as_index=False)["line_revenue"]
        .sum()
        .rename(columns={"line_revenue": "revenue"})
    )
    out["revenue"] = out["revenue"].round(2)
    return out.sort_values("month").reset_index(drop=True)


def t7_mom_growth(monthly: pd.DataFrame) -> pd.DataFrame:
    out = monthly.copy().sort_values("month").reset_index(drop=True)
    prev = out["revenue"].shift(1)
    out["mom_pct"] = ((out["revenue"] - prev) / prev * 100).round(2)
    return out


def t8_top_n_per_category(
    order_items: pd.DataFrame, orders: pd.DataFrame, products: pd.DataFrame, n: int = 3
) -> pd.DataFrame:
    df = _paid_items(order_items, orders, products)
    agg = (
        df.groupby(["category", "product_id"], as_index=False)["line_revenue"]
        .sum()
        .rename(columns={"line_revenue": "revenue"})
    )
    agg["revenue"] = agg["revenue"].round(2)
    agg = agg.sort_values(["category", "revenue"], ascending=[True, False])
    return agg.groupby("category", as_index=False).head(n).reset_index(drop=True)


def t9_iqr_outliers(order_items: pd.DataFrame) -> pd.DataFrame:
    s = order_items["unit_price"]
    q1, q3 = s.quantile(0.25), s.quantile(0.75)
    iqr = q3 - q1
    lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    out = order_items[(s < lo) | (s > hi)].copy()
    return out.sort_values("unit_price", ascending=False).reset_index(drop=True)


def t10_funnel(events: pd.DataFrame) -> pd.DataFrame:
    out = (
        events.groupby("event_type", as_index=False)["user_id"]
        .nunique()
        .rename(columns={"user_id": "n_users"})
    )
    base = out.loc[out["event_type"] == "view", "n_users"].iloc[0]
    out["pct_of_view"] = (out["n_users"] / base * 100).round(2)
    out["n_users"] = out["n_users"].astype(int)
    return out.sort_values("n_users", ascending=False).reset_index(drop=True)


def t11_clean_orders(orders: pd.DataFrame) -> tuple[pd.DataFrame, dict[str, int]]:
    df = orders.copy()
    log: dict[str, int] = {"rows_before": len(df)}

    n = len(df)
    df = df.drop_duplicates(subset=["order_id"], keep="first")
    log["dup_removed"] = n - len(df)

    n = len(df)
    df = df[df["status"] != "cancelled"]
    log["cancelled_removed"] = n - len(df)

    n = len(df)
    df = df[df["shipping_fee"] >= 0]
    log["negative_fee_removed"] = n - len(df)

    log["rows_after"] = len(df)
    return df.reset_index(drop=True), log


def t12_customer_summary(
    customers: pd.DataFrame, orders: pd.DataFrame, order_items: pd.DataFrame
) -> pd.DataFrame:
    spend = _paid_items(order_items, orders)
    agg = spend.groupby("customer_id").agg(
        n_orders=("order_id", "nunique"), total_spent=("line_revenue", "sum")
    ).reset_index()

    out = customers[["customer_id", "country"]].merge(agg, on="customer_id", how="left")
    out["n_orders"] = out["n_orders"].fillna(0).astype(int)
    out["total_spent"] = out["total_spent"].fillna(0.0).round(2)
    return out.sort_values(
        ["total_spent", "customer_id"], ascending=[False, True]
    ).reset_index(drop=True)
