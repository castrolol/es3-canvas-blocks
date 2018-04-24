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
				if (pivot.type == 'left' || pivot.type == 'right') {
					cursor = 'ew-resize';
				} else {
					cursor = 'ns-resize';
				}
			}
		}

		this.canvasHandler.setCursor(cursor);
	};

	BlocksDrawner.prototype.handleClick = function(context) {
		var block = this.blocks.filter((x) => x.pointIn(context.x, context.y))[0];
		this.selectedBlock = block;
		if (!block) {
			this.pivots = [];
		} else {
			var bounds = block.getBounds();
			this.pivots = [
				new Pivot(bounds.top, 'top'),
				new Pivot(bounds.right, 'right'),
				new Pivot(bounds.bottom, 'bottom'),
				new Pivot(bounds.left, 'left')
			];
		}
	};

	BlocksDrawner.prototype.draw = function(context) {
		this.blocks.map((block) => {
			if (this.selectedBlock == block) {
				this.drawSelectedBlock(block, context);
			} else {
				this.drawUnselectedBlock(block, context);
			}
		});

		this.pivots.map((pivot) => this.drawPivot(pivot, context));
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
