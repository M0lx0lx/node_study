function divEscapedContentElement(message){  //净化文本，将特殊字符转换成HTML实体
    return $('<div></div>').text(message);
}

function divSystemContentElement(message){
    return $('<div></div>').html('<i>'+message+'</i>');
}

function processUserInput(chatApp,socket){  //处理原始的用户输入
    var message=$('#send_message').val();
    var systemMessage;
    if(message.charAt(0) == '/'){   //命令
        systemMessage=chatApp.processCommand(message);
        if(systemMessage){
            $('#messages').append(divSystemContentElement(systemMessage));
        }
    }
    else{
        chatApp.sendMessage($('#room').text(),message);
        $('#messages').append(divEscapedContentElement(message));
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }
    $('#send_message').val('');
}

var socket=io.connect();
$(document).ready(function(){
    var chatApp=new Chat(socket);
    
    socket.on('nameResult',function(result){  //显示更名尝试的结果
        var message;
        
        if(result.success){
            message='你的昵称 '+ result.name+'.';
        }
        else{
            message=result.message;
        }
        $('#messages').append(divSystemContentElement(message));
    })
    
    socket.on('joinResult',function(result){   //显示房间变更结果
        $('#room').text(result.room);
        $('#messages').append(divSystemContentElement('聊天室 '+result.room));
        document.title=result.room
    })
    
    socket.on('message',function(message){  //显示接收到的消息
        var newElement=$('<div></div>').text(message.text);
        $('#messages').append(newElement);
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    })
    
    socket.on('rooms',function(rooms){   //显示可用房间列表
        $('#room_list').empty();
        
        for(let room in rooms){
            room=room.substring(1,room.length);
            if(room !=''){
                $('#room_list').append(divSystemContentElement(room))
            }
        }

        $('#room_list div').click(function(){
            chatApp.processCommand('/join '+$(this).text());
            $('#send_message').focus();
        })
    })

    setInterval(function(){
        socket.emit('rooms');
    },1000)

    $('#send_message').focus();
    $('#send_form').submit(function(){
        processUserInput(chatApp,socket);
        return false;
    })
})