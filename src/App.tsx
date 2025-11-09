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

function MatraItem({ value, itemType, matraNr, subsectionNr, sectionName, sectionNr, onMatraInputChange }) {
  return (
    <div className={itemType}>
      <div>{value}</div>
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

function Matra({ matra, matraNr, subsectionNr, sectionName, sectionNr, isActive, activeMatra, onMatraInputChange }) {
  return (
    <div className={isActive ? "matra active" : "matra"}>
      {Object.entries(matra).map(([key, value]) => (
        <MatraItem
          key={key}
          value={value}
          itemType={key}
          matraNr={matraNr}
          subsectionNr={subsectionNr}
          sectionName={sectionName}
          sectionNr={sectionNr}
          onMatraInputChange={onMatraInputChange}
        />
      ))}
    </div>
  )
}

function SubSection({ subsection, subsectionNr, sectionName, sectionNr, isActive, activeMatra, onMatraInputChange }) {
  return (
    <div className={isActive ? `${subsection.type} active` : subsection.type}>
      {subsection.matras.map((matra, i) => (
        <Matra
          key={i}
          matra={matra}
          matraNr={i}
          subsectionNr={subsectionNr}
          sectionName={sectionName}
          sectionNr={sectionNr}
          isActive={i == activeMatra["matra"]}
          activeMatra={activeMatra}
          onMatraInputChange={onMatraInputChange}
        />
      ))}
    </div>
  )
}

function Section({ section, sectionNr, isActive, activeMatra, onMatraInputChange }) {
  return (
    <div className={isActive ? "section active" : "section"}>
      <h2>{section.name}</h2>
      {section.subsections.map((subsection, i) => (
        <SubSection
          key={i}
          subsection={subsection}
          subsectionNr={i}
          sectionName={section.name}
          sectionNr={sectionNr}
          isActive={i == activeMatra["subsection"]}
          activeMatra={activeMatra}
          onMatraInputChange={onMatraInputChange}
        />
      ))}
    </div>
  )  
}

function Composition({ sections, cursorPosition, onMatraInputChange }) {
  const [activeMatra, setActiveMatra] = useState({"section": 0, "subsection": 0, "matra": 0})

  useEffect(() => {
    const allMatras = sections.map(section => section.subsections.map(subsection => subsection.matras))
    const compLength = allMatras.flat(2).length
    const position = cursorPosition % compLength

    const nextActiveMatra = {"section": 0, "subsection": 0, "matra": 0}

    let i = 0
    for (let sectionIdx in sections) {
      nextActiveMatra.section = sectionIdx
      for (let subsectionIdx in sections[sectionIdx].subsections) {
        nextActiveMatra.subsection = subsectionIdx
        for (let matraIdx in sections[sectionIdx].subsections[subsectionIdx].matras) {
          nextActiveMatra.matra = matraIdx
          if (i++ == position) break
        }
      }
    }

    setActiveMatra(nextActiveMatra)
  }, [sections, cursorPosition])

  return (
    <div className="composition">
      {sections.map((section, i) => (
        <Section
          key={section.name}
          section={section}
          sectionNr={i}
          isActive={i == activeMatra["section"]}
          activeMatra={activeMatra}
          onMatraInputChange={onMatraInputChange}
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

  useEffect(() => {
    const nextTaal = {sections: taal.sections.slice()}
    if (composition.taal) nextTaal.sections = taals[composition.taal].sections
    setTaal(nextTaal)
  }, [composition])

  function handleMatraChange(dataset, value) {
    const nextComposition = Object.assign({}, composition)
    nextComposition.sections = composition.sections.slice() // still doesn't enough, preserves references
    nextComposition
      .sections[dataset.sectionNr]
      .subsections[dataset.subsectionNr]
      .matras[dataset.matraNr][dataset.type] = value;
    setComposition(nextComposition)
  }

  function loadData() {
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
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={loadData}>Load</button>
      </div>
      <div>
        <h1>{composition.name}</h1>
        <div id="taal">
          <Composition
            sections={taal.sections}
            cursorPosition={count}
            onMatraInputChange={() => {console.log("Taal is not editable")}}
          />
        </div>
        <div id="composition">
          <Composition
            sections={composition.sections}
            cursorPosition={count}
            onMatraInputChange={e => handleMatraChange(e.target.dataset, e.target.value)}
          />
        </div>
      </div>
    </>
  )
}

export default App
