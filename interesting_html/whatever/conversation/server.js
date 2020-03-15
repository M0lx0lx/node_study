const http=require('http')
    ,fs=require('fs')
    ,path=require('path')
    ,mime=require('mime')
    ,chatServer=require('./lib/chat_server')



var cache={};


// 三个辅助函数以提供静态HTTP文件服务
function send404(res){   //所请求的文件不存在时发送404错误的

    fs.readFile('./public/404.html',function(err,data){
        var send=err?['text/plan','not found!']:['text/html',data]
        res.writeHead(404,{'content-type':send[0]});
        res.end(send[1]);
    })
}

function sendFile(res,filePath,fileContents){  //提供文件数据服务
    res.writeHead(200,{'content-type':mime.lookup(path.basename(filePath))})
    res.end(fileContents)
}

function serveStatic(res,cache,absPath){  //确定文件是否缓存了，如果是，就返回它。如果文件还没被缓存，它会从硬盘中读取并返回它。如果文件不存在，则返回一个HTTP 404错误作为响应
    if(cache[absPath]) {
        sendFile(res, absPath, cache[absPath])
    }
    else{
        fs.exists(absPath,function(exists) {
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send404(res);
                    }
                    else {
                        cache[absPath] = data;
                        sendFile(res, absPath, data);
                    }
                });
            }
            else{
                send404(res)
            }
        })
    }
}

// 创建HTTP服务器的逻辑
var server=http.createServer(function(requst,res){
    var filePath=false;
    if(requst.url == '/'){
        filePath='public/index.html'
    }
    else{
        filePath=`public${requst.url}`
    }
    var absPath=`./${filePath}`
    serveStatic(res,cache,absPath)
})
var port= 3000
server.listen(port,function(){
    console.log(`server listening on port ${port}`)
})
chatServer.listen(server)