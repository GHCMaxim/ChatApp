import LeftPanel from "./LeftPanel"
import ChatWindow from "./ChatWindow"
import useInit from "../../hooks/useInit"
import { useEffect } from "react"
import websocketClient from "../../utils/WebSocketClient"
import { useDispatch, useSelector } from "react-redux"
import { conversationActions } from "../../store/conversationSlice"
import useFetch from "../../hooks/useFetch"

const ChatPage = () => {

  const { loggedIn } = useInit()
  const dispatch = useDispatch()
  const {conversations} = useSelector((state) => state.conversationReducer)

  const {reqFunc: getConversationDetail, reqState} = useFetch({method: 'GET', url: '/conversations'},
    (data) => {
      dispatch(conversationActions.addToConversations(data))
    },
    (error) => {
      console.log(error)
    }
  )

  useEffect(() => {
    console.log('listening for new messages')
    
    const messageHandler = (data) => {
      const existingConversation = conversations.some(c => c.id == data.conversationId)
      if (!existingConversation) {
        getConversationDetail("", `/${data.conversationId}`)
      }
      dispatch(conversationActions.addMessageToConversation(data))
    }

    websocketClient.listen("user:sendMessage", messageHandler)
  
    return () => {
      websocketClient.socket.off("user:sendMessage", messageHandler)
    }
  }, [])

  return (
    <div className='flex bg-nav-bg h-screen'>
      <LeftPanel />
      <ChatWindow />
    </div>
  )
}

export default ChatPage
