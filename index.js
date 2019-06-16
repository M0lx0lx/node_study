/*
* @Author: 89623
* @Date:   2019-06-15 23:51:26
* @Last Modified by:   89623
* @Last Modified time: 2019-06-16 23:41:55
*/
var mysql  = require('mysql');  
 
var connection = mysql.createConnection({     
  host     : '127.0.0.1',       
  user     : 'root',              
  password : 'root',       
  port: '3306',                   
  database: 'timetrack'
}); 
 
connection.connect();
 
var  sql = 'SELECT * FROM work';
//查
connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
 
       console.log('--------------------------SELECT----------------------------');
       console.log(result);
       console.log('------------------------------------------------------------\n\n');  
});
 
connection.end();