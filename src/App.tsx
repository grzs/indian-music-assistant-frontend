import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const testData = {
  "slug": "anandi-jagabandi",
  "lines": [
    {
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
      ],
      "section": "sthayi"
    }
  ]
}

function MatraItem({ lineNr, matraNr, itemType, value, onMatraInputChange }) {
  return (
    <div className="matraitem">
      <div>{value}</div>
      <input
        value={value}
        name={`${itemType}-${lineNr}-${matraNr}`}
        data-type={itemType}
        data-matranr={matraNr}
        onChange={onMatraInputChange}
      />
    </div>
  )
}

function Matra({ lineNr, matraNr, values, onMatraInputChange }) {
  return (
    <div className="matra">
      {Object.entries(values).map(([key, value]) => (
        <MatraItem
          lineNr={lineNr}
          matraNr={matraNr}
          key={key}
          itemType={key}
          value={value}
          onMatraInputChange={onMatraInputChange}
        />
      ))}
    </div>
  )
}

function Line({lineNr, matras, onMatraInputChange}) {
  return (
    <div className="line">
      {matras.map((values, i) => (
        <Matra
          key={i}
          lineNr={lineNr}
          matraNr={i}
          values={values}
          onMatraInputChange={onMatraInputChange}
        />
      ))}
    </div>
  )
}

function Composition() {
  const [lines, setLines] = useState(testData.lines)

  function handleChange(itemType, value, matraNr, lineNr) {
    const nextLines = lines.slice();
    nextLines[lineNr].matras[matraNr][itemType] = value;
    setLines(nextLines);
  }

  return (
    <div className="composition">
      {lines.map((line, i) => (
        <Line
          key={i}
          lineNr={i}
          matras={line.matras}
          onMatraInputChange={e => handleChange(e.target.dataset.type, e.target.value, e.target.dataset.matranr, i)}
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
