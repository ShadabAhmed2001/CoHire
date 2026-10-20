import React, { useEffect, useState } from 'react'
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import { Link, Route, Routes } from 'react-router';
import axios from 'axios'
import { getCurrentUser } from './helpers/auth';
import NotFound from './Pages/NotFound';



const App = () => {

  let [msg, setMsg] = useState("")
  let [currentUser, setCurrentUser] = useState(null)


  let checkServerHealth = async () => {
    let res = await axios.get("/api/health")
    setMsg(res.data)
  }

  let handleLogout = async () => {
    try {
      await axios.post("/api/logout")
      setCurrentUser(null)
    }
    catch (error) {
      setMsg("Logout failed. Try again!")
    }
  }

  //cannot make the callback async, hence create an async IIFE inside the callback and an empty dependency array to execute only once
  useEffect(() => {
    (async () => {
      if (!currentUser) {
        setCurrentUser(await getCurrentUser())
      }
    })()
  }, [])


  return (
    <div>
      <h1>CoHire</h1>

      <p>{currentUser ? `Hello ${currentUser.name}` : `Not logged in`}</p>
      <button onClick={checkServerHealth}>Server Health</button>
      {currentUser && <button onClick={handleLogout}>Logout</button>}
      <p>
        {msg}
      </p>

      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App