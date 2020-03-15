const http = require('http');
const express = require('express');
const app = express();
// console.log('array:',a)

var router=express.Router();

router.get('/list',function(req,res){
    console.log('请求者：',req)
    res.send(JSON.stringify({name:'llx',sex:'man'}));
})
router.get('/:id',function(req,res){ //rest风格
    console.log(req.params.id);
    res.send('ok');
})

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})


// http.createServer(function (request, response) {

//     // 发送 HTTP 头部 
//     // HTTP 状态值: 200 : OK
//     // 内容类型: text/plain
//     response.writeHead(200, {'Content-Type': 'text/plain'});

//     // 发送响应数据 "Hello World"
//     response.end("Hello, Universe! I'm running on Cloud Studio!\n");
// }).listen(8888);

// // 终端打印如下信息
// console.log('Server running at http://127.0.0.1:8888/');