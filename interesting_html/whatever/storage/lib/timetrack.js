var qs=require('querystring');

// 辅助函数：发送HTML，创建表单，接收表单数据
exports.sendHtml=function(res,html){   //发送HTML响应
    res.setHeader('Content-Type','text/html');
    res.setHeader('Content-Length',Buffer.byteLength(html));
    res.end(html);
};
parseReceivedData=function(req,cb){  //解析HTTP POST数据
    var body='';
    req.setEncoding('utf8');
    req.on('data',function(chunk){body+=chunk});
    req.on('end',function(){
        var data=qs.parse(body);
        cb(data);
    });
};
exports.actionForm=function(id,path,label){  //渲染简单的表单
    var html='<form method="POST" action="'+path
    +'">'+'<input type="hidden" name="id" value="'
    +id+'"/>'+'<input type="submit" value="'
    +label+'"/>'
    +'</form>'
    return html
}

exports.add=function(db,req,res){  //添加工作记录
    parseReceivedData(req,function(work){
        db.query(
            'insert into work (hours,date,description) '
            +' values(?,?,?)',
            [work.hours,work.date,work.description],
            function(err){
                if(err) throw err;
                exports.show(db,res);
            }
        )
    })
}

exports.delete=function(db,req,res){  //删除工作记录
    parseReceivedData(req,function(work){
        db.query(
            'delete from work where id=?',
            [work.id],
            function(err){
                if(err) throw err;
                exports.show(db,res)
            }
        )
    })
}

exports.archive=function(db,req,res){  //归档一条工作记录
    parseReceivedData(req,function(work){
        db.query(
            'update work set archived=1 where id=?',
            [work.id],
            function(err){
                if(err) throw err;
                exports.show(db,res);
            }
        )
    })
}

exports.show=function(db,res,showArchived){  //获取工作记录
    var query='select * from work '+
        'where archived=? '+
        'order by date desc';
    var archiveValue=(showArchived)?1:0
    db.query(
        query,
        [archiveValue],
        function(err,rows){
            if(err) throw err;
            html=(showArchived)
                ?''
                : '<a href="/archived">Archived Work</a><br/>';
            html+=exports.workHitlistHtml(rows);
            html+=exports.workFormHtml();
            exports.sendHtml(res,html);
        }
    );
};
exports.showArchived=function(db,res){
    exports.show(db,res,true);
};

exports.workHitlistHtml=function(rows){  //将工作记录渲染为HTML表格
    var html='<table>';
    for(var i in rows){
        html+='<tr>';
        html+='<td>'+rows[i].date+'</td>';
        html+='<td>'+rows[i].hours+'</td>';
        html+='<td>'+rows[i].description+'</td>';
        if(!rows[i].archived){
            html+='<td>'+exports.workArchiveForm(rows[i].id)+'</td>';
        }
        html+='<td>'+exports.workDeleteForm(rows[i].id)+'</td>';
        html+='</tr>';
    }
    html+='</table>';
    return html;
}

// 用来添加、归档、删除工作记录的HTML表单
exports.workFormHtml=function(){
    var html='<form method="post" action="/"'+
        '<p>Date(yyy-mm-dd):<br/><input name="date" type="date"></p>'+
        '<p>Hours worked:<br /><input name="hours" type="text"></p>'+
        '<p>Description:<br/>' +
        '<textarea name="description"></textarea></p>'+
        '<input type="submit" value="Add" />'+
        '</form>';
    return html;
}
exports.workArchiveForm=function(id){  //渲染归档按钮表单
    return exports.actionForm(id,'/archive','Archive');
};
exports.workDeleteForm=function(id){  //渲染删除按钮表单
    return exports.actionForm(id,'/delete','Delete');
}