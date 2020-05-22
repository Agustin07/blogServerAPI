import { connectpg } from "../DBconection"
import { QueryResult, Query } from "pg";;
import { IncomingMessage, ServerResponse } from "http";
import * as url from "url";

interface blogPost {
    id_post?: number | undefined,
    title : string,
    content: string,
    author?: string,
    date_posted ?: Date
}


export const insert = async (req: IncomingMessage,resp: ServerResponse) : Promise<ServerResponse> => {
        let params=url.parse(req.url as string,true).query;
        if(req.method==='POST') {
            if(!(params.post_id)){ 

                let newPost : blogPost = { 
                    title : String(params.post_title as string),
                    content: String(params.post_content),
                    author: String(params.post_author),
                 } 

                 let sql ="INSERT INTO BLOG_POST (TITLE_TEXT, BODY_TEXT, AUTHOR) ";
                 sql += " VALUES ('"+newPost.title+"','"+newPost.content+"','"+newPost.author+"'); ";

                 let resultQuery = await connectpg.query(sql)
                    .then(res => resp.writeHead(200,{"Content-Type": "text/plain"}).write('Post saved!'))
                    .catch(e => resp.writeHead(500).write('DB: Something went wrong trying to insert!'));
                return resp;
            }
            resp.writeHead(400,'Bad request').write("Sorry, we coulnd't handle this! You submited a post id, maybe you shoult try an udpade!");
            return resp;
        }
        resp.writeHead(400,'Bad request').write("Sorry, we coulnd't handle this! Invalid method "+req.method+" at traying to create a post");
        return resp;
}


export const update = async (req: IncomingMessage,resp: ServerResponse) : Promise<ServerResponse> => {
    let params=url.parse(req.url as string,true).query;
    if(req.method==='PUT') {
        if(!!(params.post_id)){
            let updtPost : blogPost = {
                id_post: Number.parseInt(params.post_id as string),
                title : String(params.post_title as string),
                content: String(params.post_content)
            } 

            let exists = await connectpg.query('SELECT COUNT(*) AS FOUND FROM BLOG_POST WHERE ID_POST='+updtPost.id_post+' AND ISDELETED=FALSE LIMIT 1;');
        
            let sql = "UPDATE BLOG_POST SET TITLE_TEXT='"+updtPost.title+"', BODY_TEXT='"+updtPost.content+"' "
                        + " WHERE ID_POST="+updtPost.id_post+" AND ISDELETED=FALSE;";

            if ( Number.parseInt(exists.rows[0].found) === 1){
                let resultQuery = await connectpg.query(sql)
                .then(res => resp.writeHead(200).write('Post updated!'))
                .catch(e => resp.writeHead(500).write('DB: Something went wrong trying to update! '));
            } else {
                resp.writeHead(404).write('Post not found!');
            }
    
            return resp;
        }
        resp.writeHead(404,'Not Found').write("Sorry, we coulnd't handle this! U haven't submited a post id");
        return resp;
    }
    resp.writeHead(400,'Bad request').write("Sorry, we coulnd't handle this! Invalid method "+req.method+" at traying to update a post");
    return resp;
    //let dbresponse : QueryResult  = await connectpg.query("INSERT INTO SELECT * FROM blog_post ORDER BY id_post ASC;");
    //console.log(dbresponse.rows);
    //resp.writeHead(200,{"Content-Type": "text/plain"}).write(JSON.stringify(dbresponse.rows));
    //resp.write(dbresponse.rows)
    //return resp;
}

export const deletePost = async (req : IncomingMessage, resp : ServerResponse ) : Promise<ServerResponse> => {
    let params=url.parse(req.url as string,true).query;
    if (req.method==='DELETE'){
        if(!!(params.post_id)){
            let id_post : number = Number.parseInt(params.post_id as string);
            let exists = await connectpg.query('SELECT COUNT(*) AS FOUND FROM BLOG_POST WHERE ID_POST='+id_post+' AND ISDELETED=FALSE LIMIT 1;');
            let sql = "UPDATE BLOG_POST SET ISDELETED=TRUE WHERE ID_POST="+id_post+";";
        
            if ( Number.parseInt(exists.rows[0].found) === 1){
                let resultQuery = await connectpg.query(sql).then(res => resp.writeHead(200).write('Post deleted!'))
                .catch(e => resp.writeHead(500).write('DB: Something went wrong trying to delete! '));
            } else {
                resp.writeHead(404).write('Post not found!');
            }
            return resp;
        }
        resp.writeHead(404,'Not Found').write("Sorry, we coulnd't handle this! U haven't submited a post id");
        return resp;
    }
    resp.writeHead(400,'Bad request').write("Sorry, we coulnd't handle this! Invalid method "+req.method+" at traying to delete a post");
    return resp;
}

export const retrieve = async (req : IncomingMessage, resp : ServerResponse ) : Promise<ServerResponse> => {
    let params=url.parse(req.url as string,true).query;
    if (req.method==='GET'){
        if(!!(params.post_id)){
            let id_post : number = Number.parseInt(params.post_id as string);
            let exists = await connectpg.query('SELECT COUNT(*) AS FOUND FROM BLOG_POST WHERE ID_POST='+id_post+' AND ISDELETED=FALSE LIMIT 1;');
            let sql = "SELECT P.ID_POST AS POST_ID, P.TITLE_TEXT AS POST_TITLE, " +
                " P.BODY_TEXT AS POST_CONTENT, P.AUTHOR AS POST_AUTHOR, P.DATE_POSTED AS POSTED_DATE " +
                " FROM BLOG_POST P WHERE ID_POST="+id_post+" AND P.ISDELETED=FALSE;";

            let comment_sql ="SELECT C.ID_POST AS POST_ID, C.ID_COMMENT AS COMMENT_ID, C.COMMENT AS COMMENT_CONTENT, " + 
            " C.USERNAME AS COMMENT_USERNAME, C.DATE_POSTED AS POSTED_DATE  " +
            "FROM POST_COMMENT C WHERE C.ID_POST="+id_post+" AND C.ISDELETED=FALSE;"
           
            if ( Number.parseInt(exists.rows[0].found) === 1){
                let myPost =await connectpg.query(sql);
                await connectpg.query(comment_sql).then(res => {
                    let postData= myPost.rows;
                    let commentsData=res.rows;
                    const listofPost = postData.map((pval) => {
                        pval.comments = commentsData.filter(cval => cval.post_id===pval.post_id);
                        return pval;
                    });
                    resp.writeHead(200).write(JSON.stringify(listofPost));     
                    
                })
                .catch(e => resp.writeHead(500).write('DB: Something went wrong trying to retrieve a single post! '+e.stack));
            } else {
                resp.writeHead(404).write('Post not found!');
            }
            return resp;
        }
        resp.writeHead(404,'Not Found').write("Sorry, we coulnd't handle this! U haven't submited a post id");
        return resp;
    }
    resp.writeHead(400,'Bad request').write("Sorry, we coulnd't handle this! Invalid method "+req.method+" at traying to retrieve a post");
    return resp;
}