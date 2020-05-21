import { ParsedUrlQuery } from "querystring";
import * as blog_post from "./Handler/blog_post";  
import { IncomingMessage, ServerResponse } from "http";


export function selectAction(path : string | null, request : IncomingMessage, response: ServerResponse): Promise<ServerResponse> {
    switch (path){
        // insert
        case '/blog_post/c/' :
            try{
                return blog_post.insert(request,response);
            }
            catch(e) {
                return Promise.reject();
            }
        case '/blog_post/r/' :
        break;
        case '/blog_post/u/' :
            try{
                return blog_post.update(request,response);
            }
            catch(e) {
                return Promise.reject();
            }
        case '/blog_post/d/' :
        break;
    }
    
    return Promise.reject(response.writeHead(404,{"Content-Type": "text/plain"}));
} 


