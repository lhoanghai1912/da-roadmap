import type { QuizQuestion } from '@site/src/components/Quiz/types';

export const stage3Quiz: QuizQuestion[] = [
  {
    id: 's3q1',
    question: 'Trong BI tool, đâu là Dimension và đâu là Metric?',
    choices: [
      { id: 'a', text: 'Dimension = số đo được cộng lại; Metric = nhãn phân loại' },
      { id: 'b', text: 'Dimension trả lời "chia theo cái gì" (region, tháng); Metric trả lời "đo cái gì" (doanh thu, số đơn)' },
      { id: 'c', text: 'Dimension luôn là kiểu số' },
      { id: 'd', text: 'Metric luôn là kiểu text' },
    ],
    correct: ['b'],
    explain:
      'Một trường số như discount có thể đóng cả hai vai: metric (discount trung bình) hoặc dimension (nhóm theo mức discount). Vai trò do cách dùng quyết định, không do kiểu dữ liệu.',
  },
  {
    id: 's3q2',
    question: 'Trong star schema, bảng nào là fact table?',
    choices: [
      { id: 'a', text: 'Bảng products chứa tên, danh mục, giá niêm yết' },
      { id: 'b', text: 'Bảng orders chứa số tiền, số lượng và các khóa ngoại tới customer/product/date' },
      { id: 'c', text: 'Bảng calendar chứa ngày, tuần, quý' },
      { id: 'd', text: 'Bảng customers chứa tên, địa chỉ' },
    ],
    correct: ['b'],
    explain:
      'Fact table = bảng sự kiện: nhiều dòng, chứa số đo (measure) và khóa ngoại tới các dimension. Dimension table = bảng mô tả: ít dòng, chứa thuộc tính. Việc đầu tiên khi thiết kế fact table là chốt grain.',
  },
  {
    id: 's3q3',
    question: 'Vì sao nên có bảng date dimension riêng thay vì chỉ dùng cột ngày?',
    multi: true,
    choices: [
      { id: 'a', text: 'Để có sẵn tuần/quý/ngày lễ mà không phải viết lại logic ở mọi query' },
      { id: 'b', text: 'Để tháng không có giao dịch vẫn xuất hiện trên biểu đồ' },
      { id: 'c', text: 'Để làm dữ liệu nhẹ hơn' },
      { id: 'd', text: 'Để tính so sánh cùng kỳ năm trước dễ dàng' },
    ],
    correct: ['a', 'b', 'd'],
    explain:
      'Date dimension giúp chuẩn hóa logic thời gian và đảm bảo tính liên tục của trục thời gian. Nó không làm dữ liệu nhẹ hơn — thậm chí thêm một bảng nữa, nhưng đổi lại tính nhất quán.',
  },
  {
    id: 's3q4',
    question: 'Nên đặt phép tính nặng (join nhiều bảng, tính cohort) ở đâu?',
    choices: [
      { id: 'a', text: 'Trong calculated field của BI tool' },
      { id: 'b', text: 'Ở tầng SQL / data model, BI tool chỉ hiển thị dữ liệu đã chuẩn bị' },
      { id: 'c', text: 'Trong Excel rồi copy sang' },
      { id: 'd', text: 'Trong công thức của từng chart' },
    ],
    correct: ['b'],
    explain:
      'Đẩy logic về tầng SQL giúp dashboard nhanh, dễ kiểm thử, và tái sử dụng cho nhiều báo cáo. Đây cũng là khác biệt giữa "người kéo thả chart" và analyst.',
  },
  {
    id: 's3q5',
    question: 'Một scorecard hiển thị "Doanh thu: 1.2 tỷ". Thiếu điều gì quan trọng nhất?',
    choices: [
      { id: 'a', text: 'Màu sắc đẹp hơn' },
      { id: 'b', text: 'Mốc so sánh — % so kỳ trước hoặc so target' },
      { id: 'c', text: 'Biểu tượng icon' },
      { id: 'd', text: 'Font chữ lớn hơn' },
    ],
    correct: ['b'],
    explain:
      'Một con số đứng một mình không cho biết tốt hay xấu. 1.2 tỷ là thành công nếu tháng trước 1 tỷ, là báo động nếu tháng trước 2 tỷ. Mọi số trên dashboard phải có mốc so sánh.',
  },
  {
    id: 's3q6',
    question: 'Nguyên tắc nào KHÔNG đúng khi thiết kế dashboard?',
    choices: [
      { id: 'a', text: 'Đặt số quan trọng nhất ở góc trên bên trái' },
      { id: 'b', text: 'Nhồi càng nhiều chart càng tốt để thể hiện sự đầy đủ' },
      { id: 'c', text: 'Tiêu đề chart nên là một kết luận' },
      { id: 'd', text: 'Dùng xám cho nền, một màu nhấn cho thứ cần chú ý' },
    ],
    correct: ['b'],
    explain:
      'Tối đa 5–7 chart mỗi trang; nhiều hơn thì tách trang. Dashboard nhiều chart thường là dấu hiệu chưa xác định rõ câu hỏi chính. 1 dashboard = 1 câu hỏi chính.',
  },
  {
    id: 's3q7',
    question: 'Vì sao lộ trình này dùng Looker Studio + Metabase thay vì Power BI?',
    choices: [
      { id: 'a', text: 'Power BI kém hơn về tính năng' },
      { id: 'b', text: 'Power BI Desktop không chạy native trên macOS' },
      { id: 'c', text: 'Power BI tốn phí bản quyền' },
      { id: 'd', text: 'Thị trường VN không dùng Power BI' },
    ],
    correct: ['b'],
    explain:
      'Đây là ràng buộc hệ điều hành, không phải đánh giá chất lượng. Power BI vẫn là chuẩn ở banking/enterprise VN — nếu nhắm nhóm này, học bổ sung qua Parallels/VM sau W16 và cân nhắc cert PL-300.',
  },
  {
    id: 's3q8',
    question: 'Trong Metabase, "Model" khác "Question" ở điểm nào?',
    choices: [
      { id: 'a', text: 'Model là biểu đồ, Question là bảng' },
      { id: 'b', text: 'Model là dataset đã được curated để người khác xây câu hỏi lên trên; Question là một truy vấn/biểu đồ cụ thể' },
      { id: 'c', text: 'Không khác gì nhau' },
      { id: 'd', text: 'Model chỉ dùng cho machine learning' },
    ],
    correct: ['b'],
    explain:
      'Model đóng vai trò như một bảng ảo đã làm sạch và đặt tên chuẩn — nền tảng cho self-service analytics, giúp người không biết SQL vẫn tự đặt câu hỏi đúng.',
  },
  {
    id: 's3q9',
    question: 'Muốn so sánh doanh thu giữa 12 sub-category. Chart nào tốt nhất?',
    choices: [
      { id: 'a', text: 'Pie chart 12 lát' },
      { id: 'b', text: 'Bar chart ngang, sắp xếp giảm dần' },
      { id: 'c', text: 'Line chart' },
      { id: 'd', text: 'Scatter plot' },
    ],
    correct: ['b'],
    explain:
      'Bar ngang xử lý tốt nhãn dài và cho phép so sánh chính xác độ dài. Mắt người so sánh độ dài tốt hơn nhiều so với so sánh diện tích/góc của pie. Sắp xếp giảm dần giúp đọc thứ hạng ngay.',
  },
  {
    id: 's3q10',
    question: 'README của portfolio dashboard thiếu mục nào thì coi như chưa đạt?',
    choices: [
      { id: 'a', text: 'Danh sách công cụ đã dùng' },
      { id: 'b', text: 'Mục Hạn chế — những gì dữ liệu này không trả lời được' },
      { id: 'c', text: 'Ảnh chụp màn hình' },
      { id: 'd', text: 'Số dòng dữ liệu' },
    ],
    correct: ['b'],
    explain:
      'Nêu được giới hạn của chính phân tích mình làm là dấu hiệu của analyst trưởng thành. Người mới thường trình bày như thể kết quả là chân lý — nhà tuyển dụng nhận ra ngay.',
  },
];
