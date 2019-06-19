const socket = io();

const $messageForm = document.querySelector('.message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormBtn = $messageForm.querySelector('button');
const $sendLocationBtn = document.querySelector('.send-location-btn');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector(
  '#location-message-template'
).innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const autoScroll = () => {
  const $newMessage = $messages.lastElementChild;
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = $messages.offsetHeight;
  const containerHeight = $messages.scrollHeight;
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset)
    $messages.scrollTop = $messages.scrollHeight;
};

socket.on('message', message => {
  const html = Mustache.render(messageTemplate, {
    // day: moment(message.createdAt).format('ddd MMM DD YYYY'),
    username: message.username,
    message: message.msg,
    createdAt: moment(message.createdAt).format('ddd MMM DD YYYY h:mm a')
  });
  $messages.insertAdjacentHTML('beforeEnd', html);
  autoScroll();
});

socket.on('locationMessage', url => {
  const html = Mustache.render(locationMessageTemplate, {
    username: url.username,
    url: url.url,
    createdAt: moment(url.createdAt).format('ddd MMM DD YYYY h:mm a')
  });
  $messages.insertAdjacentHTML('beforeEnd', html);
  autoScroll();
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  $sidebar.innerHTML = html;
});

$messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const inputMsg = e.target.elements.message.value;
  if (inputMsg === '') return alert('Please enter message.');
  $messageFormBtn.setAttribute('disabled', 'disabled');

  socket.emit('sendMessage', inputMsg, error => {
    $messageFormBtn.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();
    error ? alert(error) : null;
  });
});

$sendLocationBtn.addEventListener('click', () => {
  !navigator.geolocation
    ? alert('Geolocation is not supported by your browser')
    : $sendLocationBtn.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      'sendLocation',
      {
        lat: position.coords.latitude,
        long: position.coords.longitude
      },
      () => {
        // console.log('Location shared');
        $sendLocationBtn.removeAttribute('disabled');
      }
    );
  });
});

socket.emit('join', { username, room }, error => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
