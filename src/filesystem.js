const filePickerOpts = {
  types: [
    {
      description: 'Text file',
      accept: { 'text/plain': ['.json'] },
    },
  ],
};

function importComposition(importHandler, setChanged) {
  const reader = new FileReader();
  reader.onload = () => {
    importHandler(JSON.parse(reader.result));
    setChanged(false);
  };

  window
    .showOpenFilePicker(filePickerOpts)
    .then(fileHandles => fileHandles[0].getFile())
    .then(f => reader.readAsText(f));
}

async function exportComposition(composition) {
  const writable = await window
    .showSaveFilePicker(filePickerOpts)
    .then(fileHandle => fileHandle.createWritable());

  await writable.write(JSON.stringify(composition)).then(writable.close());
}

export { importComposition, exportComposition };
