(function(win) {
	function Block(position, size) {
		this.x = position.x;
		this.y = position.y;
		this.width = size.width;
		this.height = size.height;
	}

	Block.prototype.getBounds = function() {
		var left = this.x;
		var right = this.x + this.width;
		var top = this.y;
		var bottom = this.y + this.height;
		var centerX = this.x + this.width / 2;
		var centerY = this.y + this.height / 2;

		return {
			top: { x: centerX, y: top },
			topRight: { x: right, y: top },
			right: { x: right, y: centerY },
			bottomRight: { x: right, y: bottom },
			bottom: { x: centerX, y: bottom },
			bottomLeft: { x: left, y: bottom },
			left: { x: left, y: centerY },
			topLeft: { x: left, y: top }
		};
	};

	Block.prototype.pointIn = function(x, y) {
		var left = this.x;
		var right = this.x + this.width;
		var top = this.y;
		var bottom = this.y + this.height;

		if (x > left && x < right) {
			if (y > top && y < bottom) {
				return true;
			}
		}

		return false;
	};

	win.Block = Block;
})(window);
