var Global = require('Global');

cc.Class({
	extends: cc.Component,

	properties: {},

	onBeginContact: function (c, self, other) { //碰撞到相同的球球，会合成小一级的球
		if (self.node.hitFlag) return;
		let typeId = self.node.typeId;
		if (typeId !== 0 && typeId === other.node.typeId) {
			other.node.hitFlag = true;
			self.node.hitFlag = true;

			var point = Global.MainBackground.convertToNodeSpaceAR(c.getWorldManifold().points[0]);

			other.node.destroy();
			self.node.destroy();

			let node = Global.MainBackground;
			let ball = cc.instantiate(Global.ballPrefab);
			let setting = Global.ballSettingList[typeId - 1];
			ball.setContentSize(setting.size, setting.size);
			ball.getComponent(cc.Sprite).spriteFrame = setting.texture;
			let circle = ball.getComponent(cc.PhysicsCircleCollider);
			circle.radius = setting.size / 2;
			circle.apply();
			ball.typeId = setting.id;
			ball.position = point;

			console.log(setting.score)
			Global.incScore(setting.score);

			let atom = cc.instantiate(Global.atomPrefab);
			atom.position = point;

			node.addChild(ball);
			node.addChild(atom);
		}
	},
});
