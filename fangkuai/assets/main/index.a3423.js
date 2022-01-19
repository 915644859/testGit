window.__require=function t(e,i,n){function o(a,s){if(!i[a]){if(!e[a]){var c=a.split("/");if(c=c[c.length-1],!e[c]){var h="function"==typeof __require&&__require;if(!s&&h)return h(c,!0);if(r)return r(c,!0);throw new Error("Cannot find module '"+a+"'")}a=c}var l=i[a]={exports:{}};e[a][0].call(l.exports,function(t){return o(e[a][1][t]||t)},l,l.exports,t,e,i,n)}return i[a].exports}for(var r="function"==typeof __require&&__require,a=0;a<n.length;a++)o(n[a]);return o}({BanTouch:[function(t,e,i){"use strict";cc._RF.push(e,"2f31eKk1KpF9LD3i0uRixs8","BanTouch"),cc.Class({extends:cc.Component,properties:{},start:function(){}}),cc._RF.pop()},{}],Canvas:[function(t,e,i){"use strict";cc._RF.push(e,"280c3rsZJJKnZ9RqbALVwtK","Canvas");var n=t("Global");cc.Class({extends:cc.Component,properties:{ScoreLabel:{default:null,type:cc.Label},UnitBackground:{default:null,type:cc.Node},RetUnitLayer:{default:null,type:cc.Node},AimLine:{default:null,type:cc.Node},GameoverLayer:{default:null,type:cc.Node}},onLoad:function(){n.ScoreLabel=this.ScoreLabel,n.GameoverLayer=this.GameoverLayer,this.GameoverLayer.active=!1,this.initBackGround()},retryGame:function(){n.setScore(0),this.RetUnitLayer.rotation=0,n.times=0,n.selected&&(n.selected.destroy(),n.selected=null),n.unitListFromCenter.forEach(function(t){t.has&&(t.has.destroy(),t.has=null)}),this.initUnitInBackground(),n.preCount=3,n.moveAnim=!1,n.preNodeList.forEach(function(t){t.PreUnitItem&&(t.PreUnitItem.destroy(),t.PreUnitItem=null),t.createPreUnitItem()}),this.GameoverLayer.active=!1},initUnitInBackground:function(){var t=n.unitSize,e=[[0,0],[1,0],[-1,0],[-1,-1],[1,-1],[-1,1],[1,1],[0,1]];cc.resources.load("Prefab/pre unit item",function(i,o){var r=this;e.forEach(function(e){var i=n.getUnitFromList(e[0],e[1]),a=cc.instantiate(o);a.width=t-1,a.height=t-1,a.position=i.position;var s=Math.max(Math.abs(i.i),Math.abs(i.j));a.color=n.unitColorList[s],a.parent=r.RetUnitLayer,i.has=a})}.bind(this))},initBackGround:function(){var t=n.unitSize;this.UnitBackground.width=t*n.width+1,this.UnitBackground.height=t*n.height+1,this.UnitBackground.setPosition(0,0),this.AimLine.setPosition(0,t*n.height/2),this.AimLine.width=t-1,this.AimLine.height=t*(Math.floor(n.height/2)-1),this.AimLine.active=!1,cc.resources.load("Prefab/unit",function(e,i){for(var o=(n.width-1)/2,r=(n.height,-o);r<=o;r++){for(var a=[],s=o;s>=-o;s--){var c=cc.instantiate(i),h=r*t,l=s*t;c.width=t-1,c.height=t-1,c.setPosition(h,l),c.i=r,c.j=s,this.UnitBackground.addChild(c),a.push(c)}n.unitList.push(a)}this.initUnitInBackground();for(var u=[],d=0,f=0,v=0,p="up";u.length<n.width*n.height;){var m=n.getUnitFromList(f,v);u.push(m),"up"===p?(v>=d&&(p="right",d++),v++):"left"===p?--f<=-d&&(p="up"):"right"===p?++f>=d&&(p="down"):--v<=-d&&(p="left")}n.unitListFromCenter=u}.bind(this))}}),cc._RF.pop()},{Global:"Global"}],Global:[function(t,e,i){"use strict";cc._RF.push(e,"99c21Ez8gVLo6exvaIT1c5w","Global"),e.exports={score:0,ScoreLabel:null,GameoverLayer:null,incScore:function(t){0!=t&&(this.score+=t,this.ScoreLabel&&(this.ScoreLabel.string=this.score))},setScore:function(t){this.score=t,this.ScoreLabel&&(this.ScoreLabel.string=this.score)},times:0,preCount:3,selected:null,moveAnim:!1,unitList:[],unitListFromCenter:null,preNodeList:[],preUnitDataList:[[],[[0,1],[0,-1],[1,-1]],[[0,1],[0,-1],[1,1]],[[0,1],[1,0]],[[0,1],[-1,0]],[[0,1],[0,-1]],[[0,1]],[[-1,0],[1,0],[0,1]]],unitColorList:[(new cc.Color).fromHEX("#F28484"),(new cc.Color).fromHEX("#f246b6"),(new cc.Color).fromHEX("#f2992d"),(new cc.Color).fromHEX("#f2ed28"),(new cc.Color).fromHEX("#83f22e"),(new cc.Color).fromHEX("#2df2ef")],unitSize:30,width:11,height:11,speed:.03,getUnitFromList:function(t,e){var i=(this.width-1)/2,n=(this.height-1)/2;if(Math.abs(t)>i||Math.abs(e)>n)return null;var o=t+i,r=n-e;return this.unitList[o][r]},rotatePreItemMatrix:function(t){t.forEach(function(t){t.data=[1*t.data[1],-1*t.data[0]]})},rotateUnitMatrix:function(){for(var t=this.unitList,e=[],i=t.length,n=0;n<i;n++)for(var o=0;o<i;o++){var r=i-1-o;e[r]||(e[r]=[]),e[r][n]=t[n][o].has}for(n=0;n<i;n++)for(o=0;o<i;o++)t[n][o].has=e[n][o]},convertPositionToRetUnitLayer:function(t){var e,i,n=this.times%4;return 0===n?(e=t.x,i=t.y):1===n?(e=-t.y,i=t.x):2===n?(e=-t.x,i=-t.y):(e=t.y,i=-t.x),cc.v2(e,i)},checkClear:function(t,e){for(var i=this.unitListFromCenter,n=1,o=2,r=0,a=0,s=[];n<i.length;){var c=2*(o-1)*4;r===c&&(a===c&&s.push(o),o++,r=0,a=0),i[n].has&&a++,r++,n++}return 0===s.length?t:(s.forEach(function(n){for(var o=2*(n-1),r=(o-1)*(o-1),a=4*o,s=0;s<a;){var c=i[r];c.has.destroy(),c.has=null,r++,s++,t+=++e}}),this.moveUnitAfterClear(),t=this.checkClear(t,e))},moveUnitAfterClear:function(){for(var t=this.unitListFromCenter,e=9,i=3,n=0;e<t.length;){var o=t[e];if(n===2*(i-1)*4&&(i++,n=0),o.has){var r=Math.floor(n/(2*(i-1)));this.moveUnitItem(o,r),e++,n++}else e++,n++}},moveUnitItem:function(t,e){var i=this,n=null,o=0;if(0===e)for(var r=t.j-1;r>0;r--){var a=this.getUnitFromList(t.i,r);if(a.has)break;n=a,o++}else if(1===e)for(var s=t.i-1;s>0;s--){var c=this.getUnitFromList(s,t.j);if(c.has)break;n=c,o++}else if(2===e)for(var h=t.j+1;h<0;h++){var l=this.getUnitFromList(t.i,h);if(l.has)break;n=l,o++}else for(var u=t.i+1;u<0;u++){var d=this.getUnitFromList(u,t.j);if(d.has)break;n=d,o++}if(null!==n){var f=t.has;n.has=f,t.has=null,cc.tween(n.has).to(o*this.speed,{position:this.convertPositionToRetUnitLayer(n.position)}).call(function(){var t=Math.max(Math.abs(n.i),Math.abs(n.j));f.color=i.unitColorList[t]}).start()}}},cc._RF.pop()},{}],PreUnit:[function(t,e,i){"use strict";cc._RF.push(e,"81627rXuhJMAp33Qg4uecX6","PreUnit");var n=t("Global");cc.Class({extends:cc.Component,properties:{UnitBackground:{default:null,type:cc.Node},RetUnitLayer:{default:null,type:cc.Node},AimLine:{default:null,type:cc.Node},PreUnitItem:{default:null,type:cc.Node}},onLoad:function(){n.preNodeList.push(this),this.createPreUnitItem(),this.node.on("touchstart",function(t){null!==this.PreUnitItem&&null===n.selected&&(n.moveAnim||(n.selected=this.PreUnitItem,this.PreUnitItem.touchLocation=t.getLocation()))}.bind(this));var t=n.unitSize,e=t*n.width/2,i=t*n.height/2,o=(n.width-1)/2;this.node.on("touchmove",function(r){if(null!==n.selected){var a=n.selected,s=r.getLocation(),c=this.UnitBackground.convertToNodeSpaceAR(s);if(Math.abs(this.node.position.x-c.x)<this.node.width/2&&Math.abs(this.node.position.y-c.y)<this.node.height/2)a.position=a.oriPosition;else{var h=c.x,l=c.y;if(h>-e&&h<e&&l>-i&&l<i){a.parent=this.UnitBackground;var u=0,d=0,f=0;a.extra.forEach(function(t){var e=t.data[0],i=t.data[1];i<u&&(u=i),e<d&&(d=e),e>f&&(f=e)});var v=Math.round(h/t);f+v>o?v=o-f:d+v<-o&&(v=-o-d);var p=t*v;this.AimLine.active=!0,this.AimLine.x=p,a.x=p,a.y=t/2+i-u*t+1}else{this.AimLine.active=!1,a.parent=this.UnitBackground.parent;var m=this.UnitBackground.parent.convertToNodeSpaceAR(s);a.position=m}}}}.bind(this)),this.node.on("touchend",function(t){if(!n.moveAnim){n.moveAnim=!0;var e=this.PreUnitItem;e.extraData=n.rotatePreItemMatrix(e.extra),cc.tween(e).by(.2,{angle:-90}).call(function(){n.moveAnim=!1}).start()}}.bind(this)),this.node.on("touchcancel",function(t){this.releaseSelected(this,t)}.bind(this))},createPreUnitItem:function(){var t=n.unitSize;cc.resources.load("Prefab/pre unit item",function(e,i){var o=cc.instantiate(i);o.oriPosition=this.node.position,o.width=t-1,o.height=t-1,o.position=this.node.position,this.UnitBackground.parent.addChild(o),this.PreUnitItem=o,o.extra=[];var r=n.preUnitDataList.length;n.preUnitDataList[Math.floor(Math.random()*r)].forEach(function(e){var n=cc.instantiate(i);n.width=t-1,n.height=t-1,n.position=cc.v2(t*e[0],t*e[1]),n.parent=o,n.data=e,o.extra.push(n)})}.bind(this))},releaseSelected:function(t,e){if(null!==n.selected){var i=n.unitSize,o=i*n.width/2,r=i*n.height/2,a=e.getLocation(),s=this.UnitBackground.convertToNodeSpaceAR(a),c=s.x,h=s.y;c>-o&&c<o&&h>-r&&h<r?this.releaseInArea():(n.moveAnim=!0,n.selected.parent=this.UnitBackground.parent,cc.tween(n.selected).to(.2,{position:n.selected.oriPosition}).call(function(){n.moveAnim=!1}).start()),this.AimLine.active=!1,n.selected=null}},releaseInArea:function(){var t=this;n.moveAnim=!0;var e=n.selected,i=n.speed,o=this.detectCollision();if(o)return o.has=e,this.PreUnitItem=null,void cc.tween(e).to(((n.height+1)/2-o.j)*i,{position:o.position}).call(function(){e.parent=t.RetUnitLayer,e.position=n.convertPositionToRetUnitLayer(e.position);var i=Math.max(Math.abs(o.i),Math.abs(o.j));e.color=n.unitColorList[i],e.extra.forEach(function(e){e.parent=t.RetUnitLayer;var i=e.data,r=n.getUnitFromList(o.i+i[0],o.j+i[1]);e.position=n.convertPositionToRetUnitLayer(r.position);var a=Math.max(Math.abs(r.i),Math.abs(r.j));e.color=n.unitColorList[a],r.has=e});var r=n.checkClear(0,0);n.incScore(r),n.rotateUnitMatrix(),cc.tween(t.RetUnitLayer).delay(.3).by(.3,{angle:-90}).call(function(){n.preCount--,n.preCount<=0&&(n.preCount=3,n.preNodeList.forEach(function(t){t.createPreUnitItem()})),n.times++,n.moveAnim=!1}).start()}).start();!1!==o?cc.tween(n.selected).to(n.height*i,{position:cc.v2(n.selected.position.x,-n.selected.position.y)}).to(.2,{position:n.selected.oriPosition}).call(function(){n.moveAnim=!1}).start():cc.tween(n.selected).by(.2,{position:cc.v2(0,-10)}).call(function(){n.GameoverLayer.active=!0}).start()},detectCollision:function(){for(var t=n.selected.x/n.unitSize,e=(n.height-1)/2,i=(n.height-1)/2,o=null,r=function(e){var r=n.getUnitFromList(t,e),a=!0;return n.selected.extra.forEach(function(o){var r=o.data,s=t+r[0],c=e+r[1];if(!(Math.abs(s)>i||Math.abs(c)>i)){var h=n.getUnitFromList(s,c);h&&h.has&&(a=!1)}}),a?r?r.has?{v:null!==o&&o}:void(o=r):"continue":{v:null!==o&&o}},a=e;a>=-e;a--){var s=r(a);switch(s){case"continue":continue;default:if("object"==typeof s)return s.v}}return null}}),cc._RF.pop()},{Global:"Global"}]},{},["BanTouch","Canvas","Global","PreUnit"]);