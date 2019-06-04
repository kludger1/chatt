const socket = io();

const $messageForm = document.querySelector(".message-form")
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormBtn = $messageForm.querySelector('button')
const $sendLocationBtn = document.querySelector(".send-location-btn")
const $messages = document.querySelector('#messages')



const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {message})
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