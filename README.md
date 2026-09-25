# Khalil Hebachi, portfolio and CV

Astro static site. Deployed to GitHub Pages by `.github/workflows/deploy.yml`.

```sh
npm run dev      # local site
npm run build    # site + one PDF per CV role in dist/cv/
```

## Editing content

- **CV facts:** `src/data/cv.ts`. Every bullet has tags (`lead`, `ai`, `founder`, `freelance`, `laravel`, `frontend`, `perf`) and a weight.
- **CV versions:** `src/data/roles.ts`. Each role sets its headline, summary, tag priority, bullet counts, section order and links. Adding a role adds `/cv/<slug>/` and `/cv/<slug>.pdf`.
- **Case studies:** `src/content/work/*.md`. Screenshots live in `src/assets/work/`.
- **Writing:** `src/content/blog/YYYY-MM-DD-slug.md`, served at `/blog/YYYY/MM/DD/slug/`.

Links from a CV to the portfolio carry `?ref=cv-<role>`, so GA4 shows which version sent the visit.
