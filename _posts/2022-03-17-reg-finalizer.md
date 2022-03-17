---
layout: post
title: "Closing Database Connections in R Packages"
tags: [rstats, databases, package development]
---

When writing R scripts that involve connecting to a database, it is relatively simple to set up the connection at the start of the script (`dbConnect`), do all of the required queries (`dbGetQuery`, `dbWriteTable` etc.) and then at the end of the script close the connection (`dbDisconnect`) without much of an issue (except from finding the missing bracket in the connection string).

However, when writing a package that deals with connecting to a specific database, you want to make it as easy as possible to access and use the database. There might be a wrapper for `dbConnect` so users only need their credentials to connect, avoiding copy and pasting the connection string across every project. We are also all prone to forgetting to include the disconnection at the end of the script, therefore you might want to handle the whole connect/disconnect process, leaving one fewer thing for the user to remember.

## `reg.finalizer`

`reg.finalizer` is a base R function that calls a function either during garbage collection or, in this case, at the end of an `R` session. It runs separately to `.Last` and therefore won't disrupt any other process that is run. It takes three arguments:

- `e` An environment e.g. `.GlobalEnv` or an external pointer
- `f` A function with a single argument - the environment/external pointer - to run at the end of a session
- `onexit` A logical indicator whether to run at the end of an R session. For our purposes this will always be `TRUE`

If you want to see how `reg.finalizer` works, open a new R session and run the following line, and restart your session. You will find a new file appearing in your working directory. **NB** As the connection to the terminal has stopped, you cannot print directly to the console (not that one can see anything when R closes).

```r
reg.finalizer(
  e = .GlobalEnv,
  f = function(e) cat("Output on close", file = "reg_finalizer.txt", append = TRUE),
  onexit = TRUE
)
```

### Set-Up

In order to store the connection within the package, we will create a new environment inside the package. This will be easy enough to store a database connection, and use again when required. 

The example below uses a connection to a SQLite database via the {RSQLite} package, but this can be applied to any SQL/NoSQL database. Whilst username and password aren't necessary for SQLite connections, however most other databases require credentials. Storing them as environment variables or asking to input via `rstudioapi::askForPassword()` is a lot safer than simply saving them in R scripts.

```r
# R/connect.R

DB_ENV <- new.env()
DB_DRIVER <- RSQLite::SQLite()
DB_DBNAME <- ":memory:"

connnectDB <- function(user = Sys.getenv("DB_USERNAME"), 
                       pass = Sys.getenv("DB_PASSWORD", rstudioapi::askForPassword())) {
  if (is.null(DB_ENV$conn)) {
    DB_ENV$conn <- DBI::dbConnect(DB_DRIVER, DB_DBNAME)
  } else {
    # Closing the existing connection if already open
    # Can instead ask the user if they want to restablish connection and stop if they don't
    if (DBI::dbIsValid(DB_ENV$conn)) {
      DBI::dbDisconnect(DB_ENV$conn)
    }
    DB_ENV$conn <- DBI::dbConnect(DB_DRIVER, DB_DBNAME)
  }
  
  invisible(TRUE)
}
```

Next is to write wrappers for any functions within the `{DBI}` package that users need to have access to. Here you can add any extra requirements, such as when writing a table to the database, all column names must be upper case.

```r
# R/dbi.R

getDBQuery <- function(statement, ...) {
  DBI::dbGetQuery(
    conn = DB_ENV$conn,
    statement = statement,
    ...
  )
}

writeDBTable <- function(name, value, ...) {
  DBI::dbWriteTable(
    conn = DB_ENV$conn,
    name = toupper(name),
    value = setNames(value, toupper(names(value)))
    ...
  )
}
```

### Adding `reg.finalizer`

The package is now in a state to allow users to interact with the database, however it will create a lot of unclosed connections. This is where `reg.finalizer` comes into use; we will add this to a couple of internal functions that are called when the package is either loaded or unloaded: `.onLoad` and `.onUnload`.

`.onLoad` enables the disconnection function to be registered to the database environment, so the handler to close the connection is set up before the user has even tried to connect. In the event that the package is unloaded for any reason that isn't a session restart, we also use `.onUnload` to disconnect. We want to make sure that all connections are safely and properly disconnected.

```r
# R/zzz.R
closeConnection <- function(e, conn_name = "conn") {
  # Want to be as defensive as possible, so if there is no connection, we don't want to test it
  if (conn_name %in% ls(e)) {
    conn <- get(conn_name, envir = e)
    # If connection has closed for any other reason, we don't want the function to error
    if (DBI::dbIsValid(conn)) {
      DBI::dbDisconnect(conn)
    }
  }
}

.onLoad <- function(libname, pkgname) {
  reg.finalizer(
    e = DB_ENV,
    f = closeConnection,
    onexit = TRUE
  )
}

.onUnload <- function(libpath) {
  closeConnection(DB_ENV)
}
```

The process is now set up! People are now free to access the database without having to worry about sorting out connections, or potentially leaving an unused connection open.

## Multiple Connections

Of course, you might require connections to multiple databases, and want to store the different connections in the same package. It might be a couple of specific connections that can be given predetermined names, or it might be more dynamic and the connection depends on the database name. In either case, we can slightly adapt the `closeConnection` to handle any number of connections by using `ls` to list all connections established in the package.

```r
# R/zzz.R
closeConnections <- function(e) {
  for (conn_name in ls(e)) {
    conn <- get(conn_name, envir = e)
    if (DBI::dbIsValid(conn)) {
      DBI::dbDisconnect(conn)
    }
  }
}

.onLoad <- function(libname, pkgname) {
  reg.finalizer(
    e = DB_ENV,
    f = closeConnections,
    onexit = TRUE
  )
}

.onUnload <- function(libpath) {
  closeConnections(DB_ENV)
}
```

## `.Last`

Although `.Last` applies to scripts more than packages, it is still worth mentioning here.

Setting up automated scripts that involve calls to databases may break due to an unexpected error. This will terminate the R process without closing the connection to the database. Similar to an [earlier post on sending notifications on errors](https://ashbaldry.github.io/2021-08-09-rscript-error-notification/), the `dbDisconnect` function can be added within the `.Last` function to ensure that even when a script fails to run, the connection is still closed.

```r
conn <- DBI::dbConnect(RSQLite::SQLite(), ":memory:")

.Last <- function() {
  if (DBI::dbIsValid(conn)) {
    DBI::dbDisconnect(conn)
  }
}

# When automated, this will make sure the disconnection still happens
if (!interactive()) {
  options(error = \() quit(save = "no", status = 1, runLast = TRUE))
}
```
