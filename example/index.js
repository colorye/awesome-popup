import React, { useCallback, useContext } from "react";
import ReactDOM from "react-dom";

import { AwesomePopupContainer } from "../dist";

function App() {
  const { init, destroy } = useContext(AwesomePopupContainer.context);

  const createPopup = useCallback(() => {
    init({ title: "Hello popup" });
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
