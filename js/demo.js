const chatMessages = document.getElementById("chatMessages");

function displayMessage(message, isUser = false) {
  const messageElement = document.createElement("div");
  messageElement.classList.add(
    "message",
    isUser ? "user-message" : "bot-message"
  );
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
  const userInput = document.getElementById("userInput");
  const message = userInput.value.trim();
  if (message === "") return;

  // Display user message
  displayMessage(message, true);

  // Clear input
  userInput.value = "";

  // Show typing indicator
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("typing-indicator");
  typingIndicator.textContent = "Medbot is typing...";
  chatMessages.appendChild(typingIndicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Send message to Flask API
  fetch("/send_message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message }),
  })
    .then((response) => response.json())
    .then((data) => {
      chatMessages.removeChild(typingIndicator);
      displayMessage(data.response);
    })
    .catch((error) => {
      chatMessages.removeChild(typingIndicator);
      displayMessage("Sorry, something went wrong. Please try again later.");
    });
}
