---
layout: post
title: "{designer} 0.2.0: Now with more designing!"
tags: [rstats, package, shiny, designer]
---

I'm really happy to announce the update of the {designer} package! This is the first package that I've created that has warranted such an update, and I'm hoping the new features added will be useful.

## What is {designer}?

When coming to write up about this release, I realised that I never made a post about initial release around the {designer} package (just some sporadic posts on the dying bird app), so a quick introduction to the package:

> The [{designer}](ashbaldry.github.io/designer) package is a code-free solution to prototype the UI of shiny applications.

With {designer}, you can create a basic wireframe of the application within minutes, and then provide the R code necessary to reproduce the same UI.

![Example of the designer shiny application creating a basic wireframe with a header, 3 inputs and a plot](https://raw.githubusercontent.com/ashbaldry/designer/main/man/figures/example_app.gif)

So, what has been added to the latest release of the application?

### UX

The most noticeable thing when opening the application is the update to the layout; the components, rather than being a dropdown, have moved to the left of the page. There is also the opportunity to select the page type on start-up. Both have been included to reduce the number of clicks required to start designing you shiny UI.

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

A new page type has been added to the application: the `dashboardPage` available in [{bs4Dash}](https://rinterface.github.io/bs4Dash/index.html). This will help provide an alternative to `navbarPage` for multi-tab applications.

Along with the page type, several components in {bs4Dash} package have been added. These include the box, info box and value box, providing an easy way to show high-level values in your application. 

<img src="/assets/img/blog/designer-0-2-0/designer_dashboardPage.jpeg" alt="UI of the designer application, using the dashboardPage from the bs4Dash library, with a box, info box, value box, quote and callout">

**NB** Please note that the {bs4Dash} components are only available with the `dashboardPage` as there are styling conflicts when applying these components to standard shiny applications.

### Custom Styling

When creating applications with standard {shiny} components, you might want to see what it looks like with your company colours, or you just want to not see the standard bootstrap application style. This release includes the ability to upload a custom CSS file that can be applied to the wireframe.

There are packages such as [{bslib}](https://rstudio.github.io/bslib/index.html) and [{fresh}](https://dreamrs.github.io/fresh/) that help create CSS files that can dramatically change the look of shiny applications. Once you have a theme you are happy with, save the CSS and upload to the application, and see the wireframe update to your own personal theme.

<img src="/assets/img/blog/designer-0-2-0/designer_dashboardPage_style.jpeg" alt="UI of the designer application, applying a custom style from the fresh package to the dashboard page">

<figcaption>
The bs4Dash application with the "lumen" theme.
</figcaption>

### Sharing Templates

You can now share wireframes you create using {designer}! If the application is hosted on a server then with one click you can store the state of your most recent wireframe and share with others. Thanks to [Sam Parmer](https://github.com/parmsam) for making it possible to host the application with Docker. This should make it even quicker to produce wireframes in the future.

<video width="320" height="240" controls>
<source src="/assets/img/blog/designer-0-2-0/designer_bookmark.mp4" type="video/mp4">
</video>

<figcaption>
Saving a wireframe in designer, and then restoring the wireframe in a new tab.
</figcaption>

There are a few limitations with how the storing is implemented (such as having to save new bookmarks each time the wireframe is updated), however there are plans to make the process of saving and sharing a lot more seamless.

### Under the Hood

The amount of JavaScript in this application has become unmaintainable in its previous state of sourcing 3 scripts, so the code has been moved into a separate sub-directory. This has enabled the use of the JavaScript library [esbuild](https://esbuild.github.io/) to bundle up all of the code into a single, convenient, minified JavaScript file. Using esbuild has meant in one click all of the JavaScript code has been built, minified, and sent to the "www" folder, and all in under 1 second.

By having a better project structure for the JavaScript code, it is a lot easier to develop new features such as adding the {bs4Dash} components. Each component has its own individual class (and file), and by using class inheritance there is a generic Component class that can provide common functionality across all individual component classes. It has also meant I can keep internal functions for a particular part of the application in a self-contained script, and not worry about naming clashes with other scripts (similar to how internal functions in R packages do not affect globally available functions). 

---

Thanks to everyone who has provided feedback, it has been greatly appreciated, and reflected in some of the features in this release. If you do have any thoughts on improvements, feel free to leave an issue on [GitHub](github.com/ashbaldry/designer). 
The application is also available to try on [shinyapps.io](ashbaldry.shinyapps.io/designer).
