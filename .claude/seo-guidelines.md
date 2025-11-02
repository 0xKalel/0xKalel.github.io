# SEO Guidelines for Blog Posts

**IMPORTANT**: Every blog post MUST be SEO-optimized. Follow these guidelines consistently.

---

## 1. Front Matter SEO

**Required fields for every post:**

```yaml
---
layout: default
title: "Primary Keyword: Secondary Keywords | Khalil Hebachi"
date: YYYY-MM-DD
categories: [MainCategory, SubCategory]
tags: [keyword1, keyword2, keyword3, keyword4, keyword5]
description: "Compelling 150-160 character summary with primary keyword that encourages clicks from search results"
---
```

### Title Formula
- Start with primary keyword
- Keep under 60 characters
- Make it compelling and clickable
- Include brand/name if space allows

### Description Formula
- 150-160 characters (strict)
- Include primary keyword in first 120 chars
- Include a benefit or value proposition
- Make it action-oriented
- No quotation marks or special characters that break

### Example
```yaml
title: "Complete Guide: Installing Chrome DevTools MCP in WSL for Claude Code"
description: "Step-by-step guide to install and configure Chrome DevTools MCP server in WSL for Claude Code VSCode extension. Learn browser automation, performance analysis, and AI-assisted web development."
```

---

## 2. Content Structure for SEO

### H1 (Title)
- Only ONE H1 per page (automatically generated from front matter title)
- Never add another `# H1` in the content

### H2 (Main Sections)
- Use descriptive, keyword-rich headings
- Format: `## How to Install Chrome DevTools MCP` (not just `## Installation`)
- Include variations of target keywords
- 3-7 H2s per post ideal

### H3 (Subsections)
- Support H2 sections
- Answer specific questions
- Use long-tail keywords

### Example Structure
```markdown
# Complete Guide: Installing Chrome DevTools MCP in WSL (H1 - auto from title)

## What is Chrome DevTools MCP? (H2 - keyword variation)
## Prerequisites for WSL Installation (H2 - long-tail)
### System Requirements (H3 - specific)
### Required Tools (H3 - specific)
## Step-by-Step Installation Guide (H2 - action keyword)
### Install Chrome for Testing (H3 - specific task)
### Configure MCP Server (H3 - specific task)
## Troubleshooting Common Issues (H2 - user intent)
## Real-World Use Cases (H2 - value-focused)
```

---

## 3. Internal Linking Strategy

**CRITICAL**: Always link to other relevant posts and pages on the blog.

### Rules
- Link to **2-5 other blog posts** when relevant
- Link to **About page** when mentioning personal expertise
- Link to **Blog index** in conclusions
- Use **descriptive anchor text** with keywords (not "click here")
- Open internal links in same tab (default markdown links)

### Example Internal Links
```markdown
This builds on concepts from my [guide to AI-assisted development workflows](/blog/YYYY/MM/DD/ai-workflows/).

Learn more about my background in [AI development on my about page](/about/).

For more tutorials like this, check out [all my blog posts](/blog/).
```

### Anchor Text Best Practices
- ✅ "my guide to prompt engineering with Claude"
- ✅ "optimizing token usage in LLM APIs"
- ❌ "this post" / "click here" / "read more"

### When to Link
- Mention "AI-assisted development" → link to about page
- Mention "other tutorials" → link to blog index
- Reference another tool/topic you've written about → link to that post
- Mention your background/expertise → link to about page or CV

### Key Pages to Link
- Home: `/` or `../`
- About: `/about/`
- Blog index: `/blog/`
- CV: `/assets/cv.pdf`
- LinkedIn: `https://www.linkedin.com/in/hebachi-khalil/`
- GitHub: `https://github.com/0xKalel`

**See [internal-links.md](./internal-links.md) for current list of available posts to link to.**

---

## 4. External Linking Strategy

