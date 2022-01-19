module.exports = {
    score: 0,//得分
    ScoreLabel: null,
    GameoverLayer : null,

    incScore: function (value) {
        if (value == 0) return;
        this.score += value;
        if (this.ScoreLabel) {
            this.ScoreLabel.string = this.score;
        }
    },
    setScore: function (value) {
        this.score = value;
        if (this.ScoreLabel) {
            this.ScoreLabel.string = this.score;
        }
    },

    times: 0,//回合数，也记录了旋转次数
    preCount: 3, //记录当前还剩几个备选项
    selected: null, //当前被选择的unit
    moveAnim: false, //被选中的方块是否正在动画中，动画中无法选中新方块

    unitList: [], //背景方块单元数组，二维数组矩阵
    unitListFromCenter: null, //背景方块单元一维数组，从中心向外,存放顺序是从中心开始，上右下左上
    preNodeList: [], //存放备选区对象，用于快速调用创建备选项方法


    preUnitDataList: [
        [], //单点
        [[0, 1], [0, -1], [1, -1]], //长短拐角
        [[0, 1], [0, -1], [1, 1]], //长短拐角
        [[0, 1], [1, 0]], //短拐角
        [[0, 1], [-1, 0]], //短拐角
        [[0, 1], [0, -1]], //直三点
        [[0, 1]], //两点
        [[-1, 0], [1, 0], [0, 1]], //T形
    ], //可随机刷出的预制图形

    unitColorList: [
        new cc.Color().fromHEX('#F28484'),
        new cc.Color().fromHEX('#f246b6'),
        new cc.Color().fromHEX('#f2992d'),
        new cc.Color().fromHEX('#f2ed28'),
        new cc.Color().fromHEX('#83f22e'),
        new cc.Color().fromHEX('#2df2ef')
    ],
    unitSize: 30,    //一个方块的单位的长宽尺寸
    width: 11,       //水平方向方块数量
    height: 11,       //垂直方向方块数量
    speed: 0.03, //区域内下落动画的速度（秒/每格）

    getUnitFromList: function (i, j) {
        let halfWidth = (this.width - 1) / 2;
        let halfHeight = (this.height - 1) / 2;
        if (Math.abs(i) > halfWidth || Math.abs(j) > halfHeight) {
            return null;
        }
        let indexX = i + halfWidth;
        let indexY = halfHeight - j;
        return this.unitList[indexX][indexY];
    },
    rotatePreItemMatrix: function (matrix) { //旋转待选格子,参数是preUnitItem的extra数组
        matrix.forEach(item => {
            item.data = [1 * item.data[1], -1 * item.data[0]];
        });
    },
    rotateUnitMatrix: function () { //旋转unit背景格子 has字段
        //顺时针旋转 90 度
        //列 = 行
        //行 = n - 1 - 列(j);  n表示总行数
        let matrix = this.unitList;
        var temp = [];
        var len = matrix.length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len; j++) {
                var k = len - 1 - j;
                if (!temp[k]) {
                    temp[k] = [];
                }
                temp[k][i] = matrix[i][j].has;
            }
        }
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len; j++) {
                matrix[i][j].has = temp[i][j];
            }
        }
    },
    convertPositionToRetUnitLayer: function (position) { //转换unitBackground中的坐标到layer中（旋转后）
        let rotateTimes = this.times % 4;
        let x, y;
        if (rotateTimes === 0) {
            x = position.x;
            y = position.y;
        } else if (rotateTimes === 1) {  //顺时针90度
            x = -position.y;
            y = position.x;
        } else if (rotateTimes === 2) {  //顺时针180度
            x = -position.x;
            y = -position.y;
        } else {  //顺时针270度
            x = position.y;
            y = -position.x;
        }
        return cc.v2(x, y);
    },
    checkClear: function (tmpScore, currentScore) {  //检测消除 ,参数默认0 ， 1,  返回值是本回合总共的分数
        let list = this.unitListFromCenter;
        let index = 1; //忽略最中心的
        let layer = 2; //最中心的是第一层
        let layerIndex = 0;
        let hasCount = 0;
        let layerNeedClear = [];
        while (index < list.length) {
            let layerCount = (layer - 1) * 2 * 4;
            if (layerIndex === layerCount) {
                if (hasCount === layerCount) {
                    layerNeedClear.push(layer); //记录需要清除的层
                }
                layer++;
                layerIndex = 0
                hasCount = 0;
            }

            let unit = list[index];
            if (unit.has) {
                hasCount++;
            }

            layerIndex++;
            index++;
        }
        if (layerNeedClear.length === 0) {
            return tmpScore;
        }
        //清除方块
        layerNeedClear.forEach(layer => {
            let layerCount = (layer - 1) * 2;
            let index = (layerCount - 1) * (layerCount - 1);
            let count = layerCount * 4;
            let i = 0;
            while (i < count) {
                let unit = list[index];
                unit.has.destroy();
                unit.has = null;
                index++;
                i++;

                currentScore++;
                tmpScore += currentScore;
            }
        });

        //移动外层方块
        this.moveUnitAfterClear();
        //再次检测移动后是否能够清除
        tmpScore = this.checkClear(tmpScore, currentScore);
        return tmpScore;
    },
    moveUnitAfterClear: function () { //向中心收敛
        let list = this.unitListFromCenter;
        let index = 9; //忽略中心两层
        let layer = 3;
        let layerIndex = 0;
        while (index < list.length) {
            let unit = list[index];

            let layerCount = (layer - 1) * 2 * 4;
            if (layerIndex === layerCount) {
                layer++;
                layerIndex = 0
            }

            if (!unit.has) {
                index++;
                layerIndex++;
                continue;
            }
            let dircet = Math.floor(layerIndex / ((layer - 1) * 2)); //确认方向， 0向下，1向左，2向上，3向右。 （取决于数组存放顺序）
            this.moveUnitItem(unit, dircet);

            index++;
            layerIndex++;
        }
    },
    moveUnitItem(unit, dircet) {
        let lastTarget = null;
        let long = 0;
        if (dircet === 0) {
            for (let index = unit.j - 1; index > 0; index--) {
                let target = this.getUnitFromList(unit.i, index);
                if (target.has) break;
                lastTarget = target;
                long++;
            }
        } else if (dircet === 1) {
            for (let index = unit.i - 1; index > 0; index--) {
                let target = this.getUnitFromList(index, unit.j);
                if (target.has) break;
                lastTarget = target;
                long++;
            }
        } else if (dircet === 2) {
            for (let index = unit.j + 1; index < 0; index++) {
                let target = this.getUnitFromList(unit.i, index);
                if (target.has) break;
                lastTarget = target;
                long++;
            }
        } else {
            for (let index = unit.i + 1; index < 0; index++) {
                let target = this.getUnitFromList(index, unit.j);
                if (target.has) break;
                lastTarget = target;
                long++;
            }
        }

        // unit.color = new cc.Color().fromHEX('#11f228');

        if (lastTarget === null) return;
        let has = unit.has;
        lastTarget.has = has;
        unit.has = null;
        cc.tween(lastTarget.has)
            .to(long * this.speed, {position: this.convertPositionToRetUnitLayer(lastTarget.position)})
            .call(() => {
                let index = Math.max(Math.abs(lastTarget.i), Math.abs(lastTarget.j)) //计算方块落在第几层
                has.color = this.unitColorList[index];
            })
            .start();
    }
}