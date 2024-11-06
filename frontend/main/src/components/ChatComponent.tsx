import React from 'react';

// Kiểu dữ liệu cho tin nhắn
interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

// Props cho ChatComponent
interface ChatComponentProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ messages, onSendMessage }) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue); // Gửi tin nhắn lên trên
      setInputValue(''); // Làm trống input sau khi gửi
    }
  };

  return (
    <div className="chat-component">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <span>{message.sender}: </span>
            <span>{message.text}</span>
            <span className="timestamp">{message.timestamp}</span>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
