---
layout: post
title: "Shiny and Reactive Multimedia"
tags: [rstats, shiny, audio, video]
---

Shiny has always been the framework for creating dashboards in R, but as time goes on the potential use cases for shiny applications are continuously increasing. One area that I wanted to explore was the inclusion of multimedia. This might be an introductory video, or embedding one of those racing bar charts.

## Standard HTML Players

Most web browsers come with the capability to handle `<audio>` and `<video>` tags, and come with their own functionality, but there are a few issues that one might face when including an audio or video element in their shiny application.

### Inconsistent UI

Each web browser has their own flavour of styling when it comes to audio and video controls, and whilst working on your application the theme of one browser you are developing on might be cohesive, you may find that the controls "stick out" when on another browser.

#### Audio

```html
<audio controls src="example.mp3">
```

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

```html
<video width="400" controls><source type="video/mp4" src="example.mp4"></video>
```

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

Along with the visual differences, there is also some functionality that exists in the Chromium based browsers that isn't present in the Firefox browser. Chromium adds the ability to download the track or change the playback speed using the vertical ellipsis.

The two browsers also calculate the length of tracks differently. In the example video Chromium floors the video duration of 46.6 seconds to 0:46, whereas Firefox rounds up to 0:47.

### Server-Side Interaction

Okay, whilst it is possible from the server side to use `shinyjs::runjs` to tell an audio or video element to play or pause, there is currently little available in the other direction. It might be useful to know whether or not the multimedia is playing, or where in the track the user currently is in order to trigger an event.

These, along with a general curiosity of adding multimedia into a shiny application, have brought along the creation of two R packages using a couple of JavaScript libraries.

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

![UI of howler modules in Chrome, Firefox and Edge, all 3 players have identical UI](/assets/img/blog/shiny-multimedia/howler-comparison.png)

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

There are is one difference between Firefox and Chromium, and that is the picture-in-picture. The button is visible when hovering on a Firefox browser (similar to the standard video player), but is kept in the controls bar for Chromium. Apart from that, the players are identical.

![UI of video.js players in Chrome, Mozilla and Edge, all 3 players have similar UI](/assets/img/blog/shiny-multimedia/video-comparison.png)

If you aren't satisfied with the basic skin of the video.js player, there are a [collection of skins available on GitHub](https://github.com/videojs/video.js/wiki/Skins), including one that looks like the Netflix video player.

An added benefit of video.js is that all videos are easily accessible in JavaScript by using `videojs('id')` to find any video by just referencing the ID of the HTML tag (so if there is something currently unavailable in `{video}` you can use this to create your own custom call!).

## Server-Side

There are a collection of functions available in both packages to manipulate the multimedia from the server in a shiny application:

- `playHowl`/`playVideo` - resume playing the current track*
- `pauseHowl`/`pauseVideo` - pause the current track
- `stopHowl`/`stopVideo` - pause and return to the start of the current track
- `seekHowl`/`seekVideo` - move the current track to a specified point in time
- `addTrack`/`changeVideo` - change the current track to a new one

Because `{howler}` can handle multiple tracks attached to a player, there is also the potential to change between tracks using `changeTrack` without having to add a new track. 

## `{htmlwidgets}`

It is worth mentioning that both of these packages have been facilitated with [`{htmlwidgets}`](https://github.com/ramnathv/htmlwidgets), a package that provides an easy way to create R bindings to JavaScript libraries. The [JavaScript for R](https://book.javascript-for-r.com/) book was a great aid in creating widgets for these; it made writing the connections between the UI and server a lot easier ([here](https://github.com/ashbaldry/howler/blob/af886b2d08fb9dd039dd26e0adc2acd6c7175452/inst/srcjs/howler.shiny.js) is what the howler shiny wrapper looked like **before** updating to `{htmlwidgets}`).

## Summary

Whilst the `<audio>` and `<video>` tags allow easy use of including multimedia in web pages, the use of JavaScript libraries enables a level of consistency across all web browsers plus more flexibility around playing the audio or video track.

`{howler}` and `{video}` are in the process of being submitted to CRAN and hopefully both will be available in the next couple of days.
