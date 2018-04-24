(function(win) {
	function BlocksDrawner() {
		this.blocks = [
			new Block({ x: 30, y: 40 }, { width: 100, height: 150 }),
			new Block({ x: 230, y: 240 }, { width: 80, height: 90 })
		];

		this.pivots = [];
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

		var block = this.blocks.filter((x) => x.pointIn(context.x, context.y))[0];
		this.selectBlock(block);

		if (block) {
			enable();

			this.blockDragging = block;
		}
	};

	BlocksDrawner.prototype.handleDragging = function(context) {
		if (this.blockDragging) {
			this.blockDragging.x += context.dragging.delta.x;
			this.blockDragging.y += context.dragging.delta.y;
		}

		if (this.pivotDragging) {
			var pivot = this.pivotDragging;

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
		}
	};

	BlocksDrawner.prototype.selectBlock = function(block) {
		this.selectedBlock = block;

		if (!block) {
			this.pivots = [];
		} else {
			var bounds = block.getBounds();
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
		}
	};

	BlocksDrawner.prototype.handleStopDrag = function(context) {
		this.blockDragging = null;
		this.pivotDragging = null;
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

		if (!this.blockDragging) {
			this.pivots.map((pivot) => this.drawPivot(pivot, context));
		}
	};

	BlocksDrawner.prototype.drawBlock = function(block, context) {
		context.ctx.beginPath();
		context.ctx.roundRect(block.x, block.y, block.width, block.height, 4);
		context.ctx.closePath();
	};

	BlocksDrawner.prototype.drawUnselectedBlock = function(block, context) {
		var ctx = context.ctx;

		ctx.fillStyle = 'blue';
		ctx.strokeStyle = 'green';

		ctx.lineWidth = 4;

		this.drawBlock(block, context);

		ctx.fill();
		ctx.stroke();
	};

	BlocksDrawner.prototype.drawSelectedBlock = function(block, context) {
		var ctx = context.ctx;

		ctx.fillStyle = 'navy';
		ctx.strokeStyle = 'black';

		ctx.lineWidth = 4;

		this.drawBlock(block, context);

		ctx.fill();
		ctx.stroke();
	};

	BlocksDrawner.prototype.drawPivot = function(pivot, context) {
		context.ctx.beginPath();
		context.ctx.lineWidth = 3;
		context.ctx.strokeStyle = 'red';
		context.ctx.arc(pivot.x, pivot.y, pivot.size, 0, Math.PI * 2);
		context.ctx.stroke();
		context.ctx.closePath();
	};

	win.BlocksDrawner = BlocksDrawner;
})(window);
