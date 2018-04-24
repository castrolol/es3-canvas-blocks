(function(win) {
	function CanvasHandler(element, config) {
		if (config) {
			element.width = config.width;
			element.height = config.height;
		}

		this._element = element;
		this._updating = false;
		this._listeners = {};
		this._size = { width: element.width, height: element.height };
		this._lastUpdateTime = null;
		this._ctx = element.getContext('2d');
		this._mouse = { x: 0, y: 0 };
		element.addEventListener('click', this.handleClick.bind(this));
		element.addEventListener('mousemove', this.handleMouseMove.bind(this));
	}

	CanvasHandler.prototype.resolveContext = function() {
		var deltaTime = new Date() - this._lastUpdateTime;
		this._lastUpdateTime = new Date();

		return {
			size: this._size,
			deltaTime: deltaTime / 1000,
			element: this._element,
			ctx: this._ctx,
			mouse: this._mouse,
			handler: this
		};
	};

	CanvasHandler.prototype.on = function(name, listener) {
		if (name in this._listeners == false) {
			this._listeners[name] = [];
		}
		this._listeners[name].push(listener);
	};

	CanvasHandler.prototype.trigger = function(name, args) {
		if (name in this._listeners) {
			var listeners = this._listeners[name] || [];
			listeners.forEach((listener) => listener.apply(this, args));
		}
	};

	CanvasHandler.prototype._loop = function() {
		if (!this._updating) return;

		var context = this.resolveContext();
		this.clear(context);

		this._ctx.beginPath();

		this.update(context);
		this.draw(context);

		this._ctx.closePath();

		requestAnimationFrame(this._loop.bind(this));
	};

	CanvasHandler.prototype.clear = function(context) {
		context.ctx.clearRect(0, 0, this._size.width, this._size.height);
	};

	CanvasHandler.prototype.update = function(context) {
		this.trigger('update', [ context ]);
	};

	CanvasHandler.prototype.draw = function(context) {
		this.trigger('draw', [ context ]);
	};

	CanvasHandler.prototype.handleClick = function(e) {
		e.stopPropagation();
		e.preventDefault();

		var x = e.offsetX;
		var y = e.offsetY;
		var shift = e.shiftKey;
		var ctrl = e.ctrlKey;
		var alt = e.altKey;

		this.trigger('click', [
			{
				x: x,
				y: y,
				shift: shift,
				ctrl: ctrl,
				alt: alt
			}
		]);
	};

	CanvasHandler.prototype.handleMouseMove = function(e) {
		e.stopPropagation();
		e.preventDefault();

		var x = e.offsetX;
		var y = e.offsetY;
		var shift = e.shiftKey;
		var ctrl = e.ctrlKey;
		var alt = e.altKey;

		this._mouse.x = x;
		this._mouse.y = y;

		// this.trigger('', [
		// 	{
		// 		x: x,
		// 		y: y,
		// 		shift: shift,
		// 		ctrl: ctrl,
		// 		alt: alt
		// 	}
		// ]);
	};

	CanvasHandler.prototype.startUpdate = function() {
		this._lastUpdateTime = new Date();
		this._updating = true;
		this._loop();
	};

	CanvasHandler.prototype.stopUpdate = function() {
		this._updating = false;
	};

	CanvasHandler.prototype.setCursor = function(cursor) {
		this._element.style.cursor = cursor;
	};
	win.CanvasHandler = CanvasHandler;
})(window);
