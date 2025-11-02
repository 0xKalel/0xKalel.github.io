---
layout: default
title: Home
---

# Hi, I'm Khalil Hebachi

Lead Full-Stack Engineer with 12+ years of experience building high-performance web applications. I specialize in modern web development, AI-assisted workflows, and scalable architecture.

## What I Do

I architect and build enterprise-grade applications using React, Laravel, and modern JavaScript/PHP ecosystems. Currently leading development at Storagepal, where I've delivered WMS solutions with 99%+ performance improvements.

Beyond traditional development, I'm deeply involved in AI-assisted development workflows—exploring how developers can leverage LLMs, agents, and structured prompting to build faster and smarter. I work extensively with Claude Code, custom MCP servers, and markdown-driven development processes.

## Areas of Focus

- **Full-Stack Development**: React, Vue, Laravel, Node.js, NEOS Flow
- **AI-Assisted Development**: LLM APIs, prompt engineering, agent systems
- **Performance Optimization**: Architecture, caching, database optimization
- **Modern Web**: PWAs, offline-first, Web3, local-first architectures
- **Security**: Defense-in-depth models, CASL, PostgreSQL RLS

## Connect

- [LinkedIn](https://www.linkedin.com/in/hebachi-khalil/)
- [GitHub](https://github.com/0xKalel)
- [Download CV](./assets/cv.pdf)

## Recent Posts

{% for post in site.posts limit:3 %}
- [{{ post.title }}]({{ post.url }}) - {{ post.date | date: "%B %d, %Y" }}
{% endfor %}

[View all posts →](./blog.html)
