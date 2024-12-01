import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { conversationActions } from '../../store/conversationSlice'
import websocketClient from '../../utils/WebSocketClient'

export const MessageInput = ({sendMessage}) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    sendMessage(message)

    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className='flex p-4'>
      <input
        type='text'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Type a message...'
        className='flex-grow px-4 py-2 rounded-l-lg border'
      />
      <button
        type='submit'
        className='bg-blue-500 text-white px-4 py-2 rounded-r-lg'
      >
        Send
      </button>
    </form>
  )
}

const ChatWindow = () => {
  const { user } = useSelector((state) => state.userReducer)
  const { currentConversation } = useSelector((state) => state.conversationReducer) 
  const dispatch = useDispatch()
  const messagesEndRef = useRef(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentConversation])

  if (!currentConversation) {
    return (
      <div className='flex-1 bg-chat-window-bg flex items-center justify-center rounded-2xl border-chat-window-bg border-2'>
        <p className='text-gray-400'>Select a conversation to start chatting</p>
      </div>
    )
  }

  const conversationId = currentConversation?.id
  const currentUserId = user.id
  const participantMap = currentConversation.Participants.reduce((acc, p) => {
    acc[p['Users'].id] = p['Users'].username
    return acc
  }, {})

  const sendMessage = (content) => {
    websocketClient.emit('user:newMessage', {
      userId: user.id,
      conversationId,
      content,
    })
  }

  return (
    <div className='flex-1 bg-chat-window-bg flex flex-col rounded-2xl border-chat-window-bg border-2'>
      <div className='flex-grow overflow-y-auto p-4'>
        {currentConversation && currentConversation.Messages.map((msg, index) => (
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
              }`}
            >
              {msg.content}
            </div>
            <div className='text-xs text-gray-500 ml-2'>
              {msg.senderId === currentUserId ? 'You' : participantMap[msg.senderId]}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {conversationId && <MessageInput conversationId={conversationId} sendMessage={sendMessage}/>}
    </div>
  )
}

export default ChatWindow
