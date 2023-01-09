import {Item} from './Item.js'

export class Heart extends Item
{
constructor(scene, x, y, texture, frame)
{
super(scene, x, y, texture, frame);
}
onTouch(character){
    super.onTouch(character);
    const healValue = 1;
    character.heal(healValue);
    const heartText = this.scene.add.text(this.x, this.y - 6, "+" + healValue.toString(), { color: "#FF0000", fontSize: "16px", fontStyle: "bold" });
    heartText.setOrigin(0.5);
    this.scene.time.delayedCall(600, () => { heartText.destroy(); }, null, this);
}

}