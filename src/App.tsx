import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { default as testAppState } from './testdata.js'
import { Composition } from './Composition.tsx'
import { importComposition, exportComposition } from './filesystem.js'

function App() {
  const [position, setPosition] = useState(-1)
  const [taals, setTaals] = useState(testAppState.taals)
  const [taal, setTaal] = useState({sections: []})
  const [composition, setComposition] = useState({taal: "chau", sections: []})
  const [editing, setEditing] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [bpm, setBpm] = useState(60)
  const [loop, setLoop] = useState()
  const [taalDelay, setTaalDelay] = useState(0)
  const [compositionDelay, setCompositionDelay] = useState(1)

  useEffect(() => {
    const nextTaal = {sections: taal.sections.slice()}
    if (composition.taal) nextTaal.sections = taals[composition.taal].sections
    setTaal(nextTaal)
  }, [composition])

  useEffect(() => {
    const interval = 60000 / bpm
    let nextLoop = loop
    
    if (playing) nextLoop = setInterval(
      () => setPosition(position => Number(position) + 1),
      interval,
    )
    else {
      clearInterval(loop)
      nextLoop = undefined
    }

    setLoop(nextLoop)
    
  }, [playing, bpm])

  function getMatraCounter(sections) {
    let counter = 0
    return sections.map(
      section => section.subsections.map(
        subsection => subsection.matras.map(
          (m, i) => counter++)))
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
      {/*
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
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
      </div>
      <div id="counter">player position: {position}</div>
      <div>
        <h1>{composition.name}</h1>
        <div id="taal">
          <Composition
            sections={taal.sections}
            playerPosition={position}
            matraCounter={getMatraCounter(taal.sections)}
            playing={playing}
            delay={taalDelay}
            onMatraInputChange={() => {console.log("Taal is not editable")}}
            onMatraSelect={e => handleMatraSelect(e.target.dataset.matraNrGlobal)}
          />
        </div>
        <div id="composition" className={editing ? "editing" : ""}>
          <Composition
            sections={composition.sections}
            playerPosition={position}
            matraCounter={getMatraCounter(composition.sections)}
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
        </div>
      </div>
    </>
  )
}

export default App
