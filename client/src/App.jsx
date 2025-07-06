import { useState } from 'react';
import { useSocket } from './socket';

export default function App() {
  const { connect, disconnect, sendMessage, messages, users, typingUsers, setTyping } = useSocket();
  const [username, setUsername] = useState('');
  const [input, setInput] = useState('');

  const handleLogin = () => {
    if (username.trim()) {
      connect(username);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div>
      {!users.find(u => u.username === username) ? (
        <div>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          <button onClick={handleLogin}>Join Chat</button>
        </div>
      ) : (
        <div>
          <div>
            <h3>Users Online:</h3>
            <ul>
              {users.map(u => (
                <li key={u.id}>{u.username}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Chat</h3>
            <div>
              {messages.map(m => (
                <p key={m.id}>
                  <strong>{m.sender}</strong> [{new Date(m.timestamp).toLocaleTimeString()}]: {m.message}
                </p>
              ))}
            </div>
            <div>
              {typingUsers.length > 0 && (
                <p>{typingUsers.join(', ')} is typing...</p>
              )}
            </div>
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setTyping(e.target.value.length > 0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Type a message..."
            />
            <button onClick={handleSend}>Send</button>
            <button onClick={disconnect}>Leave Chat</button>
          </div>
        </div>
      )}
    </div>
  );
}

