const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createAt: new Date().getTime()
    }
}
const generateMessage = (username, msg) => {
    return {
        username,
        msg,
        createAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}