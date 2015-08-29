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

var room = {
  'Dijkstra' : { 'key': 272, 'count': 0, 'members' : [], 'chats' : [] },
  'Prim' : { 'key': 134, 'count': 0, 'members' : [], 'chats' : [] },
  'Euclid' : { 'key': 671, 'count': 0, 'members' : [], 'chats' : [] },
  'Kruskal' : { 'key': 214, 'count': 0, 'members' : [], 'chats' : [] },
  'Fisher-yates' : { 'key': 903, 'count': 0, 'members' : [], 'chats' : [] },
  'Floyd-Warshall' : { 'key': 830, 'count': 0, 'members' : [], 'chats' : [] },
  'Bellman-Ford' : { 'key': 543, 'count': 0, 'members' : [], 'chats' : [] },
  'Hoffman' : { 'key': 862, 'count': 0, 'members' : [], 'chats' : [] },
  'DP' : { 'key': 384, 'count': 0, 'members' : [], 'chats' : [] },
  'A*' : { 'key': 097, 'count': 0, 'members' : [], 'chats' : [] }
};

//방 및 방의 카운터 전달
var get_state = function(){
  var state = [];
  var index = 0;
  
  for(i in room){
    state.push({'room' : Object.getOwnPropertyNames(room)[index],
                 'count' : room[i].count
                });
    index++;
  }
         
  return state;
}


io.on('connection', function(user_socket){
  
  user_socket.on('login',function(packet){
    var name;
    var key = packet['chat_room_key'];
    var nickname = packet['chat_member_nickname'];
    var access = false;
    
    if(key != '' && nickname != ''){

      for(i in room){
        if(room[i].key == key){ 
          name = i;

          if( room[i]['members'].indexOf(nickname) == -1 ){
            access = true;

            if( nickname == 'master')  room[name]['members'].unshift(nickname);
            else room[name]['members'].push(nickname);

            user_socket.room = name;
            user_socket.nickname = nickname;
            user_socket.join(name);
          } else { access == false; }
        }
      }
        
      if( access ){
        console.log( name+" - '"+nickname+"'님이 입장했습니다.");

        //채팅방 데이터 보내기
        user_socket.emit('load', {
          'chat_room' : name,
          'chat_nickname' : nickname,
          'chat_state' : get_state(),
          'chat_count' : room[name]['count'],
          'chat_members' : room[name]['members'],
          'chat_history' : room[name]['chats']
        });

        //상태 새로고침
        io.sockets.in(name).emit('refresh',{
          'chat_state': get_state(),
          'chat_room' : name,
          'chat_members' : room[name]['members'],
        });
        user_socket.emit('access',{ 'chk' : true, 'room' : name });
      }
    } 

    if( access == false) user_socket.emit('access',{ 'chk' : false });
  });

  user_socket.on('send',function(packet){
    var name = user_socket.room;
    var chat = {
      'chat_member_id': user_socket.nickname,
      'chat_type': packet['chat_type'],
      'chat_text': packet['chat_text'],
      'chat_time': packet['chat_time']
    }
    
    console.log(chat['chat_member_id']+"("+name+") : "+chat['chat_text']);
  
    //채팅 카운트 증가
    if( chat.chat_type == 'default' )
      room[name].count += 1;
    
    //채팅내역 저장
    room[name]['chats'].push(chat);
    
    //다른 유저들 채팅내역 및 상태 반영
    io.sockets.in(name).emit('broadcast', { 'chat' : [chat], 'count':room[name].count});
    
    //상태 새로고침
    io.sockets.emit('refresh',{
      'chat_state': get_state()
    });
  });
  
  user_socket.on('count_tool',function(packet){
    var name = user_socket.room;
    var type = packet.type;
    var val = packet.value;

    if( type == 'edit' ){
      room[name].count = val*1;
      io.sockets.emit('refresh',{
        'chat_state': get_state(),
        'chat_room':name,
        'chat_count': val
      });
    }else if( type == 'reset' ){
      room[key].count = 0;
      io.sockets.emit('refresh',{
        'chat_state': get_state(),
        'chat_count': 0
      });
    }
  });
  
  user_socket.on('typing',function(packet){
    var name = user_socket.room;
    var id = user_socket.nickname;
    var state = packet.state;
    
    io.sockets.in(name).emit('typing', {'id': id, 'state': state});
  });

  user_socket.on('disconnect', function(packet){
    var name = user_socket.room;
    var id = user_socket.nickname;
    var chat_members;
    
    if ( name != undefined ){
      var memlist = room[name].members;
      
      console.log( name+" - '"+id+"'님이 퇴장했습니다.");
      user_socket.leave(name);

      //멤버 제거
      memlist.splice(memlist.indexOf(id),1);

      chat_members = room[name]['members'];
      
      io.sockets.emit('refresh',{
        'chat_state': get_state(),
        'chat_room' : name,
        'chat_members' : chat_members
      });
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
