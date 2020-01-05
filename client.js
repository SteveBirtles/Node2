function pageLoad() {

    const connection = new WebSocket("ws://localhost:8082");
    const chat = document.getElementById("chat");

    connection.onopen = () => {
        chat.innerHTML += "<h3>The WebSocket is now open.</h3>";
    };

    connection.onclose = () => {
        chat.innerHTML += "<h3>The WebSocket was closed.</h3>";
    };

    connection.onerror = () => {
        chat.innerHTML += "<h3>A WebSocket error occurred!</h3>";
    };

    connection.onmessage = (event) => {
        chat.innerHTML += `<p>${event.data}</p>`;
    };

    const button = document.getElementById("send");
    const message = document.getElementById("message");

    button.addEventListener("click", () => {

      connection.send(message.value);
      message.value = "";

    });

}
