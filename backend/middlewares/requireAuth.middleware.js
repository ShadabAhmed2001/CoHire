import "dotenv/config"
import jwt from "jsonwebtoken"
import ClsHttpError from "../handlers/ClsHttpError.js";

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
        throw new ClsHttpError(401, "Invalid or expired token")
    }

    // Outside the try on purpose: if next() were inside, an error from the route after it would be caught above and wrongly reported as an invalid token.
    next()
}

export default requireAuth