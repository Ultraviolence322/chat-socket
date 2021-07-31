import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import { SECRET_CHATS } from '../../constants/local-storage-keys';
import { NEW_USER, USER_LEFT, JOIN_ROOM, LEFT_ROOM } from '../../constants/socket-events';

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

    let secretChats = JSON.parse(localStorage.getItem(SECRET_CHATS)) ?? {}
    let currentSecretChat = secretChats[roomId] ?? {}
    const prevMessages = currentSecretChat.messages ?? []

    setMessages(prevMessages)

    return () => {
      socket.close()
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on(NEW_USER, (senderName, senderId) => {
        const text = `${senderName} open the chat`
        let secretChats = JSON.parse(localStorage.getItem(SECRET_CHATS)) ?? {}
        let currentSecretChat = secretChats[roomId] ?? {}
        const prevMessages = currentSecretChat.messages ?? []
        const newMessages = [...prevMessages, {id: prevMessages.length, senderId, senderName: null, text}]
        currentSecretChat = {...currentSecretChat, messages: newMessages}
        secretChats = {...secretChats, [roomId]: currentSecretChat}
        localStorage.setItem(SECRET_CHATS, JSON.stringify(secretChats))
  
        setMessages(newMessages)
      })
  
      socket.on(USER_LEFT, (senderName, senderId) => {
        const text = `${senderName} left the chat`
  
        let secretChats = JSON.parse(localStorage.getItem(SECRET_CHATS)) ?? {}
        let currentSecretChat = secretChats[roomId] ?? {}
        const prevMessages = currentSecretChat.messages ?? []
        const newMessages = [...prevMessages, {id: prevMessages.length, senderId, senderName: null, text}]
        currentSecretChat = {...currentSecretChat, messages: newMessages}
        secretChats = {...secretChats, [roomId]: currentSecretChat}
        localStorage.setItem(SECRET_CHATS, JSON.stringify(secretChats))
  
        setMessages(newMessages)
      })
    }

    return () => {
      if (socket) {
        socket.removeAllListeners(NEW_USER);
        socket.removeAllListeners(USER_LEFT);
      }
      
    }
  }, [roomId])

  function handleJoinToSecretRoom(id) {
    setRoomId(id)
    setIsSign(true)
    socket.emit(JOIN_ROOM, id)
  }

  function handleCreateSecretRoom(id) {
    setRoomId(id)
    setIsSign(true)
    socket.emit(JOIN_ROOM, id)
  }

 function handleCloseChat() {
    setRoomId(null)
    setIsSign(false)
    socket.emit(LEFT_ROOM, roomId)
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
            roomId={roomId}
          />
          <button onClick={handleCloseChat}>Close chat</button>
        </div>
      }
    </div>
  )
}

export default App;
