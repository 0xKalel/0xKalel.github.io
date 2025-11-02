# Common Prompts for Blog Tasks

Quick reference prompts for common blog maintenance and content creation tasks.

---

## Creating New Blog Posts

### SEO-Optimized Tutorial Post

```
Create a new SEO-optimized blog post about [TOPIC].

Primary keyword: "[KEYWORD]"
Target audience: [developers/engineers/etc.]

Include:
- Optimized title (under 60 chars) and meta description (150-160 chars)
- H2/H3 structure with keyword variations
- 2-3 internal links to my about page and other relevant posts
- 3-5 external links to authoritative sources
- Step-by-step guide with code examples
- Troubleshooting section
- Use cases/practical examples
- Conclusion with CTA linking to related posts

Make it 2000-2500 words, well-structured, and easy to scan.
```

### Comprehensive Guide

```
Write a comprehensive guide on [TOPIC] targeting the keyword "[PRIMARY KEYWORD]".

Requirements:
- 2500-3500 words
- SEO-optimized (see seo-guidelines.md)
- Table of contents for easy navigation
- Internal links to:
  - My about page when mentioning AI-assisted development
  - Related blog posts: [list any relevant posts]
  - Blog index in conclusion
- External links to official documentation
- Code examples with proper syntax highlighting
- Troubleshooting section with common issues
- Real-world use cases
- CTA with next steps

Focus on: [specific aspects to cover]
```

### Quick Tip / Short Post

```
Create a quick tip post about [TOPIC] (800-1200 words).

Primary keyword: "[KEYWORD]"

Include:
- SEO-optimized title and description
- Brief introduction
- Main content with code example
- 1-2 internal links
- 2-3 external authoritative links
- Brief conclusion with CTA

Keep it concise but valuable.
```

### Deep Dive / Advanced Post

```
Write an in-depth deep dive on [TOPIC] for advanced users.

Primary keyword: "[KEYWORD]"
Secondary keywords: [keyword1, keyword2, keyword3]

Requirements:
- 3500-5000 words
- Technical depth without losing readability
- Multiple code examples and use cases
- Performance considerations
- Best practices section
- Internal links to related posts
- Extensive resources section
- SEO-optimized throughout
```

---

## Updating Existing Content

### Update Blog Post

```
Update the blog post at _posts/[FILENAME] to:
- [Specific changes needed]
- Maintain SEO optimization
- Update any outdated information
- Add internal links to newer posts if relevant
```

### Add New Section to Existing Post

```
Add a new section to [POST TITLE] about [NEW TOPIC].

- Place it after the [EXISTING SECTION] section
- Keep SEO optimization consistent
- Include code examples if applicable
- Add relevant internal/external links
```

### Improve SEO of Existing Post

```
Review and improve SEO for [POST TITLE]:
- Optimize title and meta description if needed
- Improve H2/H3 headings with better keywords
- Add 2-3 more internal links to newer posts
- Ensure conclusion has strong CTA
- Check keyword density and placement
- Add external authoritative links if missing
```

---

## Personal Info Updates

### Update About Page

```
Update my about page to:
- Add new role/achievement: [DETAILS]
- Include new skill/technology: [TECHNOLOGY]
- Maintain professional tone and SEO
- Keep structure consistent
```

### Update CV

```
I have a new CV at [PATH]. Please:
- Move it to assets/cv.pdf (replace existing)
- Verify all CV links still work
- Update any references if filename changed
```

### Add Social Link

```
Add new social profile link:
- Platform: [PLATFORM]
- URL: [URL]

Update in:
- _config.yml
- index.md (Connect section)
- about.md (Connect section)
```

---

## Site Maintenance

### Create New Category Page (Future)

```
Create a new category page for [CATEGORY]:
- List all posts in this category
- SEO-optimized category description
- Link from main blog page
```

### Add Navigation Link

```
Add a navigation link to [PAGE] in:
- Main navigation (if theme supports)
- About page
- Index page (if appropriate)
```

### Update Theme

```
Change the site theme to [THEME NAME]:
- Update _config.yml
- Test locally if possible
- Ensure all pages still render correctly
- Maintain SEO plugins
```

---

## Content Organization

### Reorganize Categories/Tags

```
Review all blog posts and:
- Standardize category names
- Ensure consistent tagging
- Update [POST TITLE] to use new category structure
```

### Create Post Series

```
Create a multi-part series on [TOPIC]:

Part 1: [SUBTOPIC 1]
Part 2: [SUBTOPIC 2]
Part 3: [SUBTOPIC 3]

Each part should:
- Be SEO-optimized independently
- Link to other parts in the series
- Have consistent structure
- Build on previous parts
```

---

## Internal Linking

### Add Internal Links to New Post

```
I just published [NEW POST TITLE] at [URL].

Review existing posts and add internal links to this new post where relevant:
- Check posts about [RELATED TOPIC 1]
- Check posts about [RELATED TOPIC 2]
- Use descriptive anchor text with keywords
```

### Audit Internal Links

```
Review all blog posts and:
- Ensure each post has 2-5 internal links
- Check for broken internal links
- Add links to about page where expertise is mentioned
- Update internal-links.md with current post list
```

---

## SEO Tasks

### Optimize Older Post for SEO

```
The post [OLD POST TITLE] needs SEO improvement:
- Update title to include primary keyword: [KEYWORD]
- Rewrite meta description (150-160 chars)
- Improve H2 headings with keywords
- Add 2-3 internal links to newer posts
- Ensure external authoritative links
- Add CTA in conclusion
```

### Keyword Research for New Post

```
I want to write about [TOPIC].

Suggest:
- Primary keyword to target
- 5-10 LSI keywords to include
- Potential H2 headings with keywords
- Title variations (under 60 chars)
- Meta description ideas (150-160 chars)
```

---

## Quick Reference Tasks

### List All Posts

```
List all blog posts with:
- Title
- URL
- Date
- Primary topic
- Categories/tags

Format for easy reference in internal linking.
```

### Check Post Meets SEO Guidelines

```
Review [POST TITLE] against seo-guidelines.md:
- Verify all checklist items
- Identify what's missing
- Suggest improvements
```

### Generate Post Ideas

```
Generate 10 blog post ideas related to:
- AI-assisted development
- [Your current tech stack]
- [Current project/interest]

For each idea, suggest:
- Working title
- Primary keyword
- Brief outline
- Estimated word count
```

---

## Examples in Action

### Example 1: New Tutorial

```
Create a new SEO-optimized blog post about "Building Custom MCP Servers with Claude Code".

Primary keyword: "custom MCP servers"

Include:
- Optimized title and description
- Prerequisites section
- Step-by-step guide with TypeScript code examples
- Troubleshooting section
- Use cases for custom MCP servers
- Internal links to my Chrome DevTools MCP post and about page
- External links to MCP documentation, GitHub repos
- Conclusion with CTA linking to related AI development posts

2500-3000 words, comprehensive and practical.
```

### Example 2: Update About Page

```
Update my about page to reflect:
- New achievement: Published 10+ technical articles
- New expertise area: Advanced prompt engineering techniques
- Add mention of blog and link to /blog/

Keep professional tone and maintain SEO.
```

### Example 3: SEO Audit

```
Audit the Chrome DevTools MCP post for SEO:
- Check if title and description are optimized
- Verify internal links (should have 2-5)
- Ensure H2 headings have keywords
- Check if conclusion has CTA
- Suggest improvements
```

---

*Use these prompts as starting points. Customize with your specific needs and always reference [seo-guidelines.md](./seo-guidelines.md) for SEO requirements.*
