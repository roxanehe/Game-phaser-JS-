import { CST } from "../CST.js"

export class SceneGameUI extends Phaser.Scene
{

sceneGame = null;

constructor()
{
super({key: CST.SCENES.GAME_UI});
}

init(data) {
this.sceneGame = data.sceneGame;
this.sceneGame.events.on('levelClear',this.onLevelClear,this)
}

create(){
    const playerbackground = this.add.image(72,33,"playerBackground");
    playerbackground.setScale(3);
    this.healthImage = [];
    for(let i =0;i<Math.ceil(this.sceneGame.player.health/2);i++){
        this.healthImage.push(this.add.image(64+i*24,54,'heartEmpty').setScale(3))
    }
    this.diamondText = this.add.text(130, 10, "0", { color: "white", fontSize: "20px", bold: true }).setOrigin(1,0);
    
    //create a dialogue
    this.createDialogue();

    this.endlevelbackground = this.add.graphics()
    this.endlevelbackground.setVisible(false)

    this.endlevelText = this.add.text(CST.GAME.WIDTH/2, CST.GAME.HEIGHT/2, "Congrats, you can move to next level!", { color: "white", fontSize: "40px", bold: true }).setOrigin(0.5);
    this.endlevelText.setVisible(false)
}
update(){
    this.diamondText.setText(this.sceneGame.diamondPoints)

    const playerHealth = this.sceneGame.player.health
    let fullheartCount = Math.floor(playerHealth/2);
    for(let i =0;i<fullheartCount;i++){
            this.healthImage[i].setTexture("heartFull")
    }   
    if(playerHealth % 2==1 && this.healthImage.length>fullheartCount){
            this.healthImage[fullheartCount].setTexture("heartHalf")
        }else if(playerHealth % 2==0 && this.healthImage.length>fullheartCount){
            this.healthImage[fullheartCount].setTexture("heartEmpty")
        }
    for(let i =fullheartCount+1;i< this.healthImage.length;i++){
        this.healthImage[i].setTexture("heartEmpty")
    }
}
onLevelClear(){
    this.endlevelbackground.setVisible(true)
    this.endlevelbackground.clear()
    this.endlevelbackground.x = -CST.GAME.WIDTH
    this.endlevelbackground.fillRect(this.endlevelbackground.x,0,CST.GAME.WIDTH,CST.GAME.HEIGHT)
    this.endlevelbackground.fillStyle('black',1)
  this.tweens.add({targets:this.endlevelbackground,x:0,duration:2000,delay:500,onUpdate:()=>{
    this.endlevelbackground.clear();
    this.endlevelbackground.fillRect(this.endlevelbackground.x,0,CST.GAME.WIDTH,CST.GAME.HEIGHT)
},onComplete:()=>this.endlevelText.setVisible(true),onCompleteScope:this})
}

createDialogue(){
  const dialogueWidth = CST.GAME.WIDTH-100;
  const dialogueHeight = 80;
  this.dialogueBox = this.rexUI.add.textBox(
    {background: this.add.image(0, 0, "dialogue"),
    text: this.add.text(0, 0, "", {fontFamily: "fantasy", fontSize: "36px", fontStyle: "bold", color: "#FFFFFF", align: "center",wordWrap: { width: dialogueWidth }}).setFixedSize(dialogueWidth,dialogueHeight),
    space: {left: 30, right: 30, top: 40, bottom: 20,icon: 0, text: 0},
    page: {maxLines: 1,pageBreak: '\n'},
}).setOrigin(0.5).layout()

  this.dialogueBox.setPosition(CST.GAME.WIDTH/2,700)
  
  const keys = this.input.keyboard.addKeys({
    nextPage: Phaser.Input.Keyboard.KeyCodes.ENTER,
    skip: Phaser.Input.Keyboard.KeyCodes.ESC,
    }, false) 
    keys.nextPage.on('down',()=>{
    if(this.dialogueBox.isTyping){
        this.dialogueBox.stop(true);
    }
    else if(this.dialogueBox.isLastPage){
        this.closeDialogue()}   
    else{
        this.dialogueBox.typeNextPage()}
    })  
    keys.skip.on('down',()=>{
        this.dialogueBox.stop(true)
        this.closeDialogue()
    }) 
}
showDialogue(message){
    this.dialogueBox.setVisible(true);
    this.dialogueBox.start(message,50)
}
closeDialogue(){
    this.dialogueBox.setVisible(false);
    this.sceneGame.scene.resume();
}
}