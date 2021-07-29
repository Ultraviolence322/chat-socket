import React from 'react'
import { Link } from 'react-router-dom'
export default function ChoicePath() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/secret">secret</Link>
        </li>
        <li>
          <Link to="/default">default</Link>
        </li>
      </ul>
    </div>
  )
}
