//로그인할 때 패킷
login
{
 chat_room_num : "272",
 chat_member_nickname : "nickname",
}

//이전 채팅 로딩 패킷
load
{
  chat_status : [{room:"dp", count:"1"}]
  chat_count : "room_count",
  chat_members : "members_list",
  chat_history:
	[{
		chat_member_id : "member_id",
		chat_type : "notice" or "default"
		chat_text : "chat text"
	}]
}

//채팅방 현재 상태 패킷
status ( 로그인 디스커넥트 메시지보낼때 )
{
  chat_status : [{team-name:"dp", team-count:"1"}]
  chat_members : "members_list"
  chat_count : "room_count"
}

//서버에 메세지를 보낼때 패킷
send 
{
 chat_type : "notice" or "default"
 chat_text : "chat text"
}

//팀원에게 메시지를 보낼때 패킷
broadcast
{
 chat:
	{
		chat_member_id : "member_id",
		chat_type : "notice" or "default"
		chat_text : "chat text"
	}
}

