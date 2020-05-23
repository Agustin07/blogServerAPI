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
exports.retrieveCommentsByPostId = exports.deleteComment = exports.update = exports.insert = void 0;
const url = __importStar(require("url"));
// ---- internal modules
const DBconection_1 = require("../DBconection");
const dbQuerys = __importStar(require("../DBconection"));
exports.insert = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method !== 'POST')
        return { code: 400, result: "Sorry, we coulnd't handle this!  Invalid method " + req.method + " at traying to create a comment" };
    if (!(params.post_id))
        return { code: 400, result: "Sorry, we coulnd't handle this! U haven't submited a post id" };
    let idPost = Number.parseInt(params.post_id);
    if (Number.isNaN(idPost))
        return { code: 400, result: "Sorry, we coulnd't handle this! post id should be a number" };
    let pComment = {
        id_post: idPost,
        comment: String(params.comment),
        username: String(params.username)
    };
    let exists = yield DBconection_1.connectpg.query(dbQuerys.queryExistPost, [pComment.id_post]);
    if (Number.parseInt(exists.rows[0].found) !== 1)
        return { code: 404, result: "Post not found!" };
    let respHandler = { code: 404, result: 'not found!' };
    yield DBconection_1.connectpg.query(dbQuerys.sqlInsertComment, [pComment.id_post, pComment.comment, pComment.username])
        .then(res => respHandler = { code: 200, result: 'Comment saved!' })
        .catch(e => respHandler = { code: 500, result: 'DB: Something went wrong trying to save comment!' });
    return respHandler;
});
exports.update = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method !== 'PUT')
        return { code: 400, result: "Sorry, we coulnd't handle this! Invalid method " + req.method + " at traying to update a comment" };
    if (!(params.comment_id))
        return { code: 404, result: "Sorry, we coulnd't handle this! U haven't submited a comment id" };
    let idComment = Number.parseInt(params.comment_id);
    if (Number.isNaN(idComment))
        return { code: 400, result: "Sorry, we coulnd't handle this! comment id should be a number" };
    let pComment = {
        id_comment: idComment,
        comment: String(params.comment),
        username: String(params.username)
    };
    let exists = yield DBconection_1.connectpg.query(dbQuerys.queryExistComment, [pComment.id_comment]);
    if (Number.parseInt(exists.rows[0].found) !== 1)
        return { code: 404, result: "Post or comment not found!" };
    let respHandler = { code: 404, result: 'not found!' };
    yield DBconection_1.connectpg.query(dbQuerys.sqlUpdateComment, [pComment.comment, pComment.username, pComment.id_comment])
        .then(res => respHandler = { code: 200, result: 'Comment updated!' })
        .catch(e => respHandler = { code: 500, result: 'DB: Something went wrong trying to update a comment!' });
    return respHandler;
});
exports.deleteComment = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method !== 'DELETE')
        return { code: 400, result: "Sorry, we coulnd't handle this! Invalid method " + req.method + " at traying to delete a comment" };
    if (!(params.comment_id))
        return { code: 404, result: "Sorry, we coulnd't handle this! U haven't submited a comment id" };
    let id_comment = Number.parseInt(params.comment_id);
    if (Number.isNaN(id_comment))
        return { code: 400, result: "Sorry, we coulnd't handle this! comment id should be a number" };
    let exists = yield DBconection_1.connectpg.query(dbQuerys.queryExistComment, [id_comment]);
    if (Number.parseInt(exists.rows[0].found) !== 1)
        return { code: 404, result: "Post or comment not found!" };
    let respHandler = { code: 404, result: 'not found!' };
    yield DBconection_1.connectpg.query(dbQuerys.sqlDeleteComment, [id_comment])
        .then(res => respHandler = { code: 200, result: 'Comment deleted!' })
        .catch(e => respHandler = { code: 500, result: 'DB: Something went wrong trying to delete a comment!' });
    return respHandler;
});
exports.retrieveCommentsByPostId = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method !== 'GET')
        return { code: 400, result: "Sorry, we coulnd't handle this! Invalid method " + req.method + " at traying to retrieve a post" };
    if (!(params.post_id))
        return { code: 404, result: "Sorry, we coulnd't handle this! U haven't submited a post id" };
    let id_post = Number.parseInt(params.post_id);
    if (Number.isNaN(id_post))
        return { code: 400, result: "Sorry, we coulnd't handle this! post id should be a number" };
    let exists = yield DBconection_1.connectpg.query(dbQuerys.queryExistPost, [id_post]);
    if (Number.parseInt(exists.rows[0].found) !== 1)
        return { code: 404, result: "Post not found!" };
    let respHandler = { code: 404, result: 'Not found!' };
    yield DBconection_1.connectpg.query(dbQuerys.queryCommentsByPostId, [id_post])
        .then(res => respHandler = { code: 200, result: JSON.stringify(res.rows) })
        .catch(e => respHandler = { code: 500, result: "DB: Something went wrong trying to retrieve a single post!" });
    return respHandler;
});
