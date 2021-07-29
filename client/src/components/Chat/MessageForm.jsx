import React, {useRef, useEffect} from 'react'

import { MESSAGES_KEY } from '../../constants/local-storage-keys';
import { MESSAGE_RECEIVED, SEND_MESSAGE } from '../../constants/socket-events';

export default function MessageForm({setMessages, userId, userName, socket}) {
  const messageRef = useRef()

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
      <form onSubmit={sendMessage}>
        <input ref={messageRef} placeholder="Type message" type="text" />
        <button>Send message</button>
      </form>
    </div>
  )
}
