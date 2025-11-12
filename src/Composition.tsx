import { useState, useEffect, createContext, useContext } from 'react'

const PositionContext = createContext(0)

function Matra({ matra, onMatraSelect }) {
  const position = useContext(PositionContext)
  const matraClasslist = ["matra"]

  if (position == Number(matra.matraNr)) matraClasslist.push("active")
  return (
    <>
      <div className={matraClasslist.join(" ")} data-matra-nr={matra.matraNr} onClick={onMatraSelect}>
        <div className="syllable" data-matra-nr={matra.matraNr}>{matra.syllable}</div>
        <div className="sargam" data-matra-nr={matra.matraNr}>{matra.sargam}</div>
        <div className="bol" data-matra-nr={matra.matraNr}>{matra.bol}</div>
      </div>
    </>
  )
}

function Composition({ lines, taalLength, division, globalPosition, playing, onMatraSelect, onMatraInputChange }) {
  const [matras, setMatras] = useState([])
  const [position, setPosition] = useState(0)
  const [taalLengthBeats, setTaalLengthBeats] = useState(0)
  // TODO: to state 'linelength', 'linenumbers', 'lastlinestart'

  useEffect(() => {
    setTaalLengthBeats(taalLength * division)
  }, [taalLength, division])

  useEffect(() => {
    const nextMatras = []

    let counter = 0
    for (let lineIdx in lines) {
      let line = lines[lineIdx]
      for (let matra of line.matras) {
        let newMatra = {}
        Object.assign(newMatra, matra)
        newMatra["section"] = line.section
        newMatra["lineNr"] = lineIdx
        newMatra["matraNr"] = counter++
        nextMatras.push(newMatra)
      }
    }
    setMatras(nextMatras)
  }, [lines])

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

export { Composition }
