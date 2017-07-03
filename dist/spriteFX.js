/*!
 * spriteFX
 * --------
 * Github: github.com/jaames/spriteFX
 * Author: James Daniel (github.com/jaames | rakujira.jp)
 * Last updated: Mon Jul 03 2017
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["spriteFX"] = factory();
	else
		root["spriteFX"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/test";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (window) {

  function makeCanvas() {
    return document.createElement("canvas").getContext("2d");
  };

  var spriteFX = function spriteFX(image) {
    if (!(this instanceof spriteFX)) return new spriteFX(image);
    this.ctx = makeCanvas();
    this.canvas = this.ctx.canvas;
    this.tempCtx = makeCanvas();
    this.tempCanvas = this.tempCtx.canvas;
    if (image) this.newImage(image);
  };

  spriteFX.extend = function (name, fn) {
    this.prototype[name] = fn;
  };

  spriteFX.prototype = {
    _clear: function _clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    },

    _fill: function _fill(color) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(0, 0, this.width, this.height);
    },

    _setOp: function _setOp(ctx, optype) {
      ctx.globalCompositeOperation = optype;
    },

    _copyImage: function _copyImage() {
      this.tempCtx.drawImage(this.canvas, 0, 0);
    },

    _pasteImage: function _pasteImage() {
      this.ctx.drawImage(this.tempCanvas, 0, 0);
    },

    _setSize: function _setSize(width, height) {
      this.width = this.canvas.width = this.tempCanvas.width = width;
      this.height = this.canvas.height = this.tempCanvas.height = height;
    },

    _done: function _done() {
      this._setOp(this.ctx, "source-over");
      this.image = this.canvas;
      return this;
    },

    newImage: function newImage(image) {
      this.image = image;
      this._setSize(image.naturalWidth, image.naturalHeight);
      this.ctx.drawImage(image, 0, 0);
    },

    scale: function scale(opts) {
      var newWidth = opts.width || this.width * (opts.height / this.height);
      var newHeight = opts.height || this.height * (opts.width / this.width);
      this._copyImage();
      this._clear();
      this.canvas.width = newWidth;
      this.canvas.height = newHeight;
      this.ctx.drawImage(this.tempCanvas, 0, 0, this.tempCanvas.width, this.tempCanvas.height, 0, 0, newWidth, newHeight);
      this._setSize(newWidth, newHeight);
      return this._done();
    },

    resize: function resize(opts) {
      return this.scale(opts);
    },

    getImageObject: function getImageObject(callback, mimetype) {
      var img = new Image();
      img.onload = function () {
        callback(img);
      };
      img.src = this.canvas.toDataURL(mimetype ? mimetype : "image/png");
    },

    translate: function translate(x, y) {
      this._copyImage();
      this._clear();
      this.ctx.drawImage(this.tempCanvas, x, y);
      return this._done();
    },

    crop: function crop(x1, y1, x2, y2) {
      var newWidth = this.width - x1 + x2;
      var newHeight = this.height - y1 + y2;
      this._copyImage();
      this._clear();
      this.canvas.width = newWidth;
      this.canvas.height = newHeight;
      this.ctx.drawImage(this.tempCanvas, -x1, -y1);
      this._setSize(newWidth, newHeight);
      return this._done();
    },

    fillFG: function fillFG(color) {
      this._setOp(this.ctx, "source-in");
      this._fill(color);
      return this._done();
    },

    fillBG: function fillBG(color) {
      this._setOp(this.ctx, "destination-over");
      this._fill(color);
      return this._done();
    },

    applyMask: function applyMask(color, operation) {
      this._copyImage();
      this.fillFG(color);
      this._setOp(this.ctx, operation);
      this._pasteImage();
      return this._done();
    },

    alphamap: function alphamap() {
      this.fillFG("#fff");
      this.fillBG("#000");
      return this._done();
    },

    lighten: function lighten(value) {
      return this.applyMask("hsla(0, 0%, " + value + "%, 1)", "screen");
    },

    darken: function darken(value) {
      return this.applyMask("hsla(0, 0%, " + (100 - value) + "%, 1)", "multiply");
    },

    invert: function invert() {
      return this.applyMask("#fff", "difference");
    },

    tint: function tint(color) {
      return this.applyMask(color, "multiply");
    },

    multiply: function multiply(color) {
      return this.tint(color);
    },

    screen: function screen(color) {
      return this.applyMask(color, "screen");
    },

    dropShadow: function dropShadow(color, xOffset, yOffset) {
      var ctx = this.ctx;
      this._copyImage();
      this._clear();
      ctx.drawImage(this.tempCanvas, xOffset, yOffset);
      this.fillFG(color);
      this._setOp(ctx, "source-over");
      this._pasteImage();
      return this._done();
    },

    custom: function custom(fn) {
      fn.call(this);
    }
  };

  if (true) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (spriteFX),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ("object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports))) {
    // CommonJS
    module.exports = spriteFX;
  } else {
    // browser global
    window.spriteFX = spriteFX;
  }
})(window);

/***/ })
/******/ ]);
});
//# sourceMappingURL=spriteFX.js.map