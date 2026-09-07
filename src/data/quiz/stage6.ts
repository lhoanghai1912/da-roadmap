import type { QuizQuestion } from '@site/src/components/Quiz/types';

export const stage6Quiz: QuizQuestion[] = [
  {
    id: 's6q1',
    question: 'Người phỏng vấn ra đề: "Conversion rate giảm 15% tuần này, bạn làm gì?". Bước ĐẦU TIÊN nên là gì?',
    choices: [
      { id: 'a', text: 'Viết ngay query phân tích' },
      { id: 'b', text: 'Hỏi lại để làm rõ phạm vi và định nghĩa: giảm 15% tuyệt đối hay tương đối, so với kỳ nào, conversion tính theo bước nào' },
      { id: 'c', text: 'Đoán nguyên nhân' },
      { id: 'd', text: 'Đề xuất giải pháp' },
    ],
    correct: ['b'],
    explain:
      'Bước Clarify trong khung 5 bước. Người phỏng vấn cố tình ra đề mơ hồ để xem bạn có hỏi lại không — nhảy thẳng vào giải là mất điểm ngay. Thứ tự: Clarify → Structure → Analyze → Recommend → Measure.',
  },
  {
    id: 's6q2',
    question: 'Doanh thu đột ngột tăng 50% trong 1 ngày. Việc nên làm TRƯỚC TIÊN?',
    choices: [
      { id: 'a', text: 'Báo cáo tin vui cho ban giám đốc' },
      { id: 'b', text: 'Kiểm tra chất lượng dữ liệu: pipeline chạy trùng, đơn test, đơn vị tiền tệ thay đổi' },
      { id: 'c', text: 'Phân tích ngay theo vùng và kênh' },
      { id: 'd', text: 'Dự báo tháng tới dựa trên con số mới' },
    ],
    correct: ['b'],
    explain:
      'Biến động bất thường thường là lỗi dữ liệu trước khi là hiện tượng kinh doanh. Trả lời "kiểm tra data quality trước" là điểm cộng lớn — người mới thường nhảy ngay vào phân tích rồi báo cáo một con số sai.',
  },
  {
    id: 's6q3',
    question: 'Trình bày kết quả cho ban giám đốc. Nên sắp xếp slide thế nào?',
    choices: [
      { id: 'a', text: 'Dẫn dắt từ bối cảnh, phương pháp, rồi kết luận ở slide cuối' },
      { id: 'b', text: 'Kết luận và đề xuất ngay slide 1, chi tiết ở các slide sau' },
      { id: 'c', text: 'Chỉ trình bày biểu đồ, để họ tự kết luận' },
      { id: 'd', text: 'Trình bày toàn bộ query đã dùng' },
    ],
    correct: ['b'],
    explain:
      'Lãnh đạo có thể rời cuộc họp sau 3 phút. Cấu trúc "dẫn dắt rồi mới kết luận" phù hợp bài giảng, không phù hợp báo cáo kinh doanh. Đây là khác biệt lớn nhất giữa cách trình bày của sinh viên và analyst đi làm.',
  },
  {
    id: 's6q4',
    question: 'Gạch đầu dòng nào trong CV mạnh hơn?',
    choices: [
      { id: 'a', text: '"Sử dụng SQL để phân tích dữ liệu và tạo dashboard"' },
      { id: 'b', text: '"Phân tích phễu 12 tháng dữ liệu e-commerce (BigQuery), xác định bước rơi rụng lớn nhất chiếm 38% tổng thất thoát; đề xuất 2 hành động kèm metric đo"' },
      { id: 'c', text: '"Đam mê dữ liệu, ham học hỏi"' },
      { id: 'd', text: '"Thành thạo nhiều công cụ phân tích"' },
    ],
    correct: ['b'],
    explain:
      'Công thức: Hành động + Công cụ + Kết quả có số. Mọi gạch đầu dòng project phải có ít nhất một con số. Câu chung chung không phân biệt được bạn với 200 ứng viên khác.',
  },
  {
    id: 's6q5',
    question: 'Trước khi để repo portfolio thành public, bắt buộc phải làm gì?',
    multi: true,
    choices: [
      { id: 'a', text: 'Rà .gitignore để không commit file dữ liệu' },
      { id: 'b', text: 'Quét lịch sử commit tìm API key, mật khẩu, token' },
      { id: 'c', text: 'Xóa toàn bộ file README' },
      { id: 'd', text: 'Nếu tìm thấy key đã lộ thì phải thu hồi key đó, không chỉ xóa file' },
    ],
    correct: ['a', 'b', 'd'],
    explain:
      'Key đã push lên GitHub public coi như đã lộ, kể cả khi xóa sau vài phút — bot quét liên tục. Xóa file không đủ vì key vẫn nằm trong lịch sử commit; phải viết lại lịch sử VÀ thu hồi key.',
  },
  {
    id: 's6q6',
    question: 'Định nghĩa một metric đầy đủ cần bao nhiêu trường và gồm những gì?',
    choices: [
      { id: 'a', text: 'Chỉ cần tên và công thức' },
      { id: 'b', text: 'Tên · công thức · bảng/cột nguồn · grain · owner' },
      { id: 'c', text: 'Tên · giá trị hiện tại · mục tiêu' },
      { id: 'd', text: 'Tên · biểu đồ · màu sắc' },
    ],
    correct: ['b'],
    explain:
      'Thiếu grain thì hai người tính ra hai số khác nhau mà đều "đúng". Thiếu owner thì không ai chịu trách nhiệm khi số sai. Đây là kỹ năng phân biệt "người viết query" và analyst.',
  },
  {
    id: 's6q7',
    question: 'Kết quả phân tích của bạn mâu thuẫn với trực giác của sếp. Xử lý thế nào?',
    choices: [
      { id: 'a', text: 'Sửa số liệu cho khớp với ý sếp' },
      { id: 'b', text: 'Trình bày phương pháp và dữ liệu, hỏi xem sếp dựa trên thông tin nào, kiểm tra lại giả định của cả hai bên' },
      { id: 'c', text: 'Bỏ qua phân tích, không báo cáo' },
      { id: 'd', text: 'Khẳng định mình đúng vì có số liệu' },
    ],
    correct: ['b'],
    explain:
      'Trực giác của người có kinh nghiệm thường dựa trên thông tin mà dữ liệu chưa nắm bắt được (bối cảnh thị trường, thay đổi nội bộ). Thái độ đúng là tìm hiểu nguồn gốc khác biệt, không phải thắng thua. Nhưng cũng không được sửa số.',
  },
  {
    id: 's6q8',
    question: 'Câu hỏi nào NÊN hỏi ngược nhà tuyển dụng?',
    multi: true,
    choices: [
      { id: 'a', text: 'Team data hiện có bao nhiêu người, cấu trúc thế nào?' },
      { id: 'b', text: 'Yêu cầu phân tích thường đến từ đâu, quy trình ưu tiên ra sao?' },
      { id: 'c', text: 'Sau 6 tháng, thế nào là làm tốt ở vị trí này?' },
      { id: 'd', text: 'Bao giờ thì được tăng lương?' },
    ],
    correct: ['a', 'b', 'c'],
    explain:
      'Câu hỏi tốt cho thấy bạn quan tâm tới cách làm việc thật, không chỉ tới vị trí. Chuyện lương/thưởng để dành cho vòng đàm phán offer, không phải vòng phỏng vấn kỹ thuật.',
  },
  {
    id: 's6q9',
    question: 'Trong 3 tháng đầu đi làm, ưu tiên cao nhất là gì?',
    choices: [
      { id: 'a', text: 'Học thêm công cụ mới như dbt, Airflow' },
      { id: 'b', text: 'Hiểu dữ liệu và nghiệp vụ của công ty, ghi lại mọi định nghĩa metric vì thường không ai viết ra' },
      { id: 'c', text: 'Xây dashboard càng nhiều càng tốt' },
      { id: 'd', text: 'Tối ưu tốc độ query' },
    ],
    correct: ['b'],
    explain:
      'Kiến thức nghiệp vụ và hiểu biết về dữ liệu công ty quan trọng hơn mọi kỹ năng kỹ thuật ở giai đoạn này — đó là thứ không tự học được từ khóa học, và là thứ khiến phân tích của bạn đúng bối cảnh.',
  },
  {
    id: 's6q10',
    question: 'Capstone của bạn dùng query đếm độc lập từng bước phễu (không đảm bảo thứ tự sự kiện). Nên xử lý thế nào trong README?',
    choices: [
      { id: 'a', text: 'Giấu đi, không ai để ý' },
      { id: 'b', text: 'Ghi rõ trong mục Hạn chế rằng phương pháp này có thể đếm cả user nhảy cóc, và nêu cách làm chặt hơn' },
      { id: 'c', text: 'Bỏ luôn phần phễu' },
      { id: 'd', text: 'Ghi là kết quả chính xác tuyệt đối' },
    ],
    correct: ['b'],
    explain:
      'Nêu được giới hạn của chính phương pháp mình dùng là dấu hiệu mạnh nhất của một analyst tốt. Người phỏng vấn thường hỏi xoáy đúng chỗ đó — chủ động nêu trước sẽ chuyển thế bị động thành điểm cộng.',
  },
];
