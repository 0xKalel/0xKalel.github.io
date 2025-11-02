# Claude Context: 0xKalel.github.io Blog

> **Complete context for Khalil Hebachi's personal blog and portfolio**

**Live URL**: https://0xKalel.github.io

---

## Quick Navigation

- **[SEO Guidelines](./seo-guidelines.md)** - Complete SEO rules for blog posts (MUST READ before writing)
- **[Post Template](./post-template.md)** - Copy-paste template for new posts
- **[Common Prompts](./prompts.md)** - Ready-to-use prompts for tasks
- **[Internal Links](./internal-links.md)** - List of all posts for cross-linking

---

## Project Overview

This is **Khalil Hebachi's personal blog and portfolio** built with **Jekyll** and hosted on **GitHub Pages**. The site serves as both a professional landing page and a technical blog focused on web development, AI-assisted workflows, and modern software engineering.

### Owner Information

**Name**: Khalil Hebachi
**Title**: Lead Full-Stack Engineer / Senior Full-Stack Developer
**Company**: Storagepal
**Experience**: 12+ years

**Links:**
- GitHub: https://github.com/0xKalel (username: `0xKalel`)
- LinkedIn: https://www.linkedin.com/in/hebachi-khalil/ (username: `hebachi-khalil`)
- CV: `/assets/cv.pdf`

### Professional Focus
- Full-stack development (React, Vue, Laravel, Node.js, NEOS Flow)
- AI-assisted development workflows
- LLM APIs, prompt engineering, agent systems
- Performance optimization and scalable architecture
- Modern web: PWAs, offline-first, Web3, local-first architectures
- Security: CASL, PostgreSQL RLS, defense-in-depth models

### Content Focus
Blog posts about:
- Web development and architecture
- AI-assisted development (Claude Code, MCP servers, agents)
- Prompt engineering and LLM API integration
- Token optimization and cost-effective AI usage
- Markdown-driven development workflows
- Cybersecurity and ethical hacking
- Performance optimization
- Developer tooling and productivity

---

## Site Architecture

### Technology Stack
- **Static Site Generator**: Jekyll
- **Theme**: Hacker theme (`pages-themes/hacker@v0.2.0`)
- **Hosting**: GitHub Pages
- **Markdown Processor**: kramdown
- **Plugins**: jekyll-remote-theme, jekyll-feed, jekyll-seo-tag, jekyll-sitemap

### File Structure

```
.
├── _config.yml                          # Jekyll configuration
├── _posts/                              # Blog posts (YYYY-MM-DD-title.md)
│   └── 2025-11-02-chrome-devtools-...   # Blog post example
├── assets/                              # Static files
│   ├── cv.pdf                           # Khalil's CV
│   └── images/                          # Images (create as needed)
├── .claude/                             # Claude AI context files
│   ├── README.md                        # This file
│   ├── seo-guidelines.md                # SEO rules
│   ├── post-template.md                 # Template for new posts
│   ├── prompts.md                       # Common prompts
│   └── internal-links.md                # Post linking reference
├── index.md                             # Home/landing page
├── about.md                             # About page
├── blog.md                              # Blog listing page
├── Gemfile                              # Ruby dependencies
└── README.md                            # Project documentation
```

### Page Purposes

| File | Purpose | URL | Key Content |
|------|---------|-----|-------------|
| `index.md` | Landing page | `/` | Intro, focus areas, recent posts, connect links |
| `about.md` | Detailed bio | `/about/` | Background, expertise, AI focus, philosophy |
| `blog.md` | Blog index | `/blog/` | All blog posts with dates, descriptions, tags |
| `_posts/*.md` | Blog articles | `/blog/YYYY/MM/DD/title/` | Individual posts with SEO metadata |

---

## Configuration Details

### _config.yml Key Settings

```yaml
title: Khalil Hebachi
description: Lead Full-Stack Engineer | AI-Assisted Development | Web Performance & Architecture
author: Khalil Hebachi
url: "https://0xKalel.github.io"
github_username: 0xKalel
linkedin_username: hebachi-khalil
timezone: Europe/Brussels
lang: en
permalink: /blog/:year/:month/:day/:title/
```

### SEO Plugins
- **jekyll-seo-tag**: Auto-generates meta tags, Open Graph, Twitter Cards
- **jekyll-sitemap**: Auto-generates XML sitemap for search engines
- **jekyll-feed**: Auto-generates RSS/Atom feed for blog posts

---

## Blog Post Format

### File Naming Convention
```
_posts/YYYY-MM-DD-title-slug.md
```

**Example**: `_posts/2025-11-02-chrome-devtools-mcp-wsl-claude-code.md`

### Post Front Matter

```yaml
---
layout: default
title: "Optimized Title with Primary Keyword | Khalil Hebachi"
date: YYYY-MM-DD
categories: [Category1, Category2]
tags: [tag1, tag2, tag3, tag4, tag5]
description: "150-160 char SEO description with primary keyword"
---
```

**See [post-template.md](./post-template.md) for complete template.**

### Common Categories
- AI, Development, Tools, Performance, Security, Architecture, Tutorial

