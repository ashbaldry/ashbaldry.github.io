---
layout: page
title: My Cross-Stitch Projects
full-width: true
css:
  - /assets/css/crossstitch.css
---

<div class="cross-stitch-container">
  {% for project in site.data.crossstitch %}
  <div class="cross-stitch-project">
    <h3>{{ project.title }}</h3>
    <a class="" href="{{ project.url }}">
      <img class="" src="/assets/img/crossstitch/{{ project.img }}" />
    </a>
    <div>Finished: {{ project.completed }}</div>
  </div>
  {% endfor %}
</div>
