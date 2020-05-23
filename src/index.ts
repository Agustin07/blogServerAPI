
// ---- npm modules
import * as http from "http"
import * as url from "url"

// ---- internal modules
import * as myRouter from "./myRouter";
import {responseHandler} from "./myRouter";

let server = http.createServer(function(request,response) {

    const pathURL = url.parse(request.url as string,true).pathname;
    try {
        let actionResult : Promise<responseHandler> = myRouter.selectAction(pathURL, request);
        actionResult.then((value)=> {
            response.writeHead(value.code,{'Content-Type': 'text/plain'}).write(value.result);
            response.end('');
        });
    }
    catch(e){
        console.log(e);
        response.writeHead(404);
        response.end('\nNOT FOUND\n');
    }
});

server.listen(7000);
