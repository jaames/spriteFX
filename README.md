# Features

* GPU Acceleration - spriteFX uses [composite operations](//developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation), which are hardware accelerated -- making it *much* faster than manual pixel manipulation techniques!

* Lightweight - the minified version of spriteFX weighs in at under 3kb (or under 1kb when gzipped).

* Simple - spriteFX's image operations preserve the image's transparency channel for you.

* Support for AMD and CommonJS module loaders.

# Documentation

## Contents

* [Getting Started](#getting-started)

* [Applying Effects](#applying-effects)

* [Chaining](#chaining)

* [Using the Result](#using-the-result)

* [Image Operations](#image-opperations)

    * [translate](#translate)

    * [resize](#resize)

    * [lighten](#lighten)

    * [darken](#darken)

    * [invert](#invert)

    * [multiply](#multiply)

    * [screen](#screen)

    * [dropShadow](#dropShadow)

    * [fillFG](#fillFG)

    * [fillBG](#fillBG)

    * [alphamap](#alphamap)

## Getting started

First, [download spriteFX.min.js](//raw.githubusercontent.com/jaames/spriteFX/master/dist/spriteFX.min.js), then include it into the `<head>` of your document with a `<script>` tag:

```html
<!-- ... -->
<head>
  <!-- ... -->
  <script src="path/to/spriteFX.min.js"></script>
</head>
<!-- ... -->
```

Next, the source image needs to be loaded as an [`Image` object](//developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image) before loading it with spriteFX:

```javascript
// create a new image object
var img = new Image();

// set up a callback function that gets called once the image has loaded
img.onload = function () {
  // once the image has loaded, "open" it into a spriteFX instance
  var fx = new spriteFX(img);
};

// load an image file from a URL
img.src = "path/to/image.png";
```
*Note: with spriteFX the `new` keyword is entirely optional, it's up to you to decide which way suits your needs more*

## Applying Effects

After the image has been opened with spriteFX we can apply various image operations to it:

```javascript
var img = new Image();

img.onload = function () {

  var fx = new spriteFX(img);
  // lighten the image by 50%
  fx.lighten(50);
  // then invert the image
  fx.invert();
  // then add a red tint
  fx.multiply("rgb(255, 0, 0)");

};

img.src = "path/to/image.png";
```

See the [Image Operations](#image-opperations) section for a full list of available image operations.

## Chaining

spriteFX supports method chaining, in a similar manner to libraries like jQuery or Underscore, if that's your sort of thing. The code below procudes the same result as the code above, but uses chaining instead:

```javascript
var img = new Image();

img.onload = function () {

  var fx = new spriteFX(img);
    .lighten(50)
    .invert()
    .multiply("rgb(255, 0, 0)");

};

img.src = "path/to/image.png";
```

## Using the Result

After the effects have been applied the result can be accessed from the `image` property. Note that **this actually returns a canvas object rather than an image object** for better speed and memory performance.

The [`CanvasRenderingContext2D.drawImage()`](//developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D/drawImage) method works with both canvas and image elements, so you can still draw the result onto your main canvas as you would with an image:

```javascript
var img = new Image();

img.onload = function () {

  var fx = new spriteFX(img);
  fx.lighten(50);
  fx.invert();
  fx.multiply("rgb(255, 0, 0)");

  // get the final result image
  var result = fx.image;

  // draw the result image to a canvas
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.drawImage(result, 0, 0);

};

img.src = "path/to/image.png";
```

## Image Operations

### translate

**Use:**

Reposition the current image content.

**Example:**

```javascript
var fx = new spriteFX(img);
// move the content 10 pixels on the x axis and -6 pixels on the y axis
fx.translate(10, -6)
```

### resize

**Use:**

Resize the current image content.

**Example:**

```javascript
var fx = new spriteFX(img);

// resize the image to be 16 x 16 pixels
fx.resize({width: 16, height: 16});

// or you can specify either width or height only, and the aspect ratio will be maintained!
fx.resize({width: 12});
```

### lighten

**Use:**

Lighten the image by a percentage value (where 100% equals pure white).

**Example:**

```javascript
var fx = new spriteFX(img);

// make the image 50% lighter
fx.lighten(50);
```

### darken

**Use:**

Darken the image by a percentage value (where 100% equals pure black).

**Example:**

```javascript
var fx = new spriteFX(img);

// make the image 50% darker
fx.darken(50);
```

### invert

**Use:**

Invert the image colors.

**Example:**

```javascript
var fx = new spriteFX(img);

fx.invert();
```

### multiply

**Use:**

Multiply each pixel of the image by a color value to produce a darker, color-tinted image.

**Example:**

```javascript
var fx = new spriteFX(img);

fx.multiply("rgb(255, 0, 0)");
```

### screen

**Use:**

Similar to multiply, but pixels are inverted before and after being multiplied, producing a lighter color-tinted image.

**Example:**

```javascript
var fx = new spriteFX(img);

fx.screen("rgb(255, 0, 0)");
```

### dropShadow

**Use:**

Add a [drop-shadow](https://en.wikipedia.org/wiki/Drop_shadow) to the image.

**Example:**

```javascript
var fx = new spriteFX(img);

// add a green drop-shadow to the image extends 6 pixels along the y axis and 1 pixel along the x axis
fx.dropShadow("rgb(0, 255, 0)", 6, 1);
```

### fillFG

**Use:**

Change the color of all the non-transparent pixels in the image.

**Example:**

```javascript
var fx = new spriteFX(img);

// make the non-transparent pixels blue
fx.fillBG("rgb(0, 0, 255)");
```

### fillBG

**Use:**

Change the color of all the transparent pixels in the image.

**Example:**

```javascript
var fx = new spriteFX(img);

// fill the transparent pixels with black
fx.fillBG("rgb(0, 0, 0)");
```

### alphamap

**Use:**

Creates an [alpha map](https://en.wikipedia.org/wiki/Alpha_mapping) -- a grayscale image where lighter values represent less transparency and darker values represent more transparency.

**Example:**

```javascript
var fx = new spriteFX(img);

fx.alphamap();
```
