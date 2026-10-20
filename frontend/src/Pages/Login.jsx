import axios from 'axios';
import React, { useState } from 'react'
import { getCurrentUser } from '../helpers/auth';

const Login = (prop) => {

    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [msg, setMsg] = useState("")


    let handleUserLogin = async (e) => {
        try {
            e.preventDefault()
            let res = await axios.post("/api/login", { email, password })
            setMsg(res.data.message)

            prop.setCurrentUser(await getCurrentUser())

        } catch (error) {
            setMsg(error.response?.data?.message || "Something went wrong. Try again.")
        }
    }

    return (
        <form onSubmit={handleUserLogin}>
            <h2>Login</h2>
            <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
            <p>{msg}</p>
        </form>
    )
}

export default Login