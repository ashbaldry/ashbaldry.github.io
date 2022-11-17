---
layout: post
title: "{designer} 0.2.0: Now with more designing!"
tags: [rstats, package, shiny, designer]
---

# What is {designer}?

When writing this blog, I realised that I never made a post about initial release around the {designer} package (just some sporadic posts on the dying bird app), so a quick introduction to the package:

> The [{designer}](ashbaldry.github.io/designer) package is a code-free solution to prototyping the UI of shiny applications. It helps create a basic wireframe of the application within minutes, and then provides the R code necessary to reproduce the same UI.

So, what has been added to the latest release of the application? Well...

# Updates

## UX

The most noticeable thing when opening the application is that there has been an update to the layout; the components, rather than being a dropdown, have moved to the left of the page. There is also the opportunity to select the page type on start-up. Both have been included to reduce the number of clicks required to start designing you shiny application.

<section style="display: flex; justify-content: space-around; font-weight: 700;">
<div>
<div>
0.1.0
</div>
<img src="/assets/img/blog/designer-0-2-0/designer_0_1_0_page.jpeg" alt="UI of the 0.1.0 release of the designer package">
</div>
<div>
<div>
0.2.0
</div>
<img src="/assets/img/blog/designer-0-2-0/designer_0_2_0_page.jpeg" alt="UI of the 0.2.0 release of the designer package">
</div>
</section>

Another potential pain point was the deletion of elements, where you had to drag the no longer desired element to the "bin" at the bottom of the page. This is still available, however you can now delete any element (and the children components) simply by right-clicking and confirming the delete.

## {bs4Dash} Components

<section style="display: flex; justify-content: space-around; font-weight: 700;">
<div>
<div>
Standard
</div>
<img src="/assets/img/blog/designer-0-2-0/designer_0_2_0_dashboardPage.jpeg" alt="UI of the designer application, using the dashboardPage from the bs4Dash library, with a box, info box, value box, quote and callout">
</div>
<div>
<div>
With {fresh} styling
</div>
<img src="/assets/img/blog/designer-0-2-0/designer_0_2_0_dashboardPage_style.jpeg" alt="UI of the designer application, applying a custom style from the fresh package to the dashboard page">
</div>
</section>

## Custom Styling

When creating applications with standard {shiny} components, you might want to see what

This works particularly well with the [{fresh}]() package for standard shiny applications, and [{fresh}](https://dreamrs.github.io/fresh/) for {bs4Dash} pages. 

## Under the Hood

The amount of JavaScript that has been written for this application became unmaintainable in a couple of scripts, so the code has  

# Well, what's Next?

There have been several requests to include standard templates within the application, and the ability to restore saved templates. This is currently under development, 

The right-click menu is also looking pretty bare at the moment, with only the option to delete the object. The plan is to expand this menu to include editing, so that you wouldn't have to delete and recreate an object to make sure it fit with the updated wireframe.
