module.exports = {
	width: 300,
	height: 500,
	score: 0,

	ballSettingList: [
		{id: 0, size: 100, imgPath: 'images/ball_1', texture: null, score: 300},
		{id: 1, size: 90, imgPath: 'images/ball_2', texture: null, score: 240},
		{id: 2, size: 80, imgPath: 'images/ball_3', texture: null, score: 200},
		{id: 3, size: 70, imgPath: 'images/ball_4', texture: null, score: 160},
		{id: 4, size: 60, imgPath: 'images/ball_5', texture: null, score: 120},
		{id: 5, size: 50, imgPath: 'images/ball_6', texture: null, score: 80},
		{id: 6, size: 40, imgPath: 'images/ball_7', texture: null, score: 40},
		{id: 7, size: 30, imgPath: 'images/ball_8', texture: null, score: 20},
		{id: 8, size: 20, imgPath: 'images/ball_9', texture: null, score: 10},
	],
	ballPrefab: null,
	atomPrefab: null,
	MainBackground: null,
	ScoreLabel: null,
	currentBall: null,

	setScore: function (score) {
		this.score = score;
		this.ScoreLabel.string = score;
	},

	incScore: function (score) {
		this.score = this.score + score;
		this.ScoreLabel.string = this.score;
	},

	createBall: function (x) {
		let ball = cc.instantiate(this.ballPrefab);
		let random = parseInt(Math.random() * (this.ballSettingList.length - 4)) + 4  //不会生成最前面的几个大小
		let setting = this.ballSettingList[random];
		ball.setContentSize(setting.size, setting.size);

		ball.getComponent(cc.Sprite).spriteFrame = setting.texture;

		let rigidBody = ball.getComponent(cc.RigidBody);
		rigidBody.type = cc.RigidBodyType.Static;

		let circle = ball.getComponent(cc.PhysicsCircleCollider);
		circle.radius = setting.size / 2;
		circle.apply();

		ball.typeId = setting.id;

		ball.oriTop = (this.height - setting.size) / 2;
		ball.position = cc.v2(x, ball.oriTop);
		this.MainBackground.addChild(ball);
		return ball;
	}
}