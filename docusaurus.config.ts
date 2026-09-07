import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { themes as prismThemes } from 'prism-react-renderer';

const GITHUB_USER = 'lhoanghai1912';
const REPO_NAME = 'da-roadmap';

const config: Config = {
  title: 'DA Roadmap',
  tagline: 'Lộ trình học Data Analyst từ số 0 — 24 tuần',
  favicon: 'img/favicon.svg',

  url: `https://${GITHUB_USER}.github.io`,
  baseUrl: `/${REPO_NAME}/`,
  organizationName: GITHUB_USER,
  projectName: REPO_NAME,
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'vi',
    locales: ['vi'],
  },

  markdown: {
    mermaid: true,
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en', 'vi'],
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: `https://github.com/${GITHUB_USER}/${REPO_NAME}/tree/main/`,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: { hideable: true, autoCollapseCategories: false },
    },
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
    navbar: {
      title: 'DA Roadmap',
      logo: { alt: 'DA Roadmap', src: 'img/favicon.svg' },
      items: [
        { type: 'docSidebar', sidebarId: 'mainSidebar', position: 'left', label: 'Lộ trình' },
        { to: '/phan-tich-repo', label: 'Phân tích repo gốc', position: 'left' },
        {
          href: `https://github.com/${GITHUB_USER}/${REPO_NAME}`,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Lộ trình',
          items: [
            { label: 'Tổng quan', to: '/' },
            { label: 'Stage 0 — Setup', to: '/stages/stage-0-setup' },
            { label: 'Stage 2 — SQL', to: '/stages/stage-2-sql' },
            { label: 'Stage 6 — Capstone', to: '/stages/stage-6-capstone-jobprep' },
          ],
        },
        {
          title: 'Nguồn tham khảo',
          items: [
            {
              label: 'Repo gốc: data-road-map-by-roles',
              href: 'https://github.com/tunguyenn99/data-road-map-by-roles',
            },
            { label: 'LeetCode Database', href: 'https://leetcode.com/problemset/database/' },
            { label: 'StrataScratch', href: 'https://www.stratascratch.com' },
            { label: 'Mode SQL Tutorial', href: 'https://mode.com/sql-tutorial/' },
          ],
        },
        {
          title: 'Khác',
          items: [
            { label: 'GitHub', href: `https://github.com/${GITHUB_USER}/${REPO_NAME}` },
            { label: 'Tracker CSV', href: `https://github.com/${GITHUB_USER}/${REPO_NAME}/blob/main/static/tracker.csv` },
          ],
        },
      ],
      copyright: `DA Roadmap · Xây dựng ${new Date().getFullYear()} · Nội dung dựa trên phân tích repo data-road-map-by-roles`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['sql', 'python', 'bash', 'json', 'docker'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
