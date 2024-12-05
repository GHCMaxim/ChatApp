import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useFetch from '../../hooks/useFetch'
import { conversationActions } from '../../store/conversationSlice'

// Utility function for date formatting
const formatDate = (dateString) => {
  const inputDate = new Date(dateString)
  const currentDate = new Date()

  // Check if the date is today
  if (
    inputDate.getFullYear() === currentDate.getFullYear() &&
    inputDate.getMonth() === currentDate.getMonth() &&
    inputDate.getDate() === currentDate.getDate()
  ) {
    return inputDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Check if the date is within the same week
  const oneWeekAgo = new Date(currentDate)
  oneWeekAgo.setDate(currentDate.getDate() - 7)

  if (inputDate >= oneWeekAgo && inputDate < currentDate) {
    return inputDate.toLocaleDateString('en-US', {
      weekday: 'short'
    })
  }

  // For dates outside the current week, use the specified format
  const day = inputDate.getDate().toString().padStart(2, '0')
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0')
  const year = inputDate.getFullYear()

  return `${day}.${month}.${year}`
}

// Conversation Item Component
const Conversation = ({
  conversation,
  isActive = false,
  onSelectConversation,
  user
}) => {
  let { id, name, Messages, Participants } = conversation

  const participantMap = Participants.reduce((acc, p) => {
    acc[p['Users'].id] = p['Users'].username
    return acc
  }, {})

  // If the conversation has no name, use the name of the other participant
  if (name === '') {
    const otherParticipant = Participants.find((p) => p['Users'].id != user.id)
    name = otherParticipant['Users'].username
  }
  const latestMessage = Messages ? Messages[Messages.length - 1] : ''

  const handleConversationChange = useCallback(() => {
    onSelectConversation(id)
  }, [id, onSelectConversation])

  return (
    <li
      className={`
        grid grid-cols-8 grid-rows-2 
        hover:bg-gray-700 
        p-2 rounded-md 
        cursor-pointer 
        ${isActive ? 'bg-gray-800' : ''}
      `}
      onClick={handleConversationChange}
    >
      <div className='rounded-full w-[60px] h-[60px] bg-gray-600 col-span-2 row-start-1 col-start-1 row-end-3 flex items-center justify-center text-white'>
        {name.charAt(0).toUpperCase()}
      </div>
      <div className='col-start-3 row-span-1 col-end-9'>
        <div className='flex w-full justify-between items-center'>
          <p className='text-white text-xl font-semibold'>{name}</p>
          <p className='text-gray-400 text-sm'>
            {latestMessage ? formatDate(latestMessage.createdAt) : ''}
          </p>
        </div>
      </div>
      <div className='col-start-3 row-span-1 col-end-9'>
        <div className='flex w-full justify-between items-center'>
          <p className='text-gray-400 text-md truncate max-w-[70%]'>
            {latestMessage && (user.id == latestMessage?.senderId ? 'You: ' : participantMap[latestMessage?.senderId] + ': ')}
            {latestMessage?.content}
          </p>
        </div>
      </div>
    </li>
  )
}

// Conversation List Component
const ConversationList = () => {
  const { conversations, currentConversation } = useSelector((state) => state.conversationReducer)
  const { user } = useSelector((state) => state.userReducer)
  const dispatch = useDispatch()

  const { reqFunc: getConversations, reqState } = useFetch({ method: "GET", url: `${import.meta.env.VITE_URL}/conversations` },
    (data) => {
      dispatch(conversationActions.setConversations(data))
    },
    (error) => {
      console.log(error)
    }
  )

  useEffect(() => {
    getConversations()
  }, [])

  // Handler to update active conversation
  const handleSelectConversation = useCallback((conversationId) => {
    dispatch(conversationActions.setCurrentConversation({ id: conversationId }))
  }, [])

  // Render loading or error states
  if (reqState == "loading") {
    return (
      <div className='p-4 text-center text-gray-400'>
        Loading conversations...
      </div>
    )
  }

  if (reqState == "error") {
    return (
      <div className='p-4 text-center text-red-500'>
        Error fetching conversations.{' '}
        <button
          onClick={() => window.location.reload()}
          className='ml-2 bg-blue-500 text-white px-3 py-1 rounded'
        >
          Retry
        </button>
      </div>
    )
  }

  console.log(conversations)
  console.log(typeof conversations)

  return (
    <div className='p-4 w-full h-fit'>
      <ul className='flex flex-col gap-1'>
        {conversations.length === 0 && (
          <div className='text-center text-gray-400'>
            No conversations found
          </div>
        )}
        {conversations.length > 0 && conversations.map((conversation) => (
          <Conversation
            key={conversation.id}
            conversation={conversation}
            isActive={currentConversation && currentConversation.id === conversation.id}
            onSelectConversation={handleSelectConversation}
            user={user}
          />
        ))}
      </ul>
    </div>
  )
}

export default ConversationList
