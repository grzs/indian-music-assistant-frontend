import { createContext } from 'react'
import click from './assets/sounds/click.ogg'
import clap from './assets/sounds/clap.ogg'
import chime from './assets/sounds/chime.ogg'

const SoundsContextMuteAll = createContext(true)

const sounds = {
  click: new Audio(click),
  clap: new Audio(clap),
  sam: new Audio(chime),
}

function triggerSound(key) {
  const audioObj = sounds[key]
  if (audioObj == undefined) {return}

  // play if never played or playback ended, else rewind
  if (audioObj.played.length === 0 || audioObj.ended) audioObj.play();
  else audioObj.currentTime = 0;
}

export { triggerSound, SoundsContextMuteAll }
