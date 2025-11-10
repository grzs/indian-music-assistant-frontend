import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const testAppState = {
  "taals": {
    "chau": {
      "slug": "chau",
      "name": "Chau Taal",
      "type": "taal",
      "sections": [
        {
          "name": "sam",
          "subsections": [
            {
              "type": "anga",
              "matras": [
                {
                  "syllable": "Dha"
                },
                {
                  "syllable": "Dha"
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "bandish": {
    "slug": "anandi-jagabandi",
    "name": "Anandi Jagabandi",
    "type": "bandish",
    "taal": "chau",
    "sections": [
      {
        "name": "sthayi",
        "subsections": [
          {
            "type": "line",
            "matras": [
              {
                "syllable": "A",
                "sargam": "P",
                "bol": "/"
              },
              {
                "syllable": "-",
                "sargam": "m",
                "bol": "-"
              },
              {
                "syllable": "nan",
                "sargam": "G",
                "bol": "-"
              },
              {
                "syllable": "-",
                "sargam": "-",
                "bol": "c"
              },
              {
                "syllable": "di",
                "sargam": "G",
                "bol": "\\"
              }
            ]
          }
        ]
      }
    ]
  }
}

function MatraItem({ value, itemType, matraNr, subsectionNr, sectionName, sectionNr, matraCounter, onMatraInputChange }) {
  if (itemType == "number") {
    return (
      <div className={itemType} data-matra-nr-global={matraCounter}>{value}</div>
    )
  }
  return (
    <div
      className={itemType}
      data-matra-nr-global={matraCounter}
    >
      <div className="matraitem" data-matra-nr-global={matraCounter}>
        {value}
      </div>
      <input
        name={`${sectionName}-${subsectionNr}-${matraNr}-${itemType}`}
        value={value}
        data-type={itemType}
        data-matra-nr={matraNr}
        data-subsection-nr={subsectionNr}
        data-section-name={sectionName}
        data-section-nr={sectionNr}
        onChange={onMatraInputChange}
      />
    </div>
  )
}

function Matra({ matra, matraNr, subsectionNr, sectionName, sectionNr, matraCounter, position, onMatraInputChange, onMatraSelect }) {
  matra["number"] = matraCounter
  return (
    <div
      data-matra-nr-global={matraCounter}
      onClick={onMatraSelect}
      className={position == matraCounter ? "matra active" : "matra"}
    >
      {Object.entries(matra).map(([key, value]) => (
        <MatraItem
          key={key}
          value={value}
          itemType={key}
          matraNrGlobal={matraCounter}
          matraNr={matraNr}
          subsectionNr={subsectionNr}
          sectionName={sectionName}
          sectionNr={sectionNr}
          matraCounter={matraCounter}
          onMatraInputChange={onMatraInputChange}
        />
      ))}
    </div>
  )
}

function SubSection({ subsection, subsectionNr, sectionName, sectionNr, matraCounter, position, onMatraInputChange, onMatraSelect }) {
  return (
    <div className={position in matraCounter ? `${subsection.type} active` : subsection.type}>
      {subsection.matras.map((matra, i) => (
        <Matra
          key={i}
          matra={matra}
          matraNr={i}
          subsectionNr={subsectionNr}
          sectionName={sectionName}
          sectionNr={sectionNr}
          matraCounter={matraCounter[i]}
          position={position}
          onMatraInputChange={onMatraInputChange}
          onMatraSelect={onMatraSelect}
        />
      ))}
    </div>
  )
}

function Section({ section, sectionNr, matraCounter, position, onMatraInputChange, onMatraSelect }) {
  return (
    <div className="section">
      <h2>{section.name}</h2>
      {section.subsections.map((subsection, i) => (
        <SubSection
          key={i}
          subsection={subsection}
          subsectionNr={i}
          sectionName={section.name}
          sectionNr={sectionNr}
          matraCounter={matraCounter[i]}
          position={position}
          onMatraInputChange={onMatraInputChange}
          onMatraSelect={onMatraSelect}
        />
      ))}
    </div>
  )  
}

function Composition({ sections, cursorPosition, matraCounter, onMatraInputChange, onMatraSelect }) {
  const [position, setPosition] = useState(0)

  useEffect(() => {
    const compLength = matraCounter.flat(2).length
    const nextPosition = cursorPosition % compLength
    setPosition(nextPosition)
  }, [sections, cursorPosition])

  return (
    <div className="composition">
      {sections.map((section, i) => (
        <Section
          key={section.name}
          section={section}
          sectionNr={i}
          matraCounter={matraCounter[i]}
          position={position}
          onMatraInputChange={onMatraInputChange}
          onMatraSelect={onMatraSelect}
        />
      ))}
    </div>
  )
}

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
