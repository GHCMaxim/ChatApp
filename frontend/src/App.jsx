import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'

import AuthPage from './pages/Auth'
import ChatPage from './pages/Chat'
import NotFound from './pages/NotFound'
import useInit from './hooks/useInit'
import { useSelector } from 'react-redux'

function App() {

  const { loggedIn } = useSelector((state) => state.authReducer)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/login'
          element={!loggedIn ? <AuthPage /> : <Navigate to='/' />}
        />

        <Route
          path='/'
          element={
            loggedIn ? (
              <ChatPage />
            ) : (
              <Navigate to='/login' />
            )
          }
        />

        <Route
          path='/conversation/:id'
          element={
            loggedIn ? (
              <ChatPage />
            ) : (
              <Navigate to='/login' />
            )
          }
        />

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
