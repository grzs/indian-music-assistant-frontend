import { useState, useEffect, createContext, useContext } from 'react'
import { triggerSound } from './sounds.js'

const PositionContext = createContext(0)
const CompositionContext = createContext([])

function Matra({
  matra,
  matraNr,
  subsection,
  subsectionNr,
  section,
  sectionNr,
  onMatraInputChange,
  onMatraSelect
}) {
  const position = useContext(PositionContext)
  const compositionCtx = useContext(CompositionContext)
  const matraNrGlobal = compositionCtx[sectionNr][subsectionNr][matraNr].nr

  let classList = ["matra"]

  // set active
  if (position == matraNrGlobal) classList.push("active")

  // taal symbol
  let symbol
  if (["sam", "tali", "khali"].includes(subsection.type)) {
    symbol = "\xa0"
    if (matraNr == 0) {
      classList.push(subsection.type)
      if (subsection.type == "sam") symbol = "+"
      else if (subsection.type == "khali") symbol = "0"
      else if (subsection.type == "tali") symbol = subsectionNr + 1
    }
  }

  // render items in order
  const keysOrdered = ["syllable", "sargam", "bol"]

  // every DIV has data-matra-nr-global attribute, because all of them can receive click, that bubbles
  return (
    <div data-matra-nr-global={matraNrGlobal} className={classList.join(" ")} onClick={onMatraSelect}>
      <div className="matraitem" data-matra-nr-global={matraNrGlobal}>
        <div className="symbol" data-matra-nr-global={matraNrGlobal}>
          {symbol}
        </div>
      </div>
      {keysOrdered.map(key => (
        <div className="matraitem" data-matra-nr-global={matraNrGlobal} key={key}>
          <div className={key} data-matra-nr-global={matraNrGlobal}>
            {matra[key]}
          </div>
          <input
            name={`${section.name}-${subsectionNr}-${matraNr}-${key}`}
            value={matra[key]}
            data-type={key}
            data-matra-nr={matraNr}
            data-subsection-nr={subsectionNr}
            data-section-name={section.name}
            data-section-nr={sectionNr}
            onChange={onMatraInputChange}
          />
        </div>
      ))}
      <div className="matraitem" data-matra-nr-global={matraNrGlobal}>
        <div className="number" data-matra-nr-global={matraNrGlobal}>
          {matraNrGlobal + 1}
        </div>
      </div>
    </div>
  )
}

function Composition({ sections, playerPosition, playing, delay, onMatraInputChange, onMatraSelect }) {
  const [position, setPosition] = useState(0)
  const [delayIdx, setDelayIdx] = useState(0)
  const compositionCtx = useContext(CompositionContext)

  useEffect(() => {
    const cLength = compositionCtx.flat(2).length
    if (playing) {
      if (delayIdx <= 0) setPosition(pos => pos < cLength - 1 ? pos + 1 : 0)
      if (delay > 0)
        if (delayIdx > 0) setDelayIdx(idx => idx - 1)
        else setDelayIdx(delay)
    } else {
      setPosition(playerPosition % cLength)
    }
  }, [sections, playerPosition, delay])

  useEffect(() => {
    // TODO: it should be somewhere else, before any rendering ?
    // TODO: there should be a list of sounds to be played at a matra
    if (playing && position == 0) triggerSound("sam")
  }, [position])

  return (
    <div className="composition">
      <PositionContext value={position}>
        {sections.map((section, i) => (
          <div className="row" key={i}>
            <h2>{section.name}</h2>
            <div className="section">
              {section.subsections.map((subsection, ii) => (
                <div className={`subsection ${subsection.type}`} key={ii}>
                  {subsection.matras.map((matra, iii) => (
                    <Matra
                      key={`${i}-${ii}-${iii}`}
                      matra={matra}
                      matraNr={iii}
                      subsection={subsection}
                      subsectionNr={ii}
                      section={section}
                      sectionNr={i}
                      onMatraInputChange={onMatraInputChange}
                      onMatraSelect={onMatraSelect}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </PositionContext>
    </div>
  )
}

export { CompositionContext, Composition }
