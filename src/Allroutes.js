import React from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Auth from './screens/Auth'
import Home from './screens/Home'
import Chat from './screens/chat'
import Records from './screens/Records'
import Analytics from './screens/Analytics'


const PrivateRoutes = () => {
  let auth = localStorage.getItem("user")
  return (
    auth ? <Outlet /> : <Navigate to="/" />
  )
}

const Allroutes = () => {
  return (
    <div>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path='/Home' element={<Home />} />
          <Route path='/Chat' element={<Chat />} />
          <Route path='/Records' element={<Records/>} />
          <Route path='/Analytics' element={<Analytics/>} />
        </Route>
        <Route path='/' element={<Auth />} />
      </Routes>
    </div>
  )
}

export default Allroutes