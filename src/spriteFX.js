"use strict";

(function (window) {

  var makeCanvas = function () {
    return document.createElement("canvas").getContext("2d");
  }

  var spriteFX = function (image) {
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

  var proto = spriteFX.prototype;

  proto._clear = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
  };

  proto._fill = function (color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  };

  proto._setOp = function (ctx, optype) {
    ctx.globalCompositeOperation = optype;
  };

  proto._saveImage = function () {
    this.tempCtx.drawImage(this.canvas, 0, 0);
  };

  proto._restoreImage = function () {
    this.ctx.drawImage(this.tempCanvas, 0, 0);
  };

  proto._done = function () {
    this._setOp(this.ctx, "source-over");
    this.image = this.canvas;
    return this;
  };

  proto.newImage = function (image) {
    this.image = image;
    this.width  = this.canvas.width  = this.tempCanvas.width  = image.naturalWidth;
    this.height = this.canvas.height = this.tempCanvas.height = image.naturalHeight;
    this.ctx.drawImage(image, 0, 0);
  };

  proto.resize = function (opts) {
    var newWidth  = opts.width  || this.width  * (opts.height / this.height);
    var newHeight = opts.height || this.height * (opts.width  / this.width);
    this._saveImage();
    this._clear();
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
    this.ctx.drawImage(this.tempCanvas, 0, 0, this.tempCanvas.width, this.tempCanvas.height, 0, 0, newWidth, newHeight);
    this.width  = this.tempCanvas.width  = newWidth;
    this.height = this.tempCanvas.height = newHeight;
    return this._done();
  };

  proto.translate = function (x, y) {
    this._saveImage();
    this._clear();
    this.ctx.drawImage(this.tempCanvas, x, y);
    return this._done();
  };

  proto.fillFG = function (color) {
    this._setOp(this.ctx, "source-in");
    this._fill(color);
    return this._done();
  };

  proto.fillBG = function (color) {
    this._setOp(this.ctx, "destination-over");
    this._fill(color);
    return this._done();
  };

  proto.applyMask = function (color, operation) {
    this._saveImage();
    this.fillFG(color);
    this._setOp(this.ctx, operation);
    this._restoreImage();
    return this._done();
  };

  proto.alphamap = function () {
    this.fillFG("#fff");
    this.fillBG("#000")
    return this._done();
  };

  proto.lighten = function (value) {
    return this.applyMask("hsla(0, 0%, " + value + "%, 1)", "screen");
  };

  proto.darken = function (value) {
    return this.applyMask("hsla(0, 0%, " + (100 - value) + "%, 1)", "multiply");
  };

  proto.invert = function () {
    return this.applyMask("#fff", "difference");
  };

  proto.tint = function (color) {
    return this.applyMask(color, "multiply");
  };

  proto.multiply = proto.tint;

  proto.screen = function (color) {
    return this.applyMask(color, "screen");
  };

  proto.dropShadow = function (color, xOffset, yOffset) {
    var ctx = this.ctx;
    this._saveImage();
    this._clear();
    ctx.drawImage(this.tempCanvas, xOffset, yOffset);
    this.fillFG(color);
    this._setOp(ctx, "source-over");
    this._restoreImage();
    // finish
    return this._done();
  };

  proto.custom = function (fn) {
    fn.call(this);
  };

  if ("function" == typeof define && define.amd) {
    // AMD
    define(spriteFX);
  } else if ("object" == typeof exports) {
    // CommonJS
    module.exports = spriteFX;
  } else {
    // browser global
    window.spriteFX = spriteFX;
  }

})(window);
