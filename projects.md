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
        <div class="header">{{ package.name }} {% if package.maintainer != "ashbaldry" %} (Contributor) {% endif %}</div>
        <div class="description">{{ package.description }}</div>
      </div>
      <div class="extra content">
        <div class="two small buttons">
          <a class="ui basic black button" href="https://github.com/{{ package.maintainer }}/{{ package.name }}">GitHub</a>
          <a class="ui basic black button" href="https://{{ package.maintainer }}.github.io/{{ package.name }}">Documentation</a>
        </div>
      </div>
    </div>
    {% endfor %}
  </div>
</section>
