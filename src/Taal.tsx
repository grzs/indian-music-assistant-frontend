import { useState, useEffect } from 'react'
import { triggerSound } from './sounds.js'

function getMatraSymbol(angaType, angaNr, matraNr) {
  let symbol = "\xa0"
  if (matraNr == 0) {
    if (angaType == "sam") symbol = "+"
    else if (angaType == "tali") symbol = `${angaNr}`
    else if (angaType == "khali") symbol = "0"
  }
  return symbol
}

function getMatraClass(angaType, matraIdx, position, division, matraCounter) {
  const classlist = ["matra"]
  if (matraIdx == 0) classlist.push(angaType)
  const x = position - matraCounter * division
  if (x >= 0 && x < division) classlist.push("active")
  return classlist.join(" ")
}

function getBeatClass(position, beatIdx) {
  const classlist = ["beat"]
  if (position == beatIdx) classlist.push("active")
  return classlist.join(" ")
}

function Taal({angas, division, taalLength, globalPosition}) {
  const [position, setPosition] = useState(0)

  useEffect(() => {
    setPosition(globalPosition % (taalLength * division))
  }, [taalLength, globalPosition])

  let matraCounter = 0
  let beatCounter = 0
  return (
    <>
      <div className="angas">
        {angas.map((anga, angaIdx) => (
          <div className="anga" key={angaIdx}>
            {anga.matras.map((matra, matraIdx) => (
              <div className="matradiv"
              >
                <div className="symbol">{getMatraSymbol(anga.type, angaIdx, matraIdx)}</div>
                <div
                  className={getMatraClass(anga.type, matraIdx, position, division, matraCounter++)}
                  key={matraIdx}
                  data-matra-nr={matraCounter}
                >
                  <div className="syllable">{matra.syllable}</div>
                  <div className="number">{matraCounter}</div>
                </div>
                <div className="beats">
                  {[...Array(Number(division)).keys()].map((beatIdx) => (
                    <div
                      className={getBeatClass(position,beatCounter++)}
                      key={beatIdx}
                      data-nr={beatIdx}
                      data-matra-nr={matraCounter}
                      data-beat-nr={beatCounter} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

export { Taal }
