import "dotenv/config"
import express from "express"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

let app = express()

// Parses the JSON request body into req.body; without it req.body is undefined.
app.use(express.json())


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


app.post("/api/user", async (req, res) => {
  let { name, email, password } = req.body
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

app.get("/api/users", async (req, res) => {
  res.send(await User.find())
})


app.post("/api/login", async (req, res) => {
  let { email, password } = req.body
  let user = await User.findOne({ email }).select("+passwordHash")

  // if no user found with email
  if (!user) {
    res.status(401).send({ message: "Invalid email or password" })
    return false
  }

  // if user found but password doesnt match
  let passwordMatch = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatch) {
    res.status(401).send({ message: "Invalid email or password" })
    return false
  }

  res.status(200).send({ message: "user logged in" })
})


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
