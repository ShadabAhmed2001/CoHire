import "dotenv/config"
import express from "express"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import { z } from "zod"


// extending the inbuilt js Error class to customise error handling
class ClsHttpError extends Error {
  constructor(status, message) {
    super(message)
    // The built-in Error has no status, so we add one for the middleware to use as the HTTP status code inside this custom class extending Error.
    this.status = status
  }
}

// let testErr = new ClsHttpError(400, "test error thrown")
// console.log(testErr)
// console.log(testErr.status)
// console.log(testErr.message)


let app = express()

// Parses the JSON request body into req.body; without it req.body is undefined.
app.use(express.json())

// Reads the cookies into req.cookies; without it req.cookies is undefined.
app.use(cookieParser())

app.get("/api/health", (req, res) => {
  res.send("server started")
})


let testUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  }
})

let User = mongoose.model("User", testUserSchema)


let registerSchema = z.object({
  name: z.string("Name is required").min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  password: z.string("Password is required").min(6, "Password must be at least 6 characters")
})



let requireAuth = (req, res, next) => {
  let token = req.cookies.token
  if (!token) {
    // res.status(401).send({ message: "Not logged in" })
    // return false
    throw new ClsHttpError(401, "Not logged in")
  }

  try {
    let payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userID = payload.userID
    // next() // ! moved to bottom

  } catch (error) {
    // res.status(401).send({ message: "Invalid or exprired token" })
    throw new ClsHttpError(401, "Invalid or exprired token")
  }

  // Outside the try on purpose: if next() were inside, an error from the route after it would be caught above and wrongly reported as an invalid token.
  next()
}

// ^ register user
app.post("/api/register", async (req, res) => {

  let validate = registerSchema.safeParse(req.body)


  if (!validate.success) {
    // res.status(400).send({ message: "Invalid input" })
    // return false

    // console.log(validate.error.issues)
    // throw new ClsHttpError(400, "Invalid input!")
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


// ^ get all users
app.get("/api/users", requireAuth, async (req, res) => {
  res.send(await User.find())
})


// ^ login
app.post("/api/login", async (req, res) => {
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


// ^ logout
app.post("/api/logout", (req, res) => {

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
app.get("/api/me", requireAuth, async (req, res) => {
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

// ! error handling middleware.
// instead of using try catch block in every route, one middlewear to handle all errors.
app.use((error, req, res, next) => {
  console.log(error)

  if (error instanceof ClsHttpError) {
    res.status(error.status).send({ message: error.message })
    return false
  }

  if (error.code == 11000) {
    res.status(409).send({ message: "Email already exists" })
    return false
  }

  res.status(500).send({ message: "Something went wrong" })
})



// * mongodb connect and server starting point
try {
  await mongoose.connect(process.env.MONGO_URI)
  console.log("mongo db connected")
  app.listen(process.env.PORT || 5000, () => {
    console.log("server running on http://localhost:5000")
  })
} catch (error) {
  console.log("connection failed:", error.message)
  // Stops the program; 1 means it ended because of an error (0 means fine).
  process.exit(1)
}
