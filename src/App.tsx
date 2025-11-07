import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const testData = {
  "taal": {
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
  },
  "bandish": {
    "slug": "anandi-jagabandi",
    "name": "Anandi Jagabandi",
    "type": "bandish",
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
        onChange={onMatraInputChange}
      />
    </div>
  )
}

function Matra({ matra, matraNr, subsectionNr, sectionName, sectionNr, onMatraInputChange }) {
  return (
    <div className="matra">
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

function SubSection({ subsection, subsectionNr, sectionName, sectionNr, onMatraInputChange }) {
  return (
    <div className={subsection.type}>
      {subsection.matras.map((matra, i) => (
        <Matra
          key={i}
          matra={matra}
          matraNr={i}
          subsectionNr={subsectionNr}
          sectionName={sectionName}
          sectionNr={sectionNr}
          onMatraInputChange={onMatraInputChange}
        />
      ))}
    </div>
  )
}

function Section({ section, sectionNr, onMatraInputChange }) {
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
          onMatraInputChange={onMatraInputChange}
        />
      ))}
    </div>
  )  
}

function Composition() {
  const [sections, setSections] = useState(testData.bandish.sections)
  const [name, setName] = useState(testData.bandish.name)

  function handleChange(sectionNr, subsectionNr, matraNr, itemType, value) {
    const nextSections = sections.slice();
    nextSections[sectionNr].subsections[subsectionNr].matras[matraNr][itemType] = value;
    setSections(nextSections);
  }

  return (
    <div className="composition">
      <h1>{name}</h1>
      {sections.map((section, i) => (
        <Section
          key={section.name}
          section={section}
          sectionNr={i}
          onMatraInputChange={e => handleChange(
            i,
            e.target.dataset.subsectionNr,
            e.target.dataset.matraNr,
            e.target.dataset.type,
            e.target.value,
          )}
        />
      ))}
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)

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
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      */}
      <div>
        <Composition />
      </div>
    </>
  )
}

export default App
