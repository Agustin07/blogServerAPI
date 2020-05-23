import { connectpg } from "../DBconection"
import * as dbQuerys from "../DBconection"
import { IncomingMessage, ServerResponse } from "http";
import * as url from "url";
import {responseHandler} from "../myRouter";

interface postComment {
    id_comment ?: number | undefined,
    id_post ?: number | undefined,
    comment : string,
    username : string,
    date_posted ?: Date
}

export const insert = async (req: IncomingMessage,resp: ServerResponse) : Promise<responseHandler> => {
    let params=url.parse(req.url as string,true).query;

    if(req.method!=='POST') return { code :400 , result : "Sorry, we coulnd't handle this!  Invalid method "+req.method+" at traying to create a comment"};
    
    if(!(params.post_id)) return { code :400 , result : "Sorry, we coulnd't handle this! U haven't submited a post id"}; 

    let idPost=Number.parseInt(params.post_id as string);
    if(Number.isNaN(idPost)) return { code :400 , result : "Sorry, we coulnd't handle this! post id should be a number"}; 
            
    let pComment : postComment = { 
        id_post : idPost,
        comment : String(params.comment),
        username : String(params.username)
    } 

    let exists = await connectpg.query(dbQuerys.queryExistPost, [pComment.id_post]);
    
    if ( Number.parseInt(exists.rows[0].found) !== 1) return { code :404, result : "Post not found!"};
    
    let respHandler : responseHandler = { code : 404, result : 'not found!' }
    await connectpg.query(dbQuerys.sqlInsertComment,[pComment.id_post,pComment.comment,pComment.username])
        .then(res => respHandler = { code : 200, result : 'Comment saved!' })
        .catch(e => respHandler = { code : 500, result : 'DB: Something went wrong trying to save comment!' });
    
    return respHandler;
}


export const update = async (req: IncomingMessage,resp: ServerResponse) : Promise<responseHandler> => {
    let params=url.parse(req.url as string,true).query;

    if(req.method!=='PUT') return { code :400, result : "Sorry, we coulnd't handle this! Invalid method "+req.method+" at traying to update a comment"};
    
    if(!(params.comment_id)) return { code :404, result : "Sorry, we coulnd't handle this! U haven't submited a comment id"};
    
    let idComment=Number.parseInt(params.comment_id as string);
    if(Number.isNaN(idComment)) return { code :400 , result : "Sorry, we coulnd't handle this! comment id should be a number"}; 

    let pComment : postComment = { 
        id_comment : idComment,
        comment : String(params.comment),
        username : String(params.username) 
    } 

    let exists = await connectpg.query(dbQuerys.queryExistComment,[pComment.id_comment]);

    if ( Number.parseInt(exists.rows[0].found) !== 1) return { code :404, result : "Post or comment not found!"};
    
    let respHandler : responseHandler = { code : 404, result : 'not found!' }
    await connectpg.query(dbQuerys.sqlUpdateComment, [ pComment.comment, pComment.username, pComment.id_comment ])
            .then(res => respHandler = { code : 200, result : 'Comment updated!' })
            .catch(e => respHandler = { code : 500, result : 'DB: Something went wrong trying to update a comment!' });
        
    return respHandler;
}

export const deleteComment = async (req : IncomingMessage, resp : ServerResponse ) : Promise<responseHandler> => {
    let params=url.parse(req.url as string,true).query;

    if(req.method!=='DELETE') return { code :400 , result : "Sorry, we coulnd't handle this! Invalid method "+req.method+" at traying to delete a comment"};

    if(!(params.comment_id)) return { code :404, result : "Sorry, we coulnd't handle this! U haven't submited a comment id"};
    
    let id_comment=Number.parseInt(params.comment_id as string);
    if(Number.isNaN(id_comment)) return { code :400 , result : "Sorry, we coulnd't handle this! comment id should be a number"};

    let exists = await connectpg.query(dbQuerys.queryExistComment, [id_comment]);

    if ( Number.parseInt(exists.rows[0].found) !== 1) return { code :404, result : "Post or comment not found!"};
    
    let respHandler : responseHandler = { code : 404, result : 'not found!' }
    await connectpg.query(dbQuerys.sqlDeleteComment,[id_comment])
            .then(res => respHandler = { code : 200, result : 'Comment deleted!' })
            .catch(e => respHandler = { code : 500, result : 'DB: Something went wrong trying to delete a comment!' });
    
    return respHandler;
}


export const retrieveCommentsByPostId =  async (req : IncomingMessage, resp : ServerResponse ) : Promise<responseHandler> => {
    let params=url.parse(req.url as string,true).query;

    if ( req.method !== 'GET' ) return { code :400, result : "Sorry, we coulnd't handle this! Invalid method "+req.method+" at traying to retrieve a post"};
    
    if ( !(params.post_id) ) return { code :404, result : "Sorry, we coulnd't handle this! U haven't submited a post id"};

    let id_post=Number.parseInt(params.post_id as string);
    if(Number.isNaN(id_post)) return { code :400 , result : "Sorry, we coulnd't handle this! post id should be a number"}; 


    let exists = await connectpg.query(dbQuerys.queryExistPost, [id_post]);
           
    if ( Number.parseInt(exists.rows[0].found) !== 1) return { code :404, result : "Post not found!"};

    let respHandler : responseHandler = { code:404,result : 'Not found!' };
    await connectpg.query(dbQuerys.queryCommentsByPostId,[id_post])
    .then(res => respHandler = { code : 200, result : JSON.stringify(res.rows) })
    .catch(e => respHandler = { code : 500, result : "DB: Something went wrong trying to retrieve a single post!" } );

    return respHandler;
}