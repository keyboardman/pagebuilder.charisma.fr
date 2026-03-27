import React, { createContext, useState } from 'react'

const audio = new Audio()

export const PlayerContext = createContext({
  audio: null,
  player: null,
  setPlayer: () => {},
  onPlay: () => {}
})

export const PlayerProvider = props => {
  const [player, setPlayer] = useState(false)

  const onPlay = (src, title = '', artiste = '', album = '') => {
    audio.pause()
    audio.src = src
    audio.play()

    setPlayer({
      title,
      artiste,
      album
    })
  }

  const onClose = () => {
    audio.pause()
    audio.src = ''
    setPlayer(false)
  }

  return (
    <PlayerContext.Provider value={{ audio, player, onPlay, onClose }}>
      {props.children}
    </PlayerContext.Provider>
  )
}

export default PlayerProvider
