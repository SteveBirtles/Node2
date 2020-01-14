let connection;

function pageLoad() {

    connection = new WebSocket("ws://localhost:8082");

    connection.addEventListener("open", () => console.log("Connection OK!"));
    connection.addEventListener("message", recieveMessage);
    connection.addEventListener("error", () => console.log("A WebSocket error occurred!"));
    connection.addEventListener("close", () => alert("The WebSocket was closed!"));

    document.getElementById("send").addEventListener("click", sendMessage);

    document.getElementById("message").addEventListener("keypress", event => {
      if (event.key === 'Enter') sendMessage();
    });

}

function sendMessage() {

    let message = document.getElementById("message");
    let chat = document.getElementById("chat");

    connection.send(message.value);
    chat.innerHTML += `<p><strong>You:</strong> ${message.value}</p>`;
    chat.scrollTop = chat.scrollHeight;
    message.value = "";

}

function recieveMessage(event) {

    let chat = document.getElementById("chat");

    chat.innerHTML += `<p>${event.data}</p>`;
    chat.scrollTop = chat.scrollHeight;

}
