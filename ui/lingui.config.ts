import type { LinguiConfig } from '@lingui/conf';
import { readdirSync } from 'fs';

const PO_DIR = '../po/main';

// Get list of supported locales from po/main
const locales = readdirSync(PO_DIR)
    .filter(file => file.endsWith('.po'))
    // Drop the file extension
    .map(file => file.slice(0, -3));

const config: LinguiConfig = {
  // Available locales must be listed here for the Vite plugin to be able to compile their po into a
  // JSON object that can by dynamically fetched.
  locales: locales,
  catalogs: [
    {
      path: `${PO_DIR}/{locale}`,
      include: [PO_DIR],
    },
  ],
};

export default config;