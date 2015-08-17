//메세지를 보낼때 패킷
{
 packet_type : "send",
 chat_room_key : "dpdp",
 chat_member_id : "member_id",
 chat_type : "notice" or "default"
 chat_text : "chat text"
}

//채팅방 현재 status 를 가져올때 패킷
{
 packet_type : "login",
 chat_room_key : "dpdp",
 chat_member_id : "member_id",
 chat_level : 1 (0 == master)
}

//채팅방 현재 상태 패킷
{
 packet_type : "status"
 chat_room_key : "dpdp",
 chat_members: [],
 chat_masters: [],
}

{
 packet_type : "broadcast"
 chat_history:
	[{
		chat_member_id : "member_id",
		chat_type : "notice" or "default"
		chat_text : "chat text"
	}]
}

