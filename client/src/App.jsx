import { useSocket } from './socket';
import { useState } from 'react';

function App() {
  const { connect, disconnect, isConnected, messages, sendMessage } = useSocket();
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleConnect = () => {
    if (username.trim()) {
      connect(username);
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Socket.io Chat</h1>
      {!isConnected ? (
        <div>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleConnect}>Join Chat</button>
        </div>
      ) : (
        <div>
          <p>Connected as {username}</p>
          <div>
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
            <button onClick={disconnect}>Disconnect</button>
          </div>
          <ul>
            {messages.map((msg) => (
              <li key={msg.id}>
                {msg.system
                  ? <em>{msg.message}</em>
                  : <strong>{msg.sender}:</strong>}{' '}
                {msg.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
