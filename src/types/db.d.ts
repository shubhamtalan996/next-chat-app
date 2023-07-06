interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface FriendRequest {
  id: string;
  receiverId: string;
  senderId: string;
}
interface Message extends FriendRequest {
  text: string;
  timestamp: string;
}

interface Chat {
  id: string;
  messages: Message[];
}
