import type { QuizQuestion } from '@site/src/components/Quiz/types';

export const stage4Quiz: QuizQuestion[] = [
  {
    id: 's4q1',
    question: 'Dòng code này báo lỗi. Vì sao?',
    lang: 'python',
    code: `df[df.sales > 100 & df.region == "West"]`,
    choices: [
      { id: 'a', text: 'Phải dùng "and" thay cho "&"' },
      { id: 'b', text: 'Toán tử & có độ ưu tiên cao hơn > và == nên cần bọc ngoặc từng điều kiện' },
      { id: 'c', text: 'df.sales không tồn tại' },
      { id: 'd', text: 'Phải dùng .query()' },
    ],
    correct: ['b'],
    explain:
      'Viết đúng: df[(df.sales > 100) & (df.region == "West")]. Trong pandas dùng & | ~ (không dùng and/or/not vì chúng làm việc trên giá trị bool đơn, không trên Series).',
  },
  {
    id: 's4q2',
    question: 'Muốn thêm cột "tổng doanh thu của cả nhóm" vào TỪNG dòng mà không làm mất dòng nào. Dùng gì?',
    choices: [
      { id: 'a', text: 'df.groupby("g")["x"].agg("sum")' },
      { id: 'b', text: 'df.groupby("g")["x"].transform("sum")' },
      { id: 'c', text: 'df.pivot_table()' },
      { id: 'd', text: 'df.drop_duplicates()' },
    ],
    correct: ['b'],
    explain:
      'agg gộp dòng lại (như GROUP BY), transform giữ nguyên số dòng và gắn kết quả nhóm vào từng dòng (như window function SUM() OVER (PARTITION BY g)). Dùng để tính tỷ trọng %.',
  },
  {
    id: 's4q3',
    question: 'Ghép bảng nào giúp pandas TỰ BÁO LỖI khi quan hệ không đúng như bạn nghĩ?',
    lang: 'python',
    code: `pd.merge(orders, items, on="order_id", validate="one_to_many")`,
    choices: [
      { id: 'a', text: 'Tham số how=' },
      { id: 'b', text: 'Tham số validate=' },
      { id: 'c', text: 'Tham số indicator=' },
      { id: 'd', text: 'Tham số suffixes=' },
    ],
    correct: ['b'],
    explain:
      'validate= là công cụ chống fan-out tốt nhất mà người mới hay bỏ qua. Nếu orders thực ra có order_id trùng, pandas báo lỗi ngay thay vì âm thầm nhân đôi dữ liệu. indicator=True thì hữu ích để xem dòng nào khớp/không khớp.',
  },
  {
    id: 's4q4',
    question: 'Cột "ngày giao hàng" thiếu ở 8% số dòng, toàn bộ là đơn có status = "đang xử lý". Nên xử lý thế nào?',
    choices: [
      { id: 'a', text: 'fillna bằng median của cột' },
      { id: 'b', text: 'fillna bằng 0' },
      { id: 'c', text: 'Giữ NULL — đây là thông tin có ý nghĩa (chưa giao), điền vào sẽ tạo ra "đơn đã giao" không có thật' },
      { id: 'd', text: 'Xóa toàn bộ 8% số dòng' },
    ],
    correct: ['c'],
    explain:
      'Missing không ngẫu nhiên (có hệ thống) thì bản thân việc thiếu đã mang thông tin. Điền median sẽ bóp méo mọi phân tích về thời gian giao hàng. Nếu cần, tạo thêm cột cờ is_delivered.',
  },
  {
    id: 's4q5',
    question: 'SettingWithCopyWarning xuất hiện nghĩa là gì?',
    choices: [
      { id: 'a', text: 'Code sẽ crash' },
      { id: 'b', text: 'Đang gán giá trị lên một lát cắt (view) — thay đổi có thể không ăn vào DataFrame gốc' },
      { id: 'c', text: 'Thiếu bộ nhớ' },
      { id: 'd', text: 'Phiên bản pandas cũ' },
    ],
    correct: ['b'],
    explain:
      'Cảnh báo này rất hay bị bỏ qua và dẫn tới bug âm thầm. Cách tránh: dùng .loc[hàng, cột] = giá_trị, hoặc gọi .copy() khi tạo lát cắt mà bạn định sửa.',
  },
  {
    id: 's4q6',
    question: 'Ghép cặp SQL ↔ Pandas nào SAI?',
    choices: [
      { id: 'a', text: 'GROUP BY ↔ .groupby()' },
      { id: 'b', text: 'JOIN ↔ pd.merge()' },
      { id: 'c', text: 'LAG(x) ↔ .shift(1)' },
      { id: 'd', text: 'COUNT(DISTINCT x) ↔ .count()' },
    ],
    correct: ['d'],
    explain:
      'COUNT(DISTINCT x) tương ứng .nunique(), còn .count() tương ứng COUNT(x) (đếm giá trị không NULL). Nhầm chỗ này làm sai mọi metric có mẫu số là số user duy nhất.',
  },
  {
    id: 's4q7',
    question: 'Vì sao nên hạn chế dùng .apply() cho các phép tính đơn giản?',
    choices: [
      { id: 'a', text: 'Nó không chạy được với số' },
      { id: 'b', text: 'Nó lặp theo từng dòng nên chậm hơn nhiều lần so với phép tính vectorized có sẵn' },
      { id: 'c', text: 'Nó làm mất index' },
      { id: 'd', text: 'Nó chỉ dùng được với chuỗi' },
    ],
    correct: ['b'],
    explain:
      'df["a"] / df["b"] nhanh hơn df.apply(lambda r: r.a / r.b, axis=1) rất nhiều. Chỉ dùng apply khi thật sự không có hàm vectorized tương ứng.',
  },
  {
    id: 's4q8',
    question: 'Notebook nộp cho người khác đọc phải thỏa điều kiện nào?',
    multi: true,
    choices: [
      { id: 'a', text: 'Chạy được từ đầu đến cuối bằng Restart & Run All' },
      { id: 'b', text: 'Mỗi chart có tiêu đề kết luận và nhãn trục có đơn vị' },
      { id: 'c', text: 'Có markdown cell diễn giải giữa các bước' },
      { id: 'd', text: 'Càng nhiều chart càng tốt' },
    ],
    correct: ['a', 'b', 'c'],
    explain:
      'Notebook chạy lộn xộn theo thứ tự thủ công là dấu hiệu người mới — người khác không tái tạo được kết quả. Số lượng chart không phải tiêu chí; 30 chart không kết luận kém hơn 5 chart có insight.',
  },
  {
    id: 's4q9',
    question: 'Việc đầu tiên nên làm khi mở một dataset hoàn toàn mới là gì?',
    multi: true,
    choices: [
      { id: 'a', text: '.info() để xem kiểu dữ liệu và số dòng thiếu' },
      { id: 'b', text: 'Vẽ ngay 10 biểu đồ' },
      { id: 'c', text: '.describe() để xem khoảng giá trị bất thường' },
      { id: 'd', text: 'Kiểm tra grain — 1 dòng đại diện cho cái gì' },
    ],
    correct: ['a', 'c', 'd'],
    explain:
      'Khảo sát cấu trúc trước, vẽ sau. Và quan trọng hơn: viết 3–5 câu hỏi business TRƯỚC khi mở dữ liệu, nếu không sẽ vẽ chart lung tung 3 tiếng mà không ra kết luận nào.',
  },
  {
    id: 's4q10',
    question: 'Trong pipeline làm sạch, vì sao mỗi bước nên in log số dòng trước/sau?',
    choices: [
      { id: 'a', text: 'Để code trông chuyên nghiệp hơn' },
      { id: 'b', text: 'Để biết mình đã loại bao nhiêu dữ liệu và vì sao — nếu mất 40% dòng mà không nhận ra thì mọi kết luận sau đó đều sai' },
      { id: 'c', text: 'Để chạy nhanh hơn' },
      { id: 'd', text: 'Để pandas không báo lỗi' },
    ],
    correct: ['b'],
    explain:
      'Làm sạch dữ liệu là nơi dễ mất dữ liệu âm thầm nhất. Log trước/sau vừa để tự kiểm soát, vừa là bằng chứng minh bạch khi người khác review phân tích của bạn.',
  },
];
