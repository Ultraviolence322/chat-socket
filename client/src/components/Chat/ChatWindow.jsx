import React from 'react'

export default function ChatWindow({messages}) {
  return (
    <div>
      <h2>Chat</h2>
      {messages.map(message => <div key={message.id}>{message.text + (message.senderName ? ` - ${message.senderName}`  : '')}</div>)}
    </div>
  )
}
