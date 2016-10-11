
# Primitive Wikimedia #

**Primitive Wikimedia** is the working title for a project using
[PrimitivePic](https://github.com/fogleman/primitive) that I am doing to force
myself to learn a few things I haven't mastered yet or done at all, including:

* Crawling HTML
* Automatically uploading images to a file server and social media accounts
* Automatically posting to a blog and adding entries to a web app

## The Process #

A daily task that will:

* Scrape the current daily image from [Wikimedia Commons](https://commons.wikimedia.org/wiki/Main_Page)
* Run [PrimitivePic](https://github.com/fogleman/primitive) commands against them.
* Automatically post a abstract version to blog and twitter.
* Automatically add an entry to a page that accumulates a collection of images.

## My Setup #

My setup involves three main locations.

1. Amazon S3: A file server from Amazon Web Services that will serve my images.
2. Amazon EC2: An ubuntu instance where my `cron` job will run daily.
3. PythonAnywhere: The location of my web app.

## Posts #

These are the posts I've made about the project so far:

* [Scraping the Wikimedia Commons Daily Image with NodeJs](/blog/post/2016/09/prog001_scrapeDailyImage)
* [Using PrimitivePic](/blog/post/2016/10/prog001_primitiveImageProgram)
* [Uploading Images to Amazon S3](/blog/post/2016/10/prog001_s3-upload)