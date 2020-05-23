
// ---- npm modules
import { IncomingMessage} from "http";

// ---- internal modules
import * as blog_post from "./Handler/blog_post";  
import * as post_comment from "./Handler/post_comment";  


export interface responseHandler  { code : number, info ?: any; result ?: any } ;

export function selectAction(path : string | null, request : IncomingMessage): Promise<responseHandler> {
    switch (path){
        case '/blog_post/c/' :
            return blog_post.insert(request);

        case '/blog_post/r1/' :
            return blog_post.retrievePostById(request);

        case '/blog_post/rall/':
            return blog_post.retrieveAll(request);

        case '/blog_post/u/' :
            return blog_post.update(request);

        case '/blog_post/d/' :
            return blog_post.deletePost(request);

        case '/post_comment/c/' :
            return post_comment.insert(request);

        case '/post_comment/r/' :
            return post_comment.retrieveCommentsByPostId(request);

        case '/post_comment/u/' :
            return post_comment.update(request);

        case '/post_comment/d/' :
            return post_comment.deleteComment(request);
    }

    return Promise.resolve({ code: 400, result : "Sorry, we coulnd't handle this! Route "+path+" is not valid!"});
} 


