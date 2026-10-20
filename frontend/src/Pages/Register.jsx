import axios from 'axios';
import React, { useState } from 'react'

const Register = () => {

    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [msg, setMsg] = useState("")


    let handleUserRegistration = async (e) => {
        try {
            e.preventDefault()
            let res = await axios.post("/api/register", { name, email, password })
            setMsg(`Registered: ${res.data.email}`)
        } catch (error) {
            // The server may send no message (backend down), so fall back to a default one.
            setMsg(error.response?.data?.message || "Something went wrong. Try again.")
        }
    }

    return (
        <form onSubmit={handleUserRegistration}>
            <h2>Register User</h2>
            <input placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Register</button>
            <p>{msg}</p>
        </form>
    )
}

export default Register