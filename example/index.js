import "../src/styles/index.scss";
import "./index.scss";

import React, { useCallback, useContext } from "react";

import { AwesomePopupContainer } from "../dist";
import ReactDOM from "react-dom";

function App() {
  const { init, destroy } = useContext(AwesomePopupContainer.context);

  const createPopup = useCallback(() => {
    init({ title: "Hello popup", dismiss: false, minWidth: 400 });
  }, []);

  return (
    <div>
      <h2>Awesome popup</h2>
      <button onClick={createPopup}>Click me to create popup</button>
    </div>
  );
}

ReactDOM.render(
  <AwesomePopupContainer rootId="popup-wrapper">
    <App />
  </AwesomePopupContainer>,
  document.getElementById("root")
);
