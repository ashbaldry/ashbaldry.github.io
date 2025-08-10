---
layout: post
title: "{shinytesters}: Updating Inputs in testServer"
tags: [rstats, package, shiny, shinytesters]
---

I have been working on a project where we have been unable to use {[shinytest2](https://rstudio.github.io/shinytest2/)}, 
and therefore have had a heavy reliance on the [`testServer`](https://shiny.posit.co/r/reference/shiny/latest/testserver.html)
function on testing the reactive functionality in each of the modules. Whilst it is great for checking the server-side
logic based on dummy inputs being clicked, or `reactiveValues` being updated, one point of friction was when an
observer would update an input, and that input would trigger another event. You can manually update the input in
the test after the observer, but it can cause some discrepancy between what the order of observers in a module and
what is happening in the test.

This is where {[shinytesters](https://ashbaldry.github.io/shinytesters)} comes in. This package aims to mock any
update function in {shiny} or Shiny extension package, and update the input in `testServer` when called in an
observer. This will allow the running order of observers in tests to match what would happen in a live Shiny session,
plus avoiding any need to manually update input values.

The main function available in {shinytesters} is `use_shiny_testers`. This function utilises the 
[`local_mocked_bindings`](https://testthat.r-lib.org/reference/local_mocked_bindings.html) function in the {testthat}
package. Mocking functions in tests is particularly useful for testing functions that call functions that connect
to APIs, to avoid the reliance on an internet connection when running the tests. Here it is particularly
useful as we don't have a UI for the messages sent from the update functions, and want to create a way to do
this to the mock shiny session. 

Each function in a package that contains the word "update" are found within the package and a mock function is
created to extract the new input that was going to be sent to the UI. This has been facilitated by using the
{rlang} package, being able to extract the function argument names, the call values, and any other information
around the call with easy to use functionality. This function can be put in the start of a `test_that` expression 
to add a mocked version of all update functions within a given package. 

Below is an example of how it is implemented:

```r
library(testthat)
library(shiny)
library(shinytesters)

test_that("Selected date updates when button is triggered", {
  use_shiny_testers()

  example_server_fn <- function(input, output, session) {
    observeEvent(input$trigger, {
      updateDateInput(
        inputId = "result",
        label = "New Label",
        value = as.Date("2000-01-01"),
        min = as.Date("1999-12-31")
      )
    })
  }

  shiny::testServer(
    app = example_server_fn,
    expr = {
      session$setInputs(result = as.Date("2025-01-02"))
      session$setInputs(trigger = 1L)

      expect_identical(input$result, as.Date("2000-01-01"))
      expect_identical(input$result.min, as.Date("1999-12-31"))
      expect_null(input$result.max)
    }
  )
})
```

One thing to note is that not only can you see that the input has been updated, but other values are also available
in the input. In a date input, you can select the minimum and maximum date a user a can choose, but there is no way
to track it in `testServer`. Similar cases happen when changing the options in a select input or updating the
label of any given input. These are also available in {shinytesters} by appending the argument to the end of the 
input ID, separated by a period. So in the example above, the minimum date is now available under `result.min`.
In Shiny functions, when an argument is `NULL`, then it is not updated, this is also reflected in {shinytesters},
so you are able to check when attributes of an input have updated without the actual input updating.

When there are multiple Shiny extension packages are being used in a single module, then you will need to call
`use_shiny_testers` multiple times, one for each package.

```r
test_that("Testing complex shiny module", {
  use_shiny_testers() # By default it mocks the shiny package update function
  use_shiny_testers(.package = "shinyWidgets")
  ...
})
```

There have been some assumptions made around the argument names that are used in the update functions, based off
the shiny package. This is not always the case with the extension packages, so the following can be updated
so that they all work as expected:

- `id_arg` to specify the ID argument e.g. "input_id" in the {shiny.semantic} package
- `value_args` to specify the arguments that the input value can be assigned from. This is different even
  in the {shiny} package itself, where single values are "value", whereas multiple options such as the
  select input use "selected"
- `range_value_args` to specify the arguments that a 2-length input value can be assigned from.
  Additional logic is added here when these exist in the function call to make sure that the
  first and/or last value aren't updated when they are assigned `NULL`

If the functions in a package don't all contain the explicit word "update", then there is also
`create_test_update_fns`. With this function, any number of function names in a particular package
will be mocked to update the inputs when called in the test script.

```r
test_that("Selected date updates when button is triggered", {
  local_mocked_bindings(!!!create_test_update_fns(c("updateDateInput", "updateSelectInput")))
  ...
})
```

Note: This will require {rlang} or use `do.call` instead to assign the functions to the local mocked bindings.

The {shinytesters} package will be on its way to CRAN soon, but in the meantime is available to install
from GitHub using `remotes::install_github("ashbaldry/shinytesters")`.
