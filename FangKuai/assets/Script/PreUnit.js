/**
 * 备选区，会生成备选方块
 */
var Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
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
        PreUnitItem: {
            default: null,
            type: cc.Node
        },

    },

    onLoad() {
        Global.preNodeList.push(this);
        this.createPreUnitItem();

        this.node.on('touchstart', function (event) {
            if (this.PreUnitItem === null) return; //如果备选区中没有待选方块，不处理
            if (Global.selected !== null) return; //如果存在已选择的方块，不处理
            if (Global.moveAnim) return; //选中的方块正在动画
            Global.selected = this.PreUnitItem;

            this.PreUnitItem.touchLocation = event.getLocation();
        }.bind(this));

        let unitSize = Global.unitSize;
        let maxX = unitSize * Global.width / 2;
        let maxY = unitSize * Global.height / 2;
        let halfI = (Global.width - 1) / 2;
        this.node.on('touchmove', function (event) {
            if (Global.selected === null) return; //如果不存在已选择的方块，不处理
            let selected = Global.selected;
            let worldPosition = event.getLocation();
            let position = this.UnitBackground.convertToNodeSpaceAR(worldPosition);
            if (Math.abs(this.node.position.x - position.x) < this.node.width / 2 && Math.abs(this.node.position.y - position.y) < this.node.height / 2) {
                selected.position = selected.oriPosition;
                return; //如果在区域内拖动，不移动方块，方块位置还原
            }
            //在区域外，取消显示aimLine；区域内，显示aimLine并释放
            let x = position.x;
            let y = position.y;
            if (x > -maxX && x < maxX && y > -maxY && y < maxY) {  //区域内移动在区域顶部与格子对齐
                selected.parent = this.UnitBackground;
                let minJ = 0;
                let minI = 0;
                let maxI = 0;
                selected.extra.forEach(item => {
                    let itemI = item.data[0];
                    let itemJ = item.data[1];
                    if (itemJ < minJ) {
                        minJ = itemJ;
                    }
                    if (itemI < minI) {
                        minI = itemI;
                    }
                    if (itemI > maxI) {
                        maxI = itemI;
                    }
                });
                let currentI = Math.round(x / unitSize)
                if (maxI + currentI > halfI) { //处理左右触摸点越界
                    currentI = halfI - maxI;
                } else if (minI + currentI < -halfI) {
                    currentI = -halfI - minI;
                }
                let unitX = unitSize * currentI; //与触摸点当前格子对齐的x坐标

                this.AimLine.active = true;
                this.AimLine.x = unitX;
                selected.x = unitX;
                selected.y = unitSize / 2 + maxY - (minJ * unitSize) + 1;//如果extra包含在底部的方块，相应的上升
            } else { //区域外移动跟随触摸点
                this.AimLine.active = false;
                selected.parent = this.UnitBackground.parent;
                let canvasPosition = this.UnitBackground.parent.convertToNodeSpaceAR(worldPosition);
                selected.position = canvasPosition;
            }
        }.bind(this));

        this.node.on('touchend', function (event) {
            if (Global.moveAnim) {
                return;
            }
            Global.moveAnim = true;
            let unit = this.PreUnitItem;
            //仅是点击，则旋转备选格子
            unit.extraData = Global.rotatePreItemMatrix(unit.extra);
            cc.tween(unit)
                .by(0.2, {angle: -90})
                .call(() => {
                    Global.moveAnim = false;
                })
                .start();
        }.bind(this));

        this.node.on('touchcancel', function (event) {
            this.releaseSelected(this, event);
        }.bind(this));

    },

    //生成新的备选方块
    createPreUnitItem: function () {
        let unitSize = Global.unitSize;
        cc.resources.load("Prefab/pre unit item", function (err, prefab) {
            let preUnitItem = cc.instantiate(prefab);
            preUnitItem.oriPosition = this.node.position;
            preUnitItem.width = unitSize - 1;
            preUnitItem.height = unitSize - 1;
            preUnitItem.position = this.node.position;
            this.UnitBackground.parent.addChild(preUnitItem);
            this.PreUnitItem = preUnitItem;
            //创建额外的方块
            preUnitItem.extra = [];
            let len = Global.preUnitDataList.length;
            let extraData = Global.preUnitDataList[Math.floor(Math.random() * len)];
            // preUnitItem.extraData = extraData;
            extraData.forEach(data => {
                let extra = cc.instantiate(prefab);
                extra.width = unitSize - 1;
                extra.height = unitSize - 1;
                extra.position = cc.v2(unitSize * data[0], unitSize * data[1]);
                extra.parent = preUnitItem;
                extra.data = data;
                preUnitItem.extra.push(extra);
            });
        }.bind(this));
    },

    //松开方块，区域外直接返回，区域内检测碰撞
    releaseSelected: function (that, event) {
        if (Global.selected === null) return; //如果不存在已选择的方块，不处理
        let unitSize = Global.unitSize;
        let maxX = unitSize * Global.width / 2;
        let maxY = unitSize * Global.height / 2;
        let worldPosition = event.getLocation();
        let position = this.UnitBackground.convertToNodeSpaceAR(worldPosition);
        let x = position.x;
        let y = position.y;
        if (x > -maxX && x < maxX && y > -maxY && y < maxY) {  //区域内释放逻辑
            this.releaseInArea();
        } else { //区域外释放回到原点
            Global.moveAnim = true;
            Global.selected.parent = this.UnitBackground.parent;
            cc.tween(Global.selected)
                .to(0.2, {position: Global.selected.oriPosition})
                .call(() => {
                    Global.moveAnim = false;
                })
                .start()
        }
        this.AimLine.active = false;
        Global.selected = null;
    },

    //在区域内松开方块，如果碰撞则固定，否则演示动画并返回
    releaseInArea: function () {
        Global.moveAnim = true;
        let selected = Global.selected;
        let speed = Global.speed; //区域内下落动画的速度（秒/每格）

        let targetUnit = this.detectCollision();

        if (targetUnit) {
            targetUnit.has = selected;
            this.PreUnitItem = null;
            cc.tween(selected)
                .to(((Global.height + 1) / 2 - targetUnit.j) * speed, {position: targetUnit.position})
                .call(() => {
                    selected.parent = this.RetUnitLayer;
                    selected.position = Global.convertPositionToRetUnitLayer(selected.position); //转换unitBackground位置到layer中的位置

                    let index = Math.max(Math.abs(targetUnit.i), Math.abs(targetUnit.j)) //计算方块落在第几层
                    selected.color = Global.unitColorList[index];
                    selected.extra.forEach(item => {  //附加的格子放置到对应的位置
                        item.parent = this.RetUnitLayer;
                        let data = item.data;
                        let itemTarget = Global.getUnitFromList(targetUnit.i + data[0], targetUnit.j + data[1]);
                        item.position = Global.convertPositionToRetUnitLayer(itemTarget.position);
                        let index = Math.max(Math.abs(itemTarget.i), Math.abs(itemTarget.j)) //计算方块落在第几层
                        item.color = Global.unitColorList[index];
                        itemTarget.has = item;
                    });

                    let score = Global.checkClear(0, 0); //检测是否能够消除一圈
                    Global.incScore(score)

                    Global.rotateUnitMatrix();
                    cc.tween(this.RetUnitLayer)
                        .delay(0.3)
                        .by(0.3, {angle: -90})
                        .call(() => {
                            //备选区选项用完之后，重新生成一批
                            Global.preCount--;
                            if (Global.preCount <= 0) {
                                Global.preCount = 3;
                                Global.preNodeList.forEach(that => {
                                    that.createPreUnitItem();
                                })
                            }
                            Global.times++; //回合数 +1
                            Global.moveAnim = false;
                        })
                        .start()
                })
                .start()
            return;
        }

        //如果没有检测到碰撞， 1：没有完全进入就碰撞，结束游戏  2：直接穿过区域返回原点
        if (targetUnit === false) {
            cc.tween(Global.selected)
                .by(0.2, {position: cc.v2(0, -10)})
                .call(() => {
                    // Global.moveAnim = false;
                    Global.GameoverLayer.active = true;
                })
                .start()
            return;
        }

        cc.tween(Global.selected)
            .to(Global.height * speed, {position: cc.v2(Global.selected.position.x, -Global.selected.position.y)})
            .to(0.2, {position: Global.selected.oriPosition})
            .call(() => {
                Global.moveAnim = false;
            })
            .start()
    },

    //提前检测本次释放是否碰撞
    detectCollision: function () {
        let i = Global.selected.x / Global.unitSize;
        let unitY = (Global.height - 1) / 2;
        let halfSize = (Global.height - 1) / 2;
        let lastUnit = null;
        //旋转方向问题,通过旋转碰撞检测格子（背景unit）中has的值来实现
        for (let j = unitY; j >= -unitY; j--) {
            let unit = Global.getUnitFromList(i, j);

            let ok = true;
            Global.selected.extra.forEach(item => {  //检测附加的格子是否碰撞
                let data = item.data;
                let itemI = i + data[0];
                let itemJ = j + data[1];
                if (Math.abs(itemI) > halfSize || Math.abs(itemJ) > halfSize) return;
                let itemTarget = Global.getUnitFromList(itemI, itemJ);
                if (!itemTarget) return;
                if (itemTarget.has) ok = false;
            });
            if (!ok) {
                return lastUnit === null ? false : lastUnit;
            }
            if (!unit) {
                continue;
            }
            if (unit.has) {
                return lastUnit === null ? false : lastUnit;
            }

            // unit.color = new cc.Color().fromHEX('#0f09ff');
            lastUnit = unit;
        }
        return null;
    },

});
