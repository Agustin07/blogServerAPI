import * as blog_post from "./Handler/blog_post";  
import * as post_comment from "./Handler/post_comment";  

import { IncomingMessage, ServerResponse } from "http";

export interface responseHandler  { code : number, info ?: any; result ?: any } ;

export function selectAction(path : string | null, request : IncomingMessage, response: ServerResponse): Promise<responseHandler> {
    switch (path){
        case '/blog_post/c/' :
            return blog_post.insert(request,response);

        case '/blog_post/r1/' :
            return blog_post.retrievePostById(request,response);

        case '/blog_post/rall/':
            return blog_post.retrieveAll(request);

        case '/blog_post/u/' :
            return blog_post.update(request,response);

        case '/blog_post/d/' :
            return blog_post.deletePost(request,response);

        case '/post_comment/c/' :
            return post_comment.insert(request,response);

        case '/post_comment/r/' :
            return post_comment.retrieveCommentsByPostId(request,response);

        case '/post_comment/u/' :
            return post_comment.update(request,response);

        case '/post_comment/d/' :
            return post_comment.deleteComment(request,response);
    }

    return Promise.resolve({ code: 400, result : "Sorry, we coulnd't handle this! Route "+path+" is not valid!"});
} 


