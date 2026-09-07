"""Tao database luyen tap practice.duckdb voi du lieu sinh ngau nhien co seed co dinh.

Chay: python setup_db.py
Ket qua: practice.duckdb voi 5 bang + mot so loi du lieu co chu y de luyen xu ly.
"""

from __future__ import annotations

import random
from datetime import date, datetime, timedelta
from pathlib import Path

import duckdb

SEED = 42
DB_PATH = Path(__file__).parent / "practice.duckdb"

COUNTRIES = ["Vietnam", "Singapore", "Thailand", "Malaysia", "Indonesia", "Philippines"]
CITIES = {
    "Vietnam": ["Ha Noi", "Ho Chi Minh", "Da Nang"],
    "Singapore": ["Singapore"],
    "Thailand": ["Bangkok", "Chiang Mai"],
    "Malaysia": ["Kuala Lumpur", "Penang"],
    "Indonesia": ["Jakarta", "Bandung"],
    "Philippines": ["Manila", "Cebu"],
}
CATEGORIES = ["Electronics", "Furniture", "Office Supplies", "Apparel", "Books"]
STATUSES = ["paid", "paid", "paid", "paid", "shipped", "shipped", "cancelled", "pending"]
DEVICES = ["mobile", "desktop", "tablet"]
EVENT_TYPES = ["view", "cart", "checkout", "purchase"]

START = date(2024, 1, 1)
END = date(2024, 12, 31)


def rand_date(rng: random.Random) -> date:
    return START + timedelta(days=rng.randint(0, (END - START).days))


def build() -> None:
    rng = random.Random(SEED)

    # ---- customers ----
    customers = []
    for cid in range(1, 301):
        country = rng.choice(COUNTRIES)
        customers.append(
            (
                cid,
                f"Customer {cid:03d}",
                country,
                rng.choice(CITIES[country]),
                START + timedelta(days=rng.randint(0, 200)),
            )
        )

    # ---- products ----
    products = []
    for pid in range(1, 81):
        cat = rng.choice(CATEGORIES)
        base = {"Electronics": 400, "Furniture": 250, "Office Supplies": 25,
                "Apparel": 60, "Books": 18}[cat]
        price = round(base * rng.uniform(0.4, 2.2), 2)
        products.append((pid, f"{cat[:4].upper()}-{pid:03d}", cat, price))

    # ---- orders + order_items ----
    orders = []
    order_items = []
    oid = 0
    item_id = 0
    for _ in range(2000):
        oid += 1
        # ~3% don khach vang lai: customer_id NULL (de luyen bay NOT IN / NULL)
        # Chi khach 1..270 co don => 30 khach chua tung mua (de luyen anti-join)
        customer_id = None if rng.random() < 0.03 else rng.randint(1, 270)
        orders.append(
            (
                oid,
                customer_id,
                rand_date(rng),
                rng.choice(STATUSES),
                round(rng.uniform(0, 15), 2),
            )
        )
        for _ in range(rng.randint(1, 5)):
            item_id += 1
            pid = rng.randint(1, 80)
            unit_price = products[pid - 1][3]
            # ~1.5% dong co gia bat thuong (loi nhap lieu) de luyen phat hien outlier
            if rng.random() < 0.015:
                unit_price = round(unit_price * rng.uniform(18, 30), 2)
            order_items.append(
                (item_id, oid, pid, rng.randint(1, 4), unit_price,
                 round(rng.choice([0, 0, 0, 0.1, 0.2, 0.3]), 2))
            )

    # ---- events (phieu funnel) ----
    events = []
    eid = 0
    for user_id in range(1, 301):
        device = rng.choice(DEVICES)
        n_sessions = rng.randint(1, 6)
        for _ in range(n_sessions):
            d = rand_date(rng)
            ts = datetime(d.year, d.month, d.day, rng.randint(0, 23), rng.randint(0, 59))
            # phieu: view -> cart -> checkout -> purchase, moi buoc co ty le rot
            drop = [1.0, 0.45, 0.60, 0.70]
            for step, et in enumerate(EVENT_TYPES):
                if rng.random() > drop[step]:
                    break
                eid += 1
                events.append((eid, user_id, et, ts + timedelta(minutes=step * 3), device))

    if DB_PATH.exists():
        DB_PATH.unlink()
    con = duckdb.connect(str(DB_PATH))

    con.execute("""
        CREATE TABLE customers (
            customer_id INTEGER, name VARCHAR, country VARCHAR,
            city VARCHAR, signup_date DATE
        );
        CREATE TABLE products (
            product_id INTEGER, name VARCHAR, category VARCHAR, price DOUBLE
        );
        CREATE TABLE orders (
            order_id INTEGER, customer_id INTEGER, order_date DATE,
            status VARCHAR, shipping_fee DOUBLE
        );
        CREATE TABLE order_items (
            order_item_id INTEGER, order_id INTEGER, product_id INTEGER,
            quantity INTEGER, unit_price DOUBLE, discount DOUBLE
        );
        CREATE TABLE events (
            event_id INTEGER, user_id INTEGER, event_type VARCHAR,
            created_at TIMESTAMP, device VARCHAR
        );
    """)

    con.executemany("INSERT INTO customers VALUES (?,?,?,?,?)", customers)
    con.executemany("INSERT INTO products VALUES (?,?,?,?)", products)
    con.executemany("INSERT INTO orders VALUES (?,?,?,?,?)", orders)
    con.executemany("INSERT INTO order_items VALUES (?,?,?,?,?,?)", order_items)
    con.executemany("INSERT INTO events VALUES (?,?,?,?,?)", events)

    print(f"Da tao {DB_PATH.name}")
    for t in ["customers", "products", "orders", "order_items", "events"]:
        n = con.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
        print(f"  {t:<14} {n:>6,} dong")
    n_null = con.execute(
        "SELECT COUNT(*) FROM orders WHERE customer_id IS NULL"
    ).fetchone()[0]
    print(f"\nLuu y: {n_null} don co customer_id = NULL (khach vang lai).")
    print("       Mot so unit_price bat thuong — loi nhap lieu co chu y.")
    con.close()


if __name__ == "__main__":
    build()
