---
layout: page
title: Projects
full-width: true
css: assets/css/crossstitch.css
---

<h2>Packages</h2>

### `shinytitle`

A shiny extension to manipulate the web brower tab title \[[GitHub](https://github.com/ashbaldry/shinytitle)\] \[[Documentation](https://ashbaldry.github.io/shinytitle)\]

### `howler`

Wrapper of the [howler.js](https://github.com/goldfire/howler.js) package to enable interactive audio player for shiny applications \[[GitHub](https://github.com/ashbaldry/howler)\] \[[Documentation](https://ashbaldry.github.io/howler)\]

### `shiny.semantic` (Contributor)

Shiny support for the Fomantic UI framework \[[GitHub](https://github.com/Appsilon/shiny.semantic)\] \[[Documentation](https://appsilon.github.io/shiny.semantic/)\]

### `appler`

Uses the iTunes Search API to pull data about iTunes and the iOS App Store. \[[GitHub](https://github.com/ashbaldry/appler)\] \[[Documentation](/appler)\]

<h2>Shiny Applications</h2>
  <div class="ui four cards">
    {% for project in site.data.shinyapps %}
    <div class="ui card">
      <div class="image">
        <a class="" href="{{ project.url }}" target = "_blank">
          <img class="cross-stitch-photo" src="/assets/img/shinyapps/{{ project.img }}" />
        </a>
      </div>
      <div class="content">
        <div class="header">{{ project.title }}</div>
        <div class="description">{{ project.description }}</div>
      </div>
    </div>
    {% endfor %}
  </div>