### Common Tags
- claude-code, mcp, ai-development, llm, prompt-engineering
- react, laravel, node, javascript, php
- performance, optimization, architecture
- wsl, linux, automation, devops
- security, web3, pwa

---

## Writing Blog Posts

### Required Reading
1. **[seo-guidelines.md](./seo-guidelines.md)** - SEO rules (MUST follow)
2. **[post-template.md](./post-template.md)** - Structure template
3. **[internal-links.md](./internal-links.md)** - Posts to link to

### SEO Checklist (Brief)
Every post MUST have:
- ✅ Optimized title (50-60 chars, primary keyword)
- ✅ Meta description (150-160 chars, compelling)
- ✅ 3-5 categories, 5-10 tags
- ✅ H2 headings with keywords
- ✅ 2-5 internal links to other posts/pages
- ✅ 3-8 external authoritative links
- ✅ Introduction with primary keyword
- ✅ Conclusion with CTA and links

**Full details in [seo-guidelines.md](./seo-guidelines.md)**

### Content Length Guidelines
- **Tutorial**: 1500-3000 words
- **Guide**: 2000-4000 words
- **Quick tip**: 800-1500 words
- **Deep dive**: 3000-5000 words

---

## Common Tasks

### Adding a New Blog Post

1. Create file: `_posts/YYYY-MM-DD-descriptive-title.md`
2. Use template from [post-template.md](./post-template.md)
3. Follow SEO guidelines from [seo-guidelines.md](./seo-guidelines.md)
4. Add internal links (check [internal-links.md](./internal-links.md))
5. Update [internal-links.md](./internal-links.md) with new post
6. Commit and push

**Example prompt:**
```
Create a new SEO-optimized blog post about [topic]. Primary keyword: [keyword].
Use the template from post-template.md and follow seo-guidelines.md.
Include 2-3 internal links from internal-links.md.
```

### Updating Personal Info

**Files to update:**
- `index.md` - Update intro or areas of focus
- `about.md` - Update professional background
- `_config.yml` - Update site description/metadata
- `assets/cv.pdf` - Replace CV file

### Updating CV

```bash
mv "/path/to/new/cv.pdf" assets/cv.pdf
```

---

## Development Workflow

### Local Testing (Optional)

```bash
# One-time setup
sudo apt install ruby-full build-essential zlib1g-dev
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
gem install jekyll bundler

# Serve locally
cd ~/projects/0xKalel.github.io
bundle install
bundle exec jekyll serve
# Visit http://localhost:4000
```

### Deploy to Production

```bash
cd ~/projects/0xKalel.github.io
git add .
git commit -m "Descriptive commit message"
git push origin main
```

**GitHub Pages builds automatically** (1-2 minutes)

---

## File Locations Quick Reference

| What | Where |
|------|-------|
| Site config | `_config.yml` |
| Home page | `index.md` |
| About page | `about.md` |
| Blog listing | `blog.md` |
| Blog posts | `_posts/YYYY-MM-DD-title.md` |
| CV/Resume | `assets/cv.pdf` |
| Images | `assets/images/` (create if needed) |
| Claude context | `.claude/README.md` (this file) |
| SEO rules | `.claude/seo-guidelines.md` |
| Post template | `.claude/post-template.md` |
| Common prompts | `.claude/prompts.md` |
| Internal links | `.claude/internal-links.md` |

---

## Quick Prompts

**See [prompts.md](./prompts.md) for comprehensive list.**

### New SEO-Optimized Post
```
Create a new SEO-optimized blog post about [topic]. Primary keyword: [keyword].
Follow seo-guidelines.md and use post-template.md structure.
Include 2-3 internal links (check internal-links.md) and 3-5 external authoritative links.
2000-2500 words, comprehensive and practical.
```

### Update About Page
```
Update my about page to include [new info]. Maintain SEO and professional tone.
```

### Improve Post SEO
```
Review [post title] against seo-guidelines.md and suggest improvements.
```

---

## Troubleshooting

### Site Not Building
1. Check GitHub Pages settings in repo
2. Verify `_config.yml` syntax (YAML validator)
3. Check GitHub Actions tab for build errors
4. Ensure plugins are GitHub Pages compatible

### Posts Not Showing
1. Verify filename: `YYYY-MM-DD-title.md`
2. Check front matter YAML syntax
3. Ensure date is not in future
4. Confirm file in `_posts/` directory

### Local Jekyll Errors
1. Run `bundle update`
2. Clear cache: `bundle exec jekyll clean`
3. Check Ruby version: `ruby -v` (2.5+)

---

## Important Notes

1. **GitHub Pages Compatibility**: Only use approved plugins
2. **SEO is Critical**: Every post must follow [seo-guidelines.md](./seo-guidelines.md)
3. **Internal Linking**: Update [internal-links.md](./internal-links.md) with every new post
4. **Build Time**: 1-2 minutes after push to see changes live
5. **Always Use Templates**: Reference [post-template.md](./post-template.md) for consistency

---

## Contact & Support

**Owner**: Khalil Hebachi
**GitHub**: https://github.com/0xKalel
**LinkedIn**: https://www.linkedin.com/in/hebachi-khalil/

---

*Last Updated: 2025-11-02*
*Maintained by: Khalil Hebachi with Claude Code assistance*
