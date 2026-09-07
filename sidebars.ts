import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    'intro',
    'phan-tich-repo',
    {
      type: 'category',
      label: '7 Stage — chi tiết công việc',
      collapsed: false,
      link: { type: 'generated-index', title: '7 Stage', slug: '/stages' },
      items: [
        'stages/stage-0-setup',
        'stages/stage-1-foundation',
        'stages/stage-2-sql',
        'stages/stage-3-bi-dashboard',
        'stages/stage-4-python',
        'stages/stage-5-statistics-abtest',
        'stages/stage-6-capstone-jobprep',
      ],
    },
    {
      type: 'category',
      label: 'Lý thuyết — định nghĩa & ví dụ',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Lý thuyết — định nghĩa & ví dụ',
        description:
          'Stage trả lời "làm gì, tuần nào". Lý thuyết trả lời "cái đó là gì, ví dụ ra sao, tự kiểm tra thế nào". Mỗi khái niệm: định nghĩa → ví dụ đã chạy thật trên dữ liệu → bài tập → đáp án.',
        slug: '/ly-thuyet',
      },
      items: [
        'ly-thuyet/l1-foundation',
        'ly-thuyet/l2-sql',
        'ly-thuyet/l3-bi',
        'ly-thuyet/l4-python',
        'ly-thuyet/l5-stats',
        'ly-thuyet/l6-capstone-interview',
      ],
    },
    'glossary',
    {
      type: 'category',
      label: 'Bài tập & tự chấm',
      collapsed: false,
      link: { type: 'doc', id: 'bai-tap/bai-tap-index' },
      items: [
        'bai-tap/bai-tap-stage-1',
        'bai-tap/bai-tap-stage-2',
        'bai-tap/bai-tap-stage-3',
        'bai-tap/bai-tap-stage-4',
        'bai-tap/bai-tap-stage-5',
        'bai-tap/bai-tap-stage-6',
      ],
    },
  ],
};

export default sidebars;
