var Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        Background: {
			default: null,
			type: cc.Node
		},
		ScoreLabel: {
			default: null,
			type: cc.Label
		},
    },

    onLoad: function () {
        Global.MainBackground = this.Background;
        Global.ScoreLabel = this.ScoreLabel;
		cc.director.getPhysicsManager().enabled = true;
		cc.director.getPhysicsManager().gravity = cc.v2(0, -320 * 3); //3倍重力
		cc.director.getCollisionManager().enabled = true;

		cc.resources.load("ball", function (err, prefab) {
            Global.ballPrefab = prefab;
        });

		cc.resources.load("atom", function (err, prefab) {
			Global.atomPrefab = prefab;
		});

        let ballSettingList =  Global.ballSettingList;

        ballSettingList.forEach(it => {
            cc.resources.load(it.imgPath, cc.SpriteFrame, (err, asset) => {
                it.texture = asset;
                // console.log("load success", it.imgPath)
            });
        });

        let timer = setInterval(function () {

        	let loadSuccess = true;
			ballSettingList.forEach(it=>{
				if (it.texture === null) {
					loadSuccess = false;
				}
			});

            if ( Global.ballPrefab && Global.ballPrefab && loadSuccess) {
				let ball = Global.createBall(0);
				Global.currentBall = ball;
                clearInterval(timer);
            }
        }, 500)

        // this.ball.active = true;
    },

});
