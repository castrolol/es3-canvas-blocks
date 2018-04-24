(function(win) {
	function BallBounce() {
		this.xVelocity = 200;
        this.yVelocity = 200;
        this.x = 300;
        this.y = 200;
	}

	BallBounce.prototype.attach = function(canvasHandler) {
		canvasHandler.on('update', this.update.bind(this));
		canvasHandler.on('draw', this.draw.bind(this));
	};

	BallBounce.prototype.update = function(context) {
		this.x += this.xVelocity * context.deltaTime;
		this.y += this.yVelocity * context.deltaTime;

		if (this.x < 50 && this.xVelocity < 0) this.xVelocity = -this.xVelocity;
		if (this.y < 50 && this.yVelocity < 0) this.yVelocity = -this.yVelocity;

		if (this.x > context.size.width - 50 && this.xVelocity > 0) this.xVelocity = -this.xVelocity;
		if (this.y > context.size.height - 50 && this.yVelocity > 0) this.yVelocity = -this.yVelocity;
	};

	BallBounce.prototype.draw = function(context) {
		context.ctx.fillStyle = 'purple';
		context.ctx.arc(this.x, this.y, 50, 0, Math.PI * 2);
		context.ctx.fill();
	};

	win.BallBounce = BallBounce;
})(window);
