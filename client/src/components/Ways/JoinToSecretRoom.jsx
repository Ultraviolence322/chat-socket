import React, {useState} from 'react'

export default function JoinToSecretRoom({handleJoinToSecretRoom}) {

  const [roomId, setRoomId] = useState('')

  function handleSubmit() {
    handleJoinToSecretRoom(roomId)
  }

  function handleChange(e) {
    setRoomId(e.target.value)
  }

  return (
    <div>
      <h2>
        Join to secret room
      </h2>

      <form onSubmit={handleSubmit}>
        <input onChange={handleChange} value={roomId} type="text" placeholder="Type id room" />
        <button>Join</button>
      </form>
    </div>
  )
}
