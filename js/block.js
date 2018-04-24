(function(win) {
	function deg2rad(deg) {
		return deg * 0.017453292519943295;
	}

	function applyRotation(pos, center, rotate) {
		var angle = deg2rad(rotate);
		var x = pos.x - center.x;
		var y = pos.y - center.y;

		return {
			x: x * Math.cos(angle) - y * Math.sin(angle) + center.x,
			y: x * Math.sin(angle) + y * Math.cos(angle) + center.y
		};
	}

	function Block(position, size) {
		this.x = position.x;
		this.y = position.y;
		this.width = size.width;
		this.height = size.height;

		this.rotation = 0;
	}

	Block.prototype.getBounds = function() {
		var left = this.x;
		var right = this.x + this.width;
		var top = this.y;
		var bottom = this.y + this.height;
		var centerX = this.x + this.width / 2;
		var centerY = this.y + this.height / 2;
		var center = { x: centerX, y: centerY };
		return {
			top: applyRotation({ x: centerX, y: top }, center, this.rotation),
			topRight: applyRotation({ x: right, y: top }, center, this.rotation),
			right: applyRotation({ x: right, y: centerY }, center, this.rotation),
			bottomRight: applyRotation({ x: right, y: bottom }, center, this.rotation),
			bottom: applyRotation({ x: centerX, y: bottom }, center, this.rotation),
			bottomLeft: applyRotation({ x: left, y: bottom }, center, this.rotation),
			left: applyRotation({ x: left, y: centerY }, center, this.rotation),
			topLeft: applyRotation({ x: left, y: top }, center, this.rotation),
			upperTopCenter: applyRotation({ x: centerX, y: top - 20 }, center, this.rotation)
		};
	};

	Block.prototype.pointIn = function(x, y) {
		var centerX = this.x + this.width / 2;
		var centerY = this.y + this.height / 2;
		var center = { x: centerX, y: centerY };

		var left = this.x;
		var right = this.x + this.width;
		var top = this.y;
		var bottom = this.y + this.height;

		var topLeft = applyRotation({ x: left, y: top }, center, this.rotation);
		var bottomLeft = applyRotation({ x: left, y: bottom }, center, this.rotation);
		var bottomRight = applyRotation({ x: right, y: bottom }, center, this.rotation);
		var topRight = applyRotation({ x: right, y: top }, center, this.rotation);

		var mbr = {
			x1: Math.min(topLeft.x, bottomLeft.x, topRight.x, bottomRight.x),
			y1: Math.min(topLeft.y, bottomLeft.y, topRight.y, bottomRight.y),
			x2: Math.max(topLeft.x, bottomLeft.x, topRight.x, bottomRight.x),
			y2: Math.max(topLeft.y, bottomLeft.y, topRight.y, bottomRight.y)
		};

		var ctx = canvasHandler._ctx;

		if (ctx) {
			ctx.beginPath();
			ctx.lineWidth = 5;
			ctx.fillStyle = 'red';
			// ctx.moveTo(mbr.x1, mbr.y1);
			// ctx.lineTo(mbr.x1, mbr.y2);
			// ctx.lineTo(mbr.x2, mbr.y1);
			// ctx.lineTo(mbr.x2, mbr.y2);
			// ctx.lineTo(mbr.x1, mbr.y1);

			ctx.moveTo(topLeft.x, topLeft.y);
			ctx.lineTo(topRight.x, topRight.y);
			ctx.lineTo(bottomRight.x, bottomRight.y);
			ctx.lineTo(bottomLeft.x, bottomLeft.y);
			ctx.lineTo(topLeft.x, topLeft.y);

			ctx.fill();
			ctx.closePath();
		}

		if (x > left && x < right) {
			if (y > top && y < bottom) {
				return true;
			}
		}

		return false;
	};

	Block.prototype.getCenter = function() {
		var centerX = this.x + this.width / 2;
		var centerY = this.y + this.height / 2;
		return { x: centerX, y: centerY };
	};

	win.Block = Block;
})(window);
