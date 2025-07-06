import { useState, useEffect } from "react";
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
  const [messageInput, setMessageInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  // Play sound on new message
  const playSound = () => {
    const audio = new Audio('/notification.mp3'); // Ensure /public/notification.mp3 exists
    audio.play().catch((err) => console.error("Audio play failed:", err));
  };

  // Request browser notification permission
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Update unread count + play sound + browser notification
  useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];

      // Don't count own messages as unread
      if (last.sender !== username) {
        setUnreadCount(prev => prev + 1);

        // Play notification sound
        playSound();

        // Browser notification
        if (Notification.permission === 'granted') {
          new Notification('New Message', {
            body: `${last.sender}: ${last.message}`,
          });
        }
      }
    }
  }, [messages]);

  const handleJoin = () => {
    if (username.trim()) {
      connect(username);
    }
  };

  const handleSend = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput("");
      setTyping(false);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <div>
          <input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleJoin}>Join Chat</button>
        </div>
      ) : (
        <div>
          <div>
            <p>Online users: {users.length}</p>
            <p>Unread messages: {unreadCount}</p>
            <button onClick={disconnect}>Disconnect</button>
          </div>

          <div>
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.system ? (
                  <em>{msg.message}</em>
                ) : (
                  <strong>{msg.sender}:</strong>
                )}
                {!msg.system && <span> {msg.message}</span>}
              </div>
            ))}
          </div>

          <div>
            {typingUsers.length > 0 && (
              <p>{typingUsers.join(", ")} typing...</p>
            )}
            <input
              placeholder="Type a message"
              value={messageInput}
              onChange={(e) => {
                setMessageInput(e.target.value);
                setTyping(e.target.value !== "");
              }}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}



