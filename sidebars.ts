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
  ],
};

export default sidebars;
