import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import compress from 'astro-compress';

import astrowind from './vendor/integration';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://tandemflug-lienz.com',
  output: 'static',

  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en', 'nl'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),

    sitemap({
      i18n: {
        defaultLocale: 'de',
        locales: {
          de: 'de-AT',
          en: 'en',
          nl: 'nl',
        },
      },
    }),

    icon({
      include: {
        tabler: ['*'],
      },
    }),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
