import React from 'react'
import ChatWindow from './ChatWindow'
import MessageForm from './MessageForm'
import Conversations from './Conversations'

import { MESSAGES_KEY } from '../../constants/local-storage-keys';

export default function GeneralChat({userName, userId, socket, messages, setMessages, roomId, handleCloseChat}) {

  function clearMessages() {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify([]))
    setMessages([])
  }

  return (
    <div className="general-chat">
      <div className="conversations">
        <Conversations />
      </div>
      <div>
        <div>
          <button onClick={clearMessages}>Clear messages</button>
        </div>
        <ChatWindow messages={messages} />
        <MessageForm roomId={roomId} setMessages={setMessages} userName={userName} userId={userId} socket={socket}/>
        <button onClick={handleCloseChat}>Close chat</button>

      </div>
      
    </div>
  )
}
