import React from 'react'
import { render } from 'react-dom'
import App from './index'

export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  render(<App />, container)
}
