import { useState, useCallback, useEffect } from 'react'
import useFetch from '../../hooks/useFetch'
import { useSelector, useDispatch } from 'react-redux'
import { debounce } from 'lodash'
import { conversationActions } from '../../store/conversationSlice'

export default function CreateChatModal() {
  const { user } = useSelector((state) => state.userReducer)
  const { conversations } = useSelector((state) => state.conversationReducer)
  const dispatch = useDispatch()
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [groupName, setGroupName] = useState('')
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { reqFunc: searchUser, reqState } = useFetch({ method: "GET", url: `${import.meta.env.VITE_URL}/users` }, (data) => {
    setSearchResults(data.filter(
      u => u.id !== user.id &&
        !selectedUsers.some(su => su.id === u.id)
    ))
  },
    (err) => {
      console.error(err)
    }
  )

  const { reqFunc: createConversation } = useFetch({ method: "POST", url: `${import.meta.env.VITE_URL}/conversations` }, (data) => {
    dispatch(conversationActions.addToConversations(data))
    console.log(data)
  },
    (err) => {
      console.error(err)
    })

  const debouncedSearch = useCallback(
    debounce(async (term) => await searchUser('', `?search=${term}`), 300),
    []
  );

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    setShowDropdown(true)
    debouncedSearch(searchTerm)

  }, [searchTerm])

  const handleCreateChat = async () => {
    setSelectedUsers([])
    setGroupName('')
    setSearchTerm('')
    if (selectedUsers.length == 0)
      return

    if (selectedUsers.length == 1) {
      const existingConversation = conversations.find(
        c => c.Participants.length === 2 &&
          c.Participants.some(p => p["Users"].id === selectedUsers[0].id)
      )
      if (existingConversation) {
        dispatch(conversationActions.setCurrentConversation(existingConversation))
        return
      }
    }
    createConversation({
      name: groupName,
      participantIds: [...selectedUsers.map(u => u.id)]
    })
  }

  return (
    <>
      {/* Modal */}
      <dialog id="create_chat_modal" className="modal">
        <div className="modal-box max-h-[80vh] overflow-y-auto">
          <h3 className="font-bold text-lg mb-4">Create New Chat</h3>

          {/* Search Users */}
          <div className="form-control">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users"
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                }}
              />

              {/* Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                  {searchResults.map(user => (
                    <div
                      key={user.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedUsers(prev => [...prev, user])
                        setSearchTerm('')
                        setShowDropdown(false)
                      }}
                    >
                      {user.username}
                      {user.email}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User List */}
            <div className="mt-2">
              {selectedUsers.map(user => (
                <div key={user.id} className="badge badge-primary gap-2 m-1">
                  {user.username}
                  <button onClick={() => setSelectedUsers(prev =>
                    prev.filter(u => u.id !== user.id)
                  )}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Group Name Input */}
          {selectedUsers.length >= 2 && (
            <div className="form-control mt-4">
              <input
                type="text"
                placeholder="Group name"
                className="input input-bordered"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-error mr-2"
                onClick={() => {
                  document.getElementById('create_chat_modal').close()
                  setSelectedUsers([])
                  setGroupName('')
                  setSearchTerm('')
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  // Handle chat creation logic here
                  handleCreateChat()
                  document.getElementById('create_chat_modal').close()
                }}
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}