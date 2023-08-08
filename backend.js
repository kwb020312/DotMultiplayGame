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

const backEndPlayers = {}

io.on('connection', (socket) => {
  console.log('유저가 연결되었습니다.')
  backEndPlayers[socket.id] = {
    x: 500 * Math.random(),
    y: 500 * Math.random(),
    color: `hsl(${360 * Math.random()}, 100%, 50%)`
  }

  io.emit('updatePlayers', backEndPlayers)

  socket.on('disconnect', (reason) => {
    delete backEndPlayers[socket.id]
    io.emit('updatePlayers', backEndPlayers)
  })

  socket.on('keydown', (keyCode) => {
    switch (keyCode) {
      case 'KeyW':
        backEndPlayers[socket.id].y -= 5
        break
      case 'KeyA':
        backEndPlayers[socket.id].x -= 5
        break
      case 'KeyS':
        backEndPlayers[socket.id].y += 5
        break
      case 'KeyD':
        backEndPlayers[socket.id].x += 5
        break
      default:
        break
    }
  })
})

setInterval(() => {
  io.emit('updatePlayers', backEndPlayers)
}, 15)

server.listen(port, () => {
  console.log(`서버가 ${port}포트로 시작되었습니다.`)
})
