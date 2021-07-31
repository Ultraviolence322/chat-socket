import React from 'react'
import { v4 as uuidv4 } from 'uuid';

export default function CreateSecretRoom({handleCreateSecretRoom}) {

  function handleClick() {
    const id = uuidv4()
    handleCreateSecretRoom(id)
  }

  return (
    <div>
      <h2>
        Create new secret room
      </h2>

      <form>
        <button onClick={handleClick}>Create</button>
      </form>
    </div>
  )
}
