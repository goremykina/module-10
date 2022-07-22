const wsUrl = 'wss://echo-ws-service.herokuapp.com';
const paretnDiv = document.getElementById('form_chat');
const input = document.getElementById('form_input');
const websocket = new WebSocket(wsUrl);
websocket.addEventListener('message', function (event) {
  if (!event.data.includes('GeolocationPosition')) {
    const message = createPlainTextMessage(event.data);
    appendMessageNode(message, false);
  }
});
websocket.addEventListener('close', function (event) {
  console.log(event);
});

function handleSubmit() {
  const text = input.value;
  if (!text) {
    return;
  }

  sendMessage(text)

  const message = createPlainTextMessage(text);
  appendMessageNode(message, true)

  input.value = '';
  input.focus();
}

function appendMessageNode(node, outgoing) {
  const divMessageNode = document.createElement('div')
  divMessageNode.appendChild(node)
  divMessageNode.classList.add('div_flex')

  if (outgoing) {
    divMessageNode.classList.add('position')
  } 

  paretnDiv.appendChild(divMessageNode)
  scrollDown()
}

function createPlainTextMessage(text) {
  const node = document.createElement('span');
  node.classList.add('messages');
  node.innerText = text;

  return node;
}

function createTextLinkMessage(text, href) {
  const node = document.createElement('a');
  node.classList.add('messages');
  node.href = href;
  node.innerText = text

  return node;
}

function sendMessage(message) {
  websocket.send(message);
}

function defineGeolocation () {
  navigator.geolocation.getCurrentPosition(success, error);
}


function success(position) {
  sendMessage(position);

  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;

  const message = createTextLinkMessage('Гео-локация', `https://www.openstreetmap.org/#map=16/${latitude}/${longitude}`);
  appendMessageNode(message, true);
}

function error(err) {
  console.error(`ERROR(${err.code}): ${err.message}`);
};

function scrollDown() {
  paretnDiv.scrollTop = paretnDiv.scrollHeight;
}

