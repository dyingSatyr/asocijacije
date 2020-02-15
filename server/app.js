const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

const server = app.listen(
	port,
	console.log(`Server is now running on port: ${port}.`)
)

const io = require('socket.io')(server)

app.get('/', (req, res) => {
	res.send(`Game server is up and running.`)
})

io.on('connection', socket => {
	console.log(`User with socket id ${socket.id} has joined the server.`)
})
