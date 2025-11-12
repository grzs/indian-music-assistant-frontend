import { useState, useEffect } from 'react'

// import viteLogo from '/vite.svg'

import { SoundsContextMuteAll } from './sounds.js'

import './App.css'

import { default as testAppState } from './testdata.js'

import { Taal } from './Taal.tsx'
import { CompositionContext, Composition } from './Composition.tsx'

import { importComposition, exportComposition } from './filesystem.js'

function sections2array(sections) {
  let counter = 0
  return sections.map(
    (section) => section.subsections.map(
      (subsection) => subsection.matras.map(
        (matra) => Object({nr: counter++, type: subsection.type, data: matra})
      )
    )
  )
}

function getMatrasFlattened(angas) {
  return angas.map(anga => anga.matras.map(matra => matra)).flat(2)
}

function getCss(mainWidth, taalLength, division) {
  return `
#taal .matra {width: ${mainWidth / taalLength}px;}
#taal .beat {width: ${100 / division}%;}
`
}

function App() {
  const [mainWidth, setMainWidth] = useState(1000)
  const [position, setPosition] = useState(-1)
  const [taals, setTaals] = useState(testAppState.taals)
  const [taal, setTaal] = useState({angas: []})
  const [composition, setComposition] = useState({taal: "chau", sections: []}) // TODO: only in DEV
  const [editing, setEditing] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [bpm, setBpm] = useState(60)
  const [loop, setLoop] = useState()
  const [taalDelay, setTaalDelay] = useState(0)
  const [compositionDelay, setCompositionDelay] = useState(1)
  const [taalLength, setTaalLength] = useState(0)
  const [division, setDivision] = useState(2)
  const [muteAll, setMuteAll] = useState(true)

  useEffect(() => {
    const matrasFlattened = getMatrasFlattened(taal.angas)
    setTaalLength(matrasFlattened.length)
  }, [taal])

  useEffect(() => {
    const nextTaal = {angas: taal.angas.slice()}
    if (composition.taal) nextTaal.angas = taals[composition.taal].angas
    setTaal(nextTaal)
  }, [composition])

  useEffect(() => {
    const interval = 60000 / bpm / division
    let nextLoop = loop

    if (playing) nextLoop = setInterval(triggerStep, interval)
    else {
      clearInterval(loop)
      nextLoop = undefined
    }

    setLoop(nextLoop)

  }, [playing, bpm, division])

  function triggerStep() {
    setPosition(position => Number(position) + 1)
  }

  function handleMatraChange(sectionNr, subsectionNr, matraNr, itemType, value) {
    const nextComposition = Object.assign({}, composition)
    nextComposition.sections = composition.sections.slice() // still doesn't enough, preserves references
    nextComposition.sections[sectionNr].subsections[subsectionNr].matras[matraNr][itemType] = value;
    setComposition(nextComposition)
  }

  function handleMatraSelect(newPosition) {
    if (newPosition >= 0 && !playing) setPosition(Number(newPosition))
  }

  function loadData() {
    // TODO: implement this function
    const nextComposition = JSON.parse(JSON.stringify(testAppState.bandish))
    setComposition(nextComposition)
  }

  return (
    <>
      <style href="generated.css">
        {getCss(mainWidth, taalLength, division)}
      </style>
      {/*
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      */}
      <div className="card">
        <button onClick={loadData}>load</button>
        <button onClick={() => exportComposition(composition)}>export</button>
        <button onClick={() => importComposition(setComposition)}>import</button>
        <button onClick={() => setEditing((editing) => ! editing)}>
          {editing ? "stop" : "start"} editing
        </button>
        <button onClick={() => setPlaying(playing => !playing)}>{playing ? "stop" : "play"}</button>
        <button onClick={() => {if (!playing) setPosition(-1)}}>rewind</button>
        <button onClick={() => setMuteAll(mute => !mute)}>{muteAll ? "sound" : "mute"}</button>
      </div>
      <div id="counter">player position: {position}</div>
      <SoundsContextMuteAll value={muteAll}>
        <div id="main">
          <h1>{composition.name}</h1>
          <div id="taal">
            <Taal
              angas={taal.angas}
              division={division}
              taalLength={taalLength}
              globalPosition={position}
              playing={playing}
            />
          </div>
          <div id="composition" className={editing ? "editing" : ""}>
            <CompositionContext value={sections2array(composition.sections)}>
              <Composition
                sections={composition.sections}
                playerPosition={position}
                playing={playing}
                delay={compositionDelay}
                onMatraInputChange={e => handleMatraChange(
                  e.target.dataset.sectionNr,
                  e.target.dataset.subsectionNr,
                  e.target.dataset.matraNr,
                  e.target.dataset.type,
                  e.target.value,
                )}
                onMatraSelect={e => handleMatraSelect(e.target.dataset.matraNrGlobal)}
              />
            </CompositionContext>
          </div>
        </div>
      </SoundsContextMuteAll>
    </>
  )
}

export default App
