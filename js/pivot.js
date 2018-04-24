(function(win) {
	function Pivot(position, type, block) {
		this.x = position.x;
		this.y = position.y;
		this.block = block;
        this.type = type;
        this.size = 6;
	}

	Pivot.prototype.pointIn = function(x, y) {
		var left = this.x - this.size;
		var right = this.x + this.size;
		var top = this.y - this.size;
		var bottom = this.y + this.size;

		if (x > left && x < right) {
			if (y > top && y < bottom) {
				return true;
			}
		}

		return false;
	};

	win.Pivot = Pivot;
})(window);
