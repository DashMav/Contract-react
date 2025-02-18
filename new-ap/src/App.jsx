import Header from './components/Header';
import { useState } from 'react';
import SourcesPanel from './components/SourcesPanel';
import ChatArea from './components/ChatArea';
import './index.css'; // Global styles
import StudioPanel from './components/studiopanel';

function App() {
  const [messages, setMessages] = useState([]); // Messages in ChatArea
  const [contractType, setContractType] = useState("Loan Agreement");


  return (
    
    <div className="app-container">
          <Header setContractType={setContractType} contractType={contractType} />
      <main className="main-content">
        <SourcesPanel setMessages={setMessages} contractType={contractType} />
        <ChatArea messages={messages} setMessages={setMessages} />
        <StudioPanel contractType={contractType} />
      </main>
    </div>
  );
}

export default App;
