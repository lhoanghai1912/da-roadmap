-- q14 [W9] [Hard]
-- Ty le chuyen doi theo device: so user co 'purchase' chia so user co 'view'. Cot: device, viewers, buyers, cvr_pct (lam tron 2). Sap xep cvr_pct giam dan.
-- Goi y: COUNT(DISTINCT CASE WHEN ... THEN user_id END) + NULLIF de tranh chia 0.

