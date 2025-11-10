import { useState, useEffect } from 'react'

function MatraItem({ value, itemType, matraNr, subsectionNr, sectionName, sectionNr, matraCounter, onMatraInputChange }) {
  if (itemType == "number") {
    return (
      <div className={itemType} data-matra-nr-global={matraCounter}>{value}</div>
    )
  }
  return (
    <div
      className={itemType}
      data-matra-nr-global={matraCounter}
    >
      <div className="matraitem" data-matra-nr-global={matraCounter}>
        {value}
      </div>
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

function Matra({
  matra,
  matraNr,
  subsectionNr,
  subsectionType,
  sectionName,
  sectionNr,
  matraCounter,
  position,
  onMatraInputChange,
  onMatraSelect
}) {
  matra["number"] = matraCounter + 1

  let classList = ["matra"]
  if (matraNr == 0) {
    classList.push(subsectionType)
    if (subsectionType == "sam") matra["symbol"] = "+"
    else if (subsectionType == "khali") matra["symbol"] = "0"
    else if (subsectionType == "tali") matra["symbol"] = subsectionNr + 1
  } else if (["sam", "tali", "khali"].includes(subsectionType)) matra["symbol"] = "\xa0"

  if (position == matraCounter) classList.push("active")

  const keysOrdered = ["symbol", "syllable", "sargam", "bol", "number"]
  return (
    <div
      data-matra-nr-global={matraCounter}
      onClick={onMatraSelect}
      className={classList.join(" ")}
    >
      {keysOrdered.map(key => (
        <MatraItem
          key={key}
          value={matra[key]}
          itemType={key}
          matraNrGlobal={matraCounter}
          matraNr={matraNr}
          subsectionNr={subsectionNr}
          sectionName={sectionName}
          sectionNr={sectionNr}
          matraCounter={matraCounter}
          onMatraInputChange={onMatraInputChange}
        />
      ))}
    </div>
  )
}

function SubSection({ subsection, subsectionNr, sectionName, sectionNr, matraCounter, position, onMatraInputChange, onMatraSelect }) {
  return (
    <div className={position in matraCounter ? `subsection ${subsection.type} active` : `subsection ${subsection.type}`}>
      {subsection.matras.map((matra, i) => (
        <Matra
          key={i}
          matra={matra}
          matraNr={i}
          subsectionNr={subsectionNr}
          subsectionType={subsection.type}
          sectionName={sectionName}
          sectionNr={sectionNr}
          matraCounter={matraCounter[i]}
          position={position}
          onMatraInputChange={onMatraInputChange}
          onMatraSelect={onMatraSelect}
        />
      ))}
    </div>
  )
}

function Section({ section, sectionNr, matraCounter, position, onMatraInputChange, onMatraSelect }) {
  return (
    <div className="row">
      <h2>{section.name}</h2>
      <div className="section">
        {section.subsections.map((subsection, i) => (
          <SubSection
            key={i}
            subsection={subsection}
            subsectionNr={i}
            sectionName={section.name}
            sectionNr={sectionNr}
            matraCounter={matraCounter[i]}
            position={position}
            onMatraInputChange={onMatraInputChange}
            onMatraSelect={onMatraSelect}
          />
        ))}
      </div>
    </div>
  )  
}

function Composition({ sections, cursorPosition, matraCounter, onMatraInputChange, onMatraSelect }) {
  const [position, setPosition] = useState(0)

  useEffect(() => {
    const compLength = matraCounter.flat(2).length
    const nextPosition = cursorPosition % compLength
    setPosition(nextPosition)
  }, [sections, cursorPosition])

  return (
    <div className="composition">
      {sections.map((section, i) => (
        <Section
          key={section.name}
          section={section}
          sectionNr={i}
          matraCounter={matraCounter[i]}
          position={position}
          onMatraInputChange={onMatraInputChange}
          onMatraSelect={onMatraSelect}
        />
      ))}
    </div>
  )
}

export { Composition }
