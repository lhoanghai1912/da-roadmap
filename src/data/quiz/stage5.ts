import type { QuizQuestion } from '@site/src/components/Quiz/types';

export const stage5Quiz: QuizQuestion[] = [
  {
    id: 's5q1',
    question: 'p-value = 0.03 nghĩa là gì?',
    choices: [
      { id: 'a', text: 'Có 3% xác suất H0 đúng' },
      { id: 'b', text: 'Nếu H0 đúng, xác suất quan sát được kết quả này hoặc cực đoan hơn là 3%' },
      { id: 'c', text: 'Có 97% xác suất phiên bản mới tốt hơn' },
      { id: 'd', text: 'Hiệu ứng lớn 3%' },
    ],
    correct: ['b'],
    explain:
      'p-value là xác suất của DỮ LIỆU với giả định H0 đúng — không phải xác suất của giả thuyết. Nó cũng không nói gì về độ lớn hiệu ứng: p = 0.03 với lift 0.01% là có ý nghĩa thống kê nhưng vô nghĩa với kinh doanh.',
  },
  {
    id: 's5q2',
    question: 'Khoảng tin cậy 95% cho chênh lệch conversion là [−0.4%, +4.6%]. Kết luận nào đúng?',
    choices: [
      { id: 'a', text: 'Chắc chắn phiên bản B tốt hơn' },
      { id: 'b', text: 'Khoảng chứa 0 nên chưa đủ bằng chứng kết luận có khác biệt; hiệu ứng thật có thể là giảm nhẹ hoặc tăng tới ~4.6%' },
      { id: 'c', text: 'Có 95% xác suất giá trị thật nằm trong khoảng này' },
      { id: 'd', text: 'Hai phiên bản chắc chắn như nhau' },
    ],
    correct: ['b'],
    explain:
      'Khoảng chứa 0 = chưa có ý nghĩa thống kê. Đáp án (c) là cách diễn giải sai rất phổ biến: diễn giải đúng là "nếu lặp lại lấy mẫu nhiều lần, khoảng tính theo cách này chứa giá trị thật khoảng 95% số lần".',
  },
  {
    id: 's5q3',
    question: 'Kết quả test cho p = 0.4. Kết luận nào đúng?',
    choices: [
      { id: 'a', text: 'Hai nhóm như nhau, chứng minh xong' },
      { id: 'b', text: 'Chưa đủ bằng chứng để kết luận có khác biệt — có thể do thiếu power (mẫu nhỏ)' },
      { id: 'c', text: 'Test bị lỗi' },
      { id: 'd', text: 'Phải chạy thêm tới khi p < 0.05' },
    ],
    correct: ['b'],
    explain:
      '"Không bác bỏ được H0" khác "chứng minh H0 đúng". Vắng bằng chứng không phải bằng chứng về sự vắng mặt. Và đáp án (d) chính là peeking — chạy thêm tới khi có kết quả đẹp là p-hacking.',
  },
  {
    id: 's5q4',
    question: 'Lỗi loại I (Type I error) là gì?',
    choices: [
      { id: 'a', text: 'Bỏ lỡ khác biệt thật sự có' },
      { id: 'b', text: 'Kết luận có khác biệt trong khi thực tế không có (báo động giả)' },
      { id: 'c', text: 'Chọn sai loại test' },
      { id: 'd', text: 'Cỡ mẫu quá nhỏ' },
    ],
    correct: ['b'],
    explain:
      'Type I = false positive, kiểm soát bằng alpha (thường 0.05). Type II = false negative (bỏ lỡ), kiểm soát bằng power (thường 0.8). Cỡ mẫu nhỏ làm tăng Type II.',
  },
  {
    id: 's5q5',
    question: 'Muốn phát hiện được hiệu ứng nhỏ hơn (MDE giảm một nửa) thì cỡ mẫu cần thay đổi thế nào?',
    choices: [
      { id: 'a', text: 'Giảm một nửa' },
      { id: 'b', text: 'Không đổi' },
      { id: 'c', text: 'Tăng khoảng gấp đôi' },
      { id: 'd', text: 'Tăng khoảng gấp 4 lần' },
    ],
    correct: ['d'],
    explain:
      'Cỡ mẫu tỷ lệ nghịch với bình phương của effect size. Muốn nhìn thấy khác biệt nhỏ hơn 2 lần thì cần khoảng 4 lần số mẫu. Đây là lý do các test tìm hiệu ứng nhỏ cần lưu lượng rất lớn.',
  },
  {
    id: 's5q6',
    question: 'Vì sao "peeking" (nhìn kết quả liên tục rồi dừng khi p < 0.05) nguy hiểm?',
    choices: [
      { id: 'a', text: 'Làm test chạy chậm' },
      { id: 'b', text: 'Tỷ lệ báo động giả cao hơn nhiều so với mức alpha đã đặt' },
      { id: 'c', text: 'Làm hỏng dữ liệu' },
      { id: 'd', text: 'Không có vấn đề gì' },
    ],
    correct: ['b'],
    explain:
      'Kiểm tra 1 lần ở cuối thì false positive là 5%. Kiểm tra mỗi ngày và dừng ngay khi thấy p < 0.05 thì tỷ lệ đó cao hơn nhiều lần. Cách phòng: chốt cỡ mẫu và ngày dừng TRƯỚC khi chạy. Đây chính là câu phỏng vấn "khi nào dừng test?".',
  },
  {
    id: 's5q7',
    question: 'So sánh tỷ lệ chuyển đổi (mua/không mua) giữa 2 nhóm. Test nào phù hợp?',
    multi: true,
    choices: [
      { id: 'a', text: 'Z-test cho tỷ lệ' },
      { id: 'b', text: 'Chi-square' },
      { id: 'c', text: 'ANOVA' },
      { id: 'd', text: 'Paired t-test' },
    ],
    correct: ['a', 'b'],
    explain:
      'Conversion là dữ liệu nhị phân → dùng z-test tỷ lệ hoặc chi-square. ANOVA dùng so trung bình 3+ nhóm số liên tục. Paired t-test dùng khi cùng đối tượng đo 2 lần — không phải trường hợp A/B test giữa 2 nhóm độc lập.',
  },
  {
    id: 's5q8',
    question: 'Chạy A/B test 50/50 nhưng dữ liệu cho thấy nhóm A có 52.000 user, nhóm B có 46.000. Nên làm gì?',
    choices: [
      { id: 'a', text: 'Bỏ qua, chênh lệch nhỏ' },
      { id: 'b', text: 'Đây là Sample Ratio Mismatch — dừng lại, điều tra lỗi phân bổ trước khi đọc bất kỳ kết quả nào' },
      { id: 'c', text: 'Lấy ngẫu nhiên bớt user nhóm A cho bằng nhau' },
      { id: 'd', text: 'Tăng alpha lên 0.1' },
    ],
    correct: ['b'],
    explain:
      'SRM là dấu hiệu hệ thống phân bổ có lỗi (bot, cache, tracking hỏng). Nếu việc phân nhóm đã sai thì mọi kết luận đều không tin được — sanity check phải làm TRƯỚC khi nhìn metric.',
  },
  {
    id: 's5q9',
    question: 'Test 20 metric cùng lúc ở alpha = 0.05, không hiệu chỉnh gì. Điều gì xảy ra?',
    choices: [
      { id: 'a', text: 'Không sao cả' },
      { id: 'b', text: 'Trung bình sẽ có khoảng 1 metric "có ý nghĩa" thuần do ngẫu nhiên' },
      { id: 'c', text: 'Tất cả metric đều sai' },
      { id: 'd', text: 'p-value tự động được điều chỉnh' },
    ],
    correct: ['b'],
    explain:
      'Multiple comparison problem: 20 × 5% = 1 kỳ vọng báo động giả. Cách phòng: chốt 1 primary metric trước khi chạy, hoặc hiệu chỉnh Bonferroni/FDR khi buộc phải test nhiều.',
  },
  {
    id: 's5q10',
    question: 'Guardrail metric trong A/B test dùng để làm gì?',
    choices: [
      { id: 'a', text: 'Thay thế primary metric khi primary không có ý nghĩa' },
      { id: 'b', text: 'Đảm bảo thay đổi không làm xấu đi những thứ quan trọng khác (tốc độ tải, tỷ lệ lỗi, churn)' },
      { id: 'c', text: 'Tăng power của test' },
      { id: 'd', text: 'Giảm cỡ mẫu cần thiết' },
    ],
    correct: ['b'],
    explain:
      'Một thay đổi có thể tăng conversion nhưng tăng churn hoặc làm chậm trang. Guardrail phải được định nghĩa từ đầu, nếu không sẽ triển khai một "chiến thắng" thực chất gây hại.',
  },
  {
    id: 's5q11',
    question: 'Anscombe quartet dạy điều gì?',
    choices: [
      { id: 'a', text: 'Bốn dataset có cùng thống kê mô tả và hệ số tương quan nhưng hình dạng hoàn toàn khác — luôn vẽ chart trước khi tin vào con số' },
      { id: 'b', text: 'Tương quan luôn đáng tin' },
      { id: 'c', text: 'Nên dùng 4 biến trong mọi mô hình' },
      { id: 'd', text: 'Outlier luôn phải loại bỏ' },
    ],
    correct: ['a'],
    explain:
      'Hệ số tương quan chỉ đo quan hệ tuyến tính. Quan hệ cong, outlier đơn lẻ, hay dữ liệu phân cụm đều có thể cho ra cùng một hệ số r. Vẽ trước, tính sau.',
  },
  {
    id: 's5q12',
    question: 'Định lý giới hạn trung tâm (CLT) nói gì?',
    choices: [
      { id: 'a', text: 'Mọi dữ liệu đều có phân phối chuẩn' },
      { id: 'b', text: 'Phân phối của TRUNG BÌNH MẪU tiệm cận phân phối chuẩn khi cỡ mẫu đủ lớn, kể cả khi tổng thể lệch' },
      { id: 'c', text: 'Mẫu lớn thì không cần kiểm định' },
      { id: 'd', text: 'Trung bình luôn bằng trung vị' },
    ],
    correct: ['b'],
    explain:
      'Đây là nền tảng cho phép dùng t-test/z-test trên dữ liệu doanh thu lệch phải. Chú ý: CLT nói về phân phối của trung bình mẫu, không phải phân phối của dữ liệu gốc.',
  },
];
