---
layout: default
title: Blog
permalink: /blog/
---

# Blog

Thoughts on web development, AI-assisted workflows, performance optimization, and modern software engineering.

---

{% for post in site.posts %}
## [{{ post.title }}]({{ post.url }})

**{{ post.date | date: "%B %d, %Y" }}**

{{ post.description }}

{% if post.tags %}
**Tags:** {% for tag in post.tags %}{{ tag }}{% if forloop.last == false %}, {% endif %}{% endfor %}
{% endif %}

---
{% endfor %}

{% if site.posts.size == 0 %}
*No posts yet. Check back soon!*
{% endif %}
