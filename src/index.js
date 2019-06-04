const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

const welcomeMsg = "Welcome!"
const newUserMsg = "A new User has Joined!"
const userLeftMsg = "A user has left :("

app.use(express.static(publicDirectoryPath))
io.on('connection', (socket) => {
    console.log('New Websocket connection')

    socket.emit('message', welcomeMsg)
    socket.broadcast.emit('message', newUserMsg)

    socket.on('sendMessage', (inputMsg, callback) => {
        const filter = new Filter();
        filter.isProfane(inputMsg) ? callback("profanity is not allowed!") :  
        io.emit('message', inputMsg);
        callback();
    })
    socket.on('sendLocation', (coords, callback) => {
        io.emit('message', `https://www.google.com/maps?=${coords.long},${coords.lat}`)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', userLeftMsg)
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})