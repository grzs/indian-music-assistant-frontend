import { useState } from 'react'
import './Browser.css'

function fetchComposition(baseUrl, apiVersion, slug, responseHandler) {
  let url = [baseUrl, "api", apiVersion, "compositions", slug].join("/");

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      let compositionData = JSON.parse(text);
      responseHandler(compositionData);
    })
    .catch((error) => {
      window.alert(`Could not fetch composition: ${error}`);
    });
}

function updateComposition(baseUrl, apiVersion, data) {
  let url = [baseUrl, "api", apiVersion, "compositions", data["slug"]].join("/");

  fetch(url, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response;
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      window.alert(`Could not update composition: ${error}`);
    });
}

function APIClient({ hidden, onCloseClick, responseHandler }) {
  const [apiVersion, setApiVersion] = useState("v1")
  const [baseUrl, setBaseUrl] = useState("http://localhost:8000")
  const [compSlug, setCompSlug] = useState("default")
  const [compositions, setCompositions] = useState([{slug: "anandi-jagabandi", name: "Anandi Jagabandi"}])

  return (
    <>
      <div id="browser" hidden={hidden}>
        <div className="browser">
          <select defaultValue={compSlug} onChange={e => setCompSlug(e.target.value)}>
            <option value="default">-- select a composition --</option>
            {compositions.map((comp, i) => (
              <option key={i} value={comp.slug}>{comp.name}</option>
            ))}
          </select>
          <button
            disabled={compSlug == "default"}
            onClick={() => fetchComposition(baseUrl, apiVersion, compSlug, responseHandler)}
          >
            load
          </button>
          <button disabled={hidden} onClick={onCloseClick}>close browser</button>
        </div>
      </div>
    </>
  )
}

export { APIClient }
