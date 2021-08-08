---
layout: post
title: "Error Notifications when Running Scheduled Jobs"
tags: [rstats, rscript, error-handling]
---

There are several ways to send notifications with R when a scheduled job/process has completed running, but if it errors during that process then we still 
want to have a notification that the script has been unsuccessful. Normally a scheduled job is set-up by using `Rscript`. Normally if a script is being
scheduled, then it generally should be in a good position to run every time without erroring. However there may be times where this is not the case, for
example the data from the previous day hasn't updated, the response of an API call has changed, or simply a new edge case has appeared that hasn't previously
been tested. When this happens the script will exit and the only way to find this out is to actively search the log files to find where the error happened.

Here we will look at a way where if an Rscript errors, then you will get be notified within seconds.

## Set-Up

Creating an automated job is simple enough to do in R; there are different packages available depending on the OS the job is being scheduled on.

- [`{taskscheduleR}`](https://github.com/bnosac/taskscheduleR) for Windows
- [`{cronR}`](https://github.com/bnosac/cronR) for Linux/Unix systems

To run a script every day at 6am, we can run the following:

```r
# taskscheduleR
taskscheduleR::taskscheduler_create(
  taskname = "my_daily_process", 
  rscript = "path/to/script", 
  schedule = "DAILY", 
  starttime = "06:00"
)

# cronR
cronR::cron_add(
  command = cronR::cron_rscript("path/to/script"),
  frequency = "daily",
  at = "06:00"
)
```

## Error Handling

### `.Last`

`.Last` is an useful variable. If `.Last` has been assigned a function in the global environment, then when you decide to quit your R session
then that function will be run before R fully shuts itself down. If you look at the documentation of `quit` by default `runLast`, whether or not
`.Last` should be executed, is set to to `TRUE`. **However** when running `Rscript` and there is an error, it does not call the `.Last` function 
and therefore the e-mail will not be sent.

To get around this, we can change how errors are handled when run within the scheduled job by changing the error option to enable running the `.Last` function.

```r
options(error = \() quit(save = "no", status = 1, runLast = TRUE))
```

### Logging

Logging normally happens in automated jobs, for example when a cron job runs in Linux, the output by default is sent to `/var/spool/mail/user`. However in this case we want to have that information available within the email. To enable this we can create a temporary file and use the `sink()` command to log both the standard output, and the warnings and error messages, to this file which we can attach to the e-mail.

```r
log_filename <- tempfile(fileext = ".log")
log_file <- file(log_filename, open = "wt")
sink(log_file)
sink(log_file, type = "message")
```

To make we close the connection to the log file properly, within the `.Last` function we add the following calls:

```r
sink()
sink(type = "message")
```

## E-mail

Finally, we need a way to send the results to the user. For this I have used the [`{blastula}`](https://rstudio.github.io/blastula/index.html) package. Within the
e-mail, we can include a brief message saying whether or not it has run successfully, and the log file to help diagnose the error.

For more about setting up e-mails to send using SMTP, have a read of this `{blastula}` [vignette](https://rstudio.github.io/blastula/articles/sending_using_smtp.html)

## Final Script

```r
job_completed <- FALSE

if (!interactive()) {
  .Last <- function() {
    sink()
    sink(type = "message")
    
    if (job_completed) {
      job_status <- "Success"
      email_body <- blastula::md(
        "Hello,
        
        Congratulations, the job has run successfully!"
      )
    } else {
      job_status <- "Error"
      email_body <- blastula::md(
        "Hello,
        
        The job has errored. Please take a look at the logs to diagnose where the error occurred."
      )
    }
    
    email_content <- blastula::compose_email(body = email_body)
    email_content <- blastula::add_attachment(email_content, log_filename)
    
    blastula::smtp_send(
      email = email_content,
      to = "username@gmail.com",
      from = "username@gmail.com",
      subject = paste("Scheduled Job Result:", job_status),
      credentials = blastula::creds_file(id = "gmail_creds")
    )
    
    file.remove(log_file)
  }
  
  options(error = \() quit(save = "no", status = 1, runLast = TRUE))
  
  log_filename <- tempfile(fileext = ".log")
  log_file <- file(log_filename, open = "wt")
  sink(log_file)
  sink(log_file, type = "message")
}

... # Code for automated process

job_completed <- TRUE
# end of script

```

### Notes

- A lot of this functionality is wrapped around by `if (!interactive())` because when we run this to debug any issues that have occurred, we want to avoid quitting the process when we find the erroneous code.
- Extra information can be included with the e-mail to save time when debugging the error, such as saving the current workspace when the process errors and include as an attachment. 
- If you only want to receive the e-mail upon erroring, then add an early `return()` in `.Last` checking if `job_completed` is true.

## Alternatives

- Sending the notification by push notification using [`{RPushBullet}`](https://dirk.eddelbuettel.com/code/rpushbullet.html) rather than by e-mail.
- Using a tool like [Apache Airflow](https://airflow.apache.org/docs/apache-airflow/stable/index.html) to monitor all scheduled jobs
