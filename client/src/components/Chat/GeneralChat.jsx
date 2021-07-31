import React from 'react'
import ChatWindow from './ChatWindow'
import MessageForm from './MessageForm'

import { MESSAGES_KEY } from '../../constants/local-storage-keys';

export default function GeneralChat({userName, userId, socket, messages, setMessages}) {

  function clearMessages() {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify([]))
    setMessages([])
  }

  return (
    <div>
      <div>
        <button onClick={clearMessages}>Clear messages</button>
      </div>
      <ChatWindow messages={messages} />
      <MessageForm  setMessages={setMessages} userName={userName} userId={userId} socket={socket}/>
    </div>
  )
}
