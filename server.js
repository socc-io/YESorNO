var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

var room = {};
var socket_map = {};

io.on('connection', function(user_socket){

  user_socket.on('send',function(packet){
	console.log('socket.io : send');

	var key = packet['chat_room_key'];
	var id = packet['chat_member_id'];
	var type = packet['chat_type'];
	var text = packet['chat_text'];

	room[key]['chats'].push({
		'chat_member_id':id,
		'chat_type':type,
		'chat_text':text
	});

	broad_packet = {
		'chat_history': room[key]['chats']
	}
	
	console.log(broad_packet);
	for(i in room[key]['members']){
		room[key]['members'][i]['socket'].emit(
			'broadcast',broad_packet
		);
	}
  });

  user_socket.on('disconnect', function(data){
	console.log("socket.io : disconnect");
	for( key in room ){
		var memlist = room[key]['members'];
		var rmcnt = 0;
		for( mi in memlist ){
			mi -= rmcnt;
			if(user_socket.id == memlist[mi]['socket'].id){
				memlist.splice(mi,1);
				rmcnt +=1 ;
			}
		}
	}
  });

  user_socket.on('login',function(packet){
	console.log('socket.io : login');
    var key = packet['chat_room_key'];
	var id = packet['chat_member_id'];
	var sobj = {'id':id,'socket':user_socket}
	if(room[key] == undefined){
		room[key] = {'members' : [sobj], 'chats' : []};
	}else{
		room[key]['members'].push(sobj);
	}
	console.log(room);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
