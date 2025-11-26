import { useState, useEffect, useContext } from 'react';
import { triggerSound, SoundsContextMuteAll } from './sounds';

function getMatraSymbol(angaType, angaNr, matraNr) {
  let symbol = '\xa0';
  if (matraNr == 0) {
    if (angaType == 'sam') symbol = '+';
    else if (angaType == 'tali') symbol = `${angaNr}`;
    else if (angaType == 'khali') symbol = '0';
  }
  return symbol;
}

function getMatraClass(angaType, matraIdx, position, division, matraCounter) {
  const classlist = ['matra'];
  if (matraIdx == 0) classlist.push(angaType);
  const x = position - matraCounter * division;
  if (x >= 0 && x < division) classlist.push('active');
  return classlist.join(' ');
}

function getBeatClass(position, beatIdx) {
  const classlist = ['beat'];
  if (position == beatIdx) classlist.push('active');
  return classlist.join(' ');
}

function getActiveMatra(angas, position, division) {
  if (position % division != 0) return {};
  let matraPosition = position / division;
  for (let anga of angas) {
    for (let matraIdx in anga.matras) {
      if (matraIdx == 0 && matraPosition == 0) {
        const matra = anga.matras[matraIdx];
        matra['type'] = anga.type;
        return matra;
      } else matraPosition--;
    }
  }
  return {};
}

function Taal({
  angas,
  division,
  taalLength,
  globalPosition,
  playing,
  onMatraSelect,
}) {
  const [position, setPosition] = useState(0);
  const [activeMatra, setActiveMatra] = useState({ syllable: '' });
  const muteAll = useContext(SoundsContextMuteAll);

  useEffect(() => {
    setPosition(globalPosition % (taalLength * division));
  }, [taalLength, globalPosition]);

  useEffect(() => {
    const nextActiveMatra = getActiveMatra(angas, position, division);

    // TODO: it should be somewhere else, before any rendering ?
    // TODO: there should be a list of sounds to be played at a matra
    if (!muteAll && playing) {
      triggerSound(nextActiveMatra.type);
      triggerSound('click');
    }

    setActiveMatra(nextActiveMatra);
  }, [angas, division, position]);

  let matraCounter = 0;
  let beatCounter = 0;
  return (
    <>
      <div className="angas">
        {angas.map((anga, angaIdx) => (
          <div className="anga" key={angaIdx}>
            {anga.matras.map((matra, matraIdx) => (
              <div className="matradiv" key={matraIdx}>
                <div
                  className={getMatraClass(
                    anga.type,
                    matraIdx,
                    position,
                    division,
                    matraCounter,
                  )}
                  data-matra-nr={matraCounter}
                  onClick={onMatraSelect}
                >
                  <div className="symbol" data-matra-nr={matraCounter}>
                    {getMatraSymbol(anga.type, angaIdx, matraIdx)}
                  </div>
                  <div className="syllable" data-matra-nr={matraCounter}>
                    {matra.syllable}
                  </div>
                  <div className="number" data-matra-nr={matraCounter}>
                    {matraCounter + 1}
                  </div>
                </div>
                <div className="beats">
                  {[...Array(Number(division)).keys()].map(beatIdx => (
                    <div
                      className={getBeatClass(position, beatCounter)}
                      key={beatIdx}
                      data-nr={beatIdx}
                      data-matra-nr={matraCounter}
                      data-beat-nr={beatCounter++}
                    />
                  ))}
                </div>
                <div hidden data-matra-nr={matraCounter++} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export { Taal };
