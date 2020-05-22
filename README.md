# BLOGAPI

[Node](https://nodejs.org/es/)

### JSON API that handle the CRUD of a blog and its comments!

The API is able to handle:
- Creating a blog post.
- Updating a blog post
- Deleting a blog post
- Retrieving a single blog post based on an identifier
- Retrieve a list of blog posts ordered from most recent to older.
- Handle comments on the post: 
    - Creating a post comment
    - Updating a post comment
    - Deleting a post comment

### Some examples of a request are:

```
localhost:7000/blog_post/c/?post_title=My Aunt is amazing!&post_content=I love how my aunt cooks&post_author=Adri
```
```
localhost:7000/blog_post/u/?post_id=4&post_title=Im hungry!&post_content=Lets talk about food, my passion
```

### Additional information:

- You can find the realted postgresql script on: blogDB.sql
- You can find some http request for testing on: test.txt

## How to write a request:


|     Action      |      Method    |             Route              |        Description        |
|     u need      |                |     Entity    |     Action     |                           |
|-----------------|----------------|--------------------------------|---------------------------|
|      Create     |     POST       |  /blog_post   |     /c/        |       insert post         |
|                 |                | /post_comment |     /c/        |      insert comment       |
|      Update     |     PUT        |  /blog_post   |     /u/        |       update post         |
|                 |                | /post_comment |     /u/        |      update comment       |
|      Delete     |    DELETE      |  /blog_post   |     /d/        |       delete post         |
|                 |                | /post_comment |     /d/        |      delete comment       |
|     Retrieve    |      GET       |  /blog_post   |     /r/        |  retrieve one post by id  |
|                 |                |  /blog_post   |     /r2/       |  retrieve a list of post  |
