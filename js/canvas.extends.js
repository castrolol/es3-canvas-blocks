CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
  }

  CanvasRenderingContext2D.prototype.roundSquare = function (x, y, x2, y2, r) {
    // if (w < 2 * r) r = w / 2;
    // if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x2, y,   x2, y2, r);
    this.arcTo(x2, y2, x,   y2, r);
    this.arcTo(x,   y2, x,   y,   r);
    this.arcTo(x,   y,   x2, y,   r);
    this.closePath();
    return this;
  }

  window.rad2deg = function(rad){
      return rad * 57.29577951308232 ;
  }