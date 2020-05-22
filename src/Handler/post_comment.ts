import { connectpg } from "../DBconection"
import { QueryResult, Query } from "pg";;
import { IncomingMessage, ServerResponse } from "http";
import * as url from "url";

interface postComment {
    id_comment ?: number | undefined,
    id_post : number | undefined,
    comment : string,
    username : string,
    date_posted ?: Date
}

export const insert = async (req: IncomingMessage,resp: ServerResponse) : Promise<ServerResponse> => {
    let params=url.parse(req.url as string,true).query;
    if(req.method==='POST') {
        if(!!(params.post_id)){ 
            let pComment : postComment = { 
                id_post : Number.parseInt(params.post_id as string) || 0,
                comment : String(params.comment),
                username : String(params.username)
             } 

            let exists = await connectpg.query('SELECT COUNT(*) AS FOUND FROM BLOG_POST WHERE ID_POST='+pComment.id_post+' AND ISDELETED=FALSE LIMIT 1;');
            
            let sql ="INSERT INTO POST_COMMENT (ID_POST, COMMENT, USERNAME) ";
                 sql += " VALUES ("+pComment.id_post+",'"+pComment.comment+"','"+pComment.username+"'); ";

            if ( Number.parseInt(exists.rows[0].found) === 1){
                let resultQuery = await connectpg.query(sql)
                .then(res => resp.writeHead(200,{"Content-Type": "text/plain"}).write('Comment saved!'))
                .catch(e => resp.writeHead(500).write('DB: Something went wrong trying to save comment!'));
            } else {
                resp.writeHead(404).write('Post not found!');
            }
            return resp;
        }
        resp.writeHead(404,'Not Found').write("Sorry, we coulnd't handle this! U haven't submited a post id");
        return resp;
    }
    resp.writeHead(400,'Bad request').write("Sorry, we coulnd't handle this!  Invalid method "+req.method+" at traying to create a comment");
    return resp;
}


export const update = async (req: IncomingMessage,resp: ServerResponse) : Promise<ServerResponse> => {
    let params=url.parse(req.url as string,true).query;
    if(req.method==='PUT') {
        if(!!(params.comment_id)){
            let pComment : postComment = { 
                id_comment : Number.parseInt(params.comment_id as string),
                id_post : Number.parseInt(params.post_id as string),
                comment : String(params.comment),
                username : String(params.username)
             } 

            let exists = await connectpg.query('SELECT COUNT(C.*) AS FOUND FROM POST_COMMENT C JOIN BLOG_POST P ON P.ID_POST=C.ID_POST '+
            ' WHERE C.ID_COMMENT='+pComment.id_comment+' AND P.ISDELETED=FALSE AND C.ISDELETED=FALSE;');

            let sql = "UPDATE POST_COMMENT SET COMMENT='"+pComment.comment+"', USERNAME='"+pComment.username+"' "
                        + " WHERE ID_COMMENT="+pComment.id_comment+" AND ISDELETED=FALSE;";

            if ( Number.parseInt(exists.rows[0].found) === 1){
                let resultQuery = await connectpg.query(sql)
                .then(res => resp.writeHead(200).write('Comment updated!'))
                .catch(e => resp.writeHead(500).write('DB: Something went wrong trying to update the comment! '));
            } else {
                resp.writeHead(404).write('Comment or post not found!');
            }
            return resp;
        }
        resp.writeHead(404,'Not Found').write("Sorry, we coulnd't handle this! U haven't submited a comment id");
        return resp;
    }
    resp.writeHead(400,'Bad request').write("Sorry, we coulnd't handle this! Invalid method "+req.method+" at traying to update a comment");
    return resp;
}

export const deleteComment = async (req : IncomingMessage, resp : ServerResponse ) : Promise<ServerResponse> => {
    let params=url.parse(req.url as string,true).query;
    if(req.method==='DELETE') {
        if(!!(params.comment_id)){
            let id_comment : number = Number.parseInt(params.comment_id as string);
            let exists = await connectpg.query('SELECT COUNT(C.*) AS FOUND FROM POST_COMMENT C JOIN BLOG_POST P ON P.ID_POST=C.ID_POST '+
            ' WHERE C.ID_COMMENT='+id_comment+' AND P.ISDELETED=FALSE AND C.ISDELETED=FALSE;');
            let sql = "UPDATE POST_COMMENT SET ISDELETED=TRUE WHERE ID_COMMENT="+id_comment+";";
            if ( Number.parseInt(exists.rows[0].found) === 1){
                let resultQuery = await connectpg.query(sql).then(res => resp.writeHead(200).write('Comment deleted!'))
                .catch(e => resp.writeHead(500).write('DB: DB: Something went wrong trying to delete! '));
            } else {
                resp.writeHead(404).write('Post or comment not found!');
            }
            return resp;
        }
        resp.writeHead(404,'Not Found').write("Sorry, we coulnd't handle this! U haven't submited a comment id");
        return resp;
    }
    resp.writeHead(400,'Bad request').write("Sorry, we coulnd't handle this! Invalid method "+req.method+" at traying to delete a comment");
    return resp;
}