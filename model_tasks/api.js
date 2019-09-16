/*
* @Author: 89623
* @Date:   2019-06-15 23:25:51
* @Last Modified by:   89623
* @Last Modified time: 2019-06-16 13:42:59
*/
const http= require('http')
const url= require('url')
const path= require('path')
const fs= require('fs')

const parse= url.parse
	,join= path.join
	,root= __dirname

var items= []   //用于保存数据

// 1编写启动逻辑
	// 收集参数值并解析文件数据库的路径
	,args= process.argv.splice(2)  //去掉“node cli_tasks.js”，只留下参数
	,command= args.shift()   //取出第一个参数（命令）
	,taskDescription= args.join(' ')   //合并剩余的参数
	,file= join(process.cwd(), '/.tasks')   //根据当前的工作目录解析数据库的相对路径

	// 确定CLI脚本应该采取什么动作
switch(command){
	case 'list':   //'list' 会列出所有已保存的任务
		listTasks(file)
		break
	case 'add':   //'add' 会添加新任务
		addTask(file, taskDescription)
		break
	default:   //其他任何参数都会显示帮助
		console.log(`Usage: ${process.argv[0]} list | add [taskDescription]`)
}

// 2. 定义获取任务的辅助函数
	// 从文本文件中加载用JSON编码的数据
function loadOrInitialTaskArray(file, cb){
	fs.exists(file, function(exists){   //检查.tasks文件是否已经存在
		var tasks= []
		if(exists){
			fs.readFile(file, 'utf8', function(err, data){   //从.tasks文件中读取待办事项数据
				if(err) throw err;
				var data= data.toString(),
					tasks= JSON.parse(data || '[]')   //把用JSON编码的待办事项数据解析到任务数组中
				cb(tasks)
			})
		} else{
			cb([])   //如果.tasks文件不存在，则创建空的任务数组
		}
	})
}
	// 列出任务的函数
function listTasks(file){
	loadOrInitialTaskArray(file, function(tasks){
		for(let i in tasks){
			console.log(tasks[i])
		}
	})
}

// 3. 定义一个存放任务的辅助函数
	// 把任务保存到磁盘中
function storeTasks(file, tasks){
	fs.writeFile(file, JSON.stringify(tasks), 'utf8', function(err){
		if(err) throw err
		console.log('Saved.')
	})
}
	// 添加一项任务
function addTask(file, taskDescription){
	loadOrInitialTaskArray(file, function(tasks){
		tasks.push(taskDescription)
		storeTasks(file, tasks)
	})
}


console.log('创建api服务器')
const server= http.createServer(function(req,res){
	console.log('请求方式：',req.method)
	switch(req.method){
		case 'POST':
			let item=''
			req.setEncoding('utf8')
			req.on('data', function(chunk){  //数据块默认是个 Buffer 对象（字节数组）
				console.log('parsed', chunk);
				item+= chunk
			})
			req.on('end', function(){  //数据全部读完之后触发end 事件
				console.log('done parsing');
				items.push(item)   //保存数据
				res.end('ok\n')
			})
			break
		case 'GET':
			items.forEach(function(item, i){
				res.write(`${i}) ${item}\n`)
			})
			res.end()
			break
		case 'DELETE':
			let path= url.parse(req.url).pathname
			let i= parseInt(path.slice(1), 10)
			if(isNaN(i)){   //检查数字是否有效
				res.statusCode= 400
				res.end('Invalid item id')
			} else if(!items[i]){  //确保请求的索引存在
				res.statusCode= 404
				res.end('Item not found')
			} else{  //删除请求的事项
				items.splice(i, 1)
				res.end('ok\n')
			}
			break
	}
	
}).listen(8000)

console.log('创建静态资源服务器')
const server_public= http.createServer(function(req,res){
	var url= parse(req.url),
		path= join(root, url.pathname)  //构造绝对路径


	// if(/Api/.test(url.pathname)){
    //     let sent_data= JSON.stringify({UserCode: 'shenxz', UserPsw: '123456'})
    //     var sendmsg='';
    //     let t=http.request({
    //         host:"localhost",
    //         port: 9001,
    //         path: '/Api/MobileAuthApi/Login',
    //         method: 'POST',
    //         headers: {
    //             'Content-Type':'application/json',
    //             'Content-Length': Buffer.byteLength(sent_data)
    //         }
    //     }, function(req) {      //发出请求，加上参数，然后有回调函数
    //         req.on("data", function(chunk) {               //监听data,接受数据
    //             sendmsg += chunk;                         //把接受的数据存入定放的sendmsg
    //         });
    //         req.on("end", function(d) {                     //监听end事件，请求结束后调用
    //             var list=JSON.parse(sendmsg);            //对接受到的数据流进行编码
    //             console.log('结果有吗：',sendmsg)                  //打印出结果
	//
    //         });
    //         console.log('有值么：',sendmsg)
    //     });
    //     t.on('error', (e) => {
    //         console.error(`请求遇到问题: ${e.message}`);
    //     });
    //     t.write(sent_data);
    //     t.end();
    //     res.setHeader('content-type', 'text/plain')
    //     res.setHeader('Content-Length', Buffer.byteLength(sendmsg))   //用 stat 对象的属性设置Content-Length
    //     res.end(sendmsg)
    //     return
	// }


    console.log('请求文件：',path)

    var mime = {   //类型
		 "css": "text/css",
		 "gif": "image/gif",
		 "html": "text/html",
		 "ico": "image/x-icon",
		 "jpeg": "image/jpeg",
		 "jpg": "image/jpeg",
		 "js": "text/javascript",
		 "json": "application/json",
		 "pdf": "application/pdf",
		 "png": "image/png",
		 "svg": "image/svg+xml",
		 "swf": "application/x-shockwave-flash",
		 "tiff": "image/tiff",
		 "txt": "text/plain",
		 "wav": "audio/x-wav",
		 "wma": "audio/x-ms-wma",
		 "wmv": "video/x-ms-wmv",
		 "xml": "text/xml"
        }

    //未知的类型一律用"text/plain"类型
    var contentType = mime[path.slice(path.lastIndexOf('.')+1)] || "text/plain";

	fs.stat(path, function(err, stat){
		if(err){
			if('ENOENT' == err.code){
				res.statusCode= 404
				res.end('Not Found')
			} else{
				res.statusCode= 500
				res.end('Internal Server Error')
			}
		} else{
            res.setHeader('content-type', contentType)
            res.setHeader('Content-Length', stat.size)   //用 stat 对象的属性设置Content-Length
			stream= fs.createReadStream(path).pipe(res)   //创建fs.ReadStream
			stream.pipe(res)   //res.end() 会在 stream.pipe()内部调用
			stream.on('error', function(err){
				res.statusCode= 500
				res.end('Internal Server Error')
			})
		}
	})

    // stream.on('data',function(chunk){
	// 	res.write(chunk)   //将文件数据写到响应中
	// })
	// stream.on('end', function(){
	// 	res.end()  //文件写完后结束响应
	// })
	
}).listen(8001)
