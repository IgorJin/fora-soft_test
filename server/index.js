const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom, getRoomsInfo, getRooms } = require('./controller');

const router = express.Router();
router.get("/", (req, res) => {
    res.send({ response: "Сервер на связи" }).status(200);
});
router.get("/info/:roomId", async (req, res) => { 
    let data = await getRoomsInfo(req.params.roomId)
    res.send(data);
});

const app = express()
const server = http.createServer(app);
const io = socketio(server);
app.use(cors());
app.options('*', cors());
app.use(router);

io.on('connect', (socket) => {
    console.log( 'Socket connected '+socket.id)
    socket.on('join', ({name, roomId})=>{
        console.log('join', name, roomId);
        const {error, user} = addUser({ id:socket.id, name, roomId })

        if (error) return console.error(error)

        socket.join(user.roomId)
        socket.emit('inviteMessage', {user: 'admin', text: `Добро пожаловать в чат ${user.name}` })
        socket.broadcast.to(user.roomId).emit('userJoin', {user: 'admin', text: `Пользователь ${user.name} присоединился`})
        io.to(user.roomId).emit('usersInDaRoom', { room: roomId, users: getUsersInRoom(roomId) })
        console.log(getRooms())
        io.emit('roomsInDaChat', { rooms: getRooms() })
    })

     socket.on('sendMessage', (message)=>{
        const user = getUser(socket.id)
        io.to(user.roomId).emit('message', { user: user.id, text: message, ava: user.ava });
     }) 

     socket.on('disconnect', () => {
        const user = removeUser(socket.id);
    
        if(user) {
          io.to(user.room).emit('message', { user: 'admin', text: `${user.name} покинул чат.` });
          io.to(user.room).emit('roomData', { room: user.roomId, users: getUsersInRoom(user.roomId)});
        }
      })
})

server.listen(3001, () => console.log(`Server has started.`));