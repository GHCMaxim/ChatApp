import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import websocketClient from '../../utils/WebSocketClient';
import EmojiPicker from 'emoji-picker-react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const MessageInput = ({ sendMessage, uploadAttachment }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(selectedFile.type)) {
        alert('Only images are allowed (jpeg, png, gif)');
        return;
      }
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    setIsUploading(true);
    let attachmentUrl = null;

    if (file) {
      attachmentUrl = await uploadAttachment(file);
      setFile(null);
      setFilePreview(null);
    }

    const fullMessage = attachmentUrl || message;

    sendMessage(fullMessage.trim());
    setMessage('');
    setIsUploading(false);
  };

  return (
    <div className="relative">
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 z-10 bg-white shadow-lg">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center p-4 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="px-4 py-2 bg-gray-200 rounded-l-lg hover:bg-gray-300"
        >
          😊
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow px-4 py-2 border rounded-lg"
        />
        <label className="mx-2 cursor-pointer">
          📎
          <input type="file" onChange={handleFileChange} className="hidden" />
        </label>
        <button
          type="submit"
          disabled={isUploading}
          className={`bg-blue-500 text-white px-4 py-2 rounded-r-lg ${isUploading && 'opacity-50 cursor-not-allowed'
            }`}
        >
          {isUploading ? 'Uploading...' : 'Send'}
        </button>
      </form>

      {filePreview && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">File: {file.name}</p>
          <img
            src={filePreview}
            alt="Preview"
            className="max-w-full h-auto mt-2 rounded-lg shadow"
          />
        </div>
      )}
    </div>
  );
};

const ChatWindow = () => {
  const { user } = useSelector((state) => state.userReducer);
  const { currentConversation } = useSelector((state) => state.conversationReducer);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation]);

  if (!currentConversation) {
    return (
      <div className="flex-1 bg-chat-window-bg flex items-center justify-center rounded-2xl border-chat-window-bg border-2">
        <p className="text-gray-400">Select a conversation to start chatting</p>
      </div>
    );
  }

  const conversationId = currentConversation?.id;
  const currentUserId = user.id;
  const participantMap = currentConversation.Participants.reduce((acc, p) => {
    acc[p['Users'].id] = p['Users'].username;
    return acc;
  }, {});

  const sendMessage = (content) => {
    websocketClient.emit('user:newMessage', {
      userId: user.id,
      conversationId,
      content,
    });
  };

  const uploadAttachment = async (file) => {
    const formData = new FormData();
    const token = cookies.get('token');

    formData.append('file', file);
    formData.append('messageId', currentConversation.id);

    if (!token) {
      console.error('Authentication token required');
      return null;
    }

    const response = await fetch(`${import.meta.env.VITE_URL}/attachments/upload`, {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (response.ok) {
      return result.attachmentUrl;
    } else {
      console.error('Error uploading attachment:', result.error);
      return null;
    }
  };

  return (
    <div className="flex-1 bg-chat-window-bg flex flex-col rounded-2xl border-chat-window-bg border-2">
      <div className="flex-grow overflow-y-auto p-4">
        {currentConversation &&
          currentConversation.Messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end mb-2 ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`px-4 py-2 rounded-lg ${msg.senderId === currentUserId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
                  }`}
              >
                {/\.(jpeg|jpg|gif|png)(\?.*)?$/i.test(msg.content) ? (

                  <img
                    src={msg.content}
                    alt="Attachment"
                    className="max-w-xs rounded-lg shadow-lg"
                  />
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
              <div className="text-xs text-gray-500 ml-2">
                {msg.senderId === currentUserId ? 'You' : participantMap[msg.senderId]}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      {conversationId && (
        <MessageInput sendMessage={sendMessage} uploadAttachment={uploadAttachment} />
      )}
    </div>
  );
};

export default ChatWindow;
