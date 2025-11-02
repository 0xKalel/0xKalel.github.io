# Khalil Hebachi - Personal Blog

Personal website and blog built with Jekyll and GitHub Pages.

## Structure

```
.
├── _config.yml                 # Jekyll configuration
├── _posts/                     # Blog posts (YYYY-MM-DD-title.md)
├── assets/                     # Static files (CV, images, etc.)
├── index.md                    # Home page
├── about.md                    # About page
└── blog.md                     # Blog listing page
```

## Writing New Posts

Create new blog posts in `_posts/` with the naming format:

```
YYYY-MM-DD-title-slug.md
```

### Post Template

```markdown
---
layout: default
title: "Your Post Title"
date: YYYY-MM-DD
categories: [Category1, Category2]
tags: [tag1, tag2, tag3]
description: "Brief description for SEO"
---

# Your Post Title

Your content here...
```

## Local Development

```bash
# Install Jekyll (first time only)
gem install jekyll bundler

# Serve locally
jekyll serve
```

Visit http://localhost:4000

## Deployment

Push to `main` branch. GitHub Pages will automatically build and deploy.

## Links

- **Live Site**: https://0xKalel.github.io
- **LinkedIn**: https://www.linkedin.com/in/hebachi-khalil/
- **GitHub**: https://github.com/0xKalel

## License

Content is © Khalil Hebachi. Code is MIT licensed.
