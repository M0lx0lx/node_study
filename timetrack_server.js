/*
* @Author: 89623
* @Date:   2019-06-16 13:49:19
* @Last Modified by:   89623
* @Last Modified time: 2019-06-17 00:07:54
*/

// 1....
const http= require('http')
	 ,work= require('./lib/timetrack')
	 ,mysql= require('mysql')


// 2. 创建程序的逻辑
	// 程序设置及数据库连接初始化
var db= mysql.createConnection({   //连接MySQL
	host: 'localhost',
	user: 'root',
	password: 'root',
   	port: '3306', 
	database: 'timetrack'
})

	// HTTP请求路由
var server= http.createServer(function(req,res){
	switch(req.method){
		case 'POST':
			switch(req.url){
				case '/':
					work.add(db, req, res)
					break
				case '/archive':
					work.archive(db, req, res)
					break
				case '/delete':
					work.delete(db, req, res)
					break
			}
			break
		case 'GET':
			switch(req.url){
				case '/':
					work.show(db,res)
					break
				case '/archived':
					work.showArchived(db, res)
					break
			}
			break
		
	}
})
console.log('Server started...')

db.connect();
db.query(  //建表SQL
	`create table if not exists work (
	id INT(10) NOT NULL AUTO_INCREMENT,
	hours DECIMAL(5,2) DEFAULT 0,
	date DATE, 
	archived INT(1) DEFAULT 0, 
	description LONGTEXT,
	PRIMARY KEY(id))`,
	function(err){
		if(err) throw err;
		console.log('mysql server started...')
	server.listen(3000, '127.0.0.1')   //启动HTTP服务器
	}
)