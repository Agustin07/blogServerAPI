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
exports.deleteComment = exports.update = exports.insert = void 0;
const DBconection_1 = require("../DBconection");
;
const url = __importStar(require("url"));
exports.insert = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method === 'POST') {
        if (!!(params.post_id)) {
            let pComment = {
                id_post: Number.parseInt(params.post_id) || 0,
                comment: String(params.comment),
                username: String(params.username)
            };
            let exists = yield DBconection_1.connectpg.query('SELECT COUNT(*) AS FOUND FROM BLOG_POST WHERE ID_POST=' + pComment.id_post + ' AND ISDELETED=FALSE LIMIT 1;');
            let sql = "INSERT INTO POST_COMMENT (ID_POST, COMMENT, USERNAME) ";
            sql += " VALUES (" + pComment.id_post + ",'" + pComment.comment + "','" + pComment.username + "'); ";
            if (Number.parseInt(exists.rows[0].found) === 1) {
                let resultQuery = yield DBconection_1.connectpg.query(sql)
                    .then(res => resp.writeHead(200, { "Content-Type": "text/plain" }).write('Comment saved!'))
                    .catch(e => resp.writeHead(500).write('DB: Something went wrong trying to save comment!'));
            }
            else {
                resp.writeHead(404).write('Post not found!');
            }
            return resp;
        }
        resp.writeHead(404, 'Not Found').write("Sorry, we coulnd't handle this! U haven't submited a post id");
        return resp;
    }
    resp.writeHead(400, 'Bad request').write("Sorry, we coulnd't handle this!  Invalid method " + req.method + " at traying to create a comment");
    return resp;
});
exports.update = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method === 'PUT') {
        if (!!(params.comment_id)) {
            let pComment = {
                id_comment: Number.parseInt(params.comment_id),
                id_post: Number.parseInt(params.post_id),
                comment: String(params.comment),
                username: String(params.username)
            };
            let exists = yield DBconection_1.connectpg.query('SELECT COUNT(C.*) AS FOUND FROM POST_COMMENT C JOIN BLOG_POST P ON P.ID_POST=C.ID_POST ' +
                ' WHERE C.ID_COMMENT=' + pComment.id_comment + ' AND P.ISDELETED=FALSE AND C.ISDELETED=FALSE;');
            let sql = "UPDATE POST_COMMENT SET COMMENT='" + pComment.comment + "', USERNAME='" + pComment.username + "' "
                + " WHERE ID_COMMENT=" + pComment.id_comment + " AND ISDELETED=FALSE;";
            if (Number.parseInt(exists.rows[0].found) === 1) {
                let resultQuery = yield DBconection_1.connectpg.query(sql)
                    .then(res => resp.writeHead(200).write('Comment updated!'))
                    .catch(e => resp.writeHead(500).write('DB: Something went wrong trying to update the comment! '));
            }
            else {
                resp.writeHead(404).write('Comment or post not found!');
            }
            return resp;
        }
        resp.writeHead(404, 'Not Found').write("Sorry, we coulnd't handle this! U haven't submited a comment id");
        return resp;
    }
    resp.writeHead(400, 'Bad request').write("Sorry, we coulnd't handle this! Invalid method " + req.method + " at traying to update a comment");
    return resp;
});
exports.deleteComment = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method === 'DELETE') {
        if (!!(params.comment_id)) {
            let id_comment = Number.parseInt(params.comment_id);
            let exists = yield DBconection_1.connectpg.query('SELECT COUNT(C.*) AS FOUND FROM POST_COMMENT C JOIN BLOG_POST P ON P.ID_POST=C.ID_POST ' +
                ' WHERE C.ID_COMMENT=' + id_comment + ' AND P.ISDELETED=FALSE AND C.ISDELETED=FALSE;');
            let sql = "UPDATE POST_COMMENT SET ISDELETED=TRUE WHERE ID_COMMENT=" + id_comment + ";";
            if (Number.parseInt(exists.rows[0].found) === 1) {
                let resultQuery = yield DBconection_1.connectpg.query(sql).then(res => resp.writeHead(200).write('Comment deleted!'))
                    .catch(e => resp.writeHead(500).write('DB: DB: Something went wrong trying to delete! '));
            }
            else {
                resp.writeHead(404).write('Post or comment not found!');
            }
            return resp;
        }
        resp.writeHead(404, 'Not Found').write("Sorry, we coulnd't handle this! U haven't submited a comment id");
        return resp;
    }
    resp.writeHead(400, 'Bad request').write("Sorry, we coulnd't handle this! Invalid method " + req.method + " at traying to delete a comment");
    return resp;
});
