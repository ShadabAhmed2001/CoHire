import React, { useState } from 'react'
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import { Link, Route, Routes } from 'react-router';
import axios from 'axios'


const App = () => {

  let [msg, setMsg] = useState("")

  let checkServerHealth = async () => {
    let res = await axios.get("/api/health")
    setMsg(res.data)
  }


  return (
    <div>
      <h1>CoHire</h1>
      <button onClick={checkServerHealth}>Server Health</button>
      <p>
        {msg}
      </p>

      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App