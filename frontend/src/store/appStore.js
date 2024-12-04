import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice'
import conversationReducer from './conversationSlice'
import socketReducer from './socketSlice'
import userReducer from './userSlice'

const store = configureStore({
  reducer: {
    authReducer,
    conversationReducer,
    socketReducer,
    userReducer
  }
})

export default store