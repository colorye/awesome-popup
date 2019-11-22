"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AwesomePopupProvider = AwesomePopupProvider;
exports.AwesomePopupContext = exports.AwesomePopupConsumer = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _generate = _interopRequireDefault(require("nanoid/generate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SEED = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function cx() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.reduce(function (res, arg) {
    if (!arg) return res;
    if (["string", "number"].includes(typeof arg)) return res + " " + arg;
    if (Array.isArray(arg) && arg.length > 0) return res + " " + cx(arg);

    if (typeof arg === "object") {
      for (var key in arg) {
        if (!!arg[key]) res = res + " " + key;
      }

      return res;
    }
  }, "").trim();
}

var Context = _react.default.createContext();

function AwesomePopupProvider(_ref) {
  var children = _ref.children,
      containerId = _ref.containerId;
  var rootId = "awesome-popup-wrapper";

  var _useState = (0, _react.useState)([]),
      popups = _useState[0],
      setPopups = _useState[1];

  var create = (0, _react.useCallback)(function (options) {
    var newId = (0, _generate.default)(SEED, 10);
    setPopups(function (popups) {
      return popups.concat(_extends({}, options, {
        id: newId
      }));
    });
    return newId;
  }, []);
  var destroy = (0, _react.useCallback)(function (id, callback) {
    setPopups(function (popups) {
      return popups.filter(function (popup) {
        return popup.id !== id;
      });
    });
    typeof callback === "function" && callback();
  }, []);
  (0, _react.useEffect)(function () {
    (function () {
      var container = containerId ? document.getElementById(containerId) : document.getElementsByTagName("body")[0];
      var root = document.createElement("div");
      root.id = rootId;
      container.appendChild(root);
    })();
  }, []);
  return _react.default.createElement(Context.Provider, {
    value: {
      create: create,
      destroy: destroy
    }
  }, children, popups.map(function (popup) {
    return _reactDom.default.createPortal(_react.default.createElement(Popup, _extends({}, popup, {
      onClose: destroy
    }), JSON.stringify(popup)), document.getElementById(rootId));
  }));
}

var AwesomePopupConsumer = Context.Consumer;
exports.AwesomePopupConsumer = AwesomePopupConsumer;
var AwesomePopupContext = Context;
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

exports.AwesomePopupContext = AwesomePopupContext;

function Popup(props) {
  var _this = this;

  var id = props.id;

  var onClose = function onClose(src) {
    return function () {
      if (!props.dismiss && src === "BACKGROUND") return;
      props.onClose(id, function () {
        if (src === "CONFIRM" && typeof props.onConfirm === "function") props.onConfirm();
        if (src === "CANCEL" && typeof props.onCancel === "function") props.onCancel();
      });
    };
  };

  var style = {
    minWidth: props.minWidth,
    maxWidth: props.maxWidth,
    minHeight: props.minHeight,
    maxHeight: props.maxHeight
  };

  var Header = function () {
    if (props.header === null) return null;
    return _react.default.createElement("div", {
      className: cx("header", props.headerClassName)
    }, props.header, !props.header && _react.default.createElement(_react.default.Fragment, null, props.title, props.closeIcon !== null ? _react.default.createElement("i", {
      className: cx("icon-close", props.closeIcon || "right"),
      onClick: onClose("ICON")
    }) : null));
  }();

  var Footer = function () {
    if (props.footer === null) return null;
    return _react.default.createElement("div", {
      className: cx("footer", props.footerClassName)
    }, props.footer, !props.footer && _react.default.createElement(_react.default.Fragment, null, props.onCancel !== null && _react.default.createElement("button", {
      className: cx("btn btn-cancel", props.cancelClassName),
      onClick: onClose("CANCEL")
    }, props.cancelText || "Cancel"), _react.default.createElement("button", {
      className: cx("btn btn-confirm", props.confirmClassName),
      onClick: onClose("CONFIRM")
    }, props.confirmText || "Confirm")));
  }();

  var renderContent = function renderContent(content, index) {
    if (!content) return null;
    if (Array.isArray(content)) return content.map(_this.renderContent);
    if (_react.default.isValidElement(content)) return content;
    if (typeof content === "function") return content({
      handleClose: onClose
    });
    return _react.default.createElement("p", {
      key: index
    }, content);
  };

  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
    className: "popup-bg",
    onClick: onClose("BACKGROUND")
  }), _react.default.createElement("div", {
    key: id,
    className: cx("awesome-popup", props.className, props.fullscreen && "fullscreen"),
    style: style
  }, Header, _react.default.createElement("div", {
    className: "content"
  }, props.description && _react.default.createElement("p", null, props.description), renderContent(props.content)), Footer));
}

Popup.defaultProps = {
  dismiss: true
};