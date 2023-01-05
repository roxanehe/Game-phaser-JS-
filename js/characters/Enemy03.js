import { Npc } from "./Npc.js";
export class Enemy03 extends Npc {

constructor(scene, x, y)
{
super(scene, x, y);
this.Patrol = false;
this.hitboxOffsetX = -20;
this.hitboxOffsetY = 15;
this.hitboxWidth = 15;
this.hitboxHeight = 30;
this.health = 2;
this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim, frame) => {
    if (anim.key == "Attack-left"|| anim.key == "Attack-right") {
    this.stopMeleeAttack();
    }
    }, this);
}

initAnimations(texture){
    super.initAnimations(texture);
    this.anims.create({
    key: "Idle",
    frames: this.anims.generateFrameNames(this.texture.key, { prefix: "idle", suffix: ".png", start: 1, end:8, zeroPad: 2 }),
    frameRate: 8,
    repeat: -1
    });
    
    this.anims.create({
    key: "Attack-left",
    frames: this.anims.generateFrameNames(this.texture.key, { prefix: "attack_left", suffix: ".png", start: 1, end: 8, zeroPad: 2 }),
    frameRate: 10,
    repeat: 0
    });
    this.anims.create({
        key: "Attack-right",
        frames: this.anims.generateFrameNames(this.texture.key, { prefix: "attack_right", suffix: ".png", start: 1, end: 8, zeroPad: 2 }),
        frameRate: 10,
        repeat: 0
    });
    
    this.anims.create({
    key: "Hit",
    frames: this.anims.generateFrameNames(this.texture.key, { prefix: "hit", suffix: ".png", start: 1, end: 3, zeroPad: 2 }),
    frameRate: 10,
    repeat: -1
    });
    this.anims.play('Idle')
}
updateAnimations()
    {
        super.updateAnimations();
        if(!this.isDead()){
            if(this.isMeleeAttacking){
                this.anims.play('Attack-left',true)
            }else{
                this.anims.play('Idle',true)
            }
            this.setFlipX(!this.isLookingRight)
            if(this.flipX){
                this.body.setOffset(20,30) 
            }
            else{
                this.body.setOffset(20,30)
            }
        }
    }
    die(){
        super.die();
        this.scene.sound.play('enemyKill')
        this.anims.play('Hit')
    }
}