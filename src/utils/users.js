const users = [];

const addUser = ({ id, username, room }) => {

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}


addUser({
    id: 55,
    username: 'poptart1',
    room: "text"
});
console.log(users)

const res = addUser({
    id: 7,
    username: 'Poptart1',
    room: " "

})

console.log(res)
// const removeUser = () => {

// }
// const getUser = () => {

// }
// const getUsersInRoom = () => {

// }