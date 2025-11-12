import { useState, useEffect, createContext, useContext } from 'react'
import { triggerSound } from './sounds.js'

const PositionContext = createContext(0)
const CompositionContext = createContext([])
const SectionContext = createContext({nr: 0, name: ""})
const SubSectionContext = createContext({nr: 0, type: ""})

function MatraItem({ value, itemType, matraNr, matraNrGlobal, onMatraInputChange }) {
  const section = useContext(SectionContext)
  const subsection = useContext(SubSectionContext)

  if (itemType == "number") {
    return (
      <div className={itemType} data-matra-nr-global={matraNrGlobal}>{matraNrGlobal + 1}</div>
    )
  }
  return (
    <div
      className={itemType}
      data-matra-nr-global={matraNrGlobal}
    >
      <div className="matraitem" data-matra-nr-global={matraNrGlobal}>
        {value}
      </div>
      <input
        name={`${section.name}-${subsection.nr}-${matraNr}-${itemType}`}
        value={value}
        data-type={itemType}
        data-matra-nr={matraNr}
        data-subsection-nr={subsection.nr}
        data-section-name={section.name}
        data-section-nr={section.nr}
        onChange={onMatraInputChange}
      />
    </div>
  )
}

function Matra({matra, matraNr, onMatraInputChange, onMatraSelect}) {
  const section = useContext(SectionContext)
  const subsection = useContext(SubSectionContext)
  const position = useContext(PositionContext)
  const compositionCtx = useContext(CompositionContext)
  const matraCtx = compositionCtx[section.nr][subsection.nr][matraNr]

  let classList = ["matra"]
  let symbol
  if (["sam", "tali", "khali"].includes(subsection.type)) {
    symbol = "\xa0"
    if (matraNr == 0) {
      classList.push(subsection.type)
      if (subsection.type == "sam") symbol = "+"
      else if (subsection.type == "khali") symbol = "0"
      else if (subsection.type == "tali") symbol = subsection.nr + 1
    }
  }

  if (position == matraCtx.nr) classList.push("active")

  const keysOrdered = ["syllable", "sargam", "bol"]
  return (
    <div
      data-matra-nr-global={matraCtx.nr}
      onClick={onMatraSelect}
      className={classList.join(" ")}
    >
      {symbol != undefined && <MatraItem value={symbol} itemType="symbol" />}
      {keysOrdered.map(key => (
        <MatraItem
          key={key}
          value={matra[key]}
          itemType={key}
          matraNr={matraNr}
          matraNrGlobal={matraCtx.nr}
          onMatraInputChange={onMatraInputChange}
        />
      ))}
      <MatraItem value={matraCtx.nr} itemType="number" matraNrGlobal={matraCtx.nr} />
    </div>
  )
}

function SubSection({ subsection, onMatraInputChange, onMatraSelect }) {
  return (
    <div className={`subsection ${subsection.type}`}>
      {subsection.matras.map((matra, i) => (
        <Matra
          key={i}
          matra={matra}
          matraNr={i}
          onMatraInputChange={onMatraInputChange}
          onMatraSelect={onMatraSelect}
        />
      ))}
    </div>
  )
}

function Section({ section, onMatraInputChange, onMatraSelect }) {
  return (
    <div className="row">
      <h2>{section.name}</h2>
      <div className="section">
        {section.subsections.map((subsection, i) => (
          <SubSectionContext key={i} value={{nr: i, type: subsection.type}}>
            <SubSection
              key={i}
              subsection={subsection}
              onMatraInputChange={onMatraInputChange}
              onMatraSelect={onMatraSelect}
            />
          </SubSectionContext>
        ))}
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
    if (playing && position == 0) triggerSound("chime")
  }, [position])

  return (
    <div className="composition">
      <PositionContext value={position}>
        {sections.map((section, i) => (
          <SectionContext key={i} value={{nr: i, name: section.name}}>
            <Section
              key={section.name}
              section={section}
              onMatraInputChange={onMatraInputChange}
              onMatraSelect={onMatraSelect}
            />
          </SectionContext>
        ))}
      </PositionContext>
    </div>
  )
}

export { CompositionContext, Composition }
