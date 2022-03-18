---
layout: post
title: "{depcheck}: R Package Dependency Checker"
tags: [rstats, dependencies, package, depcheck]
---

A month or so ago, over 700 R package maintainers were e-mailed about the potential removal of the `{lubridate}` package due to a test failing on MacOS systems. 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">This is a chunk of the 1000+ lines email that about 900+ <a href="https://twitter.com/hashtag/rstats?src=hash&amp;ref_src=twsrc%5Etfw">#rstats</a> package maintainers received due to the impending archival of lubridate.<a href="https://twitter.com/hashtag/lubridatecalypse?src=hash&amp;ref_src=twsrc%5Etfw">#lubridatecalypse</a> <a href="https://t.co/Ccr4eabaLr">pic.twitter.com/Ccr4eabaLr</a></p>Elio Campitelli (@d_olivaw) <a href="https://twitter.com/d_olivaw/status/1445440819285176320?ref_src=twsrc%5Etfw">October 5, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The error has since been fixed, and there has been no 'lubrigate' or 'lubridatecalypse'. However, it does beg the question, do all 900+ packages that are importing `{lubridate}` actually require the package enough for it to be a dependency? The short answer is no.

I was one of the maintainers included in the recipient list, as my package [`{appler}`](https://github.com/ashbaldry/appler) used `{lubridate}` to manipulate some timestamps from the Apple App Store API. Around the same time, my package also failed a test, so whilst updating the tests, I decided to check where `{lubridate}` was being used. Turns out it was just *once*, where it converted a numeric time-stamp of a review to `POSIXct` using `lubridate::as_datetime`. Looking at the source code behind `as_datetime`, it is a wrapper for the base function `as.POSIXct`, and nothing more. One commit and release later, and `{lubridate}` is no longer a dependency for my package. 

Although this is just one package and one dependency, it is certainly not the only situation. So the next step is: How to make it easier to search for these dependencies which can be removed? Introducing [`{depcheck}`](https://github.com/ashbaldry/depcheck), a package that will check the dependencies of a package, and will flag any package that could be looked into, either to copy over the used functions, or remove entirely from the package. Several advantages of dependency reduction include:

- **Increased stability** - Every new dependency introduced into a project creates one more opportunity for a breaking change to be introduced in the future. By copying the one or two functions you require into your package, you have greater control of the code, and less likely to see unexpected errors.
- **Speed improvements** - Each package being loaded into the R session adds time, and if you have several packages that aren't necessary, or they contain a lot of dependencies, this can quickly accumulate. This is particularly important when building shiny applications, where reducing the initial load time improves the user experience.
- **Function masking** (or a lack of) - With fewer packages loaded into the R session, you are less likely to have multiple packages with conflicting function names.

## Using `{depcheck}`

Currently there are 3 ways to check package dependency usage:

1. `checkPacakgeDependencyUse()` will read the package `DESCRIPTION` file, extract the packages from Depends and Imports fields, and search for their use in the `R` directory.
2. `checkShinyDependencyUse()` will search for any `library`, `require` or `::` call within the core shiny R scripts (and any specified directories), and search for their use in the same files.
3. `checkProjectDependencyUse()` is a generic version of `checkShinyDependencyUse()`, which can be applied to any project.

The result of all of these is a list, where the names are the dependent packages. Each item in the list contains a `data.frame` of all the exported functions in the package and the frequency of use. When printed, it will display the number of dependencies in the project, as well as the number of sub-dependencies, and if any of them should be looked into for potential removal. This should also make it a lot easier to find dependencies that you aren't entirely where and how they are used.

**NB** As of writing this, `{depcheck}` is in an experimental phase; function names and/or arguments may change from those stated above.

### Example

I have run `checkShinyDependencyUse()` on one of my own shiny applications, the (Reddit Profile Analyzer)[https://ashbaldry.shinyapps.io/reddit_analysis/], to see how well I am utilising the packages I have used.

```r
project_dependencies <- checkShinyDependencyUse("../reddit-analysis-app") # ashbaldry/reddit-analysis-app
summary(project_dependencies)
# Number of Declared Packages: 14
# Total Number of Dependencies: 85
# Declared Packages: utils, glue, httr, highcharter, scales, shiny.semantic, htmlwidgets, stringi, 
# quanteda, R6, data.table, shiny, promises, magrittr
# Function usage for 'glue', 'htmlwidgets', 'stringi', 'magrittr' are below the specified thresholds. 
# Print individual package summaries to check if packages can be removed
```

Clearly, there are potential improvements that can be made, 4 packages have been flagged for low use. Looking further into a couple of these packages:

```r
project_dependencies$stringi
# Package: 'stringi'
# Package Dependencies: 0
# Package Usage: 1 / 256 (0%)
# Functions Used: stri_split_regex
# Function usage for 'stringi' is below the specified thresholds. Consider copying used function to reduce dependencies
```

`{stringi}` has 0 dependencies that aren't base R packages, and the function `stri_split_regex` uses C++ code, so it doesn't seem like a natural contender to copy over to the application. Whilst `strsplit` could normally be a potential alternative, the returning list from this particular regular expression doesn't match, so it is not a viable option. When running the checks in the future, we can include `summary(project_dependencies, ignore_low_usage_packages = "stringi")` to avoid seeing the warning message for `{stringi}`.

```r
project_dependencies$htmlwidgets
# Package: 'htmlwidgets'
# Package Dependencies: 7
# Package Usage: 1 / 14 (7%)
# Functions Used: JS
# Function usage for 'htmlwidgets' is below the specified thresholds. Consider copying used function to reduce dependencies
```

`{htmlwidgets}` would be a great candidate for removal. It has a reasonable number of dependent packages, and the `JS` function is collapsing a character vector and assigning an extra class. This can easily be added into a utility function script and have one fewer dependency.

The other two packages, `{glue}` and `{magrittr}`, are both lightweight packages and are used throughout the codebase. There are arguments to use `paste` and avoid piping. However they are well maintained packages, and they help make the code more readable without adding too many extra dependencies to the project.
