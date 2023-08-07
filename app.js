const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 })

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const players = {}

io.on('connection', (socket) => {
  console.log('유저가 연결되었습니다.')
  players[socket.id] = {
    x: 500 * Math.random(),
    y: 500 * Math.random()
  }

  io.emit('updatePlayers', players)

  socket.on('disconnect', (reason) => {
    delete players[socket.id]
    io.emit('updatePlayers', players)
  })

  console.log(players)
})

server.listen(port, () => {
  console.log(`서버가 ${port}포트로 시작되었습니다.`)
})
