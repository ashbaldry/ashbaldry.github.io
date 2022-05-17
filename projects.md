---
layout: page
title: Projects
full-width: true
---

<section>
  <h2>Shiny Applications</h2>
  <div class="ui four stackable centered cards">
    {% for project in site.data.shinyapps %}
    <div class="ui blue card">
      <div class="image">
        <a class="" href="{{ project.url }}" target = "_blank">
          <img src="/assets/img/shinyapps/{{ project.img }}" />
        </a>
      </div>
      <div class="content">
        <div class="header">{{ project.title }}</div>
        <div class="description">{{ project.description }}</div>
      </div>
    </div>
    {% endfor %}
  </div>
  
  <h2>Packages</h2>
  <div class="ui four stackable centered cards">
    {% for package in site.data.packages %}
    <div class="ui pink card">
      <div class="content">
        <div class="header">{{ package.name }}</div>
        {% if package.maintainer != "ashbaldry" %}
        <div class="meta">Contributor</div>
        {% endif %}
        <div class="description">{{ package.description }}</div>
      </div>
      <div class="extra content">
        <a class="ui small basic black button" href="https://github.com/{{ package.maintainer }}/{{ package.name }}">GitHub</a>
        <a class="ui small basic black button" href="https://{{ package.maintainer }}.github.io/{{ package.name }}">Documentation</a>
      </div>
    </div>
    {% endfor %}
  </div>
</section>
