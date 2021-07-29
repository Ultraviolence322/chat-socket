import React from 'react'

export default function NameForm({changeName, nameRef}) {
  return (
    <div>
      <form onSubmit={changeName}>
        <input ref={nameRef} type="text" placeholder="Your name"/>
        <button>Set</button>
      </form>
    </div>
  )
}
