export class Item extends Phaser.Physics.Arcade.Image
{
constructor(scene, x, y, texture, frame)
{
super(scene, x, y, texture, frame);
}
init (texture){
    this.setTexture(texture)
    this.body.allowGravity= false;
  }
onTouch(character){
   this.disableBody(true,true)
}
}