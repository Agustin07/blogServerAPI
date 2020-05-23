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
// ---- internal modules
const blog_post = __importStar(require("./Handler/blog_post"));
const post_comment = __importStar(require("./Handler/post_comment"));
;
function selectAction(path, request) {
    switch (path) {
        case '/blog_post/c/':
            return blog_post.insert(request);
        case '/blog_post/r1/':
            return blog_post.retrievePostById(request);
        case '/blog_post/rall/':
            return blog_post.retrieveAll(request);
        case '/blog_post/u/':
            return blog_post.update(request);
        case '/blog_post/d/':
            return blog_post.deletePost(request);
        case '/post_comment/c/':
            return post_comment.insert(request);
        case '/post_comment/r/':
            return post_comment.retrieveCommentsByPostId(request);
        case '/post_comment/u/':
            return post_comment.update(request);
        case '/post_comment/d/':
            return post_comment.deleteComment(request);
    }
    return Promise.resolve({ code: 400, result: "Sorry, we coulnd't handle this! Route " + path + " is not valid!" });
}
exports.selectAction = selectAction;
