const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

const welcomeMsg = "Welcome!"
const userLeftMsg = "A user has left :("

app.use(express.static(publicDirectoryPath))
io.on('connection', (socket) => {
    console.log('New Websocket connection')

    socket.on('sendMessage', (inputMsg, callback) => {
        const filter = new Filter();
        filter.isProfane(inputMsg) ? callback("profanity is not allowed!") :  
        io.to('test').emit('message', generateMessage(inputMsg));
        callback();
    })

    socket.on('join', ({username, room}) => {
        socket.join(room)

        socket.emit('message', generateMessage(welcomeMsg))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has Joined ${room}!`))
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage( `https://www.google.com/maps?=${coords.long},${coords.lat}`))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage(userLeftMsg))
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})