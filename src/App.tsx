import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { default as testAppState } from './testdata.js'
import { Composition } from './Composition.tsx'

function App() {
  const [count, setCount] = useState(0)
  const [taals, setTaals] = useState(testAppState.taals)
  const [taal, setTaal] = useState({sections: []})
  const [composition, setComposition] = useState({taal: "chau", sections: []})
  const [editing, setEditing] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [bpm, setBpm] = useState(60)
  const [loop, setLoop] = useState()

  useEffect(() => {
    const nextTaal = {sections: taal.sections.slice()}
    if (composition.taal) nextTaal.sections = taals[composition.taal].sections
    setTaal(nextTaal)
  }, [composition])

  function getMatraCounter(sections) {
    let counter = 0
    return sections.map(
      section => section.subsections.map(
        subsection => subsection.matras.map(
          (m, i) => counter++)))
  }

  function incrementCount() {
    setCount(count => count + 1)
  }

  function handleMatraChange(sectionNr, subsectionNr, matraNr, itemType, value) {
    const nextComposition = Object.assign({}, composition)
    nextComposition.sections = composition.sections.slice() // still doesn't enough, preserves references
    nextComposition.sections[sectionNr].subsections[subsectionNr].matras[matraNr][itemType] = value;
    setComposition(nextComposition)
  }

  function handleMatraSelect(position) {
    if (position >= 0) setCount(Number(position))
  }

  function loadData() {
    const nextComposition = JSON.parse(JSON.stringify(testAppState.bandish))
    setComposition(nextComposition)
  }

  function togglePlay() {
    let interval = 60000 / bpm
    let nextLoop = loop
    
    const nextPlaying = !playing
    if (nextPlaying) nextLoop = setInterval(incrementCount, interval)
    else {
      clearInterval(loop)
      nextLoop = undefined
    }

    setPlaying(nextPlaying)
    setLoop(nextLoop)
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
        <button onClick={incrementCount}>
          count is {count}
        </button>
        <button onClick={loadData}>Load</button>
        <button onClick={() => setEditing((editing) => ! editing)}>
          {editing ? "stop" : "start"} editing
        </button>
        <button onClick={togglePlay}>{playing ? "stop" : "play"}</button>
      </div>
      <div>
        <h1>{composition.name}</h1>
        <div id="taal">
          <Composition
            sections={taal.sections}
            cursorPosition={count}
            matraCounter={getMatraCounter(taal.sections)}
            onMatraInputChange={() => {console.log("Taal is not editable")}}
            onMatraSelect={e => handleMatraSelect(e.target.dataset.matraNrGlobal)}
          />
        </div>
        <div id="composition" className={editing ? "editing" : ""}>
          <Composition
            sections={composition.sections}
            cursorPosition={count}
            matraCounter={getMatraCounter(composition.sections)}
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
