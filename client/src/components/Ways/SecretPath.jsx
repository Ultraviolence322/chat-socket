import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import { MESSAGES_KEY } from '../../constants/local-storage-keys';
import { NEW_USER, USER_LEFT } from '../../constants/socket-events';

import GeneralChat from '../Chat/GeneralChat';
import NameManager from '../Name/NameManager';
import JoinToSecretRoom from './JoinToSecretRoom'
import CreateSecretRoom from './CreateSecretRoom'

function App() {
  const [userId, setUserId] = useState()
  const [userName, setUserName] = useState('nobody')
  const [socket, setSocket] = useState()
  const [messages, setMessages] = useState([])
  const [isSign, setIsSign] = useState(false)
  const [roomId, setRoomId] = useState()

  useEffect(() => {
    const userId = uuidv4();
    setUserId(userId)
    
    const socket = io('http://localhost:5000/', {query: {userId, userName}});
    setSocket(socket)

    setMessages(JSON.parse(localStorage.getItem(MESSAGES_KEY)) ?? [])

    socket.on(NEW_USER, (senderName, senderId) => {
      const text = `${senderName} open the chat`
      const prevMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY)) ?? []
      const newMessages = [...prevMessages, {id: prevMessages.length, senderId, senderName, text}]
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(newMessages))

      setMessages(newMessages)
    })

    socket.on(USER_LEFT, (senderName, senderId) => {
      const text = `${senderName} left the chat`
      const prevMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY)) ?? []
      const newMessages = [...prevMessages, {id: prevMessages.length, senderId, senderName, text}]
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(newMessages))

      setMessages(newMessages)
    })

    return () => {
      socket.close()
    }
  }, [])

  function handleJoinToSecretRoom(id) {
    setRoomId(id)
    setIsSign(true)
  }

  function handleCreateSecretRoom(id) {
    setRoomId(id)
    setIsSign(true)
  }

 function handleCloseChat() {
    setRoomId(null)
    setIsSign(false)
  }

  return (
    <div>
      <h1>Secret</h1>
      Your id - {userId}

      { !isSign && 
        <div>
          <NameManager userName={userName} setUserName={setUserName}/>

          <JoinToSecretRoom handleJoinToSecretRoom={handleJoinToSecretRoom} />
          <hr />
          <CreateSecretRoom handleCreateSecretRoom={handleCreateSecretRoom} />
        </div>
      }

      { isSign && 
        <div>
          Chat id - {roomId}
          <GeneralChat 
            messages={messages} 
            setMessages={setMessages} 
            userId={userId} 
            userName={userName} 
            socket={socket}
          />
          <button onClick={handleCloseChat}>Close chat</button>
        </div>
      }
    </div>
  )
}

export default App;
