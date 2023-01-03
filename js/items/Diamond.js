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
    this.scene.diamondPoints+=this.value
}
}