import "dotenv/config"
import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import errorHandler from "./middlewares/errorHandler.middleware.js";
import authRouter from "./routes/auth.route.js"

let app = express()

// Parses the JSON request body into req.body; without it req.body is undefined.
app.use(express.json())

// Reads the cookies into req.cookies; without it req.cookies is undefined.
app.use(cookieParser())

app.get("/api/health", (req, res) => {
  res.send("server started")
})

app.use("/api",authRouter)


// ! error handling middleware.
// instead of using try catch block in every route, one middlewear to handle all errors.
app.use(errorHandler)


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
