import { Character } from "./Character.js";

export class Player extends Character {
    /** Keys to control the player */
    keys = null;

    constructor(scene, x, y) {
        super(scene, x, y);
        this.hitboxOffsetX = -15;
        this.hitboxOffsetY = 14;
        this.hitboxWidth = 30;
        this.hitboxHeight = 32;
        this.on(Phaser.Animations.Events.ANIMATION_START, (anim, frame) => {
        }, this);
        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim, frame) => {
            if (anim.key == "AttackIdle" || anim.key == "AttackRun" || anim.key == "AttackJump" || anim.key == "AttackD") {
                this.stopMeleeAttack();
            }
        }, this);
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    init(texture) {
        super.init(texture);

        this.keys = this.scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
            meleeAttack: Phaser.Input.Keyboard.KeyCodes.K
        }, false);

        this.keys.jump.on("down", this.jump, this);
        this.keys.meleeAttack.on("down", this.meleeAttack, this);
        this.lookOnRight()
    }
    initAnimations(texture) {
        super.initAnimations(texture);
        this.anims.create({
            key: "Idle",
            frames: this.anims.generateFrameNames(this.texture.key, { prefix: "idle", suffix: ".png", start: 1, end: 9, zeroPad: 2 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: "Run",
            frames: this.anims.generateFrameNames(this.texture.key, { prefix: "run", suffix: ".png", start: 1, end: 8, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "Jump",
            frames: this.anims.generateFrameNames(this.texture.key, { prefix: "jump_mid", suffix: ".png", start: 1, end: 4, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "Die",
            frames: this.anims.generateFrameNames(this.texture.key, { prefix: "death", suffix: ".png", start: 1, end: 5, zeroPad: 2 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: "AttackIdle",
            frames: this.anims.generateFrameNames(this.texture.key, { prefix: "AttackA", suffix: ".png", start: 1, end: 7, zeroPad: 2 }),
            frameRate: 16,
            repeat: 0
        });

        this.anims.create({
            key: "AttackRun",
            frames: this.anims.generateFrameNames(this.texture.key, { prefix: "AttackB", suffix: ".png", start: 1, end: 5, zeroPad: 2 }),
            frameRate: 16,
            repeat: 0
        });

        this.anims.create({
            key: "AttackJump",
            frames: this.anims.generateFrameNames(this.texture.key, { prefix: "AttackC", suffix: ".png", start: 1, end: 7, zeroPad: 2 }),
            frameRate: 16,
            repeat: 0
        });

        this.anims.create({
            key: "AttackD",
            frames: this.anims.generateFrameNames(this.texture.key, { prefix: "AttackD", suffix: ".png", start: 1, end: 8, zeroPad: 2 }),
            frameRate: 16,
            repeat: 0
        });
        this.anims.play("Idle");
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    updateAnimations() {
        if (!this.isDead()) {
            super.updateAnimations();
            if (!this.body.onFloor()) {
                if (this.isMeleeAttacking) {
                    if (this.anims.currentAnim.key != "AttackRun" && this.anims.currentAnim.key != "AttackIdle") {
                        this.anims.play("AttackJump", true)
                    }
                }
                else {
                    this.anims.play("Jump", true);
                }
            }
            else if (this.isWalking) {
                
                if (this.isMeleeAttacking) {
                    if (this.anims.currentAnim.key != "AttackJump" && this.anims.currentAnim.key != "AttackIdle") {
                        this.anims.play("AttackRun", true)
                    }
                }
                else {
                    this.anims.play("Run", true);
                }
            }
            else {
                if (this.isMeleeAttacking) {
                    if (this.anims.currentAnim.key != "AttackJump" && this.anims.currentAnim.key != "AttackRun") {
                        this.anims.play("AttackIdle", true)
                    }
                }
                else {
                    this.anims.play("Idle", true)
                }
            }
        }
        this.setFlipX(!this.isLookingRight)
        if (this.flipX) {
            this.body.setOffset(32, 30)
        }
        else {
            this.body.setOffset(12, 30)
        }
    }


    updateControls() {
        if (this.keys.right.isDown) {
            this.walkOnRight();
        }
        else if (this.keys.left.isDown) {
            this.walkOnLeft();
        }
        else {
            this.stopWalking()
        }
    }
    die() {
        super.die();
        this.anims.play('Die')
        
    }
    meleeAttack() {
        super.meleeAttack();
        this.anims.play("AttackA")
        
    }
    jump(){
        super.jump();
        this.scene.sound.play('jump')
    }
    recover() {
        super.recover();

        const tweenSlow = this.alphaAnimation(350, 2);
        tweenSlow.on("complete", () => {
            this.setAlpha(1);

            const tweenFast = this.alphaAnimation(100, 4);
            tweenFast.on("complete", () => {
                this.setAlpha(1);
                this.stopRecovering();
            }, this);
        }, this);
    }

    alphaAnimation(duration, repeat) {
        return this.scene.tweens.add({
            targets: this,
            alpha: 0.2,
            ease: Phaser.Math.Easing.Linear,
            yoyo: true,
            duration: duration,
            repeat: repeat,
        });
    }
    hurt(pushOnRight, pushVelocity) {
        super.hurt(pushOnRight, pushVelocity);
        this.scene.cameras.main.shake(200, 0.002, false)
    }
}
