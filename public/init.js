var temp;
var add_RoomList = function(data){
  $('.team-list').empty();
  
  for(i in data){
    if(data[i].room == socket.room)
      $('.team-list').append('<li class="active">'+data[i].room+'<span class="badge">'+data[i].count+'</span></li>');
    else
      $('.team-list').append('<li>'+data[i].room+'<span class="badge">'+data[i].count+'</span></li>');
  }
};
var add_UserList = function(data){
  $('.user-list').empty();
  
  for(i in data){
    if(data[i] == socket.nickname)
      $('.user-list').append('<li class="active">'+data[i]+'</li>');
    else
      $('.user-list').append('<li>'+data[i]+'</li>');
  }
};
var add_Message = function(data){
  for(i in data){
    var id = data[i].chat_member_id;
    var text = data[i].chat_text;
    var time = data[i].chat_time;
    var img = ( id == 'master' ) ? 'master.jpeg' : '1.jpg';
    var message = '<li class="media"><div class="media-left"><img class="media-object img-circle" src="'+img+'" alt="img"></div><div class="media-body"><h4 class="media-heading nickname">'+id+'<span class="time">'+time+'</span></h4>'+text+'</div></li>'
    $('.media-list').append(message);
  }
  $("div.message").scrollTop( $("div.message")[0].scrollHeight + $('div.message').outerHeight() )
};
var get_time = function(){
  var dt = new Date();
  var h =  dt.getHours(), m = dt.getMinutes();
  var time = (h > 12) ? (h-12 + ':' + m +' PM') : (h + ':' + m +' AM');
  
  return time;
}

var load = function(o){
  $('#nickname').html(socket.nickname);
  $('.team-name').html(socket.room);
  $('.badge.me').html(o['chat_count']);

  //room, user 리스트 추가
  add_RoomList(o['chat_status']);
  add_UserList(o['chat_members']);
  
  //이전 채팅 로드
  add_Message(o['chat_history']);
}
var broadcast = function(o){
  $('.badge.me').html(o['count']);
  add_Message(o['chat']);
};
var refresh = function(o){
  //room, user 리스트 갱신
  temp = o;
  add_RoomList(o['chat_status']);
  if(o['chat_key'] == socket.room) add_UserList(o['chat_members']);
};