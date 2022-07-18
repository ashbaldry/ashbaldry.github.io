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

The two browsers also calculate the length of tracks differently. In the example video Chromium floors the video duration of 46.6 seconds to 0:46, whereas Firefox rounds up to 0:47.

### Server-Side Interaction

Okay, whilst from the server side you can use `shinyjs::runjs` to tell an audio or video element to play or pause, there is currently little available in the other direction. It might be useful to know whether or not the multimedia is playing, or where in the track the user currently in order to trigger an event.

These, along with a general curiosity of adding multimedia into a shiny application, have brought along the creation of two R packages, based on a couple of separate JavaScript libraries.

## Audio with howler.js

[howler.js](https://howlerjs.com/) is an audio library that makes working with audio in JavaScript easy and reliable across all platforms. [`{howler}`](https://github.com/ashbaldry/howler) is a wrapper for howler.js, creating an audio player that can handle multiple tracks and seamlessly switch between them. A variety of buttons are available that can trigger events on the player, and are easily customisable.

On the server side, there are 4 input values for any `howler` player:

- `{id}_playing` A logical value as to whether or not the howler is playing audio
- `{id}_track` Basename of the file currently loaded
- `{id}_seek` The current time (in seconds) of the track loaded
- `{id}_duration` The duration (in seconds) of the track loaded

There are also two modules available: a basic module that tries to emulate the UI of the Chromium audio player, and a full module with a few extra components, such as the track name and the ability to switch track. If the audio is purely UI, the server-side module is not required, however it does contain the standard information that comes with the `howler` widget.

### Example

```r
library(shiny)
library(howler)

ui <- fluidPage(
  h1("Howler Audio Player"),
  howler::howlerModuleUI(
    id = "sound",
    files = list(
      "Winning Elevation" = "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3"
    )
  ),
  howler::howlerBasicModuleUI(
    id = "sound2",
    files = list(
      "Winning Elevation" = "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3"
    )
  )
)

server <- function(input, output, session) {}

shinyApp(ui, server)
```

This produces the same UI in each of the three main browsers:

![UI of howler modules in Chrome, Mozilla and Edge, all 3 players have identical UI](/assets/img/blog/shiny-multimedia/howler-comparison.png)

## Video with video.js

[video.js](https://videojs.com/) is another JavaScript library, focussing on providing consistent video behaviour across all web browsers, being able to embed videos from a variety of different sources. [`{video}`](https://github.com/ashbaldry/video) is the wrapper for this library, and creates a video player that is easy to communicate between the UI and server of shiny applications.

Three of the four audio player inputs are available in the `video` player:

- `{id}_playing` A logical value as to whether or not the howler is playing audio
- `{id}_seek` The current time (in seconds) of the track loaded
- `{id}_duration` The duration (in seconds) of the track loaded

### Example

```r
library(shiny)
library(video)

ui <- fluidPage(
  h1("Video Player"),
  video("https://vjs.zencdn.net/v/oceans.mp4", width = 600, height = NA)
)

server <- function(input, output, session) {}

shinyApp(ui, server)
```



If you aren't satisfied with the basic skin of the video.js player, there are a [series of skins available on GitHub](https://github.com/videojs/video.js/wiki/Skins), including one that looks like the Netflix video player.

An added benefit of video.js is that all videos are easily accessible in JavaScript by using `videojs('id')` to find any video by just referencing the ID of the HTML tag (so if there is something currently unavailable in `{video}` you can use this to create your own custom call!).

## `{htmlwidgets}`

It is worth mentioning that both of these packages have been facilitated with [`{htmlwidgets}`](https://github.com/ramnathv/htmlwidgets), a package that provides an easy way to create R bindings to JavaScript libraries. The [JavaScript for R](https://book.javascript-for-r.com/) book was a great aid in creating widgets for these; it made writing the connections between the UI and server a lot easier ([here](https://github.com/ashbaldry/howler/blob/af886b2d08fb9dd039dd26e0adc2acd6c7175452/inst/srcjs/howler.shiny.js) is what it looked like **before** updating to `{htmlwidgets}`).

## Summary

Whilst the `<audio>` and `<video>` tags allow easy use of including multimedia in web pages, the use of JavaScript libraries enables a level of consistency across all web browsers plus more flexibility around playing the audio or video track.

`{howler}` and `{video}` are in the process of being submitted to CRAN and hopefully both available in the next few days.
