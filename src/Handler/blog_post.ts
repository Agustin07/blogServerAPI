
// ---- npm modules
import { IncomingMessage } from "http";
import * as url from "url";

// ---- internal modules
import { connectpg } from "../DBconection"
import * as dbQuerys from "../DBconection"
import {responseHandler} from "../myRouter";

interface blogPost {
    id_post?: number | undefined,
    title : string,
    content: string,
    author?: string,
    date_posted ?: Date
}


export const insert = async (req: IncomingMessage) : Promise<responseHandler> => {
        let params=url.parse(req.url as string,true).query;

        if(req.method!=='POST') return { code :400, result : "Sorry, we coulnd't handle this! Invalid method "+req.method+" at traying to create a post"};
        
        if(!!(params.post_id)) return { code :400, result : "Sorry, we coulnd't handle this! You submited a post id, maybe you shoult try an udpade!"};

        let newPost : blogPost = { 
            title : String(params.post_title as string),
            content: String(params.post_content),                
            author: String(params.post_author),
         } 

        let respHandler : responseHandler = { code:404,result : 'not found!' }
        await connectpg.query(dbQuerys.sqlInsertPost,[newPost.title,newPost.content,newPost.author])
            .then(res => respHandler = { code :200, result : "Post saved!"})
            .catch(e => respHandler = { code :500, result : "DB: Something went wrong trying to insert!"});

        return respHandler;        
}


export const update = async (req: IncomingMessage) : Promise<responseHandler> => {
    let params=url.parse(req.url as string,true).query;

    if(req.method!=='PUT') return { code :400, result : "Sorry, we coulnd't handle this! Invalid method "+req.method+" at traying to update a post"};
    
    if(!(params.post_id)) return { code :404, result : "Sorry, we coulnd't handle this! U haven't submited a post id"};

    let idPost=Number.parseInt(params.post_id as string);
    if(Number.isNaN(idPost)) return { code :400 , result : "Sorry, we coulnd't handle this! post id should be a number"}; 
    
    let updtPost : blogPost = {
        id_post: idPost,
        title : String(params.post_title as string),
        content: String(params.post_content)
    } 

    let exists = await connectpg.query(dbQuerys.queryExistPost,[updtPost.id_post]);

    if ( Number.parseInt(exists.rows[0].found) !== 1) return { code :404, result : "Post not found!"};
    
    let respHandler : responseHandler = { code:404,result : 'not found!' }
    await connectpg.query(dbQuerys.sqlUpdatePost,[updtPost.title,updtPost.content,updtPost.id_post])
        .then(res => respHandler ={ code : 200, result : "Post updated!"})
        .catch(e => respHandler ={ code : 500, result : "DB: Something went wrong trying to update!"});
    return respHandler;
}

export const deletePost = async (req : IncomingMessage ) : Promise<responseHandler> => {
    let params=url.parse(req.url as string,true).query;

    if (req.method!=='DELETE') return { code :400 , result : "Sorry, we coulnd't handle this! Invalid method "+req.method+" at traying to delete a post"};
    
    if(!(params.post_id)) return { code :404 , result : "Sorry, we coulnd't handle this! U haven't submited a post id"};

    let id_post=Number.parseInt(params.post_id as string);
    if(Number.isNaN(id_post)) return { code :400 , result : "Sorry, we coulnd't handle this! post id should be a number"};

    let exists = await connectpg.query(dbQuerys.queryExistPost,[id_post]);
    
    if ( Number.parseInt(exists.rows[0].found) !== 1) return { code :404, result : "Post not found!"};
    
    let respHandler : responseHandler = { code:404,result : 'not found!' }
    await connectpg.query(dbQuerys.sqlDeletePost,[id_post])
        .then(res => respHandler = { code : 200, result : "Post deleted!"})
        .catch(e => respHandler = { code : 500, result : "DB: Something went wrong trying to delete!"});
   
    return respHandler
}

export const retrievePostById = async (req : IncomingMessage) : Promise<responseHandler> => {
    let params=url.parse(req.url as string,true).query;

    if ( req.method !== 'GET' ) return { code :400, result : "Sorry, we coulnd't handle this! Invalid method "+req.method+" at traying to retrieve a post"};
    
    if ( !(params.post_id) ) return { code :404, result : "Sorry, we coulnd't handle this! U haven't submited a post id"};

    let id_post=Number.parseInt(params.post_id as string);
    if(Number.isNaN(id_post)) return { code :400 , result : "Sorry, we coulnd't handle this! post id should be a number"}; 


    let exists = await connectpg.query(dbQuerys.queryExistPost, [id_post]);
           
    if ( Number.parseInt(exists.rows[0].found) !== 1) return { code :404, result : "Post not found!"};

    let respHandler : responseHandler = { code:404,result : 'Not found!' }
    let myPost =await connectpg.query(dbQuerys.queryPostById,[id_post]);
    await connectpg.query(dbQuerys.queryCommentsByPostId,[id_post])
    .then(res => {   
        let postData= myPost.rows;
        let commentsData=res.rows;
        const listofPost = postData.map((pval) => {
            pval.comments = commentsData.filter(cval => cval.post_id===pval.post_id);
            return pval;
        });
        respHandler = { code : 200, result : JSON.stringify(listofPost) }  
    })
    .catch(e => respHandler = { code : 500, result : "DB: Something went wrong trying to retrieve a single post!" } );

    return respHandler;
}

export const retrieveAll = async ( req : IncomingMessage ) : Promise<responseHandler> => {
    let params=url.parse(req.url as string, true).query;

    if ( req.method !== 'GET' ) return { code :400, result : "Sorry, we coulnd't handle this! Invalid method "+req.method+" at traying to retrieve a post"};

    let respHandler : responseHandler = { code : 404, result : 'Not found!' };

    let allPostsResult = await connectpg.query(dbQuerys.queryAllPost);
    await connectpg.query(dbQuerys.queryAllComments)
    .then(res => {
        let allPosts= allPostsResult.rows;
        let allComments=res.rows;
        const listofPosts = allPosts.map((post_val) => {
            post_val.comments = allComments.filter(comment_val => comment_val.post_id===post_val.post_id);
            return post_val;
        });
        respHandler = { code : 200, result : JSON.stringify(listofPosts) } 
    })
    .catch( e => respHandler = { code : 500, result : "DB: Something went wrong trying to retrieve all posts w comments!" } );

    return respHandler;
}