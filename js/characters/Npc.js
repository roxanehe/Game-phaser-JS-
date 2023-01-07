import { Character } from "./Character.js";

export class Npc extends Character
{
startPathX = 0;
endPathX = 100;
Patrol = true;
    
constructor(scene, x, y)
{
super(scene, x, y);
// this.lookOnRight();
}

init(texture){
    super.init(texture);
    if(this.Patrol){ 
        this.walkOnRight()
    }
    this.scene.time.addEvent({delay:3000,loop:true,callback:()=>this.meleeAttack(),callbackScope:this})
}

updateControls()
{   if(this.Patrol){
    if (this.x<this.startPathX) {
        this.walkOnRight();
    }
    if (this.x>this.endPathX){
    this.walkOnLeft();
  }
}
}
die(){
    super.die();
    this.scene.tweens.add({targets:this,alpha:0,duration:2000})
}
recover(){
    super.recover();
    this.scene.time.delayedCall(400,()=> this.stopRecovering())
}
stopHurtAnimation(){
    super.stopHurtAnimation();
    if(this.Patrol){
        if(this.isLookingRight){
            this.walkOnRight();
        }else{
            this.walkOnLeft();
        }
    }
}
}
