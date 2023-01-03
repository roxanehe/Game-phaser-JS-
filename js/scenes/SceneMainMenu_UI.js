import { CST } from "../CST.js";
import { SceneGame } from "./SceneGame.js";
import { TextButton } from "../HUD/TextButton.js";

export class SceneMainMenu_UI extends Phaser.Scene
{
    constructor()
    {
        super({key: CST.SCENES.MAIN_MENU});
    }

    /** Title of the game */
    title = null;

    // Init
    ////////////////////////////////////////////////////////////////////////

    init()
    {
    }

    // Create
    ////////////////////////////////////////////////////////////////////////

    create()
    {
        this.createBackground()
        const titleStyle = { fontSize : "84px", color: CST.STYLE.COLOR.WHITE, strokeThickness : 4, stroke: "#000000", fontStyle: "bold",fontFamily:'fantasy'};
        const buttonStyle = { fontSize : "50px", color: CST.STYLE.COLOR.WHITE, strokeThickness : 4, fontStyle: "normal",fontFamily:'fantasy'};
        this.title = this.add.text(280, 100, "ROCKY WORLD SURVIVAL", titleStyle);
        const buttonLevel =  new TextButton(this, 650, 450, "START", buttonStyle);
        buttonLevel.onClicked(() => { this.launchLevel(1); }, this);
        buttonLevel.onHovered(() => { this.onButtonHovered(buttonLevel); }, this);
        buttonLevel.setDepth(1);
        this.animateMenu()
    }
    createBackground(){
        const bg1 = this.add.image(0,0,'menubg1');
        bg1.setOrigin(0);
        bg1.setScale(3);
        bg1.setScrollFactor(0);
        this.bg2 = this.add.tileSprite(0,0,CST.GAME.WIDTH,CST.GAME.HEIGHT,'menubg2');
        this.bg2.setTileScale(3);
        this.bg2.setOrigin(0);
        // this.bg2.setScrollFactor(0);
        this.bg3 = this.add.tileSprite(0,0,CST.GAME.WIDTH,CST.GAME.HEIGHT,'menubg3');
        this.bg3.setTileScale(3);
        this.bg3.setOrigin(0);
        this.bg3.setScrollFactor(0);
        this.bg3.setDepth(1);
    }
    // Update
    ////////////////////////////////////////////////////////////////////////

    update(time, delta)
    {
        super.update(time, delta);
        this.bg2.tilePositionX += delta *0.02;
        this.bg3.tilePositionX += delta *0.02;
    }

    onButtonHovered(button)
    {
    }

    launchLevel(level)
    {
        const sceneData = {level: level};
        const sceneGame = this.scene.get(CST.SCENES.GAME);

        if (sceneGame)
        {
            sceneGame.scene.setActive(true);
            sceneGame.scene.setVisible(true);
            sceneGame.scene.restart(sceneData);
        }
        else
        {
            this.scene.add(CST.SCENES.GAME, SceneGame, true, sceneData);
        }

        this.scene.remove(CST.SCENES.MAIN_MENU);
    }
    animateMenu(){
        const ship = this.add.image(0, 0, "ship1").setScale(2);
        this.tweens.add({
        targets: ship,
        x: CST.GAME.WIDTH/1.5,
        y: CST.GAME.HEIGHT,
        duration: 6000,
        delay:Math.random()*2000+1000,
        onComplete: () => { ship.destroy();this.animateMenu() },
        onCompleteScope: this
        })
    }
}