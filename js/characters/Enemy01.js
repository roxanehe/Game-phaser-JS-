import { Npc } from "./Npc.js";
export class Enemy01 extends Npc {

constructor(scene, x, y)
{
super(scene, x, y);
this.hitboxOffsetX = -30;
this.hitboxOffsetY = -2;
this.hitboxWidth = 15;
this.hitboxHeight = 25;
this.health = 2;
this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim, frame) => {
    if (anim.key == "Attack") {
    this.stopMeleeAttack();
    }
    }, this);
}
init(texture){
    super.init(texture);
    this.body.setAllowGravity(false)
}
initAnimations(texture){
    super.initAnimations(texture);
    this.anims.create({
    key: "Fly",
    frames: this.anims.generateFrameNames(this.texture.key, { prefix: "fly", suffix: ".png", start: 1, end: 7, zeroPad: 2 }),
    frameRate: 8,
    repeat: -1
    });
    
    this.anims.create({
    key: "Attack",
    frames: this.anims.generateFrameNames(this.texture.key, { prefix: "attack", suffix: ".png", start: 1, end: 10, zeroPad: 2 }),
    frameRate: 10,
    repeat: 0
    });
    
    this.anims.create({
    key: "Hit",
    frames: this.anims.generateFrameNames(this.texture.key, { prefix: "hit", suffix: ".png", start: 1, end: 3, zeroPad: 2 }),
    frameRate: 10,
    repeat: -1
    });
    this.anims.play('Fly')
}
updateAnimations()
    {
        super.updateAnimations();
        if(!this.isDead()){
            if(this.isMeleeAttacking){
                this.anims.play('Attack',true)
            }else{
                this.anims.play('Fly',true)
            }
            this.setFlipX(!this.isLookingRight)
            if(this.flipX){
                this.body.setOffset(0,0) 
            }
            else{
                this.body.setOffset(0,0)
            }
        }
        
    }
    die(){
        super.die();
        this.anims.play('Hit')
    }
}