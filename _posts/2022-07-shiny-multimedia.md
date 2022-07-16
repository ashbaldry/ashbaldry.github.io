---
layout: post
title: "Shiny and Reactive Multimedia"
tags: [shiny, audio, video]
---

Shiny has always been a good framework for creating dashboards, but as time goes on the potential and use cases for shiny applications are continually increasing. One

## Standard Players

Most web browsers come with the capability of understanding what `<audio>` and `<video>` tags, but there are a few issues that one might face when including an audio or video element in their shiny application.

### Inconsistent UI

Each web browser has their own flavour of styling when it comes to audio and video controls, and whilst working on your application the theme of the browser you are developing on might be cohesive, it might stick out when on another browser

#### Audio

<section style="display: flex; font-weight: 700;">
<div>
<div>
Chromium (Chrome/Edge)
</div>

![UI of an audio tag on Chromium web browser](/assets/img/blog/shiny-multimedia/chrome-audio.png)

</div>
<div>
<div>
Mozilla Firefox
</div>

![UI of an audio tag on Mozilla Firefox web browser](/assets/img/blog/shiny-multimedia/mozilla-audio.png)

</div>
</section>

#### Video

<section style="display: flex; font-weight: 700;">

<div>
<div>
Chromium (Chrome/Edge)
</div>

![UI of a video tag on Chromium web browser](/assets/img/blog/shiny-multimedia/chrome-video.png)

</div>
<div>
<div>
Mozilla Firefox
</div>

![UI of a video tag on Mozilla Firefox web browser](/assets/img/blog/shiny-multimedia/mozilla-video.png)

</div>
</section>

### Server-Side Interaction

Okay, well you can use `{shinyjs}` to send a JS

## Audio with howler.js

[howler.js](https://howlerjs.com/) is a JavaScript library that

## Video with video.js

[video.js](https://videojs.com/) is another JavaScript library, focussing on providing consistent video behaviour across all web browsers, being able to embed videos from a variety of different sources.

An added benefit of video.js is that all videos are easily accessible in JavaScript by using `videojs.video('id')` to find any video by just referencing the ID of the HTML tag.
