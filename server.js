var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/master', function(req, res){
  res.sendfile('master.html');
});
var room = {};

//방, 유저 리스트 및 카운터 전달
var get_status = function(){
  var status = [];
  var index = 0;
  
  for(i in room){
    status.push({'room' : Object.getOwnPropertyNames(room)[index],
                 'count' : room[i].count
                });
    index++;
  }
         
  return status;
}

io.on('connection', function(user_socket){
  
  user_socket.on('login',function(packet){
    var key = packet['chat_room_key'];
    var id = packet['chat_member_id'];
    
    if(key != '' && id != ''){
      user_socket.room = key;
      user_socket.nickname = id;
      user_socket.join(key);
      
      //room과 socket 객체에 요소 추가
      if(room[key] == undefined)
        room[key] = {'count': 0, 'members' : [id], 'chats' : []};
      else if( room[key]['members'].indexOf(id) == -1 )
        room[key]['members'].push(id);
      else 
        user_socket.emit('access',false); 
    
      console.log( key+" - '"+id+"'님이 입장했습니다.");
      
      //채팅방 데이터 보내기
      user_socket.emit('load', {
        'chat_status' : get_status(),
        'chat_count' : room[key]['count'],
        'chat_members' : room[key]['members'],
        'chat_history' : room[key]['chats']
      });
      
      //상태 새로고침
      io.sockets.emit('refresh',{
        'chat_status': get_status(),
        'chat_key' : key,
        'chat_members' : room[key]['members'],
      });
      
      user_socket.emit('access',true);
      
    } else{
     user_socket.emit('access',false); 
    }
  });

  user_socket.on('send',function(packet){
    var key = user_socket.room;
    var chat = {
      'chat_member_id': user_socket.nickname,
      'chat_type': packet['chat_type'],
      'chat_text': packet['chat_text'],
      'chat_time': packet['chat_time']
    }
    
    console.log(chat['chat_member_id']+"("+key+") : "+chat['chat_text']);
  
    //채팅 카운트 증가
    if( chat.chat_type == 'default' )
      room[key].count += 1;
    
    //채팅내역 저장
    room[key]['chats'].push(chat);
    
    //다른 유저들 채팅내역 및 상태 반영
    io.sockets.in(key).emit('broadcast', { 'chat' : [chat], 'count':room[key].count});
    
    //상태 새로고침
    io.sockets.emit('refresh',{
      'chat_status': get_status()
    });
  });

  user_socket.on('disconnect', function(data){
    var key = user_socket.room;
    var id = user_socket.nickname;
    
    if ( key != undefined ){
      var memlist = room[key].members;
      
      console.log( key+" - '"+id+"'님이 퇴장했습니다.");

      memlist.splice(memlist.indexOf(id),1);
      io.sockets.emit('refresh',{
        'chat_status': get_status(),
        'chat_key' : key,
        'chat_members' : room[key]['members'],
      });
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
