const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT;

// we need to parse the incoming json data to an object so that it can be used
app.use(express.json()) // This is automatically parse incoming json to an object so that we can use that object in request handler

app.use(userRouter)

app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})