### Rules
- Link to **authoritative sources** (official docs, GitHub repos, MDN, etc.)
- Use `target="_blank"` for external links (add manually if needed, or just use default)
- 3-8 external links per post
- Link to official documentation for all tools/technologies mentioned
- Add "Resources" section with key external links

### Example External Links
```markdown
According to [Chrome DevTools documentation](https://developer.chrome.com/docs/devtools/), the protocol enables...

The [Model Context Protocol specification](https://modelcontextprotocol.io/) defines...
```

---

## 5. Keyword Optimization

### Primary Keyword
- Mention in first 100 words
- Include in title, description, first H2
- Use 3-5 times throughout naturally
- Include in conclusion

### LSI Keywords (Latent Semantic Indexing)
- Use variations and related terms
- Example: "Chrome DevTools MCP" + "browser automation" + "DevTools protocol" + "MCP server" + "Chrome automation"

### Keyword Density
- 1-2% for primary keyword (naturally, not forced)
- Avoid keyword stuffing
- Focus on readability first

---

## 6. Meta Content Checklist

Every post MUST have:
- ✅ Optimized title (50-60 chars, primary keyword)
- ✅ Meta description (150-160 chars, compelling)
- ✅ 3-5 categories (relevant, consistent)
- ✅ 5-10 tags (specific keywords)
- ✅ H2 headings with keywords
- ✅ 2-5 internal links
- ✅ 3-8 external authoritative links
- ✅ Introduction with primary keyword
- ✅ Conclusion with call-to-action
- ✅ Alt text for any images (if used)

---

## 7. Content Length Guidelines

- **Tutorial posts**: 1500-3000 words (comprehensive)
- **Guide posts**: 2000-4000 words (detailed)
- **Quick tips**: 800-1500 words (concise)
- **Deep dives**: 3000-5000 words (exhaustive)

**Rule**: Longer = better for SEO, but only if valuable content.

---

## 8. Readability Optimization

### Use
- Short paragraphs (2-4 sentences)
- Bullet points and numbered lists
- Code blocks with syntax highlighting
- Tables for comparisons
- Blockquotes for important notes
- Bold/italic for emphasis (sparingly)

### Avoid
- Walls of text
- Long sentences (keep under 20 words when possible)
- Jargon without explanation
- Passive voice

---

## 9. Image SEO (When Using Images)

### If adding images
```markdown
![Descriptive alt text with keyword](../assets/images/filename.png)
```

### Alt text formula
- Describe what's in the image
- Include relevant keyword naturally
- Keep under 125 characters
- Make it useful for screen readers

---

## 10. Call-to-Action (CTA) in Conclusion

### Every post should end with
- Summary of key points
- Next steps for reader
- Link to related content
- Social/contact invitation

### Example CTA
```markdown
## Conclusion

Chrome DevTools MCP integration transforms how you work with browsers in Claude Code. By following this guide, you've unlocked browser automation, performance analysis, and AI-assisted debugging capabilities.

**Next steps:**
- Explore [advanced MCP server development](/blog/YYYY/MM/DD/mcp-servers/)
- Read about [optimizing AI workflows](/blog/YYYY/MM/DD/ai-workflows/)
- Check out [all my AI development posts](/blog/)

**Questions?** Connect with me on [LinkedIn](https://www.linkedin.com/in/hebachi-khalil/) or [GitHub](https://github.com/0xKalel).
```

---

## Common Categories
- `AI`
- `Development`
- `Tools`
- `Performance`
- `Security`
- `Architecture`
- `Tutorial`

## Common Tags
- `claude-code`, `mcp`, `ai-development`, `llm`, `prompt-engineering`
- `react`, `laravel`, `node`, `javascript`, `php`
- `performance`, `optimization`, `architecture`
- `wsl`, `linux`, `automation`, `devops`
- `security`, `web3`, `pwa`

---

*This file is referenced by Claude when creating blog posts to ensure consistent SEO optimization.*
