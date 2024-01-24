import type { LinguiConfig } from '@lingui/conf';

const config: LinguiConfig = {
  locales: [
    'en',
    'de',
    'pl',
  ],
  catalogs: [
    {
      path: '../po/main/{locale}',
      include: ['../po/main/'],
    },
  ],
};

export default config;