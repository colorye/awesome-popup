import "../src/styles/index.scss";
import "./index.scss";

import React, { useCallback, useContext } from "react";

import { AwesomePopupContext, AwesomePopupProvider } from "../dist";
import ReactDOM from "react-dom";

function App() {
  const { create, destroy } = useContext(AwesomePopupContext);

  const createPopup = useCallback(() => {
    create({ title: "Hello popup", dismiss: false, minWidth: 400 });
  }, []);

  return (
    <div>
      <h2>Awesome popup</h2>
      <button onClick={createPopup}>Click me to create popup</button>
    </div>
  );
}

ReactDOM.render(
  <AwesomePopupProvider>
    <App />
  </AwesomePopupProvider>,
  document.getElementById("root")
);
