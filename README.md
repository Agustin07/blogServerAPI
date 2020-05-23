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

Using POST to insert a Post:
```
localhost:7000/blog_post/c/?post_title=What They Thought of Programmers.&post_content=It is interesting and educational to go back in time and look at how programmers were represented in popular culture. What did they think of us? Did they know who were?&post_author=Robert C. Martin
```
Using GET to Retrieve a Post by Id:
```
localhost:7000/blog_post/r1/?post_id=4
```
Using PUT to Update a Post: 
```
localhost:7000/blog_post/u/?post_id=1&post_title=What They Thought of Programmers.&post_content=It is interesting to go back in time and look at how programmers were represented in popular culture. What did they think of us? Did they know who were?
```
Using DELETE to Delete a Post:
```
localhost:7000/blog_post/d/?post_id=6
```

### Additional information:

- You can find the realted postgresql script on: blogDB.sql
- You can find some http request for testing on: test.txt

## How to write a request:

| Action |Method  |   Route | Description                         |
|----------------|---------------|----------------|-----------|
|Create|   POST        |      /blog_post/c/         |insert post  |
|Update          |    PUT       | /blog_post/u/ |   update post   |
|Delete         | DELETE|/blog_post/d/| delete post|
|Retrieve |  GET |  /blog_post/r1/     |  retrieve one post by id |
||  |  /blog_post/rall/     | retrieve a list of post  |


- Also the API can handle comments on a post. Example: 
```
localhost:7000/post_comment/c/?post_id=1&comment=I am a programer!&username=Agustin M.
```