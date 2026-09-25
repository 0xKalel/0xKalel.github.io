// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://0xkalel.github.io',
  integrations: [icon(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});