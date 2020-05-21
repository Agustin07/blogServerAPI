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
exports.update = exports.insert = exports.blog_postHandler = void 0;
const DBconection_1 = require("../DBconection");
;
const url = __importStar(require("url"));
function blog_postHandler(request, response, action) {
    switch (request.method) {
        case 'POST':
            // -- INSERT
            try {
                return exports.insert(request, response);
            }
            catch (e) {
                return Promise.reject();
            }
        case 'PUT':
            try {
                return exports.update(request, response);
            }
            catch (e) {
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
exports.blog_postHandler = blog_postHandler;
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
            try {
                let resultQuery = yield DBconection_1.connectpg.query(sql);
                resp.writeHead(200, { "Content-Type": "text/plain" }).write('Inserted!');
                return resp;
            }
            catch (e) {
                console.log(e);
                resp.writeHead(500).write('Internal Server error');
                return Promise.reject(resp.end());
            }
        }
    }
    resp.writeHead(500).write('Internal Server error');
    return Promise.reject(resp.end());
});
exports.update = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    let params = url.parse(req.url, true).query;
    if (req.method === 'PUT') {
        if (!!(params.post_id)) { //undefinido
            let newPost = {
                id_post: Number.parseInt(params.post_id),
                title: String(params.post_title),
                content: String(params.post_content)
            };
            let sql = "UPDATE BLOG_POST SET TITLE_TEXT='" + newPost.title + "', BODY_TEXT='" + newPost.content + "' WHERE ID_POST=" + newPost.id_post + ";";
            try {
                console.log(sql);
                let resultQuery = yield DBconection_1.connectpg.query(sql);
                resp.writeHead(200, { "Content-Type": "text/plain" }).write('Updated!');
                return resp;
            }
            catch (e) {
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
});
