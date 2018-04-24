(function(win) {
	function BlocksDrawner() {
		this.blocks = [
			new Block({ x: 30, y: 40 }, { width: 100, height: 150 }),
			new Block({ x: 230, y: 240 }, { width: 80, height: 90 })
		];

		this.pivots = [];
		this.rotatePivots = [];
		this.canvasHandler = null;
	}

	BlocksDrawner.prototype.attach = function(canvasHandler) {
		canvasHandler.on('update', this.update.bind(this));
		canvasHandler.on('draw', this.draw.bind(this));
		canvasHandler.on('click', this.handleClick.bind(this));
		canvasHandler.on('begindrag', this.handleBeginDrag.bind(this));
		canvasHandler.on('dragging', this.handleDragging.bind(this));
		canvasHandler.on('stopdrag', this.handleStopDrag.bind(this));

		this.canvasHandler = canvasHandler;
	};

	BlocksDrawner.prototype.update = function(context) {
		var cursor = 'default';

		for (var i = 0; i < this.blocks.length; i++) {
			var block = this.blocks[i];

			if (block.pointIn(context.mouse.x, context.mouse.y)) {
				cursor = 'pointer';
				if (block == this.selectedBlock) {
					cursor = 'move';
				}
				break;
			}
		}

		for (var i = 0; i < this.pivots.length; i++) {
			var pivot = this.pivots[i];

			if (pivot.pointIn(context.mouse.x, context.mouse.y)) {
				switch (pivot.type) {
					case 'left':
					case 'right':
						cursor = 'ew-resize';
						break;
					case 'top':
					case 'bottom':
						cursor = 'ns-resize';
						break;

					case 'top-left':
					case 'bottom-right':
						cursor = 'nwse-resize';
						break;

					case 'top-right':
					case 'bottom-left':
						cursor = 'nesw-resize';
						break;
				}
			}
		}

		for (var i = 0; i < this.rotatePivots.length; i++) {
			var pivot = this.rotatePivots[i];

			if (pivot.pointIn(context.mouse.x, context.mouse.y)) {
				cursor = 'cell';
			}
		}

		this.canvasHandler.setCursor(cursor);
	};

	BlocksDrawner.prototype.handleClick = function(context) {
		if (this.dragging) return;

		var block = this.blocks.filter((x) => x.pointIn(context.x, context.y))[0];
		this.selectBlock(block);
	};

	BlocksDrawner.prototype.handleBeginDrag = function(context, enable) {
		var pivot = this.pivots.filter((x) => x.pointIn(context.x, context.y))[0];

		if (pivot) {
			enable();

			this.pivotDragging = pivot;
			return;
		}

		var rotatePivot = this.rotatePivots.filter((x) => x.pointIn(context.x, context.y))[0];

		if (rotatePivot) {
			this.rotatePivotDragging = rotatePivot;
			enable();
			return;
		}

		var block = this.blocks.filter((x) => x.pointIn(context.x, context.y))[0];
		this.selectBlock(block);

		if (block) {
			enable();

			this.blockDragging = block;
		}
	};

	BlocksDrawner.prototype.handlePivotDragging = function(pivot, context) {
		switch (pivot.type) {
			case 'left':
				this.selectedBlock.x += context.dragging.delta.x;
				this.selectedBlock.width -= context.dragging.delta.x;
				break;

			case 'right':
				this.selectedBlock.width += context.dragging.delta.x;
				break;

			case 'top':
				this.selectedBlock.y += context.dragging.delta.y;
				this.selectedBlock.height -= context.dragging.delta.y;
				break;

			case 'bottom':
				this.selectedBlock.height += context.dragging.delta.y;

				break;

			case 'top-left':
				this.selectedBlock.y += context.dragging.delta.y;
				this.selectedBlock.height -= context.dragging.delta.y;
				this.selectedBlock.x += context.dragging.delta.x;
				this.selectedBlock.width -= context.dragging.delta.x;
				break;

			case 'bottom-right':
				this.selectedBlock.height += context.dragging.delta.y;
				this.selectedBlock.width += context.dragging.delta.x;

				break;

			case 'top-right':
				this.selectedBlock.width += context.dragging.delta.x;
				this.selectedBlock.y += context.dragging.delta.y;
				this.selectedBlock.height -= context.dragging.delta.y;

				break;
			case 'bottom-left':
				this.selectedBlock.height += context.dragging.delta.y;
				this.selectedBlock.x += context.dragging.delta.x;
				this.selectedBlock.width -= context.dragging.delta.x;

				break;
		}

		this.selectedBlock.width = Math.max(this.selectedBlock.width, 1);
		this.selectedBlock.height = Math.max(this.selectedBlock.height, 1);

		var bounds = this.selectedBlock.getBounds();
		this.pivots = [
			new Pivot(bounds.top, 'top'),
			new Pivot(bounds.topRight, 'top-right'),
			new Pivot(bounds.right, 'right'),
			new Pivot(bounds.bottomRight, 'bottom-right'),
			new Pivot(bounds.bottom, 'bottom'),
			new Pivot(bounds.bottomLeft, 'bottom-left'),
			new Pivot(bounds.left, 'left'),
			new Pivot(bounds.topLeft, 'top-left')
		];
		this.rotatePivots = [ new Pivot(bounds.upperTopCenter, 'rotate') ];
	};

	BlocksDrawner.prototype.handleDragging = function(context) {
		if (this.blockDragging) {
			this.blockDragging.x += context.dragging.delta.x;
			this.blockDragging.y += context.dragging.delta.y;
		}
		if (this.rotatePivotDragging) {
			var center = this.rotatePivotDragging.block.getCenter();
			var rads = Math.atan2(center.x - context.mouse.x, center.y - context.mouse.y);
			var deg = 360 - (rad2deg(rads) + 360) % 360;
			this.rotatePivotDragging.block.rotation = Math.round(deg / 45) * 45;

			var bounds = this.selectedBlock.getBounds();
			this.pivots = [
				new Pivot(bounds.top, 'top'),
				new Pivot(bounds.topRight, 'top-right'),
				new Pivot(bounds.right, 'right'),
				new Pivot(bounds.bottomRight, 'bottom-right'),
				new Pivot(bounds.bottom, 'bottom'),
				new Pivot(bounds.bottomLeft, 'bottom-left'),
				new Pivot(bounds.left, 'left'),
				new Pivot(bounds.topLeft, 'top-left')
			];
			this.rotatePivots = [ new Pivot(bounds.upperTopCenter, 'rotate') ];
		}
		if (this.pivotDragging) {
			this.handlePivotDragging(this.pivotDragging, context);
		}
	};

	BlocksDrawner.prototype.selectBlock = function(block) {
		this.selectedBlock = block;

		if (!block) {
			this.pivots = [];
			this.rotatePivots = [];
		} else {
			this.blocks = this.blocks.filter((x) => this.selectBlock != x);

			this.blocks.push(block);
			var bounds = block.getBounds();
			this.pivots = [
				new Pivot(bounds.top, 'top', block),
				new Pivot(bounds.topRight, 'top-right', block),
				new Pivot(bounds.right, 'right', block),
				new Pivot(bounds.bottomRight, 'bottom-right', block),
				new Pivot(bounds.bottom, 'bottom', block),
				new Pivot(bounds.bottomLeft, 'bottom-left', block),
				new Pivot(bounds.left, 'left', block),
				new Pivot(bounds.topLeft, 'top-left', block)
			];

			this.rotatePivots = [ new Pivot(bounds.upperTopCenter, 'rotate', block) ];
		}
	};

	BlocksDrawner.prototype.handleStopDrag = function(context) {
		this.blockDragging = null;
		this.pivotDragging = null;
		this.rotatePivotDragging = null;
		var block = this.selectedBlock;
		setTimeout(() => this.selectBlock(block));
	};

	BlocksDrawner.prototype.draw = function(context) {
		this.blocks.map((block) => {
			if (this.selectedBlock == block) {
				this.drawSelectedBlock(block, context);
			} else {
				this.drawUnselectedBlock(block, context);
			}
		});

		if (!this.blockDragging && !this.rotatePivotDragging) {
			this.pivots.map((pivot) => this.drawPivot(pivot, context));
		}
		if (!this.blockDragging) {
			this.rotatePivots.map((rotatePivot) => this.drawRotatePivot(rotatePivot, context));
		}
	};

	BlocksDrawner.prototype.drawBlock = function(block, context) {
		var ctx = context.ctx;

		ctx.translate(block.x + block.width / 2, block.y + block.height / 2);

		ctx.rotate(block.rotation * Math.PI / 180);

		ctx.roundRect(-(block.width / 2), -(block.height / 2), block.width, block.height, 4);

		ctx.translate(-(block.x + block.width / 2), -(block.y + block.height / 2));
	};

	BlocksDrawner.prototype.drawUnselectedBlock = function(block, context) {
		var ctx = context.ctx;
		ctx.beginPath();

		ctx.save();
		ctx.fillStyle = 'blue';
		ctx.strokeStyle = 'green';

		ctx.lineWidth = 4;

		this.drawBlock(block, context);

		ctx.fill();
		ctx.stroke();

		ctx.restore();

		ctx.closePath();
	};

	BlocksDrawner.prototype.drawSelectedBlock = function(block, context) {
		var ctx = context.ctx;
		ctx.beginPath();

		ctx.save();
		ctx.fillStyle = 'navy';
		ctx.strokeStyle = 'black';

		ctx.lineWidth = 4;

		this.drawBlock(block, context);

		ctx.fill();
		ctx.stroke();

		ctx.restore();

		ctx.closePath();
	};

	BlocksDrawner.prototype.drawPivot = function(pivot, context) {
		var ctx = context.ctx;
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'red';
		ctx.arc(pivot.x, pivot.y, pivot.size, 0, Math.PI * 2);
		ctx.stroke();
		ctx.closePath();
	};

	BlocksDrawner.prototype.drawRotatePivot = function(pivot, context) {
		var ctx = context.ctx;

		if (this.rotatePivotDragging) {
			var center = this.rotatePivotDragging.block.getCenter();
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#aaa';

			ctx.arc(center.x, center.y, 5, 0, Math.PI * 2);
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.setLineDash([ 5, 7 ]);
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#aaa';

			ctx.moveTo(center.x, center.y);
			ctx.lineTo(pivot.x, pivot.y);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.closePath();
		}

		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.fillStyle = 'orange';
		ctx.moveTo(pivot.x, pivot.y - 5);
		ctx.lineTo(pivot.x + 5, pivot.y);
		ctx.lineTo(pivot.x, pivot.y + 5);
		ctx.lineTo(pivot.x - 5, pivot.y);
		ctx.moveTo(pivot.x, pivot.y + 5);

		ctx.fill();
		ctx.closePath();
	};

	win.BlocksDrawner = BlocksDrawner;
})(window);
