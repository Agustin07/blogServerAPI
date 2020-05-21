// ---- external modules
import * as http from "http"
import * as url from "url"
import * as myRouter from "./myRouter";
import { ServerResponse } from "http"

let server = http.createServer(function(request,response) {

    //let methodRequested = request.method as string;
    //let queryresult=url.parse(request.url as string,true).query;
    const pathURL = url.parse(request.url as string,true).pathname;
    try {
        let  actionResult : Promise<ServerResponse> = myRouter.selectAction(pathURL, request,response);
        actionResult.then((value)=>value.end(''));
    }
    catch(e){
        console.log(e);
        response.end('Error');
    }

   

    
});

server.listen(7000);
