const express = require('express')
const bodyParser = require('body-parser')
const userRouter = require('./routers/user')
const port = process.env.PORT || 3000

require('./db/db')

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(userRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})