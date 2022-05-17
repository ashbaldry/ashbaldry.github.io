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
</section>

<section>
  <h2>Packages</h2>
  <div class="ui four stackable centered cards">
    {% for package in site.data.packages %}
    <div class="ui pink card">
      {% assign maintainer = package.maintainer | default: ashbaldry %}
      <div class="content">
        <div class="header">{{ package.name }} {% if maintainer != "ashbaldry" %} (Contributor) {% endif %}</div>
        <div class="description">{{ package.description }}</div>
      </div>
      <div class="extra content">
        <div class="two buttons>
          <a class="ui basic black button" href="https://github.com/{{ maintainer }}/{{ package.name }}">GitHub</button>
          <a class="ui basic black button" href="https://{{ maintainer }}.github.io/{{ package.name }}">Documentation</button>
        </div>
      </div>
    </div>
    {% endfor %}
  </div>
</section>
