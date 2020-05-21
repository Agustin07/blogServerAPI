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
function selectAction(path, request, response) {
    switch (path) {
        // insert
        case '/blog_post/c/':
            try {
                return blog_post.insert(request, response);
            }
            catch (e) {
                return Promise.reject();
            }
        case '/blog_post/r/':
            break;
        case '/blog_post/u/':
            try {
                return blog_post.update(request, response);
            }
            catch (e) {
                return Promise.reject();
            }
        case '/blog_post/d/':
            break;
    }
    return Promise.reject(response.writeHead(404, { "Content-Type": "text/plain" }));
}
exports.selectAction = selectAction;
