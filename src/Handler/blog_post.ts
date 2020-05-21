import { connectpg } from "../DBconection"
import { QueryResult, Query } from "pg";;
import { IncomingMessage, ServerResponse } from "http";
import * as url from "url";

interface blogPost {
    id_post?: number | undefined,
    title : string,
    content: string,
    author?: string,
}


export function blog_postHandler(request: IncomingMessage, response:ServerResponse ,action: string): Promise<ServerResponse>{
    switch (request.method) {
        case 'POST':
            // -- INSERT
            try{
                return insert(request,response);
            }
            catch(e) {
                return Promise.reject();
            }
        case 'PUT':
            try{
                return update(request,response);
            }
            catch(e) {
                return Promise.reject();
            }
    
        case 'DELETE':
            // -- DELETE
       
        break;
        case 'GET':
            // -- RETRIEVE

        break;
    }
    return Promise.reject(response.write(404));
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
    
                try {
                    let resultQuery = await connectpg.query(sql);
                    resp.writeHead(200,{"Content-Type": "text/plain"}).write('Inserted!');
                    return resp;
                } catch (e) {
                    console.log(e);
                    resp.writeHead(500).write('Internal Server error');
                    return Promise.reject(resp.end());
                }
                 
            }
        }
        resp.writeHead(500).write('Internal Server error');
        return Promise.reject(resp.end());
}


export const update = async (req: IncomingMessage,resp: ServerResponse) : Promise<ServerResponse> => {
    let params=url.parse(req.url as string,true).query;
    if(req.method==='PUT') {
        if(!!(params.post_id)){ //undefinido
            let newPost : blogPost = {
                id_post: Number.parseInt(params.post_id as string),
                title : String(params.post_title as string),
                content: String(params.post_content)
            } 
            let sql = "UPDATE BLOG_POST SET TITLE_TEXT='"+newPost.title+"', BODY_TEXT='"+newPost.content+"' WHERE ID_POST="+newPost.id_post+";";
            
            try {
                let resultQuery = await connectpg.query(sql);
                resp.writeHead(200,{"Content-Type": "text/plain"}).write('Updated!');
                return resp;
            } catch (e) {
                console.log(e);
                resp.writeHead(500).write('Internal Server error');
                return Promise.reject(resp.end());
            }
            
        }
    }
    resp.writeHead(500).write('Internal Server error');
    return Promise.reject(resp.end());
    //let dbresponse : QueryResult  = await connectpg.query("INSERT INTO SELECT * FROM blog_post ORDER BY id_post ASC;");
    //console.log(dbresponse.rows);
    //resp.writeHead(200,{"Content-Type": "text/plain"}).write(JSON.stringify(dbresponse.rows));
    //resp.write(dbresponse.rows)
    //return resp;
}