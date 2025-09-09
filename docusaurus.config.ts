import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'JT-Lib & JT-Trader Documentation',
  tagline: 'JavaScript Trading Libraries Documentation',
  favicon: 'img/favicon.ico',

  // To match the URL structure on GitHub Pages
  deploymentBranch: 'main',
  trailingSlash: true,

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://jt-lab-com.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/jt-lab-docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'jt-lab-com', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/jt-lab-com/docs/tree/main/docs/',
          // Disable external plugins - use built-in capabilities
          // remarkPlugins: [
          //   require('remark-images'),
          //   require('remark-gfm'),
          // ],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'JT-Lib',
      logo: {
        alt: 'JT-Lib Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/jt-lab-com/jt-trader',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
            label: 'System Installation',
              to: '/docs/installation/',
            },
            
            {
              label: 'JT-Lib',
              to: '/jt-lib/introduction-architecture',
            },
            {
              label: 'JT-Trader',
              to: '/jt-trader/getting-started',
            },
            {
              label: 'Triggers',
              to: '/jt-lib/triggers-system',
            },
          ],
        },
        {
          title: 'JT-Lab',
          items: [
            {
              label: 'Official Website',
              href: 'https://jt-lab.com',
            },
            {
              label: 'JT-Trader GitHub',
              href: 'https://github.com/jt-lab-com/jt-trader',
            },
            {
              label: 'JT-Lib GitHub',
              href: 'https://github.com/jt-lab-com/jt-lib',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Docs',
              href: 'https://github.com/jt-lab-com/docs',
            },
            {
              label: 'Issues',
              href: 'https://github.com/jt-lab-com/docs/issues',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} JT-Lib. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
