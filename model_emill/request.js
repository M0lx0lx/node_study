var http = require('http');
const path = require('path')
var express = require('express');
var fs = require("fs");
var app = express();

function getHTML(options){  //获取数据方法
    return new Promise((resolve,reject)=>{
        // 用于请求的选项
        var options = {
            host: 'www.3dmgame.com',
            path: `/gl/3779635.html`
        };

        // 处理响应的回调函数
        var callback = function(response){
                // 不断更新数据
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
            console.log('进入吗：',body)

                response.on('end', function() {
                    // 数据接收完成
                    console.log('result:',body);
                    resolve(body)
                });
        }
        // 向服务端发送请求
        var req = http.request(options, callback);
        req.end();
    })
}

// app.use('/public', express.static('public'));

module.exports= getHTML
