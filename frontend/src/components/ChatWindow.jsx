import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import Cookies from "universal-cookie";

const URL = 'http://localhost:3000';
const API = "http://localhost:3000/api/conversations/";
const cookies = new Cookies();

export const MessageInput = ({socket, conversationId}) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!socket || !message.trim()) return;

        const currentUserId = cookies.get('user')['id'];

        socket.emit('sendMessage', {
            senderId: currentUserId,
            content: message,
            conversationId: parseInt(conversationId),  // Ensure number type
            attachmentIds: []
        });

        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex p-4">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow px-4 py-2 rounded-l-lg border"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
            >
                Send
            </button>
        </form>
    );
};

const ChatWindow = ({conversationId}) => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function transformConversationData(conversation) {
        if (!conversation || conversation.length === 0 || !conversation[0].Messages) {
            return [];
        }
        return conversation[0].Messages.map(message => ({
            senderId: message.senderId,
            content: message.content,
        }));
    }

    const getMessages = async () => {
        try {
            const response = await fetch(API + conversationId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.get('token')}`
                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Error fetching conversation:', data.error);
                return;
            }
            setMessages(transformConversationData(data));
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Socket initialization
    useEffect(() => {
        const newSocket = io(URL, {
            auth: {
                token: cookies.get('token')
            }
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
        });

        newSocket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []); // Only run once on mount

    // Handle room changes and message listeners
    useEffect(() => {
        if (!socket || !conversationId) return;

        console.log('Joining room:', conversationId);
        socket.emit('joinRoom', conversationId.toString());
        getMessages();

        // Message listener
        const messageHandler = (newMessage) => {
            console.log('Received new message:', newMessage);
            setMessages(prevMessages => [...prevMessages, {
                senderId: newMessage.senderId,
                content: newMessage.content
            }]);
        };

        socket.on('newMessage', messageHandler);

        // Cleanup
        return () => {
            console.log('Cleaning up room:', conversationId);
            socket.off('newMessage', messageHandler);
        };
    }, [socket, conversationId]);

    const currentUserId = cookies.get('user')['id'];

    return (
        <div className="flex-1 bg-chat-window-bg flex flex-col rounded-2xl border-chat-window-bg border-2">
            <div className="flex-grow overflow-y-auto p-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-end mb-2 ${
                            msg.senderId === currentUserId ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg ${
                                msg.senderId === currentUserId
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}>
                            {msg.content}
                        </div>
                        <div className="text-xs text-gray-500 ml-2">
                            {msg.senderId === currentUserId ? 'You' : 'Other User'}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}/>
            </div>
            {
                !conversationId ? <div></div> : <MessageInput socket={socket} conversationId={conversationId} />
            }

        </div>
    );
};

export default ChatWindow;