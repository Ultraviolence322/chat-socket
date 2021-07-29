import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGES_KEY } from '../../constants/local-storage-keys';
import { MESSAGE_RECEIVED, SEND_MESSAGE } from '../../constants/socket-events';

import GeneralChat from '../Chat/GeneralChat';
import NameManager from '../Name/NameManager';

function App() {
  

  const [userId, setUserId] = useState()
  const [userName, setUserName] = useState('nobody')
  
  const [socket, setSocket] = useState()

  useEffect(() => {
    const userId = uuidv4();
    setUserId(userId)
    
    const socket = io('http://localhost:5000/', {query: {userId, userName}});
    setSocket(socket)

    // setMessages(JSON.parse(localStorage.getItem(MESSAGES_KEY)) ?? [])

    return () => {
      socket.close()
    }
  }, [])



  return (
    <div>
      <h1>Secret</h1>
      Your id - {userId}
      <NameManager userName={userName} setUserName={setUserName}/>
      <GeneralChat userId={userId} userName={userName} socket={socket}/>
    </div>
  )
}

export default App;
