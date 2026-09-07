-- q11 [W7] [Hard]
-- TOP 3 san pham doanh thu cao nhat TRONG MOI category (don 'paid'). Cot: category, product_id, revenue (lam tron 2), rn (thu hang 1..3). Sap xep category tang dan roi rn tang dan.
-- Goi y: Dang kinh dien 'top N moi nhom': ROW_NUMBER() OVER (PARTITION BY ...) trong CTE, loc rn <= 3 o tang ngoai. Khong loc duoc window function trong WHERE cung tang.

