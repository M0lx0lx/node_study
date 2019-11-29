var connect =require('connect');
var url=require('url');
var app=connect();
// var router=require('./middleware/router');
var parse =require('url').parse;

var toutes={
    GET:{
        '/users':function(req,res){
            res.end('tobi, loki, ferret');
        },
        '/user/:id': function(req,res,id){
            res.end('user'+id);
        }
    },
    DELETE:{
        '/user/:id':function(req,res,id){
            res.end('deleted user '+id);
        }
    }
};

function logger(req,res,next){  //输出HTTP请求的方法和URL并调用next()
    console.log('%s %s',req.method,req.url);
    next();
}

function hello(req,res){
    res.setHeader('Content-Type','text/plain');
    res.end('hello world');
}

function restrict(req,res,next){  //实现HTTP Basic认证的中间件组件
    var authorization=req.headers.authorization;
    if(!authorization) return next(new Error('Unauthorized'));

    var parts=authorization.split(' ');
    console.log('parts: ',parts)
    var scheme=parts[0];
    var auth=new Buffer(parts[0],'base64').toString().split(':')
    var user=auth[0];
    var pass=auth[1];
    next()
    // authenticateWithDatabase(user,pass,function(err){
    //     if(err) return next(err);
    //
    //     next();
    // })
}

function admin(req,res,next){  //路由 admin 请求
    switch (req.url){
        case '/':
            res.end('try /users');
            break;
        case '/users':
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify(['tobi','loki','jane']));
            break;
    }
}

function setup(format){  //可配置的Connect中间件组件 logger
    var regexp=/:(\w+)/g;
    return function logger(req,res,next){
        var str=format.replace(regexp,function(match,property){  //用正则表达式格式化请求的日志条目
            return req[property];
        });
        console.log(str);
        next();
    }
}

module.exports=function route(obj){
    return function(req,res,next){
        if(!obj[req.method]){
            next();
            return;
        }
        var routes=obj[req.method]
        var url=parse(req.url)
        var paths=Object.keys(routes)

        for(var i=0;i<paths.length;i++){
            var path=paths[i];
            var fn=routes[path];
            path=path
                .replace(/\//g,'\\/')
                .replace(/:(\w+)/g,'([^\\/]+)');
            var re=new RegExp('^'+path+'$');
            var captures=url.pathname.match(re)
            if(captures){
                var args=[req,res].concat(captures.slice(1));
                fn.apply(null,args);
                return;
            }
        }
        next();
    }
}

function rewrite(req,res,next){  //基于缩略名重写请求URL的中间件
    var path=url.parse(req.url).pathname
    var match=path.match(/^(\/blog)|(\/posts\/)(.+)/)
    console.log('path:',path,'\n',match)
    next();
    // if(match){
    //     findPostIdBySlug(match[1],function(err,id){
    //         if(err) return next(err);
    //         if(!id) return next(new Error('User not found'));
    //         req.url='/blog/posts/'+id;
    //         next();
    //     });
    // }
    // else{
    //     next();
    // }
}

function errorHandler(){  //Connect中的错误处理中间件
    var env=process.env.NODE_ENV || 'development';
    return function(err,req,res,next){
        res.statusCode=500;
        switch (env){
            case 'development':
                res.setHeader('content-type','application/json');
                res.end(JSON.stringify(err));
                break;
            default:
                res.end('Server error');
        }
    }
}
var db={
    users:[
        {name: 'tobi'},
        {name: 'loki'},
        {name: 'jane'}
    ]
};

function users(req,res,next){  // 中间件组件
    var match=req.url.match(/^\/user\/(.+)/)
    console.log('mat:',match)
    if(match){
        var user=db.users[match[1]];
        if(user){
            res.setHeader('content-type','application/json');
            res.end(JSON.stringify(user));
        }
        else{
            var err=new Error('User not found');
            err.notFound=true;
            next(err);
        }
    }
    else{
        next();
    }
}

function pets(req,res,next){  // 中间件组件
    if(req.url.match(/^\/pet\/(.+)/)){
        foo();
    }
    else{
        next();
    }
}

function errorHandler(err,req,res,next){  //不暴露非必要数据的错误处理组件
    console.log(err.stack);
    res.setHeader('content-type','application/json');
    if(err.notFound){
        res.statusCode=404;
        res.end(JSON.stringify({error:err.message}));
    }
    else{
        res.statusCode=500;
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }
}

var api=connect()
    .use(users)
    .use(pets)
    .use(errorHandler);

connect()
    .use(logger)
    // .use('/blog',blog)
    // .use('/posts',blog)
    // .use(router(rooutes))
    // .use(router(require('./routes/user')))
    // .use(router(require('./routes/admin')))
    // .use(rewrite)
    // .use(hello)
    .use('/admin',restrict)
    .use('/admin',admin)
    .use('/api',api)
    .listen(3000)