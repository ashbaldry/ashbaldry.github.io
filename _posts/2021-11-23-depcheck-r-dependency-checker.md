---
layout: post
title: "{depcheck}: R Package Dependency Checker"
tags: [rstats, dependencies, package, depcheck]
---

A month or so ago, several hundred R package maintainers were e-mailed about the potential removal of the `{lubridate}` package due to a test failing on MacOS systems. 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">This is a chunk of the 1000+ lines email that about 900+ <a href="https://twitter.com/hashtag/rstats?src=hash&amp;ref_src=twsrc%5Etfw">#rstats</a> package maintainers received due to the impending archival of lubridate.<a href="https://twitter.com/hashtag/lubridatecalypse?src=hash&amp;ref_src=twsrc%5Etfw">#lubridatecalypse</a> <a href="https://t.co/Ccr4eabaLr">pic.twitter.com/Ccr4eabaLr</a></p>&mdash; Elio Campitelli (@d_olivaw) <a href="https://twitter.com/d_olivaw/status/1445440819285176320?ref_src=twsrc%5Etfw">October 5, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The error has since been fixed, and there has been no 'lubrigate' or 'lubridatecalypse'. However, it does beg the question, do all 900+ packages that are importing `{lubridate}` actually require the package enough for it to be a dependency? The short answer is no.

I was one of the maintainers in the e-mail, as my package [`{appler}`](https://github.com/ashbaldry/appler) used `{lubridate}` to manipulate some dates from the Apple App Store API. Around the same time, my package failed a test, so whilst updating the tests, I decided to check where `{lubridate}` was being used. Turns out it was just *once*, where it converted a numeric time-stamp of a review to `POSIXct` using `lubridate::as_datetime`. Looking at the source code behind `as_datetime`, it is a wrapper for the base function `as.POSIXct`, and nothing more. One commit and release later, and `{lubridate}` is no longer a dependency for my package. 

This is just one package and one dependency, though certainly not the only situation. So the next step is, how to make it easier to search for these dependencies which can be removed? Introducing `{depcheck}`, a package that will check the dependencies of a package, and will flag any package that could be looked into, either to copy over the used functions, or remove entirely from the package.

**NB** As of writing this, `{depcheck}` is in an experimental phase, and function names and arguments may change from what is currently in the code chunks below.

