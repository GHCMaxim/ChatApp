import ConversationList from './ConversationList'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { authActions } from '../../store/authSlice'
import CreateChatModal from './CreateChatModal'
import { CircleFadingPlus } from 'lucide-react'
import { conversationActions } from '../../store/conversationSlice'

// eslint-disable-next-line react/prop-types
const LeftPanel = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <>
      <div className='bg-side-bar-bg p-2  w-1/3 flex flex-col justify-between relative'>
        <div>
          {/* <UserSearchBar /> */}
          <ConversationList />
        </div>

        
        <button 
        className="btn btn-circle btn-primary absolute bottom-20 right-4"
        onClick={() => document.getElementById('create_chat_modal').showModal()}
        >
          <CircleFadingPlus />
        </button>
        <CreateChatModal />
        <button
          className={'btn btn-error text-white'}
          onClick={() => {
            dispatch(conversationActions.clearData())
            dispatch(authActions.logout())
            navigate('/')
          }}
        >
          Logout
        </button>
      </div>
    </>
  )
}
export default LeftPanel
