import { useState, useEffect } from 'react'

// import viteLogo from '/vite.svg'

import { SoundsContextMuteAll } from './sounds.js'

import './App.css'

import { default as testAppState } from './testdata.js'

import { Taal } from './Taal.tsx'
import { Composition, EditContext } from './Composition.tsx'

import { importComposition, exportComposition } from './filesystem.js'
import { APIClient } from './apiClient.tsx'

function getMatrasFlattened(angas) {
  return angas.map(anga => anga.matras.map(matra => matra)).flat(2)
}

function getCss(mainWidth, taalLength, division) {
  return `
#taal .matra {width: ${mainWidth / taalLength}px;}
#taal .beat {width: ${100 / division}%;}
#composition .matra {width: ${(mainWidth / taalLength) / division}px;}
`
}

function App() {
  const [mainWidth, setMainWidth] = useState(1200)
  const [position, setPosition] = useState(-1)
  const [taals, setTaals] = useState(testAppState.taals)
  const [taal, setTaal] = useState({angas: []})
  const [composition, setComposition] = useState({taal: "chau", lines: []}) // TODO: only in DEV
  const [compositionChanged, setCompositionChanged] =useState(false)
  const [editing, setEditing] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [bpm, setBpm] = useState(60)
  const [loop, setLoop] = useState()
  const [taalLength, setTaalLength] = useState(0)
  const [division, setDivision] = useState(1)
  const [muteAll, setMuteAll] = useState(true)
  const [browserHidden, setBrowserHidden] = useState(true)

  useEffect(() => {
    const matrasFlattened = getMatrasFlattened(taal.angas)
    setTaalLength(matrasFlattened.length)
  }, [taal])

  useEffect(() => {
    const nextTaal = {angas: taal.angas.slice()}
    if (composition.taal) nextTaal.angas = taals[composition.taal].angas
    setTaal(nextTaal)
    setBrowserHidden(true)
  }, [composition])

  useEffect(() => {
    const interval = 60000 / bpm / division
    let nextLoop = loop

    if (playing) nextLoop = setInterval(triggerStep, interval)
    else {
      clearInterval(loop)
      nextLoop = undefined
    }

    setLoop(nextLoop)

  }, [playing, bpm, division])

  function triggerStep() {
    setPosition(position => Number(position) + 1)
  }

  function showHideBrowser() {
    setBrowserHidden(!browserHidden)
  }

  function compositionSubmit(formData) {
    const nextComposition = Object.assign({}, composition)
    let matraNr
    let lineNr
    let changed = false
    formData.entries().forEach(([key, value]) => {
      if (key == "matraNr") matraNr = value;
      else if (key == "lineNr") lineNr = value;
      else if (nextComposition.lines[lineNr].matras[matraNr][key] != value) {
        nextComposition.lines[lineNr].matras[matraNr][key] = value
        changed = true
      }
    })
    setComposition(nextComposition)
    changed && setCompositionChanged(true)
    setEditing(editing => !editing)
  }

  function handleMatraSelect(matraPosition) {
    const newPosition = matraPosition * division
    if (newPosition >= 0) setPosition(Number(newPosition))
  }

  function loadTestData() {
    // TODO: implement this function
    const nextComposition = JSON.parse(JSON.stringify(testAppState.bandish))
    setComposition(nextComposition)
    setCompositionChanged(false)
  }

  return (
    <>
      <style href="generated.css">
        {getCss(mainWidth, taalLength, division)}
      </style>
      {/*
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      */}
      <div className="card">
        <button disabled={playing} onClick={showHideBrowser}>{browserHidden ? "open" : "close"} browser</button>
        <button disabled={playing || !compositionChanged} onClick={() => setCompositionChanged(!compositionChanged)}>save</button>
        <button disabled={playing} onClick={() => exportComposition(composition)}>export</button>
        <button disabled={playing} onClick={() => importComposition(setComposition, setCompositionChanged)}>import</button>
        <button onClick={() => setMuteAll(mute => !mute)}>{muteAll ? "sound" : "mute"}</button>
      </div>
      <div className="card" id="counter">player position: {position}</div>
      <div className="card">
        <button onClick={() => setPlaying(playing => !playing)}>{playing ? "stop" : "play"}</button>
        <button onClick={() => {setPosition(-1)}}>rewind</button>
      </div>
      <div className="controls">
        <div id="bpm">{bpm} bpm</div>
        <input
          id="bpmslider"
          type="range"
          min="0" max="300" value={bpm}
          onChange={e => setBpm(e.target.value)}
          disabled={playing}
        />
        <div>
          / <input
              id="divisioninput"
              type="number"
              min="1" max="9" value={division}
              onChange={e => setDivision(e.target.value)}
              disabled={playing}
          />
        </div>
      </div>
      <SoundsContextMuteAll value={muteAll}>
        <div id="main">
          <h2>{composition.name}</h2>
          <div id="edit-buttons">
            <button type="reset" form="compositionForm" disabled={playing} onClick={() => setEditing(editing => !editing)}>
              {editing ? "cancel" : "edit"}
            </button>
            <button type="submit" form="compositionForm" hidden={!editing}>apply</button>
          </div>
          <div id="taal">
            <Taal
              angas={taal.angas}
              division={division}
              taalLength={taalLength}
              globalPosition={position}
              playing={playing}
              onMatraSelect={e => handleMatraSelect(e.target.dataset.matraNr)}
            />
          </div>
          <div id="composition" className={editing ? "editing" : ""}>
            <form id="compositionForm" action={compositionSubmit}>
              <EditContext value={editing}>
                <Composition
                  composition={composition}
                  division={division}
                  taalLength={taalLength}
                  globalPosition={position}
                  playing={playing}
                  onMatraSelect={e => handleMatraSelect(e.target.dataset.matraNr / division)}
                />
              </EditContext>
            </form>
          </div>
        </div>
      </SoundsContextMuteAll>
      <APIClient hidden={browserHidden} onCloseClick={showHideBrowser} responseHandler={setComposition} />
    </>
  )
}

export default App
