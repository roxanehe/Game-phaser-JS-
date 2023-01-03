import { Npc } from "./Npc.js";
export class Enemy02 extends Npc {

constructor(scene, x, y)
{
super(scene, x, y);
this.hitboxOffsetX = -20;
this.hitboxOffsetY = 5;
this.hitboxWidth = 15;
this.hitboxHeight = 22;
this.health = 3;
this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim, frame) => {
    if (anim.key == "Attack") {
    this.stopMeleeAttack();
    }
    }, this);
}

initAnimations(texture){
    super.initAnimations(texture);
    this.anims.create({
    key: "Idle",
    frames: this.anims.generateFrameNames(this.texture.key, { prefix: "idle", suffix: ".png", start: 1, end: 11, zeroPad: 2 }),
    frameRate: 8,
    repeat: -1
    });
    
    this.anims.create({
    key: "Attack",
    frames: this.anims.generateFrameNames(this.texture.key, { prefix: "attack", suffix: ".png", start: 1, end: 8, zeroPad: 2 }),
    frameRate: 10,
    repeat: 0
    });
    
    this.anims.create({
    key: "Hit",
    frames: this.anims.generateFrameNames(this.texture.key, { prefix: "hit", suffix: ".png", start: 1, end: 3, zeroPad: 2 }),
    frameRate: 10,
    repeat: -1
    });
    this.anims.create({
        key: "Walk",
        frames: this.anims.generateFrameNames(this.texture.key, { prefix: "walk", suffix: ".png", start: 1, end: 8, zeroPad: 2 }),
        frameRate: 10,
        repeat: -1
        });
    this.anims.play('Walk')
}
updateAnimations()
    {
        super.updateAnimations();
        if(!this.isDead()){
            if(this.isMeleeAttacking){
                this.anims.play('Attack',true)
            }else{
                this.anims.play('Walk',true)
            }
            this.setFlipX(!this.isLookingRight)
            if(this.flipX){
                this.body.setOffset(10,8) 
            }
            else{
                this.body.setOffset(0,8)
            }
        }
    }
    die(){
        super.die();
        this.anims.play('Hit')
    }
}