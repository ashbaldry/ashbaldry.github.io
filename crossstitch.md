---
layout: page
title: My Cross-Stitch Projects
full-width: true
css: assets/css/crossstitch.css
js: assets/js/crossstitch.js
---

<div class="ui four stackable centered cards">
  {% for project in site.data.crossstitch %}
  <div class="ui grey card">
    <div class="image">
      <a class="cross-stitch-photo" href="{{ project.url }}">
        <img src="/assets/img/crossstitch/{{ project.img }}" />
      </a>
    </div>
    <div class="content">
      <div class="header">{{ project.title }}</div>
      <div class="description">
        Completed: {{ project.completed }}
        <a class="" href="{{ project.url }}">Original Pattern</a>
      </div>
    </div>
  </div>
  {% endfor %}
</div>

<div class="ui modal">
  <div class="header"></div>
  <div class="content"></div>
  <div class="actions">
    <button class="ui grey button">Close</button>
  </div>
</div>
