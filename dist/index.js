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
// ---- npm modules
const http = __importStar(require("http"));
const url = __importStar(require("url"));
// ---- internal modules
const myRouter = __importStar(require("./myRouter"));
let server = http.createServer(function (request, response) {
    const pathURL = url.parse(request.url, true).pathname;
    try {
        let actionResult = myRouter.selectAction(pathURL, request);
        actionResult.then((value) => {
            response.writeHead(value.code, { 'Content-Type': 'text/plain' }).write(value.result);
            response.end('');
        });
    }
    catch (e) {
        console.log(e);
        response.writeHead(404);
        response.end('\nNOT FOUND\n');
    }
});
server.listen(7000);
