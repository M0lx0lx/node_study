var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'mysql'
});

connection.connect();

function add_one(){   //增
    var  addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
    var  addSqlParams = ['nima', 'www.nihao.co','ni', 'CN'];
    connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------INSERT----------------------------');
        //console.log('INSERT ID:',result.insertId);
        console.log('INSERT ID:',result);
        console.log('-----------------------------------------------------------------\n\n');
    });
}


function search(){  //查
    var  sql = 'SELECT * FROM websites';
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
    });
}

function updata(){  //改
    var modSql = 'UPDATE websites SET name = ?,url = ? WHERE Id = ?';
    var modSqlParams = ['菜鸟移动站', 'https://m.runoob.com',5];
    connection.query(modSql,modSqlParams,function (err, result) {
        if(err){
            console.log('[UPDATE ERROR] - ',err.message);
            return;
        }
        console.log('--------------------------UPDATE----------------------------');
        console.log('UPDATE affectedRows',result.affectedRows);
        console.log('-----------------------------------------------------------------\n\n');
    });
}

function delete_one(){   //删
    var delSql = 'DELETE FROM websites where id=3';
    connection.query(delSql,function (err, result) {
        if(err){
            console.log('[DELETE ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------DELETE----------------------------');
        console.log('DELETE affectedRows',result.affectedRows);
        console.log('-----------------------------------------------------------------\n\n');
    });
}
search();
connection.end();