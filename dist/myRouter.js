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
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectAction = void 0;
const blog_post = __importStar(require("./Handler/blog_post"));
const post_comment = __importStar(require("./Handler/post_comment"));
function selectAction(path, request, response) {
    switch (path) {
        case '/blog_post/c/':
            return blog_post.insert(request, response);
        case '/blog_post/r/':
            return blog_post.retrieve(request, response);
        case '/blog_post/u/':
            return blog_post.update(request, response);
        case '/blog_post/d/':
            return blog_post.deletePost(request, response);
        case '/post_comment/c/':
            return post_comment.insert(request, response);
        case '/post_comment/u/':
            return post_comment.update(request, response);
        case '/post_comment/d/':
            return post_comment.deleteComment(request, response);
    }
    response.writeHead(400, 'Bad request').write("Sorry, we coulnd't handle this! Route " + path + " is not valid!");
    return Promise.reject(response.end(''));
}
exports.selectAction = selectAction;
