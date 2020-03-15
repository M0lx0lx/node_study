var http=require('http');
var work=require('./lib/timetrack');
var mysql=require('mysql');

var db=mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'timetrack'
});

var server=http.createServer(function(req,res){
    switch (req.method){
        case 'POST':
            switch (req.url){
                case '/':
                    work.add(db,req,res);
                    break;
                case '/archive':
                    work.archive(db,req,res);
                    break;
                case '/delete':
                    work.delete(db,req,res);
                    break;
            }
            break;
        case 'GET':
            switch (req.url){
                case '/':
                    work.show(db,res);
                    break;
                case '/archived':
                    work.showArchived(db,res);
            }
            break;
    }
})

db.query(
    'create table if not exists work ('
    + 'id int(10) not null auto_increment, '
    +'hours decimal(5,2) default 0, '
    +'date date, '
    +'archived int(1) default 0, '
    +'description longtext,'
    +'primary key(id))',
    function(err){
        if(err) throw err;
        console.log('server started...');
        server.listen(3306,'127.0.0.1');
    }
)