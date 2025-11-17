import { useState, useEffect, createContext, useContext } from 'react'

const PositionContext = createContext(0)
const EditContext = createContext(false)

function Composition({ composition, taalLength, division, globalPosition, playing, onMatraSelect, onMatraAdd }) {
  const [matras, setMatras] = useState([])
  const [position, setPosition] = useState(0)
  const [taalLengthBeats, setTaalLengthBeats] = useState(0)
  const [lines, setLines] = useState([])
  const editing = useContext(EditContext)
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
    var matraNr = e.target.dataset.matraNr
    const nextMatras = []

    let newMatra
    let count = 0
    for (let matra of matras) {
      if (count == matraNr) {
        matraNr = -1
      } else {
        newMatra = Object.assign({}, matra)
        newMatra.matraNrGlobal = count++
        nextMatras.push(newMatra)
      }
    }
    setMatras(nextMatras)
  }

  function copyMatra(oldMatra, count, lineNr, matraNr, offset) {
    let defaultSection = "sthayi"
    let newMatra = Object.assign({}, oldMatra)
    newMatra.lineNr = lineNr
    newMatra.matraNr = Number(matraNr) + offset
    newMatra.section = oldMatra.section || defaultSection
    newMatra.matraNrGlobal = count
    return newMatra
  }

  function onMatraAdd(e) {
    const matraNr = e.target.dataset.matraNr
    const nextMatras = []
    const emptyMatra = {syllable: "", sargam: "", bol: ""}
    
    let newMatra
    let count = 0
    let offset = 0
    let newLineNr = 0
    let newMatraNr = 0
    for (let matra of matras) {
      // reset the offset when starting a new line
      if (matra.lineNr != newLineNr) offset = 0
      newLineNr = matra.lineNr

      if (count == matraNr) {
        newMatra = copyMatra(emptyMatra, count++, newLineNr, matra.matraNr, offset++)
        nextMatras.push(newMatra)
      }
      newMatra = copyMatra(matra, count++, newLineNr, matra.matraNr, offset)
      nextMatras.push(newMatra)
    }
    if (matraNr == -1) {
      newMatra = copyMatra(emptyMatra, count++, ++newLineNr, 0, 0)
      nextMatras.push(newMatra)
    }
    setMatras(nextMatras)
  }

  if (matras.length > 0) return (
    <>
      <PositionContext value={position}>
        {lines.map((line, lineIdx) => (
          <Line
            key={lineIdx}
            lineNr={lineIdx}
            matras={line}
            onMatraSelect={onMatraSelect}
            onMatraDelete={onMatraDelete}
            onMatraAdd={onMatraAdd}
          />
        ))}
        <div hidden={!editing}>
          <button
            type="button"
            className="addBtn"
            data-matra-nr="-1"
            onClick={onMatraAdd}
          >append empty matra</button>
        </div>
      </PositionContext>
    </>
  )
  return (
    <div className="empty">Load a composition</div>
  )
}

function Line({ lineNr, matras, onMatraSelect, onMatraDelete, onMatraAdd }) {
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
          <div className="buttons">
            <button
              type="button"
              className="addBtn"
              data-matra-nr={matra.matraNrGlobal}
              onClick={onMatraAdd}
              hidden={!editing}
            >+</button>
            <button
              type="button"
              className="removeBtn"
              data-matra-nr={matra.matraNrGlobal}
              onClick={onMatraDelete}
              hidden={!editing}
            >-</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export { Composition, EditContext }
