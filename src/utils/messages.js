const generateLocationMessage = (url) => {
    return {
        url,
        createAt: new Date().getTime()
    }
}
const generateMessage = (msg) => {
    return {
        msg,
        createAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}