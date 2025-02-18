// src/components/ChatArea/ChatArea.jsx
import { useState } from 'react';
import { Icon } from '../Shared/icons';
import { api } from '../Shared/api';

const ChatArea = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const response = await api.sendMessage(message, []);
    setMessages(prev => [...prev, 
      { type: 'user', content: message },
      { type: 'assistant', content: response.response }
    ]);
    setMessage('');
  };

  return (
    <div className="flex-1 p-4">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="mb-4 text-blue-500">
            <Icon label="upload" />
          </div>
          <h3 className="text-xl mb-4">Add a source to get started</h3>
          <button className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700">
            Upload a source
          </button>
        </div>
      ) : (
        <div className="h-full overflow-y-auto mb-16">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg ${
                msg.type === 'user' ? 'bg-blue-600' : 'bg-gray-800'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="absolute bottom-4 w-[calc(100%-32px)] max-w-3xl">
        <div className="flex gap-2 items-center bg-gray-800 rounded-lg p-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none outline-none px-2"
          />
          <span className="text-xs text-gray-500">0 sources</span>
          <button 
            className="p-2 rounded-full bg-blue-600 text-white"
            onClick={sendMessage}
          >
            <Icon label="send" />
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          NotebookLM can be inaccurate, please double check its responses.
        </p>
      </div>
    </div>
  );
};

export default ChatArea;