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


export default ClsHttpError