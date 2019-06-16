/*
* @Author: 89623
* @Date:   2019-06-16 13:49:44
* @Last Modified by:   89623
* @Last Modified time: 2019-06-17 00:09:34
*/
const qs= require('querystring')


// 3. 创建辅助函数发送HTML，创建表单，接收表单数据
	// 辅助函数：发送HTML，创建表单，接收表单数据
exports.sendHtml= function(res, html){   //发送HTML响应
	res.setHeader('Content-Type', 'text/html')
	res.setHeader('Content-Length', Buffer.byteLength(html))
	res.end(html)
}

exports.parseReceivedData= function(req,cb){   //解析HTTP POST数据
	var body= ''
	req.setEncoding('utf8')
	req.on('data', function(chunk){
		body+= chunk
	})
	req.on('end', function(){
		var data= qs.parse(body)
		cb(data)
	})
}
exports.actionForm= function(id, path, label){   //渲染简单的表单
	var html= `<form method='post' action= '${path}'>
					<input type='hidden' name='id' value= '${id}'>
					<input type='submit' value= '${label}'>
				</form>`
	return html
}

// 4. 用MySQL添加数据
exports.add= function(db, req, res){   //添加工作记录
	exports.parseReceivedData(req, function(work){
		db.query(
				`INSERT INTO work (hours, date, description) 
				VALUES(?, ?, ?)`,   //添加工作记录的SQL
				[work.hours, work.date, work.description],   //工作记录数据
				function(err){
					if(err) throw err
					exports.show(db, res)   //给用户显示工作记录清单
				}
			)
	})
}

// 5. 删除MySQL数据
exports.delete= function(db, req, res){
	exports.parseReceivedData(req, function(work){
		db.query(
				`DELETE FROM work WHERE id=?`,   //删除工作记录的SQL
				[work.id],   //工作记录ID
				function(err){
					if(err) throw err
					exports.show(db,res)
				}
			)
	})
}

//6. 更新MySQL数据
exports.archive= function(db, req, res){   //归档一条工作记录
	exports.parseReceivedData(req, function(work){
		db.query(
				`UPDATE work SET archived=1 WHERE id=?`,
				[work.id],
				function(err){
					if(err) throw err
					exports.show(db,res)
				}
			)
	})
}

// 7. 获取MySQL数据
exports.show= function(db, res, showArchived){
	var query= `SELECT *FROM work
				WHERE archived=? 
				ORDER BY date DESC`
		,archiveValue= (showArchived)?1:0
	db.query(
		query,
		[archiveValue],   //想要的工作记录归档状态
		function(err,rows){
			if(err) throw err
			html= showArchived
				? ''
				: `<a href='/archived'>Archived Work</a><br/>`
			html+= exports.workHitlistHtml(rows)   //将结果格式化为HTML表格
			html+= exports.workFormHtml()
			exports.sendHtml(res, html)
		}
		)
}

exports.showArchived= function(db, res){
	exports.show(db, res, true)   //只显示归档的工作记录
}

// 8. 渲染MySQL记录
exports.workHitlistHtml= function(rows){
	var html= '<table'
	for(let i in rows){   //将每条工作记录渲染为HTML表格中的一行
		html+= `<tr>
				<td>${rows[i].date}</td>
				<td>${rows[i].hours}</td>
				<td>${rows[i].description}</td>
				${!rows[i].archived?'<td>'+exports.workArchiveForm(rows[i].id)+'</td>':''}
				<td>${exports.workDeleteForm(rows[i].id)}</td>
				</tr>`
	}
	html+= '</table>'
	return html
}

// 9. 渲染HTML表单
	//用来添加、归档、删除工作记录的HTML表单
exports.workFormHtml= function(){
	var html= `<form method='post' action='/'>
				<p>Date (yyyy-mm-dd):<br/><input name='date' type='text'></p>
				<p>Hours worked:<br/><input name='hours' type='text'></p>
				<p>Description:<br/>
				<textarea name='description'></textarea></p>
				<input type='submit' value='Add' />
				</form>`
	return html
}
exports.workArchiveForm= function(id){
	return exports.actionForm(id, '/archive', 'Archive')   //渲染归档按钮表单
}
exports.workArchiveForm= function(id){
	return exports.actionForm(id, '/delete', 'Delete')   //渲染删除按钮表单
}