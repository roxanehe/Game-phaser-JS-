export class Meleehitbox extends Phaser.GameObjects.Zone{
character = null;
constructor(scene, x, y, width, height)
{
super(scene, x, y, width, height);

scene.add.existing(this);
scene.physics.add.existing(this);
this.body.setAllowGravity(false);
this.body.enable = false;
}

}