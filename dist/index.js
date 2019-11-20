"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.AwesomePopupContainer = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _generate = _interopRequireDefault(require("nanoid/generate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SEED = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

var context = _react.default.createContext();

function Provider(_ref) {
  var children = _ref.children,
      rootId = _ref.rootId;

  var _useState = (0, _react.useState)([]),
      popups = _useState[0],
      setPopups = _useState[1];

  var destroy = (0, _react.useCallback)(function (id) {
    setPopups(function (popups) {
      return popups.filter(function (popup) {
        return popup.id !== id;
      });
    });
  }, []);
  var init = (0, _react.useCallback)(function (options) {
    setPopups(function (popups) {
      return popups.concat(_extends({}, options, {
        id: (0, _generate.default)(SEED, 10)
      }));
    });
  }, []);
  console.log("POPUP", popups);
  return _react.default.createElement(context.Provider, {
    value: {
      init: init,
      destroy: destroy,
      popups: popups
    }
  }, children, popups.map(function (popup) {
    return _reactDom.default.createPortal(_react.default.createElement(Popup, _extends({}, popup, {
      onClose: destroy
    }), JSON.stringify(popup)), document.getElementById(rootId));
  }));
}

Provider.context = context;
Provider.propTypes = {
  rootId: _propTypes.default.string.isRequired
};
var AwesomePopupContainer = Provider;
exports.AwesomePopupContainer = AwesomePopupContainer;

function Popup(_ref2) {
  var children = _ref2.children,
      id = _ref2.id,
      onClose = _ref2.onClose;

  var onClick = function onClick() {
    return onClose(id);
  };

  return _react.default.createElement("div", {
    key: id,
    className: "awesome-popup"
  }, children, _react.default.createElement("button", {
    onClick: onClick
  }, "Destroy popup"));
}

var _default = Popup;
exports.default = _default;