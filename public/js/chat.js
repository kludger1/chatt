const socket = io();

const $messageForm = document.querySelector(".message-form")
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormBtn = $messageForm.querySelector('button')
const $sendLocationBtn = document.querySelector(".send-location-btn")
const $messages = document.querySelector('#messages')



const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

const {username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        // day: moment(message.createdAt).format('ddd MMM DD YYYY'),
        message: message.msg,
        createdAt: moment(message.createdAt).format('ddd MMM DD YYYY h:mm a')
    })
    $messages.insertAdjacentHTML('beforeEnd', html)
})

socket.on('locationMessage', (url) => {
    const html = Mustache.render(locationMessageTemplate, {
        url: url.url,
        createdAt: moment(url.createdAt).format('ddd MMM DD YYYY h:mm a')
    })
    $messages.insertAdjacentHTML('beforeEnd', html)
})



$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputMsg = e.target.elements.message.value

    $messageFormBtn.setAttribute('disabled', 'disabled');

    socket.emit('sendMessage', inputMsg, (error) => {

        $messageFormBtn.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        error ? console.log(error) : console.log("message was delivered")
    })
})



$sendLocationBtn.addEventListener('click', () => {
    !navigator.geolocation ? alert('Geolocation is not supported by your browser') :
        $sendLocationBtn.setAttribute('disabled', 'disabled');

        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('sendLocation', {
                lat: position.coords.latitude,
                long: position.coords.longitude
            }, () => {
                console.log("Location shared")
                $sendLocationBtn.removeAttribute('disabled')
            })
        })


})

socket.emit('join', {username, room})