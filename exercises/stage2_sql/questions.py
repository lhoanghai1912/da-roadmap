"""Ngan hang cau hoi SQL Stage 2 — dung chung cho grade.py va sinh de bai.

Moi cau: id, muc do, de bai, cot ket qua mong doi, SQL tham chieu, goi y.
`ordered=True` nghia la thu tu dong duoc cham (bai co ORDER BY/LIMIT).
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Question:
    id: str
    week: str
    level: str
    prompt: str
    reference: str
    hint: str
    ordered: bool = False
    tags: tuple[str, ...] = field(default_factory=tuple)


QUESTIONS: list[Question] = [
    Question(
        id="q01",
        week="W3",
        level="Easy",
        prompt="Liet ke customer_id, name, city cua khach o Vietnam, sap xep theo name tang dan.",
        reference="""
            SELECT customer_id, name, city
            FROM customers
            WHERE country = 'Vietnam'
            ORDER BY name
        """,
        hint="WHERE + ORDER BY co ban.",
        ordered=True,
        tags=("where", "order by"),
    ),
    Question(
        id="q02",
        week="W4",
        level="Easy",
        prompt=(
            "Dem so don hang theo status. Tra ve 2 cot: status, n_orders. "
            "Sap xep n_orders giam dan."
        ),
        reference="""
            SELECT status, COUNT(*) AS n_orders
            FROM orders
            GROUP BY status
            ORDER BY n_orders DESC
        """,
        hint="GROUP BY + COUNT(*).",
        ordered=True,
        tags=("group by",),
    ),
    Question(
        id="q03",
        week="W4",
        level="Easy",
        prompt=(
            "Voi moi country, tinh so khach (n_customers). Chi lay country co tren 45 khach. "
            "Cot: country, n_customers. Sap xep n_customers giam dan."
        ),
        reference="""
            SELECT country, COUNT(*) AS n_customers
            FROM customers
            GROUP BY country
            HAVING COUNT(*) > 45
            ORDER BY n_customers DESC
        """,
        hint="HAVING loc SAU khi gom nhom, khac WHERE loc tung dong truoc khi gom.",
        ordered=True,
        tags=("having",),
    ),
    Question(
        id="q04",
        week="W5",
        level="Medium",
        prompt=(
            "Tinh doanh thu theo country. Doanh thu 1 dong item = quantity * unit_price * (1 - discount). "
            "Chi tinh don co status = 'paid'. Cot: country, revenue (lam tron 2 so). "
            "Sap xep revenue giam dan."
        ),
        reference="""
            SELECT c.country,
                   ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS revenue
            FROM orders o
            JOIN customers c  ON c.customer_id = o.customer_id
            JOIN order_items i ON i.order_id = o.order_id
            WHERE o.status = 'paid'
            GROUP BY c.country
            ORDER BY revenue DESC
        """,
        hint="JOIN 3 bang. Chu y don co customer_id NULL se bi loai boi INNER JOIN — dung y do.",
        ordered=True,
        tags=("join", "aggregate"),
    ),
    Question(
        id="q05",
        week="W5",
        level="Medium",
        prompt=(
            "Tim khach hang CHUA TUNG co don hang nao. Cot: customer_id, name. "
            "Sap xep customer_id tang dan."
        ),
        reference="""
            SELECT c.customer_id, c.name
            FROM customers c
            LEFT JOIN orders o ON o.customer_id = c.customer_id
            WHERE o.order_id IS NULL
            ORDER BY c.customer_id
        """,
        hint=(
            "Anti-join: LEFT JOIN roi loc IS NULL. Neu dung NOT IN se ra RONG "
            "vi orders.customer_id co NULL — day la bay can nho."
        ),
        ordered=True,
        tags=("anti-join", "null"),
    ),
    Question(
        id="q06",
        week="W5",
        level="Medium",
        prompt=(
            "CANH BAO FAN-OUT: tinh tong phi ship cua cac don 'paid'. "
            "Cot: total_shipping (lam tron 2 so). Ket qua 1 dong."
        ),
        reference="""
            SELECT ROUND(SUM(shipping_fee), 2) AS total_shipping
            FROM orders
            WHERE status = 'paid'
        """,
        hint=(
            "Khong JOIN order_items o day. Neu JOIN, moi don bi nhan len theo so san pham "
            "va phi ship bi cong nhieu lan."
        ),
        tags=("fan-out",),
    ),
    Question(
        id="q07",
        week="W6",
        level="Medium",
        prompt=(
            "Tim khach co tong chi tieu (don 'paid') CAO HON muc trung binh cua tat ca khach. "
            "Cot: customer_id, total_spent (lam tron 2 so). Sap xep total_spent giam dan, lay 10 dong dau."
        ),
        reference="""
            WITH spend AS (
                SELECT o.customer_id,
                       SUM(i.quantity * i.unit_price * (1 - i.discount)) AS total_spent
                FROM orders o
                JOIN order_items i ON i.order_id = o.order_id
                WHERE o.status = 'paid' AND o.customer_id IS NOT NULL
                GROUP BY o.customer_id
            )
            SELECT customer_id, ROUND(total_spent, 2) AS total_spent
            FROM spend
            WHERE total_spent > (SELECT AVG(total_spent) FROM spend)
            ORDER BY total_spent DESC
            LIMIT 10
        """,
        hint="CTE tinh tong theo khach, roi so voi AVG lay tu chinh CTE do.",
        ordered=True,
        tags=("cte", "subquery"),
    ),
    Question(
        id="q08",
        week="W8",
        level="Medium",
        prompt=(
            "Doanh thu theo thang (don 'paid'). Cot: month (kieu DATE, dau thang), "
            "revenue (lam tron 2 so). Sap xep theo month tang dan."
        ),
        reference="""
            SELECT DATE_TRUNC('month', o.order_date)::DATE AS month,
                   ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS revenue
            FROM orders o
            JOIN order_items i ON i.order_id = o.order_id
            WHERE o.status = 'paid'
            GROUP BY 1
            ORDER BY 1
        """,
        hint="DATE_TRUNC('month', col) gom ve dau thang.",
        ordered=True,
        tags=("date",),
    ),
    Question(
        id="q09",
        week="W7",
        level="Hard",
        prompt=(
            "Doanh thu theo thang kem DOANH THU LUY KE tu dau nam (running total). "
            "Cot: month, revenue, running_total (deu lam tron 2 so). Sap xep month tang dan."
        ),
        reference="""
            WITH m AS (
                SELECT DATE_TRUNC('month', o.order_date)::DATE AS month,
                       SUM(i.quantity * i.unit_price * (1 - i.discount)) AS revenue
                FROM orders o
                JOIN order_items i ON i.order_id = o.order_id
                WHERE o.status = 'paid'
                GROUP BY 1
            )
            SELECT month,
                   ROUND(revenue, 2) AS revenue,
                   ROUND(SUM(revenue) OVER (ORDER BY month), 2) AS running_total
            FROM m
            ORDER BY month
        """,
        hint="SUM(x) OVER (ORDER BY month) — co ORDER BY trong OVER moi ra luy ke.",
        ordered=True,
        tags=("window", "running total"),
    ),
    Question(
        id="q10",
        week="W7",
        level="Hard",
        prompt=(
            "Doanh thu theo thang kem % tang truong so thang truoc (MoM). "
            "Cot: month, revenue (lam tron 2), mom_pct (lam tron 2, don vi %, thang dau tien de NULL). "
            "Sap xep month tang dan."
        ),
        reference="""
            WITH m AS (
                SELECT DATE_TRUNC('month', o.order_date)::DATE AS month,
                       SUM(i.quantity * i.unit_price * (1 - i.discount)) AS revenue
                FROM orders o
                JOIN order_items i ON i.order_id = o.order_id
                WHERE o.status = 'paid'
                GROUP BY 1
            )
            SELECT month,
                   ROUND(revenue, 2) AS revenue,
                   ROUND((revenue - LAG(revenue) OVER (ORDER BY month))
                         * 100.0 / LAG(revenue) OVER (ORDER BY month), 2) AS mom_pct
            FROM m
            ORDER BY month
        """,
        hint="LAG(revenue) OVER (ORDER BY month). Nho nhan 100.0 de ra %, va ep kieu tranh chia nguyen.",
        ordered=True,
        tags=("window", "lag"),
    ),
    Question(
        id="q11",
        week="W7",
        level="Hard",
        prompt=(
            "TOP 3 san pham doanh thu cao nhat TRONG MOI category (don 'paid'). "
            "Cot: category, product_id, revenue (lam tron 2), rn (thu hang 1..3). "
            "Sap xep category tang dan roi rn tang dan."
        ),
        reference="""
            WITH p AS (
                SELECT pr.category, pr.product_id,
                       SUM(i.quantity * i.unit_price * (1 - i.discount)) AS revenue
                FROM order_items i
                JOIN orders o   ON o.order_id = i.order_id
                JOIN products pr ON pr.product_id = i.product_id
                WHERE o.status = 'paid'
                GROUP BY 1, 2
            ), ranked AS (
                SELECT category, product_id, revenue,
                       ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) AS rn
                FROM p
            )
            SELECT category, product_id, ROUND(revenue, 2) AS revenue, rn
            FROM ranked
            WHERE rn <= 3
            ORDER BY category, rn
        """,
        hint=(
            "Dang kinh dien 'top N moi nhom': ROW_NUMBER() OVER (PARTITION BY ...) trong CTE, "
            "loc rn <= 3 o tang ngoai. Khong loc duoc window function trong WHERE cung tang."
        ),
        ordered=True,
        tags=("window", "top-n-per-group"),
    ),
    Question(
        id="q12",
        week="W8",
        level="Medium",
        prompt=(
            "Pivot ngang: voi moi category, tinh doanh thu quy 1 va quy 2 (don 'paid'). "
            "Cot: category, q1_revenue, q2_revenue (lam tron 2, khong co du lieu thi 0). "
            "Sap xep category tang dan."
        ),
        reference="""
            SELECT pr.category,
                   ROUND(COALESCE(SUM(CASE WHEN QUARTER(o.order_date) = 1
                        THEN i.quantity * i.unit_price * (1 - i.discount) END), 0), 2) AS q1_revenue,
                   ROUND(COALESCE(SUM(CASE WHEN QUARTER(o.order_date) = 2
                        THEN i.quantity * i.unit_price * (1 - i.discount) END), 0), 2) AS q2_revenue
            FROM order_items i
            JOIN orders o    ON o.order_id = i.order_id
            JOIN products pr ON pr.product_id = i.product_id
            WHERE o.status = 'paid'
            GROUP BY 1
            ORDER BY 1
        """,
        hint="SUM(CASE WHEN dieu_kien THEN gia_tri END) — pivot bang CASE WHEN.",
        ordered=True,
        tags=("case when", "pivot"),
    ),
    Question(
        id="q13",
        week="W9",
        level="Hard",
        prompt=(
            "PHEU: dem so user DUY NHAT o moi buoc trong bang events. "
            "Cot: event_type, n_users, pct_of_view (ty le % so voi buoc 'view', lam tron 2). "
            "Sap xep n_users giam dan."
        ),
        reference="""
            WITH s AS (
                SELECT event_type, COUNT(DISTINCT user_id) AS n_users
                FROM events
                GROUP BY event_type
            )
            SELECT event_type, n_users,
                   ROUND(n_users * 100.0
                         / (SELECT n_users FROM s WHERE event_type = 'view'), 2) AS pct_of_view
            FROM s
            ORDER BY n_users DESC
        """,
        hint=(
            "COUNT(DISTINCT user_id), khong phai COUNT(*). Mau so lay tu subquery buoc dau. "
            "Nhan 100.0 de tranh chia nguyen."
        ),
        ordered=True,
        tags=("funnel", "count distinct"),
    ),
    Question(
        id="q14",
        week="W9",
        level="Hard",
        prompt=(
            "Ty le chuyen doi theo device: so user co 'purchase' chia so user co 'view'. "
            "Cot: device, viewers, buyers, cvr_pct (lam tron 2). Sap xep cvr_pct giam dan."
        ),
        reference="""
            SELECT device,
                   COUNT(DISTINCT CASE WHEN event_type = 'view' THEN user_id END) AS viewers,
                   COUNT(DISTINCT CASE WHEN event_type = 'purchase' THEN user_id END) AS buyers,
                   ROUND(
                     COUNT(DISTINCT CASE WHEN event_type = 'purchase' THEN user_id END) * 100.0
                     / NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'view' THEN user_id END), 0),
                   2) AS cvr_pct
            FROM events
            GROUP BY device
            ORDER BY cvr_pct DESC
        """,
        hint="COUNT(DISTINCT CASE WHEN ... THEN user_id END) + NULLIF de tranh chia 0.",
        ordered=True,
        tags=("funnel", "nullif"),
    ),
    Question(
        id="q15",
        week="W9",
        level="Hard",
        prompt=(
            "RFM rut gon: voi moi khach co don 'paid', tinh recency_days (so ngay tu don gan nhat "
            "den 2024-12-31), frequency (so don duy nhat), monetary (tong chi, lam tron 2). "
            "Cot: customer_id, recency_days, frequency, monetary. "
            "Sap xep monetary giam dan, lay 15 dong dau."
        ),
        reference="""
            SELECT o.customer_id,
                   DATE '2024-12-31' - MAX(o.order_date) AS recency_days,
                   COUNT(DISTINCT o.order_id) AS frequency,
                   ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS monetary
            FROM orders o
            JOIN order_items i ON i.order_id = o.order_id
            WHERE o.status = 'paid' AND o.customer_id IS NOT NULL
            GROUP BY o.customer_id
            ORDER BY monetary DESC
            LIMIT 15
        """,
        hint=(
            "frequency phai dung COUNT(DISTINCT order_id) — vi da JOIN order_items nen 1 don "
            "xuat hien nhieu dong (fan-out)."
        ),
        ordered=True,
        tags=("rfm", "fan-out"),
    ),
]


def get(qid: str) -> Question:
    for q in QUESTIONS:
        if q.id == qid:
            return q
    raise KeyError(qid)
