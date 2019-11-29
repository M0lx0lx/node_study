const socketio=require('socket.io')
var io
    ,guestNumber=1
    ,nickNames={}
    ,namesUsed=[]
    ,currentRoom={}

exports.listen=function(server){   //启动Socket.IO服务器
    io=socketio.listen(server)  //启动Socket.IO服务器，允许它搭载在已有的HTTP服务器上
    io.set('log level',1)
    io.sockets.on('connection',function(socket){   //定义每个用户连接的处理逻辑
        guestNumber=assignGuestName(socket,guestNumber,nickNames,namesUsed);  //在用户连接上来时赋予其一个访客名

        joinRoom(socket,'Lobby');  //在用户连接上来时把他放入聊天室Lobby里

        handleMessageBroadcasting(socket,nickNames)  //处理用户的消息，更名，以及聊天室的创建和变更
        handleNameChangeAttempts(socket,nickNames,namesUsed);
        handleRoomJoining(socket);

        socket.on('rooms',function(){
            socket.emit('rooms',io.sockets.manager.rooms)
        });   //用户发出请求时，向其提供已经被占用的聊天室的列表
        handleClientDisconnection(socket,nickNames,namesUsed);  //定义用户断开连接后的清除逻辑
    })
}

function assignGuestName(socket,guestNumber,nickNames,namesUsed){  //分配用户昵称
    var name= 'Guest'+guestNumber;   //生成新昵称
    nickNames[socket.id]=name;      //把用户昵称跟客户端连接ID关联上
    socket.emit('nameResult',{     //让用户知道他们的昵称
        success: true,
        name: name
    });
    namesUsed.push(name)           //存放已经被占用的昵称
    return guestNumber + 1          //增加用来生成昵称的计数器
}

function joinRoom(socket,room){  //进入聊天室相关的逻辑
    socket.join(room);
    currentRoom[socket.id]=room
    socket.emit('joinResult',{room:room})
    socket.broadcast.to(room).emit('message',{
        text:nickNames[socket.id]+' 进入 '+room+' 聊天室.'
    });

    var usersInRoom=io.sockets.clients(room)
    if(usersInRoom.length>1){
        var usersInRoomSummary='当前聊天室 '+room+'的用户: ';
        for(let i in usersInRoom){
            var userSocketId =usersInRoom[i].id;
            if(userSocketId != socket.id){
                if(i>0){
                    usersInRoomSummary+=', ';
                }
                usersInRoomSummary+=nickNames[userSocketId];
            }
        }
        usersInRoomSummary+='.';
        socket.emit('message',{text:usersInRoomSummary});
    }
}

function handleNameChangeAttempts(socket,nickNames,namesUsed){   //更名请求的处理逻辑
    socket.on('nameAttempt',function(name){
        if(name.indexOf('Guest')==0){
            socket.emit('nameResult',{
                success: false,
                message: '昵称不能以"Guest"开头.'
            });
        }
        else{
            if(namesUsed.indexOf(name) == -1){
                var previousName=nickNames[socket.id];
                var previousNameIndex=namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id]=name;
                delete namesUsed[previousNameIndex];
                socket.emit('nameResult',{
                    success: true,
                    name: name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message',{
                    text: previousName+' 更名为 '+name+'.'
                });
            }
            else{
                socket.emit('nameResult',{
                    success: false,
                    message: '昵称已存在.'
                })
            }
        }
    })
}

function handleMessageBroadcasting(socket) {  //发送聊天消息
    socket.on('message',function(message){
        socket.broadcast.to(message.room).emit('message',{
            text: nickNames[socket.id]+': '+ message.text
        })
    })
}

function handleRoomJoining(socket){  //创建房间
    socket.on('join',function(room){
        socket.leave(currentRoom[socket.id])
        joinRoom(socket,room.newRoom)
    })
}

function handleClientDisconnection(socket){
    socket.on('disconnect',function(){
        var nameIndex=namesUsed.indexOf(nickNames[socket.id])
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    })
}