/**
 * ret unit layer层只用来存放ret unit 用作旋转的视觉效果展示
 * 实际的碰撞检测逻辑在unitBackground的格子中，使用旋转矩阵，调整格子在矩阵中的下标，格子实际位置不变。通过get方法获取旋转后的坐标
 */
var Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        ScoreLabel: {
            default: null,
            type: cc.Label
        },
        UnitBackground: {
            default: null,
            type: cc.Node
        },
        RetUnitLayer: {
            default: null,
            type: cc.Node
        },
        AimLine: {
            default: null,
            type: cc.Node
        },
        GameoverLayer: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        Global.ScoreLabel = this.ScoreLabel;
        Global.GameoverLayer = this.GameoverLayer;
        this.GameoverLayer.active = false;
        this.initBackGround();
    },

    //再来一局
    retryGame() {
        Global.setScore(0); //重置分数
        this.RetUnitLayer.rotation = 0;
        Global.times = 0;
        if (Global.selected) {
            Global.selected.destroy();
            Global.selected = null;
        }
        Global.unitListFromCenter.forEach(it => { //清除所有块
            if (it.has) {
                it.has.destroy();
                it.has = null;
            }
        });
        this.initUnitInBackground(); //初始化初始块
        Global.preCount = 3;
        Global.moveAnim = false;
        Global.preNodeList.forEach(it=>{
            if (it.PreUnitItem) {
                it.PreUnitItem.destroy();
                it.PreUnitItem = null;
            }
            it.createPreUnitItem();
        });
        this.GameoverLayer.active = false; //关掉gameover对话框
    },

    initUnitInBackground: function () {
        let unitSize = Global.unitSize;
        // let initList = [[0, 0], [1, 0], [-1, 0], [-1, -1], [0, -1], [1, -1], [-1, 1], [1, 1]];
        let initList = [[0, 0], [1, 0], [-1, 0], [-1, -1], [1, -1], [-1, 1], [1, 1], [0, 1]];
        cc.resources.load("Prefab/pre unit item", function (err, prefab) {
            initList.forEach(item => {
                let initUnit = Global.getUnitFromList(item[0], item[1]);
                let preUnitItem = cc.instantiate(prefab);
                preUnitItem.width = unitSize - 1;
                preUnitItem.height = unitSize - 1;
                preUnitItem.position = initUnit.position;
                let colorIndex = Math.max(Math.abs(initUnit.i), Math.abs(initUnit.j)) //计算方块落在第几层
                preUnitItem.color = Global.unitColorList[colorIndex];
                preUnitItem.parent = this.RetUnitLayer;
                initUnit.has = preUnitItem;
            });
        }.bind(this));
    },

    initBackGround: function () {
        let unitSize = Global.unitSize;
        //背景板
        this.UnitBackground.width = unitSize * Global.width + 1;
        this.UnitBackground.height = unitSize * Global.height + 1;
        this.UnitBackground.setPosition(0, 0);
        this.AimLine.setPosition(0, unitSize * Global.height / 2);
        this.AimLine.width = unitSize - 1;
        this.AimLine.height = unitSize * (Math.floor(Global.height / 2) - 1)
        this.AimLine.active = false;
        cc.resources.load("Prefab/unit", function (err, prefab) {
            //11*11背景方格
            let maxI = (Global.width - 1) / 2;
            let maxJ = (Global.height - 1) / 2;
            for (let i = -maxI; i <= maxI; i++) {
                let itemList = [];
                for (let j = maxI; j >= -maxI; j--) {
                    let unit = cc.instantiate(prefab);
                    let x = i * unitSize;
                    let y = j * unitSize;
                    // if (i === 0 && j === 0) {
                    //     unit.color = Global.unitColorList[0];
                    //     unit.has = true;
                    // }
                    unit.width = unitSize - 1;
                    unit.height = unitSize - 1;
                    unit.setPosition(x, y);
                    unit.i = i;
                    unit.j = j;
                    this.UnitBackground.addChild(unit);
                    itemList.push(unit);

                    // unit.on('touchstart', function (event) {
                    //     console.log(i,j)
                    // }.bind(this));
                }
                Global.unitList.push(itemList);
            }

            //初始化初始方块
            this.initUnitInBackground();

            //将unitList另存为一个从内向外遍历的一维数组
            let list = [];
            let layer = 0;
            let i = 0;
            let j = 0;
            let dirct = 'up';
            while (list.length < Global.width * Global.height) {
                let unit = Global.getUnitFromList(i, j);
                list.push(unit);
                if (dirct === 'up') {
                    if (j >= layer) {
                        dirct = 'right';
                        layer++;
                    }
                    j++;
                } else if (dirct === 'left') {
                    i--;
                    if (i <= -layer) {
                        dirct = 'up';
                    }
                } else if (dirct === 'right') {
                    i++;
                    if (i >= layer) {
                        dirct = 'down';
                    }
                } else {
                    j--;
                    if (j <= -layer) {
                        dirct = 'left';
                    }
                }
            }
            Global.unitListFromCenter = list;
        }.bind(this));
    }

});
