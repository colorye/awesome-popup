import React, { useCallback, useState, useRef } from "react";

import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import nanoId from "nanoid/generate";

const SEED = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const context = React.createContext();

function Provider({ children, rootId }) {
  const [popups, setPopups] = useState([]);
  const destroy = useCallback(id => {
    setPopups(popups => popups.filter(popup => popup.id !== id));
  }, []);
  const init = useCallback(options => {
    setPopups(popups => popups.concat({ ...options, id: nanoId(SEED, 10) }));
  }, []);

  console.log("POPUP", popups);
  return (
    <context.Provider value={{ init, destroy, popups }}>
      {children}
      {popups.map(popup =>
        ReactDOM.createPortal(
          <Popup {...popup} onClose={destroy}>
            {JSON.stringify(popup)}
          </Popup>,
          document.getElementById(rootId)
        )
      )}
    </context.Provider>
  );
}
Provider.context = context;
Provider.propTypes = {
  rootId: PropTypes.string.isRequired
};

export const AwesomePopupContainer = Provider;

function Popup({ children, id, onClose }) {
  const onClick = () => onClose(id);
  return (
    <div key={id} className="awesome-popup">
      {children}
      <button onClick={onClick}>Destroy popup</button>
    </div>
  );
}

export default Popup;
