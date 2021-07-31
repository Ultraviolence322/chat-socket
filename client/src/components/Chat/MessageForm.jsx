import React, {useRef, useEffect} from 'react'

import { SECRET_CHATS } from '../../constants/local-storage-keys';
import { MESSAGE_RECEIVED, SEND_MESSAGE } from '../../constants/socket-events';

export default function MessageForm({roomId, setMessages, userId, userName, socket}) {
  const messageRef = useRef()

  function sendMessage(e) {
    e.preventDefault()

    const text = messageRef.current.value
    const senderId = userId
    const senderName = userName

    messageRef.current.value = ""

    let secretChats = JSON.parse(localStorage.getItem(SECRET_CHATS)) ?? {}
    let currentSecretChat = secretChats[roomId] ?? {}
    const prevMessages = currentSecretChat.messages ?? []
    const newMessages = [...prevMessages, {id: prevMessages.length, senderId, senderName, text}]
    currentSecretChat = {...currentSecretChat, messages: newMessages}
    secretChats = {...secretChats, [roomId]: currentSecretChat}
    localStorage.setItem(SECRET_CHATS, JSON.stringify(secretChats))

    setMessages(newMessages)

    socket.emit(SEND_MESSAGE, {senderId, senderName, text, roomId})
  }

  useEffect(() => {
    socket?.on(MESSAGE_RECEIVED, ({senderId, senderName, text}) => {

      let secretChats = JSON.parse(localStorage.getItem(SECRET_CHATS)) ?? {}
      let currentSecretChat = secretChats[roomId] ?? {}
      const prevMessages = currentSecretChat.messages ?? []
      const newMessages = [...prevMessages, {id: prevMessages.length, senderId, senderName, text}]
      currentSecretChat = {...currentSecretChat, messages: newMessages}
      secretChats = {...secretChats, [roomId]: currentSecretChat}
      localStorage.setItem(SECRET_CHATS, JSON.stringify(secretChats))

      setMessages(newMessages)
    })

    return () => {
      socket?.off()
    }
  }, [socket])

  return (
    <div>
      <form onSubmit={sendMessage}>
        <input ref={messageRef} placeholder="Type message" type="text" />
        <button>Send message</button>
      </form>
    </div>
  )
}
