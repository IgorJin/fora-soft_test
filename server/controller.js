const users = [];
const rooms = [];
const messages = []

const ava_collection = [
    'circle',
    'square',
    'rhombus'
]

const generateRoomId = () => {
    const abc = "abcdefghijklmnopqrstuvwxyz";
    let id = "";
    while (id.length < 6) {
        id += abc[Math.floor(Math.random() * abc.length)];
    }
    return id
}
const roomAdd = (id='', roomName, user) => {
    id = !id.length ? generateRoomId() : id
    const room = {id, roomName, auth: user.name, ava: user.ava}
    rooms.push(room)
    return id
}

const addUser = ({ id, name, roomId }) => {
  
  let room = getRoom(roomId)
  name = name.trim().toLowerCase();

  if(!name || !roomId) return { error: 'Необходимы "Имя пользователя" и "Индетификатор комнаты".' };

  let ava = ava_collection[Math.floor(Math.random() * ava_collection.length)]
  const user = { id, name, roomId, ava };
  if (!room.length) roomAdd(roomId, name, user);

  users.push(user);
  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  let user = users.splice(index, 1)[0]
  if (!user) return
  let usersInDaRoom = getUsersInRoom(user.roomId)
  if (!usersInDaRoom.length) removeRoom(user.roomId)
  if(index !== -1) return user;
}

const getUser = (id) => users.find((user) => user.id === id);

const getRoom = (id) => rooms.filter(room => id == room.id);

const getRooms = () => rooms;

const getUsersInRoom = (roomId) => users.filter((user) => user.roomId === roomId);

const getRoomsInfo = (id) => {
    let users = []
    let room, roomName
    id  = id == 'join' ? generateRoomId() : id //если не по приглашению, то создаем новую комнату
    room = getRoom(id)
    roomName = room ? room.roomName : ''
    users = getUsersInRoom(id)
    return {
        count : rooms.length,
        roomId : id,
        roomName,
        users
    }
};
const removeRoom = (id) => {
    const index = rooms.findIndex((room) => room.id === id);
    rooms.splice(index, 1)[0]
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getRoomsInfo, getRooms };