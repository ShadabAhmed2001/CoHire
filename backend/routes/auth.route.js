import express from "express"
import jwt from "jsonwebtoken"
import { z } from "zod"
import bcrypt from "bcryptjs"
import User from "../models/User.model.js"
import ClsHttpError from "../handlers/ClsHttpError.js"
import requireAuth from "../middlewares/requireAuth.middleware.js"

let router = express.Router()


let registerSchema = z.object({
  name: z.string("Name is required").min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  password: z.string("Password is required").min(6, "Password must be at least 6 characters")
})



// ^ register user
router.post("/register",async (req, res) => {

  let validate = registerSchema.safeParse(req.body)

  if (!validate.success) {
    throw new ClsHttpError(400, validate.error.issues[0].message)
  }

  let { name, email, password } = validate.data
  let hashedPassowrd = await bcrypt.hash(password, 10)
  let addedUser = await User.create({
    name,
    email,
    passwordHash: hashedPassowrd
  })
  res.status(201).send({
    _id: addedUser._id,
    name: addedUser.name,
    email: addedUser.email
  })
})

// ^ login
router.post("/login", async (req, res) => {
  let { email, password } = req.body
  let user = await User.findOne({ email }).select("+passwordHash")

  // if no user found with email
  if (!user) {
    // res.status(401).send({ message: "Invalid email or password" })
    // return false
    throw new ClsHttpError(401, "Invalid email or password")
  }

  // if user found but password doesnt match
  let passwordMatch = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatch) {
    // res.status(401).send({ message: "Invalid email or password" })
    // return false
    throw new ClsHttpError(401, "Invalid email or password")
  }

  let token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

  // res.cookie(token_name,value,options)
  res.cookie(
    "token",
    token,
    {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 //milliseconds
    }
  )

  res.status(200).send({ message: "user logged in" })
})




// ^ get all users
router.get("/users", requireAuth, async (req, res) => {
  res.send(await User.find())
})



// ^ logout
router.post("/logout", (req, res) => {

  res.clearCookie(
    "token",
    {
      httpOnly: true,
      sameSite: "lax"
    }
  )

  res.status(200).send({ message: "User logged out" })

})


// ^ who's logged in
router.get("/me", requireAuth, async (req, res) => {
  let user = await User.findById(req.userID)
  if (!user) {
    throw new ClsHttpError(401, "User not found")
  }

  res.send({
    _id: user._id,
    name: user.name,
    email: user.email
  })
})



export default router