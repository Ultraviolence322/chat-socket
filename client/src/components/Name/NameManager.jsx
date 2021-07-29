import React, {useRef, useState} from 'react'
import NameForm from './NameForm'

export default function NameManager({userName, setUserName}) {
  const [isChangeNameModal, setIsChangeNameModal] = useState(false)
  const nameRef = useRef()

  function changeName(e) {
    e.preventDefault()
    setUserName(nameRef.current.value)
    setIsChangeNameModal(false)
  }

  function toggleChangeNameModal() {
    setIsChangeNameModal(!isChangeNameModal)
    setTimeout(() => {
      nameRef.current.focus()
    })
  }
  return (
    <div>
      <div>
        Your name - {userName}
        <button onClick={toggleChangeNameModal}>Change name</button> 
      </div>

      {isChangeNameModal && <NameForm changeName={changeName} nameRef={nameRef} />}
    </div>
  )
}
