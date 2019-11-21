import React, { useCallback, useState, useEffect } from "react";

import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import nanoId from "nanoid/generate";

const SEED = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function cx(...args) {
  return args
    .reduce((res, arg) => {
      if (!arg) return res;
      if (["string", "number"].includes(typeof arg)) return `${res} ${arg}`;
      if (Array.isArray(arg) && arg.length > 0) return `${res} ${cx(arg)}`;
      if (typeof arg === "object") {
        for (const key in arg) {
          if (!!arg[key]) res = `${res} ${key}`;
        }
        return res;
      }
    }, "")
    .trim();
}

const context = React.createContext();

function Provider({ children }) {
  const rootId = "awesome-popup-wrapper";
  const [popups, setPopups] = useState([]);
  const destroy = useCallback(id => {
    setPopups(popups => popups.filter(popup => popup.id !== id));
  }, []);
  const init = useCallback(options => {
    setPopups(popups => popups.concat({ ...options, id: nanoId(SEED, 10) }));
  }, []);

  useEffect(() => {
    (() => {
      let root = document.getElementById(rootId);
      if (!!root) return;

      const body = document.getElementsByTagName("body")[0];
      root = document.createElement("div");
      root.id = rootId;
      body.insertBefore(root, body.firstChild);
    })();
  }, []);

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

export const AwesomePopupContainer = Provider;

/**
 * header: header / title, closeIcon. header will override all
 * content: description, content (function will have onClose as props)
 * footer: footer / confirmText, cancelText. footer will override all
 *
 * fullscreen, dismiss
 * className, headerClassName, footerClassName
 * confirmClassName, cancelClassName
 * onConfirm, onCancel
 *
 * await (wait for callback result)
 */

function Popup(props) {
  const { id } = props;
  const onClose = src => () => {
    if (!props.dismiss && src === "BACKGROUND") return;
    props.onClose(id);
  };

  const style = {
    minWidth: props.minWidth,
    maxWidth: props.maxWidth
  };

  const Header = (() => {
    if (props.header === null) return null;
    return (
      <div className={cx("header", props.headerClassName)}>
        {props.header}
        {!props.header && (
          <>
            {props.title}
            {props.closeIcon !== null ? (
              <i
                className={cx("icon-close", props.closeIcon || "right")}
                onClick={onClose("ICON")}
              />
            ) : null}
          </>
        )}
      </div>
    );
  })();

  const Footer = (() => {
    if (props.footer === null) return null;
    return (
      <div className={cx("footer", props.footerClassName)}>
        {props.footer}
        {!props.footer && (
          <>
            {props.onCancel && (
              <button
                className={cx("btn btn-cancel", props.cancelClassName)}
                onClick={onClose("CANCEL")}
              >
                {props.cancelText || "Cancel"}
              </button>
            )}
            <button
              className={cx("btn btn-confirm", props.confirmClassName)}
              onClick={onClose("CONFIRM")}
            >
              {props.confirmText || "Confirm"}
            </button>
          </>
        )}
      </div>
    );
  })();

  const renderContent = (content, index) => {
    if (!content) return null;
    if (Array.isArray(content)) return content.map(this.renderContent);
    if (React.isValidElement(content)) return content;
    if (typeof content === "function") return content({ handleClose: onClose });
    return <p key={index}>{content}</p>;
  };

  return (
    <>
      <div className="popup-bg" onClick={onClose("BACKGROUND")} />
      <div
        key={id}
        className={cx(
          "awesome-popup",
          props.className,
          props.fullscreen && "fullscreen"
        )}
        style={style}
      >
        {Header}
        <div className="content">
          {props.description && <p>{props.description}</p>}
          {renderContent(props.content)}
        </div>
        {Footer}
      </div>
    </>
  );
}
Popup.defaultProps = {
  dismiss: true
};

export default Popup;
