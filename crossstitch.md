---
layout: page
title: My Cross-Stitch Projects
full-width: true
---

<div class="ui stackable padded grid">
  <div class="ui row">
    {% for project in site.data.crossstitch %}
    <div class="four wide column">
      <div class="ui grey segment">
        <h3>{{ project.title }}</h3>
        <img class="cross-stitch-photo" src="/assets/img/crossstitch/{{ project.img }}" />
        <div>Finished: {{ project.completed }}</div>
        <a class="" href="{{ project.url }}">Original Pattern</a>
      </div>
    </div>
    {% endfor %}
  </div>
</div>
