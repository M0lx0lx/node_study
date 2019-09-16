const fs= require('fs')
const url= require('url')
const path= require('path')
const root= __dirname
const app= require('http').createServer(handler);
const io= require('socket.io').listen(app);  //将普通的HTTP服务器升级为socket.io服务器

const html= fs.readFileSync('../index.html','utf8')

app.use(function(req, res, next){
    req.on('static', function(){
        var file= url.parse(req.url).pathname;
        var mode= 'staylesheet'
        if(file[file.length-1] == '/'){
            file+= 'index.html'
            mode= 'reload'
        }
        createWatcher(file, mode)
    })
    next()
})
app.use(express.static(root))
var watchers={}
function createWatcher(file, event){
    var absolute= path.join(root, file)
    if(watchers[absolute]){
        return
    }
    fs.watchFile(absolute, function(curr, prev){

    })
}
function handler(req, res){
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Length', Buffer.byteLength(html, 'utf8'));
    res.end(html);
}

function tick(){
    var now= new Date().toUTCString();
    io.sockets.send(now);
}
setInterval(tick, 1000);

app.listen(8080);
