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
exports.retrieveAll = exports.retrievePostById = exports.deletePost = exports.update = exports.insert = void 0;
const DBconection_1 = require("../DBconection");
const dbQuerys = __importStar(require("../DBconection"));
const url = __importStar(require("url"));
exports.insert = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method !== 'POST')
        return { code: 400, result: "Sorry, we coulnd't handle this! Invalid method " + req.method + " at traying to create a post" };
    if (!!(params.post_id))
        return { code: 400, result: "Sorry, we coulnd't handle this! You submited a post id, maybe you shoult try an udpade!" };
    let newPost = {
        title: String(params.post_title),
        content: String(params.post_content),
        author: String(params.post_author),
    };
    let respHandler = { code: 404, result: 'not found!' };
    yield DBconection_1.connectpg.query(dbQuerys.sqlInsertPost, [newPost.title, newPost.content, newPost.author])
        .then(res => respHandler = { code: 200, result: "Post saved!" })
        .catch(e => respHandler = { code: 500, result: "DB: Something went wrong trying to insert!" });
    return respHandler;
});
exports.update = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method !== 'PUT')
        return { code: 400, result: "Sorry, we coulnd't handle this! Invalid method " + req.method + " at traying to update a post" };
    if (!(params.post_id))
        return { code: 404, result: "Sorry, we coulnd't handle this! U haven't submited a post id" };
    let idPost = Number.parseInt(params.post_id);
    if (Number.isNaN(idPost))
        return { code: 400, result: "Sorry, we coulnd't handle this! post id should be a number" };
    let updtPost = {
        id_post: idPost,
        title: String(params.post_title),
        content: String(params.post_content)
    };
    let exists = yield DBconection_1.connectpg.query(dbQuerys.queryExistPost, [updtPost.id_post]);
    if (Number.parseInt(exists.rows[0].found) !== 1)
        return { code: 404, result: "Post not found!" };
    let respHandler = { code: 404, result: 'not found!' };
    yield DBconection_1.connectpg.query(dbQuerys.sqlUpdatePost, [updtPost.title, updtPost.content, updtPost.id_post])
        .then(res => respHandler = { code: 200, result: "Post updated!" })
        .catch(e => respHandler = { code: 500, result: "DB: Something went wrong trying to update!" });
    return respHandler;
});
exports.deletePost = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method !== 'DELETE')
        return { code: 400, result: "Sorry, we coulnd't handle this! Invalid method " + req.method + " at traying to delete a post" };
    if (!(params.post_id))
        return { code: 404, result: "Sorry, we coulnd't handle this! U haven't submited a post id" };
    let id_post = Number.parseInt(params.post_id);
    if (Number.isNaN(id_post))
        return { code: 400, result: "Sorry, we coulnd't handle this! post id should be a number" };
    let exists = yield DBconection_1.connectpg.query(dbQuerys.queryExistPost, [id_post]);
    if (Number.parseInt(exists.rows[0].found) !== 1)
        return { code: 404, result: "Post not found!" };
    let respHandler = { code: 404, result: 'not found!' };
    yield DBconection_1.connectpg.query(dbQuerys.sqlDeletePost, [id_post])
        .then(res => respHandler = { code: 200, result: "Post deleted!" })
        .catch(e => respHandler = { code: 500, result: "DB: Something went wrong trying to delete!" });
    return respHandler;
});
exports.retrievePostById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
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
    let myPost = yield DBconection_1.connectpg.query(dbQuerys.queryPostById, [id_post]);
    yield DBconection_1.connectpg.query(dbQuerys.queryCommentsByPostId, [id_post])
        .then(res => {
        let postData = myPost.rows;
        let commentsData = res.rows;
        const listofPost = postData.map((pval) => {
            pval.comments = commentsData.filter(cval => cval.post_id === pval.post_id);
            return pval;
        });
        respHandler = { code: 200, result: JSON.stringify(listofPost) };
    })
        .catch(e => respHandler = { code: 500, result: "DB: Something went wrong trying to retrieve a single post!" });
    return respHandler;
});
exports.retrieveAll = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method !== 'GET')
        return { code: 400, result: "Sorry, we coulnd't handle this! Invalid method " + req.method + " at traying to retrieve a post" };
    let respHandler = { code: 404, result: 'Not found!' };
    let allPostsResult = yield DBconection_1.connectpg.query(dbQuerys.queryAllPost);
    yield DBconection_1.connectpg.query(dbQuerys.queryAllComments)
        .then(res => {
        let allPosts = allPostsResult.rows;
        let allComments = res.rows;
        const listofPosts = allPosts.map((post_val) => {
            post_val.comments = allComments.filter(comment_val => comment_val.post_id === post_val.post_id);
            return post_val;
        });
        respHandler = { code: 200, result: JSON.stringify(listofPosts) };
    })
        .catch(e => respHandler = { code: 500, result: "DB: Something went wrong trying to retrieve all posts w comments!" });
    return respHandler;
});
