// ---- external modules
import * as http from "http"
import * as url from "url"
import * as myRouter from "./myRouter";
import { ServerResponse } from "http"

let responseHandler : { code : number, info: string; result:any } ;

let server = http.createServer(function(request,response) {

    const pathURL = url.parse(request.url as string,true).pathname;
    try {
        let  actionResult : Promise<ServerResponse> = myRouter.selectAction(pathURL, request,response);
        actionResult.then((value)=> {
            console.log('salida');
            value.end('')
        });
    }
    catch(e){
        console.log(e);
        response.end('\nError\n');
    }

   

    
});

server.listen(7000);
