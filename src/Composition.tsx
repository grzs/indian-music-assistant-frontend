import { useState, useEffect, createContext, useContext } from 'react'

const PositionContext = createContext(0)
const EditContext = createContext(false)

function Composition({ composition, taalLength, division, globalPosition, playing, onMatraSelect }) {
  const [matras, setMatras] = useState([])
  const [position, setPosition] = useState(0)
  const [taalLengthBeats, setTaalLengthBeats] = useState(0)
  const [lines, setLines] = useState([])
  // TODO: to state 'linelength', 'linenumbers', 'lastlinestart'

  useEffect(() => {
    setTaalLengthBeats(taalLength * division)
  }, [taalLength, division])

  useEffect(() => {
    const nextMatras = []
    const lines = composition.lines

    let counter = 0
    for (let lineIdx in lines) {
      let line = lines[lineIdx]
      for (let matraIdx in line.matras) {
        let newMatra = {}
        Object.assign(newMatra, line.matras[matraIdx])
        newMatra["lineNr"] = lineIdx
        newMatra["section"] = line.section
        newMatra["matraNr"] = matraIdx
        newMatra["matraNrGlobal"] = counter++
        nextMatras.push(newMatra)
      }
    }
    setMatras(nextMatras)
  }, [composition])

  useEffect(() => {
    setPosition(globalPosition % matras.length)
  }, [globalPosition, matras])

  useEffect(() => {
    const nextLines = []

    let line = []
    let matraCounter = 0
    let lineCounter = 0
    for (let matra of matras) {
      if (matraCounter == 0) nextLines.push([])
      nextLines[lineCounter].push(matra)
      if (++matraCounter >= taalLengthBeats) {
        matraCounter = 0
        lineCounter++
      }
    }
    setLines(nextLines)
  }, [taalLengthBeats, matras])

  function onMatraDelete(e) {
    const matraNr = e.target.dataset.matraNr
    const nextMatras = []

    let newMatra
    let count = 0
    for (let matra of matras) {
      if (count != matraNr) {
        newMatra = Object.assign({}, matra)
        newMatra.matraNrGlobal = count
        nextMatras.push(newMatra)
      }
      count++
    }
    setMatras(nextMatras)
  }

  if (matras.length > 0) return (
    <>
      <PositionContext value={position}>
        {lines.map((line, lineIdx) => (
          <Line
            key={lineIdx}
            matras={line}
            onMatraSelect={onMatraSelect}
            onMatraDelete={onMatraDelete}
          />
        ))}
      </PositionContext>
    </>
  )
  return (
    <div className="empty">Load a composition</div>
  )
}

function Line({ matras, onMatraSelect, onMatraDelete }) {
  const position = useContext(PositionContext)
  const editing = useContext(EditContext)
  return (
    <div className="line">
      {matras.map((matra, matraIdx) => (
        <div
          key={matraIdx}
          className={position == Number(matra.matraNrGlobal) ? "matra active" : "matra"}
          data-matra-nr={matra.matraNrGlobal}
          onClick={onMatraSelect}
        >
          <input type="hidden" name="lineNr" value={matra.lineNr} />
          <input type="hidden" name="section" value={matra.section} />
          <input type="hidden" name="matraNr" value={matra.matraNr} />
          <input
            className="syllable"
            data-matra-nr={matra.matraNrGlobal}
            name="syllable"
            defaultValue={matra.syllable}
            readOnly={!editing}
          />
          <input
            className="sargam"
            data-matra-nr={matra.matraNrGlobal}
            name="sargam"
            defaultValue={matra.sargam}
            readOnly={!editing}
          />
          <input
            className="bol"
            data-matra-nr={matra.matraNrGlobal}
            name="bol"
            defaultValue={matra.bol}
            readOnly={!editing}
          />
          <button type="button"
            hidden={!editing}
            data-matra-nr={matra.matraNrGlobal}
            onClick={onMatraDelete}
          >
            X
          </button>
        </div>
      ))}
    </div>
  )
}

export { Composition, EditContext }
