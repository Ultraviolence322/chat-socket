import { useRef, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGES_KEY } from './constants/local-storage-keys';
import { MESSAGE_RECEIVED, SEND_MESSAGE } from './constants/socket-events';

function App() {
  const nameRef = useRef()
  const messageRef = useRef()

  const [userId, setUserId] = useState()
  const [userName, setUserName] = useState('nobody')
  const [isChangeNameModal, setIsChangeNameModal] = useState(false)
  const [socket, setSocket] = useState()
  const [messages, setMessages] = useState([])
  
  function toggleChangeNameModal() {
    setIsChangeNameModal(!isChangeNameModal)
    setTimeout(() => {
      nameRef.current.focus()
    })
  }

  function changeName(e) {
    e.preventDefault()
    setUserName(nameRef.current.value)
    setIsChangeNameModal(false)
  }

  function sendMessage(e) {
    e.preventDefault()

    const text = messageRef.current.value
    const senderId = userId
    const senderName = userName

    messageRef.current.value = ""

    const prevMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY)) ?? []
    const newMessages = [...prevMessages, {id: prevMessages.length, senderId, senderName, text}]
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(newMessages))

    setMessages(newMessages)

    socket.emit(SEND_MESSAGE, {senderId, senderName, text})
  }

  useEffect(() => {
    const userId = uuidv4();
    setUserId(userId)
    
    const socket = io('http://localhost:5000/', {query: {userId, userName}});
    setSocket(socket)

    setMessages(JSON.parse(localStorage.getItem(MESSAGES_KEY)) ?? [])

    return () => {
      socket.close()
    }
  }, [])

  useEffect(() => {
    socket?.on(MESSAGE_RECEIVED, ({senderId, senderName, text}) => {

      const prevMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY)) ?? []
      const newMessages = [...prevMessages, {id: prevMessages.length, senderId, senderName, text}]
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(newMessages))

      setMessages(newMessages)
    })

    return () => {
      socket?.off()
    }
  }, [socket])

  return (
    <div>
      <div>
        Your name - {userName}
        <button onClick={toggleChangeNameModal}>Change name</button> 
      </div>

      {isChangeNameModal && <form onSubmit={changeName}>
        <input ref={nameRef} type="text" placeholder="Your name"/>
        <button>Set</button>
      </form>
      }
      
      Your id - {userId}
      <form onSubmit={sendMessage}>
        <input ref={messageRef} placeholder="Type message" type="text" />
        <button>Send message</button>
      </form>

      <h1>Chat</h1>
      {messages.map(message => <div key={message.id}>{message.text} - {message.senderName}</div>)}
    </div>
  )
}

export default App;
