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
