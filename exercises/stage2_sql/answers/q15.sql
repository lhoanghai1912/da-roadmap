-- q15 [W9] [Hard]
-- RFM rut gon: voi moi khach co don 'paid', tinh recency_days (so ngay tu don gan nhat den 2024-12-31), frequency (so don duy nhat), monetary (tong chi, lam tron 2). Cot: customer_id, recency_days, frequency, monetary. Sap xep monetary giam dan, lay 15 dong dau.
-- Goi y: frequency phai dung COUNT(DISTINCT order_id) — vi da JOIN order_items nen 1 don xuat hien nhieu dong (fan-out).

