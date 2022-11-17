---
layout: post
title: "{designer} 0.2.0: Now with more designing!"
tags: [rstats, package, shiny, designer]
---

## What is {designer}?

When planning the release of the update to CRAN, I realised that I never made a post about initial release around the {designer} package (just some sporadic posts on the dying bird app), so a quick introduction to the package:

> The [{designer}](ashbaldry.github.io/designer) package is a code-free solution to prototype the UI of shiny applications.

With {designer}, you can create a basic wireframe of the application within minutes, and then provides the R code necessary to reproduce the same UI.

So, what has been added to the latest release of the application?

### UX

The most noticeable thing when opening the application is the update to the layout; the components, rather than being a dropdown, have moved to the left of the page. There is also the opportunity to select the page type on start-up. Both have been included to reduce the number of clicks required to start designing you shiny application.

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
<figcaption>
A much more convenient way to start wireframing your application!
</figcaption>
</div>
</section>

Another pain point was the deletion of elements, where you had to drag the redundant element to the "bin" at the corner of the page. This is still available, however you can now delete any element (and the children components) simply by right-clicking and clicking the delete option.

### {bs4Dash} Components

A new page type has been added to the application: the `dashboardPage` available in {bs4Dash}. This will help provide an alternative to `navbarPage` for multi-tab applications.

Along with the page type, several components in {bs4Dash} package have been added. These include the box, info box and value box, providing an easy way to show high-level values in your application. 

<img src="/assets/img/blog/designer-0-2-0/designer_dashboardPage.jpeg" alt="UI of the designer application, using the dashboardPage from the bs4Dash library, with a box, info box, value box, quote and callout">

**NB** Please note that the {bs4Dash} components are only available with the `dashboardPage`.

### Custom Styling

When creating applications with standard {shiny} components, you might want to see what it looks like with your company colours, or you just want to not see the standard bootstrap application style. This release includes the ability to upload a custom CSS file that can be applied to the wireframe.

There are packages such as [{bslib}](https://rstudio.github.io/bslib/index.html) and [{fresh}](https://dreamrs.github.io/fresh/) that help create CSS files that can dramatically change the look of shiny applications. Once you have a theme you are happy with, save the CSS and upload to the application, and see the wireframe update to your own personal theme.

<img src="/assets/img/blog/designer-0-2-0/designer_dashboardPage_style.jpeg" alt="UI of the designer application, applying a custom style from the fresh package to the dashboard page">

<figcaption>
The bs4Dash application with the "lumen" theme.
</figcaption>

### Under the Hood

The amount of JavaScript in this application has become unmaintainable in its previous state of sourcing 3 scripts, so the code has been moved into a separate sub-directory. This has enabled the use of the JavaScript library [esbuild](https://esbuild.github.io/) to bundle up all of the code into a single, convenient, minified JavaScript file. Using esbuild has meant in one click all of the JavaScript code has been built, minified, and sent to the "www" folder, and all in under 1 second.

By having a better project structure for the JavaScript code, it is a lot easier to develop new features such as adding the {bs4Dash} components. Each component has its own individual class (and file), and by using class inheritance there is a generic Component class that can provide common functionality across all individual component classes. It has also meant I can keep internal functions for a particular part of the application in a self-contained script, and not worry about naming clashes with other scripts (similar to how internal functions in R packages do not affect globally available functions). 

## Well, what's Next?

There have been several requests to include standard templates within the application, and the ability to restore saved templates. This is currently under development, 

The right-click menu is also looking pretty bare at the moment, with only the option to delete the object. The plan is to expand this menu to include editing, so that you wouldn't have to delete and recreate an object to make sure it fit with the updated wireframe.

---

As always, any feedback on the application is greatly appreciated; feel free to leave an issue on [GitHub](github.com/ashbaldry/designer). 
The application is also available to try on [shinyapps.io](ashbaldry.shinyapps.io/designer).
