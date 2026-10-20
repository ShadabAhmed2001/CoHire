import ClsHttpError from "../handlers/ClsHttpError.js";

// Keep all four parameters(error, req, res, next), even if next is unused.Express decides it's an error handler by counting four parameters. With three, it treats it as normal middleware and never calls it for errors.

let errorHandler = (error, req, res, next) => {
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
}

export default errorHandler