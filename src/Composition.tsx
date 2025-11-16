import { useState, useEffect, createContext, useContext } from 'react'

const PositionContext = createContext(0)
const EditContext = createContext(false)

function Matra({ matra, onMatraSelect }) {
  const position = useContext(PositionContext)
  const editing = useContext(EditContext)
  const matraClasslist = ["matra"]

  if (position == Number(matra.matraNrGlobal)) matraClasslist.push("active")
  return (
    <>
      <div className={matraClasslist.join(" ")} data-matra-nr={matra.matraNrGlobal} onClick={onMatraSelect}>
        <input type="hidden" name="matraNr" value={matra.matraNr} />
        <input type="hidden" name="lineNr" value={matra.lineNr} />
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
      </div>
    </>
  )
}

function Composition({ composition, taalLength, division, globalPosition, playing, onMatraSelect }) {
  const [matras, setMatras] = useState([])
  const [position, setPosition] = useState(0)
  const [taalLengthBeats, setTaalLengthBeats] = useState(0)
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
        newMatra["section"] = line.section
        newMatra["lineNr"] = lineIdx
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

  if (matras.length > 0) return (
    <>
      <PositionContext value={position}>
        {[...Array(Number(Math.trunc(matras.length / taalLengthBeats))).keys()].map(lineIdx => (
          <div key={lineIdx} className="line">
            {matras.slice(lineIdx * taalLengthBeats, (lineIdx + 1) * taalLengthBeats).map((matra, matraIdx) => (
              <Matra
                key={`${lineIdx}-${matraIdx}`}
                matra={matra}
                onMatraSelect={onMatraSelect}
              />
            ))}
          </div>
        ))}
        {matras.length % taalLengthBeats > 0 && (
          <div key="last" className="line">
            {matras.slice(matras.length - (matras.length % taalLengthBeats)).map((matra, matraIdx) => (
              <Matra
                key={`last-${matraIdx}`}
                matra={matra}
                onMatraSelect={onMatraSelect}
              />
            ))}
          </div>
        )}
      </PositionContext>
    </>
  )
  return (
    <div className="empty">Load a composition</div>
  )
}

export { Composition, EditContext }
