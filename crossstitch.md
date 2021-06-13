---
layout: page
title: My Cross-Stitch Projects
---

<div id="">
  {% for project in site.data.crossstitch %}
	<div class="">
    <a class="applink" href="{{ project.url }}">
      <h3 class="">{{ project.title }}</div>
      <img class="" src="/assets/img/screenshots/{{ project.img }}" />
      <div class="">Completed on: {{ project.completed }}</div>
    </a>
  </div>
  {% endfor %}
</div>
