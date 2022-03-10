---
layout: post
title: "Closing Database Connections in R Packages"
tags: [rstats, databases, package]
---

When writing R scripts that involve connecting to a database, it is easy enough to set up the connection at the start of the script (`dbConnect`), do all of the required queries (`dbGetQuery`, `dbWriteTable` etc.) and then at the end of the script close the connection (`dbDisconnect`) without much issue.

However, when writing a package that deals with connecting to a specific database, you want to make it as easy as possible for users to access the database and perform their analysis. There might be a wrapper for `dbConnect` to ensure the user only needs to include their username and password to successfully connect. We are all prone to forgetting to include the disconnection at the end of the script, and so you might want to handle all database connections, leaving one fewer thing for the analyst to consider.

## `.Last`

Although `.Last` applies to scripts more than packages, it is worth mentioning here.

Setting up automated scripts that involve calls to databases can break for any reason, and therefore the connection to the database may not successfully close. Similar to an [earlier post on notifications on errors](https://ashbaldry.github.io/2021-08-09-rscript-error-notification/), the `dbDisconnect` function can be added to the `.Last` function to ensure that even when a script fails to run, it still closes the connection.

```
conn <- dbConnect()

.Last <- function() {
  if (DBI::dbIsValid(conn)) { # If already closed, no need to re-close connection
    DBI::dbDisconnect(conn)
  }
}

# When automated, this will make sure the disconnection still happens
if (!interactive()) {
  options(error = \() quit(save = "no", status = 1, runLast = TRUE))
}
```

## `reg.finalizer`

The `reg.finalizer` function is a function in base R that can either be called upon garbage collection or, in this case, at the end of an `R` session. It runs separately to `.Last` and 

In the example I will be using {RSQLite} but this can be applied to 

### Set-Up

We want to store the connection within the package, so we will create an internal environment
to be able to store and call the connection.

```
# R/connect.R

DB_ENV <- new.env()
DB_DRIVER <- RSQLite::SQLite()
DB_DBNAME <- ":memory:"

connnectDB <- function(user = Sys.getenv("USER"), 
                       pass = Sys.getenv("PASS", rstudioapi::askForPassword())) {
  if (is.null(DB_ENV$CONN)) {
    DB_ENV$CONN <- DBI::dbConnect(DB_DRIVER, DB_DBNAME)
  } else {
    # Closing the existing connection if already open
    # Can instead ask the user if they want to restablish connection and stop if they don't
    if (DBI::dbIsValid(DB_ENV$CONN)) {
      DBI::dbDisconnect(DB_ENV$CONN)
    }
    DB_ENV$CONN <- DBI::dbConnect(DB_DRIVER, DB_DBNAME)
  }
  
  invisible(TRUE)
}
```

Username and password aren't necessary for SQLite connections, however most other databases require credentials, and having them as environment variables or asking to write via `rstudioapi::askForPassword()` is a lot safer than saving them in R scripts.

Next is to write wrappers for any functions within the `{DBI}` package that you want users to have access to. Here you can add any extra requirements such as all tables written must have upper case column names.

```
# R/dbi.R

getDBQuery <- function(statement, ...) {
  DBI::dbGetQuery(
    conn = DB_ENV$CONN,
    statement = statement,
    ...
  )
}

writeDBTable <- function(name, value, ...) {
  DBI::dbWriteTable(
    conn = DB_ENV$CONN,
    name = name,
    value = value
    ...
  )
}
```

### Adding `reg.finalizer`

```
# R/package.R
.onLoad <- function() {
  reg.finalizer(
    e = DB_ENV,
    f = function(e) {
      if (DBI::dbIsValid(e$CONN)) {
        DBI::dbDisconnect(e$CONN)
      }
    }
  )
}

```
