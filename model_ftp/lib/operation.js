const Client = require('ftp')
const fs = require('fs')
const config= require('./config')

module.exports= function connect({type='',file=''}={}){
    var c = new Client();
    c.on('ready', function() {

        switch (type) {
            case 'get':
                c.get(file, function(err, stream) {
                    if (err){
                        console.error(err)
                        return
                    }
                    stream.once('close', function() {
                        console.log('\n下载成功')
                        c.end();
                    });
                    stream.pipe(fs.createWriteStream(file));
                });
                break
            case 'put':
                c.put(file, file, function(err) {
                    if (err){
                        console.error(err)
                        return
                    }
                    console.log('\n上传成功')
                    c.end();
                })
                break
            default:
                c.list(function(err, list) {
                    if (err){
                        console.error(err)
                        return
                    }
                    console.dir(list)
                    c.end()
                })
        }

    })
    c.connect(config.options);
}


