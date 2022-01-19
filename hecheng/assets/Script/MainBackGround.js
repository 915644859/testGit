var Global = require('Global');

cc.Class({
	extends: cc.Component,

	properties: {},

	onLoad: function () {
		let node = this.node;
		let ballTop = Global.height / 2

		this.node.on('touchmove', function (event) {
			if (Global.currentBall === null) return;
			let currentBall = Global.currentBall;

			let worldPosition = event.getLocation();
			let position = node.convertToNodeSpaceAR(worldPosition);

			currentBall.position = cc.v2(position.x, currentBall.oriTop);
		}.bind(this));

		this.node.on('touchend', function (event) {
			if (Global.currentBall === null) return;
			let currentBall = Global.currentBall;
			Global.currentBall = null;

			let worldPosition = event.getLocation();
			let position = node.convertToNodeSpaceAR(worldPosition);

			currentBall.position = cc.v2(position.x, currentBall.oriTop);

			let rigidBody = currentBall.getComponent(cc.RigidBody);
			rigidBody.type = cc.RigidBodyType.Dynamic;

			setTimeout(function () {
				let ball = Global.createBall(0);
				Global.currentBall = ball;
			}, 1000)
		}.bind(this));
	},


});
