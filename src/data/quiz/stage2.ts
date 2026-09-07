import type { QuizQuestion } from '@site/src/components/Quiz/types';

export const stage2Quiz: QuizQuestion[] = [
  {
    id: 's2q1',
    question: 'Query này trả về gì?',
    lang: 'sql',
    code: `SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.status = 'paid';`,
    choices: [
      { id: 'a', text: 'Tất cả khách, khách chưa mua thì cột id = NULL' },
      { id: 'b', text: 'Chỉ khách có đơn paid — LEFT JOIN bị biến thành INNER JOIN' },
      { id: 'c', text: 'Tất cả khách và tất cả đơn' },
      { id: 'd', text: 'Lỗi cú pháp' },
    ],
    correct: ['b'],
    explain:
      'Điều kiện trên bảng phải đặt ở WHERE sẽ loại hết các dòng NULL do LEFT JOIN sinh ra, biến nó thành INNER JOIN. Muốn giữ, đưa điều kiện vào ON: LEFT JOIN orders o ON c.id = o.customer_id AND o.status = \'paid\'. Đây là câu phỏng vấn kinh điển.',
  },
  {
    id: 's2q2',
    question: 'Bảng orders có 1 dòng/đơn (kèm shipping_fee), order_items có nhiều dòng/đơn. Query sau sai ở đâu?',
    lang: 'sql',
    code: `SELECT SUM(o.shipping_fee)
FROM orders o
JOIN order_items i ON o.id = i.order_id;`,
    choices: [
      { id: 'a', text: 'Thiếu GROUP BY' },
      { id: 'b', text: 'Fan-out: mỗi đơn bị nhân lên theo số sản phẩm nên phí ship bị cộng nhiều lần' },
      { id: 'c', text: 'Không có lỗi' },
      { id: 'd', text: 'Phải dùng LEFT JOIN' },
    ],
    correct: ['b'],
    explain:
      'JOIN 1-nhiều làm nhân bản dòng bên "1". Đơn có 5 sản phẩm sẽ tính phí ship 5 lần. Cách xử lý: gộp order_items trước rồi mới join, hoặc tính shipping_fee ở query riêng. Đây là lỗi làm sai báo cáo doanh thu ngoài đời thật.',
  },
  {
    id: 's2q3',
    question: 'WHERE và HAVING khác nhau thế nào?',
    choices: [
      { id: 'a', text: 'Không khác gì, dùng thay nhau được' },
      { id: 'b', text: 'WHERE lọc từng dòng trước khi gom nhóm; HAVING lọc kết quả sau khi đã gom nhóm' },
      { id: 'c', text: 'HAVING nhanh hơn WHERE' },
      { id: 'd', text: 'WHERE chỉ dùng cho số, HAVING cho text' },
    ],
    correct: ['b'],
    explain:
      'Thứ tự thực thi: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. Không thể dùng WHERE trên kết quả aggregate vì lúc WHERE chạy thì aggregate chưa được tính.',
  },
  {
    id: 's2q4',
    question: 'Cột composer có 500 giá trị NULL trong 3000 dòng. COUNT(composer) trả về bao nhiêu?',
    choices: [
      { id: 'a', text: '3000' },
      { id: 'b', text: '2500' },
      { id: 'c', text: '500' },
      { id: 'd', text: 'NULL' },
    ],
    correct: ['b'],
    explain:
      'COUNT(col) bỏ qua NULL nên trả về 2500. COUNT(*) đếm mọi dòng nên trả về 3000. COUNT(DISTINCT col) đếm số giá trị khác nhau, cũng bỏ NULL. Hiểu sai chỗ này làm sai mẫu số của mọi tỷ lệ.',
  },
  {
    id: 's2q5',
    question: 'Query này trả về rỗng dù bảng có dữ liệu. Vì sao?',
    lang: 'sql',
    code: `SELECT * FROM customers
WHERE id NOT IN (SELECT customer_id FROM orders);`,
    choices: [
      { id: 'a', text: 'Thiếu DISTINCT' },
      { id: 'b', text: 'orders.customer_id có NULL — NOT IN gặp NULL luôn trả về rỗng' },
      { id: 'c', text: 'Phải dùng JOIN' },
      { id: 'd', text: 'Sai cú pháp subquery' },
    ],
    correct: ['b'],
    explain:
      'So sánh với NULL cho kết quả UNKNOWN, và NOT IN với tập chứa NULL không bao giờ trả về TRUE. Dùng NOT EXISTS hoặc thêm WHERE customer_id IS NOT NULL vào subquery.',
  },
  {
    id: 's2q6',
    question: 'Vì sao query này báo lỗi?',
    lang: 'sql',
    code: `SELECT *, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY d DESC) AS rn
FROM orders
WHERE rn = 1;`,
    choices: [
      { id: 'a', text: 'Thiếu GROUP BY' },
      { id: 'b', text: 'Window function được tính sau WHERE nên không lọc được ở WHERE' },
      { id: 'c', text: 'ROW_NUMBER cần đối số' },
      { id: 'd', text: 'PARTITION BY sai cú pháp' },
    ],
    correct: ['b'],
    explain:
      'Theo thứ tự thực thi, WHERE chạy trước SELECT — lúc đó rn chưa tồn tại. Phải bọc vào CTE rồi lọc ở tầng ngoài, hoặc dùng QUALIFY (BigQuery/DuckDB).',
  },
  {
    id: 's2q7',
    question: 'Khác biệt cốt lõi giữa window function và GROUP BY là gì?',
    choices: [
      { id: 'a', text: 'Window function nhanh hơn' },
      { id: 'b', text: 'Window function giữ nguyên số dòng, GROUP BY gộp dòng lại' },
      { id: 'c', text: 'GROUP BY không dùng được với SUM' },
      { id: 'd', text: 'Không khác gì' },
    ],
    correct: ['b'],
    explain:
      'GROUP BY thu gọn nhiều dòng thành 1 dòng/nhóm. Window function tính toán theo nhóm nhưng gắn kết quả vào từng dòng gốc — nhờ đó tính được tỷ trọng, running total, so sánh dòng trước/sau.',
  },
  {
    id: 's2q8',
    question: 'Tính tỷ lệ chuyển đổi, query trả về 0 ở mọi dòng. Nguyên nhân nhiều khả năng nhất?',
    lang: 'sql',
    code: `SELECT COUNT(DISTINCT buyer_id) / COUNT(DISTINCT visitor_id) AS cvr
FROM sessions;`,
    choices: [
      { id: 'a', text: 'Không có buyer nào' },
      { id: 'b', text: 'Chia số nguyên — kết quả bị cắt phần thập phân thành 0' },
      { id: 'c', text: 'Thiếu GROUP BY' },
      { id: 'd', text: 'COUNT DISTINCT không dùng được' },
    ],
    correct: ['b'],
    explain:
      'Nhiều DB chia hai số nguyên trả về số nguyên: 3/4 = 0. Viết COUNT(DISTINCT buyer_id) * 1.0 / NULLIF(COUNT(DISTINCT visitor_id), 0). NULLIF thêm vào để tránh chia cho 0.',
  },
  {
    id: 's2q9',
    question: 'Cần lấy top 3 sản phẩm doanh thu cao nhất trong MỖI danh mục. Cách đúng?',
    choices: [
      { id: 'a', text: 'ORDER BY revenue DESC LIMIT 3' },
      { id: 'b', text: 'GROUP BY category rồi LIMIT 3' },
      { id: 'c', text: 'CTE tính ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC), lọc rn <= 3 ở tầng ngoài' },
      { id: 'd', text: 'DISTINCT TOP 3' },
    ],
    correct: ['c'],
    explain:
      'LIMIT áp cho toàn kết quả, không áp theo nhóm. Bài toán "top N mỗi nhóm" là dạng kinh điển của window function: đánh số trong từng partition rồi lọc.',
  },
  {
    id: 's2q10',
    question: 'Thứ tự thực thi logic đúng của một câu SQL là gì?',
    choices: [
      { id: 'a', text: 'SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY' },
      { id: 'b', text: 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT' },
      { id: 'c', text: 'FROM → SELECT → WHERE → ORDER BY' },
      { id: 'd', text: 'WHERE → FROM → SELECT → GROUP BY' },
    ],
    correct: ['b'],
    explain:
      'Hiểu thứ tự này giải thích được hầu hết lỗi hay gặp: vì sao không dùng alias của SELECT trong WHERE, vì sao không lọc window function ở WHERE, vì sao HAVING mới lọc được aggregate.',
  },
  {
    id: 's2q11',
    question: 'Muốn báo cáo hiện đủ 12 tháng kể cả tháng không có đơn hàng nào. Cách làm?',
    choices: [
      { id: 'a', text: 'Dùng INNER JOIN với bảng orders' },
      { id: 'b', text: 'Tạo bảng lịch đủ 12 tháng rồi LEFT JOIN doanh thu vào, dùng COALESCE để hiện 0' },
      { id: 'c', text: 'Thêm ORDER BY month' },
      { id: 'd', text: 'Dùng GROUP BY month là đủ' },
    ],
    correct: ['b'],
    explain:
      'GROUP BY chỉ sinh ra dòng cho tháng có dữ liệu — tháng 0 đơn sẽ biến mất khỏi biểu đồ, làm người xem hiểu sai xu hướng. Bảng lịch (calendar table) là chuẩn xử lý.',
  },
  {
    id: 's2q12',
    question: 'Trên BigQuery Sandbox (1TB free/tháng), thói quen nào giúp tiết kiệm quota?',
    multi: true,
    choices: [
      { id: 'a', text: 'Chỉ SELECT các cột cần dùng thay vì SELECT *' },
      { id: 'b', text: 'Lọc theo cột partition (thường là ngày)' },
      { id: 'c', text: 'Thêm LIMIT 10 vào cuối query' },
      { id: 'd', text: 'Xem trước bytes scanned trước khi chạy' },
    ],
    correct: ['a', 'b', 'd'],
    explain:
      'BigQuery tính tiền theo lượng dữ liệu quét, phụ thuộc số CỘT đọc chứ không phải số dòng trả về — nên LIMIT không giảm chi phí. Chọn ít cột và lọc partition mới giảm thật.',
  },
];
