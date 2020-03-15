const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const fs = require("fs");
const bodyParser = require('body-parser');
const multer  = require('multer');
const cookieParser = require('cookie-parser')
const util = require('util');
// const cheerio = require('cheerio')   //用于非浏览器环境下的DOM模型

// var $ = cheerio.load(' <h2 class=“title” > Hello world </h2> ')            //测试
// $('h2.title').text('Hello there!');
// $('h2').addClass('welcome');
// $.html();
//=> <h2 class="title welcome">Hello there!</h2>


app.use(cookieParser())
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));

//路由
// app.use('/user', require('./routers/user.js'))

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.all('*',function(req,res,next){

    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','X-Requested-With');
    res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By','3.2.1');
    res.header('Content-Type','application/json;charset=utf-8');
    // var Cookies = {};
    // req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
    //     var parts = Cookie.split('=');
    //     Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    // });
    // var exp = new Date();
    // exp.setTime(exp.getTime() + 0.2*60*1000)
    // res.header('cookie',`myCookie=test;expires=${exp.toGMTString()}`)
    next();
})

app.get('/get_runoob',(req,res)=>{  // 中转获取  获取runoob页面
    var options = {
        host: 'www.runoob.com',
        port: '80',
        path: '/w3cnote/webpack-tutorial.html'
    };
    res.header('Content-Type', 'text/html;charset=UTF-8');

    // 处理响应的回调函数
    var callback = function(response){
        // 不断更新数据
        var body = '';
        response.on('data', function(data) {
            body += data;
        });
        response.on('end', function() {
            // 数据接收完成
            console.log('data length:',body.length);
            res.end(body)
        });
    }
    // 向服务端发送请求
    var reqe = http.request(options, callback);
    reqe.end();
})

app.get('/get_chedaibao',(req,res)=> {  // 中转获取  获取页面信息
    var pc=1
        ,this_pc=1
        ,body=[];
    function get_info(pageNumber=1){
        https.get(`https://ss.chedaibao.com/p2p-mall/sanbiaolistJson.do?pageNumber=${pageNumber}&pageSize=6&isInvestPwd=2&isNewUser=0&_=1542952169672`, (res_i) => {
            console.log('headers:', res_i.headers);
            console.log('statusCode:', res_i.statusCode);
            if(res_i.statusCode !== 200){
                res.header('Content-Type', 'text/html;charset=UTF-8');
            }
            var tem='';
            res_i.on('data',(d) => {
                tem+=d;
            });
            res_i.on('end',()=>{
                var json=JSON.parse(tem)
                    ,just_use=[];
                json.sanbiaoList.dataList.forEach(function(e,i){
                    just_use[i]='回报率：' + e.annualizedRate + '%'
                })
                body.push(just_use)
                pc=json.sanbiaoList.pageCount;
                if(pc>this_pc){
                    get_info(++this_pc)
                    console.log('where:',this_pc,';just_use:',just_use)
                }
                else{
                    res.end(JSON.stringify(body))
                }
            })

        }).on('error', (e) => {
            console.error(e);
        });
    }
    get_info()

})


app.get('/', function(req, res) {
    console.log("Cookies: ", util.inspect(req.cookies));
    res.end('ok')
})

app.post('/file_upload', function (req, res) {   //上传文件
    console.log('file info:',req.files[0]);  // 上传的文件信息
    var des_file = __dirname + "/public/images/" + req.files[0].originalname;
    fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if( err ){
                console.log( err );
            }else{
                var response = {
                    message:'File uploaded successfully',
                    filename:req.files[0].originalname
                };
            }
            console.log( response );
            res.status(200);
            // res.json(response);
            res.end( JSON.stringify( response ) );
        });
    });
})

app.post('/process_post', urlencodedParser, function (req, res) {

    // 输出 JSON 格式
    var response = {
        "first_name":req.body.first_name,
        "last_name":req.body.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

app.get('/index', function (req, res) {
    res.header('Content-Type', 'text/html;charset=UTF-8');
    // res.header('Content-Type','application/json;charset=utf-8');
    // res.sendFile( __dirname + "/index.html" );
    console.log('index');
    res.sendFile( __dirname + "/h_scroll.html" );
})
app.get('/test.html', function (req, res) {
    res.header('Content-Type', 'text/html;charset=UTF-8');
    res.sendFile( __dirname + "/test.html" );
})
app.get('/I_love_you', function (req, res) {
    res.header('Content-Type', 'text/html;charset=UTF-8');
    res.sendFile( __dirname + "/I_love_you.html" );
})
app.get('/flower', function (req, res) {
    res.header('Content-Type', 'text/html;charset=UTF-8');
    res.sendFile( __dirname + "/flower.html" );
})

app.get('/process_get', function (req, res) {

    // 输出 JSON 格式
    var response = {
        "first_name":req.query.first_name,
        "last_name":req.query.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
    // res.json(response);
})



app.get('/', function (req, res) {  //主页输出 "Hello World"
    console.log("主页 GET 请求");
    res.send('Hello GET');
})



app.post('/', function (req, res) {  //  POST 请求
    console.log("主页 POST 请求");
    res.send('Hello POST');
})


app.get('/del_user', function (req, res) {  //  /del_user 页面响应
    console.log("/del_user 响应 DELETE 请求");
    res.send('删除页面');
})


app.get('/list_user', function (req, res) {  //  /list_user 页面 GET 请求
    console.log("/list_user GET 请求");
    res.send('用户列表页面');
})


app.get('/ab*cd', function(req, res) {   // 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
    console.log("/ab*cd GET 请求");
    res.send('正则匹配');
})


var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})