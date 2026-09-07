import type { QuizQuestion } from '@site/src/components/Quiz/types';

export const stage1Quiz: QuizQuestion[] = [
  {
    id: 's1q1',
    question:
      'Bảng Superstore có grain "1 dòng = 1 sản phẩm trong 1 đơn hàng". Muốn đếm số đơn hàng, dùng cách nào?',
    choices: [
      { id: 'a', text: 'COUNT tất cả các dòng' },
      { id: 'b', text: 'COUNTUNIQUE trên cột Order ID' },
      { id: 'c', text: 'COUNT trên cột Sales' },
      { id: 'd', text: 'SUM cột Quantity' },
    ],
    correct: ['b'],
    explain:
      'Grain là dòng-sản-phẩm nên 1 đơn hàng nhiều sản phẩm sẽ chiếm nhiều dòng. Đếm dòng sẽ thổi phồng số đơn. Phải đếm giá trị duy nhất của Order ID. Đây là lỗi sai grain — âm thầm, không báo lỗi, chỉ ra số sai.',
  },
  {
    id: 's1q2',
    question:
      'Doanh thu mỗi đơn có mean = 230, median = 54. Kết luận nào đúng?',
    choices: [
      { id: 'a', text: 'Dữ liệu bị nhập sai, cần loại bỏ' },
      { id: 'b', text: 'Phân phối lệch phải — vài đơn rất lớn kéo mean lên' },
      { id: 'c', text: 'Phân phối lệch trái' },
      { id: 'd', text: 'Phân phối chuẩn' },
    ],
    correct: ['b'],
    explain:
      'Mean cao hơn median nhiều = lệch phải (right-skewed). Nhiều đơn nhỏ, vài đơn rất lớn. Báo cáo "doanh thu trung bình mỗi đơn = 230" sẽ khiến stakeholder hiểu sai về đơn hàng điển hình — nên dùng median hoặc báo cả hai.',
  },
  {
    id: 's1q3',
    question: 'Cần thể hiện phân phối của một biến số liên tục. Chart nào phù hợp?',
    multi: true,
    choices: [
      { id: 'a', text: 'Histogram' },
      { id: 'b', text: 'Box plot' },
      { id: 'c', text: 'Pie chart' },
      { id: 'd', text: 'Line chart' },
    ],
    correct: ['a', 'b'],
    explain:
      'Histogram cho thấy hình dạng phân phối, box plot cho thấy tứ phân vị và outlier. Pie dùng cho cấu phần trong tổng. Line dùng cho xu hướng theo thời gian.',
  },
  {
    id: 's1q4',
    question: 'Q1 = 17, Q3 = 210. Ngưỡng trên để coi là outlier theo quy tắc IQR là bao nhiêu?',
    choices: [
      { id: 'a', text: '210' },
      { id: 'b', text: '289.5' },
      { id: 'c', text: '499.5' },
      { id: 'd', text: '420' },
    ],
    correct: ['c'],
    explain:
      'IQR = Q3 − Q1 = 210 − 17 = 193. Ngưỡng trên = Q3 + 1.5×IQR = 210 + 289.5 = 499.5. Ngưỡng dưới = Q1 − 1.5×IQR = 17 − 289.5 = −272.5 (âm nên thực tế không có outlier dưới).',
  },
  {
    id: 's1q5',
    question: 'Phát hiện được outlier là các đơn hàng giá trị 15.000$. Nên làm gì?',
    choices: [
      { id: 'a', text: 'Loại ngay vì làm hỏng biểu đồ' },
      { id: 'b', text: 'Kiểm tra xem là lỗi nhập liệu hay đơn B2B thật, rồi mới quyết định và ghi rõ lý do' },
      { id: 'c', text: 'Thay bằng giá trị trung bình' },
      { id: 'd', text: 'Luôn giữ nguyên mọi outlier' },
    ],
    correct: ['b'],
    explain:
      'Không loại outlier chỉ vì nó lớn. Chỉ loại khi chứng minh được là lỗi dữ liệu (ngày 2099, giá âm). Đơn B2B 15.000$ là dữ liệu thật — loại đi là bóp méo thực tế. Mọi quyết định giữ/loại phải ghi rõ lý do trong báo cáo.',
  },
  {
    id: 's1q6',
    question: 'Ô trống trong cột "Ngày giao hàng" nên hiểu thế nào?',
    choices: [
      { id: 'a', text: 'Giống số 0' },
      { id: 'b', text: 'Giống chuỗi rỗng' },
      { id: 'c', text: 'Là NULL — có thể mang thông tin (đơn chưa giao), khác hẳn 0 và chuỗi rỗng' },
      { id: 'd', text: 'Luôn là lỗi dữ liệu cần điền' },
    ],
    correct: ['c'],
    explain:
      'NULL nghĩa là "không có giá trị/không biết", khác 0 (một giá trị số) và khác chuỗi rỗng. Ngày giao thiếu ở đơn chưa giao là thông tin, không phải lỗi. Điền bừa sẽ tạo ra "đơn đã giao" không có thật.',
  },
  {
    id: 's1q7',
    question: 'Doanh thu tháng 3 = 120, tháng 4 = 150. Công thức MoM growth đúng là gì?',
    choices: [
      { id: 'a', text: '(150 − 120) / 150' },
      { id: 'b', text: '(150 − 120) / 120' },
      { id: 'c', text: '150 / 120' },
      { id: 'd', text: '150 − 120' },
    ],
    correct: ['b'],
    explain:
      'Growth = (kỳ này − kỳ trước) / kỳ trước = 30/120 = 25%. Mẫu số luôn là kỳ gốc (kỳ trước). Nhớ bọc IFERROR vì kỳ trước có thể bằng 0.',
  },
  {
    id: 's1q8',
    question:
      'Scatter cho thấy discount tăng thì profit giảm, hệ số tương quan −0.22. Kết luận nào an toàn?',
    choices: [
      { id: 'a', text: 'Giảm giá gây ra lỗ, cần dừng mọi chương trình giảm giá' },
      { id: 'b', text: 'Có tương quan âm yếu; chưa kết luận nhân quả vì có thể do mặt hàng khó bán vốn biên lợi nhuận thấp mới hay bị giảm giá' },
      { id: 'c', text: 'Không có quan hệ nào' },
      { id: 'd', text: 'Profit gây ra discount' },
    ],
    correct: ['b'],
    explain:
      'Correlation ≠ causation. Biến ẩn (confounder) ở đây có thể là "loại mặt hàng": hàng khó bán vừa biên lợi nhuận thấp vừa hay bị giảm giá. Muốn kết luận nhân quả cần thí nghiệm ngẫu nhiên.',
  },
  {
    id: 's1q9',
    question: 'Lỗi thiết kế chart nào dưới đây làm người xem hiểu sai mức độ khác biệt?',
    multi: true,
    choices: [
      { id: 'a', text: 'Bar chart có trục Y không bắt đầu từ 0' },
      { id: 'b', text: 'Pie chart với 8 lát' },
      { id: 'c', text: 'Bar chart sắp xếp giảm dần theo giá trị' },
      { id: 'd', text: 'Hai trục Y khác thang đo mà không ghi rõ' },
    ],
    correct: ['a', 'b', 'd'],
    explain:
      'Bar cắt trục Y phóng đại khác biệt. Pie nhiều hơn 5 lát khó so sánh. Hai trục Y khác thang tạo ảo giác về mối quan hệ. Sắp xếp giảm dần lại là thực hành tốt.',
  },
  {
    id: 's1q10',
    question: 'Tiêu đề chart nào tốt hơn cho báo cáo gửi lãnh đạo?',
    choices: [
      { id: 'a', text: '"Doanh thu theo miền"' },
      { id: 'b', text: '"Biểu đồ 3"' },
      { id: 'c', text: '"Doanh thu miền Tây giảm 3 tháng liên tiếp, −12% so cùng kỳ"' },
      { id: 'd', text: '"Dữ liệu bán hàng"' },
    ],
    correct: ['c'],
    explain:
      'Tiêu đề nên là kết luận, không phải nhãn trung tính. Người đọc lướt qua chart chỉ đọc tiêu đề — hãy để tiêu đề nói điều bạn muốn họ nhớ, kèm số cụ thể.',
  },
];
