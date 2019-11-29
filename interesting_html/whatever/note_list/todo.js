var http=require('http');
var https=require('https');
var url=require('url');
var fs=require('fs');
var qs=require('querystring');
var formidable=require('formidable');
var items=[];
var options={
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./key-cert.pem')
}
var server=https.createServer(options,function(req,res){
    if('/' == req.url){
        switch(req.method){
            case 'GET':
                show(res);
                break
            case 'POST':
                upload(req,res);
                // add(req,res);
                break;
            default:
                badRequest(res);
        }
    }
    else{
        notFound(res);
    }
    // switch (req.method){
    //     case 'POST':
    //         var item='';
    //         req.setEncoding('utf8');
    //         req.on('data',function(chunk){
    //             item+=chunk;
    //             console.log('data:',chunk)
    //         });
    //         req.on('end',function(){
    //             items.push(item);
    //             res.end('ok\n');
    //         });
    //         break;
    //     case 'GET':
    //         var body=items.map(function(item,i){
    //             return i+')'+ item;
    //         }).join('\n');
    //         res.setHeader('Content-Length',Buffer.byteLength(body));
    //         res.setHeader('Content-Type','text/plain;charset="utf-8"');
    //         res.end(body);
    //         break;
    //     case 'DELETE':
    //         var path=url.parse(req.url).pathname;
    //         var i= parseInt(path.slice(1),10);
    //         if(isNaN(i)){
    //             res.statusCode=400;
    //             res.end('Invalid item id');
    //         }
    //         else if(!items[i]){
    //             res.statusCode=404;
    //             res.end('Item not found');
    //         }
    //         else{
    //             items.splice(i,1);
    //             res.end('ok\n');
    //         }
    //         break;
    // }
}).listen(8400);

function show(res){
    var html='<html><head><title>Todo List</title></head>'
            +'<h1>Todo List</h1>'
            +'<ul>'
            +items.map(function(item){
                return '<li>'+item+'</li>'
            }).join('')
            +'</ul>'
            +'<form method="post" action="/">'
            +'<p><input type="text" name="item" /></p>'
            +'<p><input type="submit" value="Add Item" /></p>'
            +'</form></body></html>'
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

function notFound(res) {
    res.statusCode=404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
}

function badRequest(res){
    res.statusCode=404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Bad Request');
}

function add(req,res){
    var body='';
    req.setEncoding('utf8');
    req.on('data',function(chunk){body+=chunk});
    req.on('end',function(){
        var obj=qs.parse(body);
        items.push(obj.item);
        show(res);
    });
}

function upload(req,res){
    if(!isFormData(req)){
        res.statusCode=400;
        res.end('Bad Request: expection multipart/form-data');
        return;
    }
    var form=new formidable.IncomingForm();
    form.parse(req);
    form.on('field',function(field,value){
        console.log(field,'\n',value);
    })
    form.on('file',function(name,file){
        console.log(name,'\n',file);
    })
    form.on('end',function(){
        res.end('upload complete!');
    })
    form.parse(req);

}

function isFormData(req){
    var type=req.headers['content-type'] || '';
    console.log('type:',type)
    return 0 === type.indexOf('multipart/form-data');
}