import {Item} from './Item.js'

export class Heart extends Item
{
constructor(scene, x, y, texture, frame)
{
super(scene, x, y, texture, frame);
}
onTouch(character){
    super.onTouch(character);
    character.heal(1);
}

}