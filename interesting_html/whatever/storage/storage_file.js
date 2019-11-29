var fs=require('fs');
var path=require('path');
var args=process.argv.splice(2);
var command=args.shift();
var taskDescription=args.join(' ');
var file=path.join(process.cwd(),'/.tasks');

switch(command){  //确定CLI脚本应该采取什么动作
    case 'list':  //列出所有已保存的任务
        listTasks(file);
        break;
    case 'add':  //添加新任务
        addTask(file,taskDescription);
        break;
    default:   //其他任何参数都会显示帮助
        console.log('Usage: '+process.argv[0]+' list|add [taskDescription]');
}

function loadOrInitializeTaskArray(file,cb){  //从文本文件中加载用JSON编码的数据
    fs.exists(file,function(exists){
        var tasks=[];
        if(exists){
            fs.readFile(file,'utf8',function(err,data){
                if(err) throw err;
                var data=data.toString();
                var tasks=JSON.parse(data || '[]');
                cb(tasks);
            });
        }
        else{
            cb([]);
        }
    })
}

function listTasks(file) {  //列出任务的函数
    loadOrInitializeTaskArray(file,function(tasks){
        for(var i in tasks){
            console.log(tasks[i]);
        }
    });
}

function storeTasks(file,tasks){  //把任务保存到磁盘中
    fs.writeFile(file,JSON.stringify(tasks),'utf8',function(err){
        if(err) throw err;
        console.log('Saved.');
    })
}

function addTask(file,taskDescription){  //添加一项任务
    loadOrInitializeTaskArray(file,function(tasks){
        tasks.push(taskDescription)
        storeTasks(file,tasks);
    })
}