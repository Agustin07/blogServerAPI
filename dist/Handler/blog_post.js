"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieve = exports.deletePost = exports.update = exports.insert = void 0;
const DBconection_1 = require("../DBconection");
;
const url = __importStar(require("url"));
exports.insert = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method === 'POST') {
        if (!(params.post_id)) {
            let newPost = {
                title: String(params.post_title),
                content: String(params.post_content),
                author: String(params.post_author),
            };
            let sql = "INSERT INTO BLOG_POST (TITLE_TEXT, BODY_TEXT, AUTHOR) ";
            sql += " VALUES ('" + newPost.title + "','" + newPost.content + "','" + newPost.author + "'); ";
            let resultQuery = yield DBconection_1.connectpg.query(sql)
                .then(res => resp.writeHead(200, { "Content-Type": "text/plain" }).write('Post saved!'))
                .catch(e => resp.writeHead(500).write('DB: Something went wrong trying to insert!'));
            return resp;
        }
        resp.writeHead(400, 'Bad request').write("Sorry, we coulnd't handle this! You submited a post id, maybe you shoult try an udpade!");
        return resp;
    }
    resp.writeHead(400, 'Bad request').write("Sorry, we coulnd't handle this! Invalid method " + req.method + " at traying to create a post");
    return resp;
});
exports.update = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method === 'PUT') {
        if (!!(params.post_id)) {
            let updtPost = {
                id_post: Number.parseInt(params.post_id),
                title: String(params.post_title),
                content: String(params.post_content)
            };
            let exists = yield DBconection_1.connectpg.query('SELECT COUNT(*) AS FOUND FROM BLOG_POST WHERE ID_POST=' + updtPost.id_post + ' AND ISDELETED=FALSE LIMIT 1;');
            let sql = "UPDATE BLOG_POST SET TITLE_TEXT='" + updtPost.title + "', BODY_TEXT='" + updtPost.content + "' "
                + " WHERE ID_POST=" + updtPost.id_post + " AND ISDELETED=FALSE;";
            if (Number.parseInt(exists.rows[0].found) === 1) {
                let resultQuery = yield DBconection_1.connectpg.query(sql)
                    .then(res => resp.writeHead(200).write('Post updated!'))
                    .catch(e => resp.writeHead(500).write('DB: Something went wrong trying to update! '));
            }
            else {
                resp.writeHead(404).write('Post not found!');
            }
            return resp;
        }
        resp.writeHead(404, 'Not Found').write("Sorry, we coulnd't handle this! U haven't submited a post id");
        return resp;
    }
    resp.writeHead(400, 'Bad request').write("Sorry, we coulnd't handle this! Invalid method " + req.method + " at traying to update a post");
    return resp;
    //let dbresponse : QueryResult  = await connectpg.query("INSERT INTO SELECT * FROM blog_post ORDER BY id_post ASC;");
    //console.log(dbresponse.rows);
    //resp.writeHead(200,{"Content-Type": "text/plain"}).write(JSON.stringify(dbresponse.rows));
    //resp.write(dbresponse.rows)
    //return resp;
});
exports.deletePost = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method === 'DELETE') {
        if (!!(params.post_id)) {
            let id_post = Number.parseInt(params.post_id);
            let exists = yield DBconection_1.connectpg.query('SELECT COUNT(*) AS FOUND FROM BLOG_POST WHERE ID_POST=' + id_post + ' AND ISDELETED=FALSE LIMIT 1;');
            let sql = "UPDATE BLOG_POST SET ISDELETED=TRUE WHERE ID_POST=" + id_post + ";";
            if (Number.parseInt(exists.rows[0].found) === 1) {
                let resultQuery = yield DBconection_1.connectpg.query(sql).then(res => resp.writeHead(200).write('Post deleted!'))
                    .catch(e => resp.writeHead(500).write('DB: Something went wrong trying to delete! '));
            }
            else {
                resp.writeHead(404).write('Post not found!');
            }
            return resp;
        }
        resp.writeHead(404, 'Not Found').write("Sorry, we coulnd't handle this! U haven't submited a post id");
        return resp;
    }
    resp.writeHead(400, 'Bad request').write("Sorry, we coulnd't handle this! Invalid method " + req.method + " at traying to delete a post");
    return resp;
});
exports.retrieve = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method === 'GET') {
        if (!!(params.post_id)) {
            let id_post = Number.parseInt(params.post_id);
            let exists = yield DBconection_1.connectpg.query('SELECT COUNT(*) AS FOUND FROM BLOG_POST WHERE ID_POST=' + id_post + ' AND ISDELETED=FALSE LIMIT 1;');
            let sql = "SELECT P.ID_POST AS POST_ID, P.TITLE_TEXT AS POST_TITLE, " +
                " P.BODY_TEXT AS POST_CONTENT, P.AUTHOR AS POST_AUTHOR, P.DATE_POSTED AS POSTED_DATE " +
                " FROM BLOG_POST P WHERE ID_POST=" + id_post + " AND P.ISDELETED=FALSE;";
            let comment_sql = "SELECT C.ID_POST AS POST_ID, C.ID_COMMENT AS COMMENT_ID, C.COMMENT AS COMMENT_CONTENT, " +
                " C.USERNAME AS COMMENT_USERNAME, C.DATE_POSTED AS POSTED_DATE  " +
                "FROM POST_COMMENT C WHERE C.ID_POST=" + id_post + " AND C.ISDELETED=FALSE;";
            if (Number.parseInt(exists.rows[0].found) === 1) {
                let myPost = yield DBconection_1.connectpg.query(sql);
                yield DBconection_1.connectpg.query(comment_sql).then(res => {
                    let postData = myPost.rows;
                    let commentsData = res.rows;
                    let listofPost = postData.map((pval) => {
                        pval.comments = commentsData.filter(cval => cval.post_id === pval.post_id);
                        return pval;
                    });
                    console.log(JSON.stringify(listofPost));
                    resp.writeHead(200).write(JSON.stringify(listofPost));
                })
                    .catch(e => resp.writeHead(500).write('DB: Something went wrong trying to retrieve a single post! ' + e.stack));
            }
            else {
                resp.writeHead(404).write('Post not found!');
            }
            return resp;
        }
        resp.writeHead(404, 'Not Found').write("Sorry, we coulnd't handle this! U haven't submited a post id");
        return resp;
    }
    resp.writeHead(400, 'Bad request').write("Sorry, we coulnd't handle this! Invalid method " + req.method + " at traying to retrieve a post");
    return resp;
});
