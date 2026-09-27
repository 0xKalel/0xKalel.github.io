// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://0xkalel.github.io',
  integrations: [icon(), mdx()],
  // github-dark's gray comments fail WCAG AA (3:1); the default variant's pass at about 6:1.
  markdown: { shikiConfig: { theme: 'github-dark-default' } },
  vite: {
    plugins: [tailwindcss()],
  },
});