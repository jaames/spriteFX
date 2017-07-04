function makeCanvas () {
  return document.createElement("canvas").getContext("2d");
};

var spriteFX = function (image) {
  if (!(this instanceof spriteFX)) return new spriteFX(image);
  this.ctx = makeCanvas();
  this.canvas = this.ctx.canvas;
  this.tempCtx = makeCanvas();
  this.tempCanvas = this.tempCtx.canvas;
  Object.defineProperties(this, {
    width: {
      get: function () {
        return this.canvas.width;
      },
      set: function (value) {
        this.canvas.width = this.tempCanvas.width = value;
      }
    },
    height: {
      get: function () {
        return this.canvas.height;
      },
      set: function (value) {
        this.canvas.height = this.tempCanvas.height = value;
      }
    }
  });
  if (image) this.newImage(image);
};

spriteFX.extend = function (newFns) {
  for (var fnName in newFns) {
    if (newFns.hasOwnProperty(fnName)) {
      this.prototype[fnName] = newFns[fnName];
    }
  }
};

spriteFX.prototype = {
  _clear: function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
  },

  _fill: function (color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  },

  _setOp: function (ctx, optype) {
    ctx.globalCompositeOperation = optype;
  },

  _copyImage: function () {
    this.tempCtx.drawImage(this.canvas, 0, 0);
  },

  _pasteImage: function () {
    this.ctx.drawImage(this.tempCanvas, 0, 0);
  },

  _setSize: function (width, height) {
    this.width  = width;
    this.height = height;
  },

  done: function () {
    this._setOp(this.ctx, "source-over");
    this.image = this.canvas;
    return this;
  },

  newImage: function (image) {
    this.image = image;
    this._setSize(image.naturalWidth, image.naturalHeight);
    this.ctx.drawImage(image, 0, 0);
  },

  scale: function (opts) {
    var newWidth  = opts.width  || this.width  * (opts.height / this.height);
    var newHeight = opts.height || this.height * (opts.width  / this.width);
    this._copyImage();
    this._clear();
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
    this.ctx.drawImage(this.tempCanvas, 0, 0, this.tempCanvas.width, this.tempCanvas.height, 0, 0, newWidth, newHeight);
    this._setSize(newWidth, newHeight);
    return this.done();
  },

  resize: function (opts) {
    return this.scale(opts);
  },

  getImageObject: function (callback, mimetype) {
    var img = new Image();
    img.onload = function () {
      callback(img);
    };
    img.src = this.canvas.toDataURL(mimetype ? mimetype : "image/png");
  },

  translate: function (x, y) {
    this._copyImage();
    this._clear();
    this.ctx.drawImage(this.tempCanvas, x, y);
    return this.done();
  },

  crop: function (x1, y1, x2, y2) {
    var newWidth  = this.width - x1 + x2;
    var newHeight = this.height - y1 + y2;
    this._copyImage();
    this._clear();
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
    this.ctx.drawImage(this.tempCanvas, -x1, -y1);
    this._setSize(newWidth, newHeight);
    return this.done();
  },

  fillFG: function (color) {
    this._setOp(this.ctx, "source-in");
    this._fill(color);
    return this.done();
  },

  fillBG: function (color) {
    this._setOp(this.ctx, "destination-over");
    this._fill(color);
    return this.done();
  },

  applyMask: function (color, operation) {
    this._copyImage();
    this.fillFG(color);
    this._setOp(this.ctx, operation);
    this._pasteImage();
    return this.done();
  },

  alphamap: function () {
    this.fillFG("#fff");
    this.fillBG("#000")
    return this.done();
  },

  lighten: function (value) {
    return this.applyMask("hsla(0, 0%, " + value + "%, 1)", "screen");
  },

  darken: function (value) {
    return this.applyMask("hsla(0, 0%, " + (100 - value) + "%, 1)", "multiply");
  },

  invert: function () {
    return this.applyMask("#fff", "difference");
  },

  tint: function (color) {
    return this.applyMask(color, "multiply");
  },

  multiply: function (color) {
    return this.tint(color);
  },

  screen: function (color) {
    return this.applyMask(color, "screen");
  },

  dropShadow: function (color, xOffset, yOffset) {
    var ctx = this.ctx;
    this._copyImage();
    this._clear();
    ctx.drawImage(this.tempCanvas, xOffset, yOffset);
    this.fillFG(color);
    this._setOp(ctx, "source-over");
    this._pasteImage();
    return this.done();
  },

  custom: function (fn) {
    fn.call(this);
  },
};

module.exports = spriteFX;
