---
layout: base
title: My Cross-Stitch Projects
---

<div>
  {% for project in site.data.crossstitch %}
  <h3>{{ project.title }}</h3>
  <a class="" href="{{ project.url }}">
    <img class="" src="/assets/img/crossstitch/{{ project.img }}" />
  </a>
  <div>Finished: {{ project.completed }}</div>
  {% endfor %}
</div>
