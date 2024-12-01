// Redux/ChatTypes.ts

export interface Message {
    id: string;
    senderId: string;
    content: string; // Thay đổi từ 'text' thành 'content'
    receiverId: string; // Thêm receiverId
    timestamp: string;
}

export interface Chat {
    id: string;
    participants: string[];
    messages: Message[]; // Sử dụng interface Message
    lastMessage: Message;
}
