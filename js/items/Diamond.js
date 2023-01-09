import {Item} from './Item.js'

export class Diamond extends Item
{
value = 1;
constructor(scene, x, y, texture, frame)
{
super(scene, x, y, texture, frame);
}
onTouch(character){
    super.onTouch(character);
    this.scene.diamondPoints+=this.value;
    const diamondText = this.scene.add.text(this.x, this.y - 6, "+" + this.value.toString(), { color: "#00e591", fontSize: "16px", fontStyle: "bold" });
    diamondText.setOrigin(0.5);
    this.scene.time.delayedCall(600, () => { diamondText.destroy(); }, null, this);
}
}