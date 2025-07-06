// App.jsx
import { useState } from "react";
import { useSocket } from "./socket";

export default function App() {
  const {
    connect,
    disconnect,
    isConnected,
    messages,
    users,
    typingUsers,
    sendMessage,
    sendPrivateMessage,
    setTyping,
  } = useSocket();

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [privateMessage, setPrivateMessage] = useState("");
  const [privateRecipient, setPrivateRecipient] = useState("");

  const handleConnect = () => {
    if (username.trim()) {
      connect(username);
    } else {
      alert("Please enter a username");
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
      setTyping(false);
    }
  };

  const handlePrivateSend = (e) => {
    e.preventDefault();
    if (privateMessage.trim() && privateRecipient) {
      sendPrivateMessage(privateRecipient, privateMessage);
      setPrivateMessage("");
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setTyping(e.target.value.length > 0);
  };

  return (
    <div style={{ padding: "20px" }}>
      {!isConnected ? (
        <div>
          <h2>Join Chat</h2>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleConnect}>Join</button>
        </div>
      ) : (
        <div>
          <h2>Chat Room</h2>
          <button onClick={disconnect}>Leave</button>

          <div style={{ marginTop: "10px" }}>
            <h3>Users Online</h3>
            <ul>
              {users.map((u) => (
                <li key={u.id}>
                  {u.username} {u.id === privateRecipient ? "(Private selected)" : ""}
                  <button onClick={() => setPrivateRecipient(u.id)}>Private</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Messages</h3>
            <ul>
              {messages.map((msg) => (
                <li key={msg.id}>
                  {msg.system ? (
                    <em>{msg.message}</em>
                  ) : (
                    <>
                      <strong>{msg.sender}:</strong> {msg.message}
                      {msg.isPrivate && <span style={{ color: "red" }}> [Private]</span>}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={handleTyping}
            />
            <button type="submit">Send</button>
          </form>

          <form onSubmit={handlePrivateSend}>
            <input
              type="text"
              placeholder="Type a private message"
              value={privateMessage}
              onChange={(e) => setPrivateMessage(e.target.value)}
            />
            <button type="submit" disabled={!privateRecipient}>
              Send Private
            </button>
          </form>

          {typingUsers.length > 0 && (
            <p>
              {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
            </p>
          )}
        </div>
      )}
    </div>
  );
}

