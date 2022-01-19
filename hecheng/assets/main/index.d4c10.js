window.__require=function e(t,i,o){function n(a,r){if(!i[a]){if(!t[a]){var l=a.split("/");if(l=l[l.length-1],!t[l]){var s="function"==typeof __require&&__require;if(!r&&s)return s(l,!0);if(c)return c(l,!0);throw new Error("Cannot find module '"+a+"'")}a=l}var u=i[a]={exports:{}};t[a][0].call(u.exports,function(e){return n(t[a][1][e]||e)},u,u.exports,e,t,i,o)}return i[a].exports}for(var c="function"==typeof __require&&__require,a=0;a<o.length;a++)n(o[a]);return n}({Ball:[function(e,t,i){"use strict";cc._RF.push(t,"41275+Z8FxEZJ9u+MVPDoI6","Ball");var o=e("Global");cc.Class({extends:cc.Component,properties:{},onBeginContact:function(e,t,i){if(!t.node.hitFlag){var n=t.node.typeId;if(0!==n&&n===i.node.typeId){i.node.hitFlag=!0,t.node.hitFlag=!0;var c=o.MainBackground.convertToNodeSpaceAR(e.getWorldManifold().points[0]);i.node.destroy(),t.node.destroy();var a=o.MainBackground,r=cc.instantiate(o.ballPrefab),l=o.ballSettingList[n-1];r.setContentSize(l.size,l.size),r.getComponent(cc.Sprite).spriteFrame=l.texture;var s=r.getComponent(cc.PhysicsCircleCollider);s.radius=l.size/2,s.apply(),r.typeId=l.id,r.position=c,console.log(l.score),o.incScore(l.score);var u=cc.instantiate(o.atomPrefab);u.position=c,a.addChild(r),a.addChild(u)}}}}),cc._RF.pop()},{Global:"Global"}],Canvas:[function(e,t,i){"use strict";cc._RF.push(t,"280c3rsZJJKnZ9RqbALVwtK","Canvas");var o=e("Global");cc.Class({extends:cc.Component,properties:{Background:{default:null,type:cc.Node},ScoreLabel:{default:null,type:cc.Label}},onLoad:function(){o.MainBackground=this.Background,o.ScoreLabel=this.ScoreLabel,cc.director.getPhysicsManager().enabled=!0,cc.director.getPhysicsManager().gravity=cc.v2(0,-960),cc.director.getCollisionManager().enabled=!0,cc.resources.load("ball",function(e,t){o.ballPrefab=t}),cc.resources.load("atom",function(e,t){o.atomPrefab=t});var e=o.ballSettingList;e.forEach(function(e){cc.resources.load(e.imgPath,cc.SpriteFrame,function(t,i){e.texture=i})});var t=setInterval(function(){var i=!0;if(e.forEach(function(e){null===e.texture&&(i=!1)}),o.ballPrefab&&o.ballPrefab&&i){var n=o.createBall(0);o.currentBall=n,clearInterval(t)}},500)}}),cc._RF.pop()},{Global:"Global"}],Global:[function(e,t,i){"use strict";cc._RF.push(t,"5294aeoi/VLA4oIgi0m/j4c","Global"),t.exports={width:300,height:500,score:0,ballSettingList:[{id:0,size:100,imgPath:"images/ball_1",texture:null,score:300},{id:1,size:90,imgPath:"images/ball_2",texture:null,score:240},{id:2,size:80,imgPath:"images/ball_3",texture:null,score:200},{id:3,size:70,imgPath:"images/ball_4",texture:null,score:160},{id:4,size:60,imgPath:"images/ball_5",texture:null,score:120},{id:5,size:50,imgPath:"images/ball_6",texture:null,score:80},{id:6,size:40,imgPath:"images/ball_7",texture:null,score:40},{id:7,size:30,imgPath:"images/ball_8",texture:null,score:20},{id:8,size:20,imgPath:"images/ball_9",texture:null,score:10}],ballPrefab:null,atomPrefab:null,MainBackground:null,ScoreLabel:null,currentBall:null,setScore:function(e){this.score=e,this.ScoreLabel.string=e},incScore:function(e){this.score=this.score+e,this.ScoreLabel.string=this.score},createBall:function(e){var t=cc.instantiate(this.ballPrefab),i=parseInt(Math.random()*(this.ballSettingList.length-4))+4,o=this.ballSettingList[i];t.setContentSize(o.size,o.size),t.getComponent(cc.Sprite).spriteFrame=o.texture,t.getComponent(cc.RigidBody).type=cc.RigidBodyType.Static;var n=t.getComponent(cc.PhysicsCircleCollider);return n.radius=o.size/2,n.apply(),t.typeId=o.id,t.oriTop=(this.height-o.size)/2,t.position=cc.v2(e,t.oriTop),this.MainBackground.addChild(t),t}},cc._RF.pop()},{}],MainBackGround:[function(e,t,i){"use strict";cc._RF.push(t,"b196bSMDA1HH7JchbNh4+Xs","MainBackGround");var o=e("Global");cc.Class({extends:cc.Component,properties:{},onLoad:function(){var e=this.node;o.height;this.node.on("touchmove",function(t){if(null!==o.currentBall){var i=o.currentBall,n=t.getLocation(),c=e.convertToNodeSpaceAR(n);i.position=cc.v2(c.x,i.oriTop)}}.bind(this)),this.node.on("touchend",function(t){if(null!==o.currentBall){var i=o.currentBall;o.currentBall=null;var n=t.getLocation(),c=e.convertToNodeSpaceAR(n);i.position=cc.v2(c.x,i.oriTop),i.getComponent(cc.RigidBody).type=cc.RigidBodyType.Dynamic,setTimeout(function(){var e=o.createBall(0);o.currentBall=e},1e3)}}.bind(this))}}),cc._RF.pop()},{Global:"Global"}],homeBtn:[function(e,t,i){"use strict";cc._RF.push(t,"bf21fbX6P1CF7OlKYP7ccLe","homeBtn"),cc.Class({extends:cc.Component,properties:{},gohome:function(){window.location.href="/index.html"}}),cc._RF.pop()},{}]},{},["Ball","Canvas","Global","MainBackGround","homeBtn"]);