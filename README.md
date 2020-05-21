# BLOGAPI
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

localhost:7000/blog_post/u/?post_id=4&post_title=Im hungry!&post_content=Lets talk about food, my passion
```

