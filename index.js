const PORT = 8000
const express = require('express')
const app = express()

app.use(express.static('public'))

const newsRouter = require('./routes/news')
const userRouter = require('./routes/users')

app.use('/news', newsRouter)
app.use('/users', userRouter)

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))