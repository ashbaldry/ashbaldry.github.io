---
layout: post
title: "Shiny and Reactive Multimedia"
tags: [shiny, audio, video]
---

Shiny has always been the framework in R for creating dashboards, but as time goes on the potential and use cases for shiny applications are continually increasing. One area that I wanted to explore more was the inclusion of multimedia. This might be an introductionary video, or embedding one of those racing bar charts.

## Standard HTML Players

Most web browsers come with the capability of understanding what `<audio>` and `<video>` tags, and come with their own functionality, but there are a few issues that one might face when including an audio or video element in their shiny application.

### Inconsistent UI

Each web browser has their own flavour of styling when it comes to audio and video controls, and whilst working on your application the theme of the browser you are developing on might be cohesive, it might stick out when on another browser.

#### Audio

<section style="display: flex; justify-content: space-around; font-weight: 700;">
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

<section style="display: flex; justify-content: space-around; font-weight: 700;">

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

As well the visual differences, there is also some functionality that exists in the Chromium version that isn't present in the Firefox version. Chromium adds the ability to download the track or change the playback speed using the vertical ellipsis.

The two browsers also calculate the length of tracks differently. In a separate example video I found Chromium rounds down the video duration of 46.6 seconds to 0:46, whereas Firefox rounds up to 0:47.

### Server-Side Interaction

Okay, from the server side you can use `shinyjs::runjs` to tell an audio or video element to play or pause, there is currently little available in the other direction. It might be useful to know whether or not the multimedia is playing, or where in the track the user currently is.

## Audio with howler.js

[howler.js](https://howlerjs.com/) is a JavaScript library that.

[`{howler}`](https://github.com/ashbaldry/howler) is a wrapper that includes 

## Video with video.js

[video.js](https://videojs.com/) is another JavaScript library, focussing on providing consistent video behaviour across all web browsers, being able to embed videos from a variety of different sources.

[`{video}`](https://github.com/ashbaldry/video) is a wrapper

An added benefit of video.js is that all videos are easily accessible in JavaScript by using `videojs('id')` to find any video by just referencing the ID of the HTML tag (so if there is something currently unavailable in `{video}` you can use this to create your own custom call!).

## `{htmlwidgets}`

It is worth mentioning that both of these packages have been facilitated with [`{htmlwidgets}`](https://github.com/ramnathv/htmlwidgets), a package that provides an easy way to create R bindings to JavaScript libraries. 

## Summary

Whilst the `<audio>` and `<video>` tags allow easy use of including multimedia in web pages, the use of JavaScript libraries enables a level of consistency across all web browsers plus more flexibility around playing the audio or video track.

`{howler}` and `{video}` are in the process of being submitted to CRAN and hopefully both available in the next few days.
