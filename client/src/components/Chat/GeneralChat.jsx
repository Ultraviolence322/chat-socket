import React, {useState} from 'react'
import ChatWindow from './ChatWindow'
import MessageForm from './MessageForm'

export default function GeneralChat({userName, userId, socket}) {
  const [messages, setMessages] = useState([])

  return (
    <div>
      <ChatWindow messages={messages} />
      <MessageForm  setMessages={setMessages} userName={userName} userId={userId} socket={socket}/>
    </div>
  )
}
