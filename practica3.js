"use strict"
var game = function () {
    // Set up an instance of the Quintus engine and include
    // the Sprites, Scenes, Input and 2D module. The 2D module
    // includes the `TileLayer` class as well as the `2d` componet.
    var Q = Quintus({
        audioSupported: ['mp3', 'ogg']
    })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX,Audio")
        // Maximize this game to whatever the size of the browser is
        .setup({
             maximize:true,
             scaleToFit: true,
             width: 1200,
             height: 612

        })
        // And turn on default input controls and touch input (for UI)
        .controls().touch().enableSound();



    Q.load("buttonHard.png, buttonEasy.png, buttonMedio.png, daddy.png, mario_small.json, goomba.png, goomba.json, covidVerde.png, tiles.png, bloopa.json, bloopa.png, princess.png, hospital.png, coin.png, coin.json, music_main.mp3, music_main.ogg,coin.mp3, coin.ogg,music_die.mp3, music_die.ogg, music_level_complete.mp3, music_level_complete.ogg, squish_enemy.mp3, squish_enemy.ogg", function () {
        
    Q.debug=true;
     
        // Or from a .json asset that defines sprite locations
        Q.compileSheets("daddy.png", "mario_small.json");
        Q.animations('player_anim', {
            run_right: {
                frames: [1, 2, 3],
                rate: 1 / 15
            },
            run_left: {
                frames: [15, 16, 17],
                rate: 1 / 5
            },
            stand_right: {
                frames: [0],
                rate: 1 / 5
            },
            stand_left: {
                frames: [14],
                rate: 1 / 5
            },
            jump_right: {
                frames: [1, 2, 3],
                rate: 1 / 5
            },
            jump_left: {
                frames: [1, 2, 3],
                rate: 1 / 5
            },
            fall_right: {
                frames: [1, 2, 3],
                rate: 1 / 5,
                loop: false
            },
            fall_left: {
                frames: [1, 2, 3],
                rate: 1 / 5,
                loop: false
            },
            die: {
                frames: [12],
                rate: 1 / 5
            }
        });


        Q.Sprite.extend("Player", {

            init: function (p) {
                this._super(p, {
                    sprite: "player_anim",
                    sheet: "daddyR",
                    x: 50,
                    y: 380,
                    dead: false
                });
                this.add('2d, platformerControls, animation');

            },
            step: function (dt) {
                this.p.points[0] = [-25, -25];
                this.p.points[1] = [-25, 25];
                this.p.points[2] = [15, 25];
                this.p.points[3] = [15, -25];
                if (!this.p.dead) {
                    if (this.p.vy < 0) { //jump
                        this.p.y -= 2;
                        this.p.landed == true;
                        this.play("jump_" + this.p.direction);
                    } else if (this.p.vy > 0) {
                        this.play("fall_" + this.p.direction);
                        if (this.p.y > 580) {
                            this.play("die");
                            this.p.dead = true;
                            Q.stageScene("endGame", 1, {
                                label: "You Died"
                            });
                        }
                    } else if (this.p.vx > 0 && this.p.vy == 0) {
                        this.play("run_right");
                    } else if (this.p.vx < 0 && this.p.vy == 0) {
                        this.play("run_left");
                    } else {
                        this.play("stand_" + this.p.direction);
                    }
                } else {
                    this.p.vx = 0;
                }

            }
        });

        Q.component("defaultEnemy", {
            added: function () {

                this.entity.on("bump.left,bump.right,bump.bottom, bump.top", function (collision) {

                    if (collision.obj.isA("Player") && !collision.obj.p.dead) {
                        collision.obj.play("die");
                        collision.obj.p.dead = true;
                        collision.obj.p.vy = -500;
                        collision.obj.del("platformerControls");
                        Q.stageScene("endGame", 1, {
                            label: "You Died"
                        });


                    }
                });
     
            }
        });

        Q.compileSheets("goomba.png", "goomba.json");

        Q.animations('goomba_anim', {
            move: {

                frames: [0, 1],
                rate: 1 / 10,
                loop: true
            },
            die: {
                frames: [2],
                rate: 1 / 5,
                loop: false
            }
        });


        Q.Sprite.extend("Goomba", {

            init: function (p) {

                this._super(p, {
                    sprite: "goomba_anim",
                    sheet: "goomba",
                    x: p.x,
                    y: p.y,
                    vx: 40,
                    dead: false
                });
                this.add('2d,aiBounce,defaultEnemy,animation');
            },
            step: function (dt) {
                if (this.p.vx > 0 || this.p.vx < 0)
                    this.play("move");
            }
        });

        Q.compileSheets("covidVerde.png", "bloopa.json");
        Q.animations('bloopa_anim', {
            move_up: {
                frames: [0, 1, 2],
                rate: 1 / 2,
                loop: false
            },
            //move_down: {
              //  frames: [2],
                //rate: 1 / 15,
                //loop: false
            //},
            
        });
        Q.Sprite.extend("Bloopa", {
            init: function (p) {
                this._super(p, {
                    sprite: "bloopa_anim",
                    sheet: "virus",
                    x: p.x,
                    y: p.y,
                    vy: 0,
                    move: 'up',
                    dead: false,
                    range: p.range,
                    gravity:0,
                    dest: 0
                });
                this.add('2d,defaultEnemy,animation');
            },
            step: function (dt) {
                this.p.points[0] = [-25, -25];
                 this.p.points[1] = [-25, 25];
                 this.p.points[2] = [25, 25];
                this.p.points[3] = [25, -25];
                
               
                if (this.p.vy== 0)
                    this.play("move_up");
                    /*
                else
                    this.play("move_down");
                */

            }
        });

        Q.compileSheets("coin.png", "coin.json");
        Q.animations('coin_anim', {
            taken: {
                frames: [0, 1, 2],
                rate: 1 / 15,
                loop: true
            }
        });
        Q.Sprite.extend("Coin", {
            init: function (p) {
                this._super(p, {
                    sprite: "coin_anim",
                    sheet: "coin",
                    x: p.x,
                    y: p.y,
                    sensor: true,
                    gravity: 0,
                    frame: 0,
                    hit: false
                });
                this.add('2d, animation, aiBounce, tween');
                this.on("bump.left,bump.right,bump.bottom,bump.top", function (collision) {
                    if (collision.obj.isA("Player") && !collision.obj.p.dead) {
                        if (!this.p.hit) {
                            this.play("taken")
                            this.p.hit = true;
                            Q.audio.play('coin.mp3');
                            this.animate({
                                x: this.p.x,
                                y: this.p.y - 100
                            },
                                1, Q.Easing.Quadratic.Linear, {
                                callback: () => {
                                    this.destroy();
                                    Q.state.inc("score", 1);
                                }
                            });
                        }
                    }
                });
            }
        });

        Q.compileSheets("princess.png");
        Q.Sprite.extend("Princess", {
            init: function (p) {
                this._super(p, {
                    asset: "princess.png",
                    x: 3640,
                    y: 508,
                    win: false
                });
                this.add('2d');
                this.on("bump.left,bump.right,bump.bottom,bump.top", function (collision) {
                    if (collision.obj.isA("Player") && !collision.obj.p.dead && !this.p.win) {
                        this.p.win = true;
                        Q.stageScene("winGame", 1, {
                            label: "You just got friendzoned <3"
                        });
                    }
                });
            },
            step: function (dt) { }
        });

        Q.scene("endGame", function (stage) {
            Q.audio.stop('music_main.mp3');
            Q.audio.play('music_die.mp3');

            var container = stage.insert(new Q.UI.Container({
                x: Q.width / 2,
                y: Q.height / 2,
                fill: "rgba(0,0,0,0.5)"
            }));

            var button = container.insert(new Q.UI.Button({
                x: 0,
                y: 0,
                fill: "#CCCCCC",
                label: "Play Again"
            }));

            var label = container.insert(new Q.UI.Text({
                x: 10,
                y: -10 - button.p.h,
                label: stage.options.label
            }));

            button.on("click", function () {
                Q.audio.stop();
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('level1');
                Q.state.p.score = 0;
                Q.audio.play('music_main.mp3', {
                    loop: true
                });
            });
            Q.input.on('fire', this, () => {
                Q.audio.stop();
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('level1');
                Q.state.p.score = 0;
                Q.audio.play('music_main.mp3', {
                    loop: true
                });
            });
            container.fit(20);
        });

        Q.scene("winGame", function (stage) {
            Q.audio.stop('music_main.mp3');
            Q.audio.play('music_level_complete.mp3');

            var container = stage.insert(new Q.UI.Container({
                x: Q.width / 2,
                y: Q.height / 2,
                fill: "rgba(0,0,0,0.5)"
            }));

            var button = container.insert(new Q.UI.Button({
                x: 0,
                y: 0,
                fill: "#CCCCCC",
                label: "Play Again"
            }));

            var label = container.insert(new Q.UI.Text({
                x: 10,
                y: -10 - button.p.h,
                label: stage.options.label
            }));

            button.on("click", function () {
                Q.audio.stop();
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('level1');
                Q.state.p.score = 0;
                Q.audio.play('music_main.mp3', {
                    loop: true
                });

            });
            Q.input.on('fire', this, () => {
                Q.audio.stop();
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('level1');
                Q.state.p.score = 0;
                Q.audio.play('music_main.mp3', {
                    loop: true
                });
            
            });
            container.fit(20);
        });


        Q.compileSheets("buttonMedio.png", "buttonEasy.png", "buttonHard.png");

        Q.scene("title-screen", function (stage) {
            var container = stage.insert(new Q.UI.Container({
                x: Q.width / 2,
                y: Q.height / 2,
                w: Q.width,
                h: Q.height,
                fill: "rgba(0,0,0,0.5)"
            }));

            var buttonEasy = container.insert(new Q.UI.Button({
                asset: "buttonEasy.png",
                label: "Nivel Fácil",
                y: -100,
                x: 0,
                fill: "#1C00ff00"
            }));
            buttonEasy.on("click", function () {
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('level1');
                Q.audio.play('music_main.mp3', {
                    loop: true
                });

            });
            var buttonMedio = container.insert(new Q.UI.Button({
                asset: "buttonMedio.png",
                label: "Nivel Normal",
                y: 0,
                x: 0,
                fill: "#1C00ff00"
                
            }));
            buttonMedio.on("click", function () {
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('level1');
                Q.audio.play('music_main.mp3', {
                    loop: true
                });

            });

            var buttonDificil = container.insert(new Q.UI.Button({
                asset: "buttonHard.png",
                label: "Nivel Difícil",
                y: 100,
                x: 0,
                fill: "#1C00ff00"
                
            }));
            buttonDificil.on("click", function () {
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('level1');
                Q.audio.play('music_main.mp3', {
                    loop: true
                });

            });


            Q.input.on('fire', this, () => {
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('level1');
                Q.audio.play('music_main.mp3', {
                    loop: true
                });
            });

            container.fit(20);
        });

        Q.scene("hud", function (stage) {
            Q.UI.Text.extend("Score", {
                init: function (p) {
                    this._super({
                        label: "score: 0",
                        x: 50,
                        y: 0
                    });
                    Q.state.on("change.score", this, "score");
                },
                score: function (score) {
                    this.p.label = "score: " + score;
                },
            });
            stage.insert(new Q.Score());
        })


        Q.scene("level1", function (stage) {
            Q.stageTMX("level.tmx", stage);
            // Create the player and add them to the stage

            var player = stage.insert(new Q.Player());
            stage.add("viewport").follow(player, {
                x: true,
                y: false
            });
            stage.insert(new Q.Princess());

        });



        Q.loadTMX("level.tmx", function () {
            Q.state.reset({
                score: 0
            });
            Q.stageScene("title-screen");
        });

    });

}