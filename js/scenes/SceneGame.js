import { CST } from "../CST.js";
import { Character } from "../characters/Character.js";
import { Player } from "../characters/Player.js";
import {Npc} from '../characters/Npc.js'
import {Enemy01} from '../characters/Enemy01.js'
import {Enemy02} from '../characters/Enemy02.js'
import {Enemy03} from '../characters/Enemy03.js'
import {Heart} from '../items/Heart.js'
import { Diamond } from "../items/Diamond.js";
import { SceneGameUI } from "./SceneGameUI.js";

export class SceneGame extends Phaser.Scene
{
    // Characters
    player = null;

    // Level data
    currentLevel = 0;

    currentMap = null;

    /** All npcs */
    npcs = null;

    ships = null;

    sceneGameUI = null;

    items = null;

    diamondPoints = 0;

    cinematicOn = false;

    constructor()
    {
        super({key: CST.SCENES.GAME});
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    init(data)
    {
        this.currentLevel = data && data.level ? data.level : 1;
    }

    // Preload
    ////////////////////////////////////////////////////////////////////////

    preload()
    {
        this.preloadMap();
    }

    preloadMap()
    {
        this.load.setPath("./assets/maps");

        const levelName = "level" + this.currentLevel.toString();
        this.load.tilemapTiledJSON(levelName, "./" + levelName + ".json");
    }

    // Create
    ////////////////////////////////////////////////////////////////////////

    create()
    {       
        this.cinematicOn = false;
        this.createLevel();
        this.startShipAnim()
        
    }

    createLevel()
    {
        this.createBackground();
        this.createMap();
        this.createItems();
        this.createPlayer();
        this.createNpcs();
        this.createCameras();
        this.createInteractions();
        this.createUI();
    }
    createBackground(){
        const bg1 = this.add.image(0,0,'bg1');
        bg1.setOrigin(0);
        bg1.setScale(3);
        bg1.setScrollFactor(0);
        this.bg2 = this.add.tileSprite(0,0,CST.GAME.WIDTH,CST.GAME.HEIGHT,'bg2');
        this.bg2.setTileScale(3);
        this.bg2.setOrigin(0);
        this.bg2.setScrollFactor(0);
        this.bg3 = this.add.tileSprite(0,0,CST.GAME.WIDTH,CST.GAME.HEIGHT,'bg3');
        this.bg3.setTileScale(3);
        this.bg3.setOrigin(0);
        this.bg3.setScrollFactor(0);
    }
    createMap()
    {
        this.currentMap = this.add.tilemap("level" + this.currentLevel.toString());
        const tilesetImage = this.currentMap.addTilesetImage("levelAssets", "levelAssets");
       
        this.currentMap.createLayer("Background1", [tilesetImage], 0, 0);
        this.currentMap.createLayer("Background2", [tilesetImage], 0, 0);
       
        this.platforms = this.currentMap.createLayer("Platforms", [tilesetImage], 0, 0);
        const platformsBounds = this.platforms.getBounds();
        this.physics.world.setBounds(0, 0, platformsBounds.width, platformsBounds.height);

        this.currentMap.createLayer("Foreground1", [tilesetImage], 0, 0);
        this.currentMap.createLayer("Foreground2", [tilesetImage], 0, 0).setDepth(2);
    }

    createItems(){
        this.items = this.physics.add.group();
        //@ts-ignore - Problem with Phaser’s types. classType supports classes
        const hearts = this.currentMap.createFromObjects("Items", {name: "heart", classType:Heart});
        const diamondSmall = this.currentMap.createFromObjects("Items", {name: "diamondSmall", classType:Diamond});
        const diamondBig = this.currentMap.createFromObjects("Items", {name: "diamondBig", classType:Diamond});
        hearts.map((heart) => {
            this.items.add(heart);
            heart.init("heart");
            heart.setScale(1);
            heart.body.setSize(13,13);
        });
        diamondSmall.map((diamond)=> {
            this.items.add(diamond);
            diamond.init("diamondSmall");
            diamond.setScale(1);
            diamond.body.setSize(8,7)
            diamond.value = 1
        });

        diamondBig.map((diamond)=> {
            this.items.add(diamond);
            diamond.init("diamondBig");
            diamond.setScale(1);
            diamond.body.setSize(16,14)
            diamond.value = 5;
        });
        this.diamondPoints = 0;


    }

    createPlayer()
    {
        // @ts-ignore - Problem with Phaser’s types. classType supports classes
        const playerSpawns = this.currentMap.createFromObjects("Player", {name: "Player", classType: Player});

        this.player = playerSpawns[0];

        this.player.init("player");
        this.player.setScale(1);
        this.player.body.setSize(20,32)

        this.player.on("die", () => this.time.delayedCall(3000, ()=> {this.scene.restart()}, null, this),this);
        // this.player.on("die", () => {this.time.delayedCall(2000, () => {this.scene.restart();}, null, this);}, this);
        
        this.ships = this.physics.add.group();

        const ships = this.currentMap.createFromObjects("Player", {name: "Ship", classType: Phaser.Physics.Arcade.Image});
        ships.map((ship) => {
            this.ships.add(ship);
            ship.setTexture('ship2');
            ship.body.allowGravity = false;
            ship.setScale(1);
        });
    }

    createNpcs()
    {
        this.npcs = this.physics.add.group();

        //@ts-ignore - Problem with Phaser’s types. classType supports classes
        const npc1 = this.currentMap.createFromObjects("Npcs", {name: "Npc1", classType:Enemy01});
        const npc2 = this.currentMap.createFromObjects("Npcs", {name: "Npc2", classType:Enemy02});
        const npc3 = this.currentMap.createFromObjects("Npcs", {name: "Npc3", classType:Enemy03});

        npc1.map((npc) => {
            this.npcs.add(npc);
            npc.init("enemy01");
            npc.setScale(1);
            npc.body.setSize(26,26);
        });
        npc2.map((npc) => {
            this.npcs.add(npc);
            npc.init("enemy02");
            npc.setScale(1);
            npc.body.setSize(24,24)
            
        });
        npc3.map((npc) => {
            this.npcs.add(npc);
            npc.init("enemy03");
            npc.setScale(1);
            npc.body.setSize(24,34)
        });
    }

    createCameras()
    {
        this.cameras.main.setBounds(this.physics.world.bounds.x, this.physics.world.bounds.y, this.physics.world.bounds.width, this.physics.world.bounds.height);
        
        this.cameras.main.zoomTo(CST.GAME.ZOOM, 0.0);
        this.cameras.main.startFollow(this.player);
    }

    createInteractions()
    {
        this.platforms.setCollisionByProperty({collides: true});

        // Player collides with platforms - no test or action on collision
        this.physics.add.collider(this.player, this.platforms);

        // Npcs collides with platforms if canNpcCollidePlatforms return true
        this.physics.add.collider(this.npcs, this.platforms);

        this.physics.add.overlap(this.player.Meleehitbox, this.npcs, this.onPlayerAttackNpc,this.canPlayerAttackNpc)
        // Player overlap npc only if the player is on the left of the npc. console.log on overlap
        this.physics.add.overlap(this.player, this.npcs, this.onPlayerOverlapNpc, this.canPlayerOverlapNpc, this);

        this.physics.add.overlap(this.player, this.items, this.onPlayerOverlapItems, this.canPlayerOverlapItems, this);

        this.npcs.getChildren().forEach((npc)=>{this.physics.add.overlap(this.player, npc.Meleehitbox, this.onNpcAttackPlayer,this.canNpcAttackPlayer)})
        
        this.physics.add.overlap(this.player, this.ships, this.onPlayerOverlapShip, this.canPlayerOverlapShip, this);

    }
    onPlayerAttackNpc(meleehitbox,npc){
        npc.hurt(npc.body.touching.left,50);
    }
    canPlayerAttackNpc(meleehitbox,npc){
        return !meleehitbox.character.isDead() &&  !npc.isDead() && !npc.isRecovering;
    }
    onNpcAttackPlayer(player,meleehitbox){
        player.hurt(player.body.touching.left,150);

    }
    canNpcAttackPlayer(player,meleehitbox){
        return !player.isDead() && !meleehitbox.character.isDead() && !player.isRecovering;

    }
    onPlayerOverlapNpc(player, npc)
    {
        player.hurt(player.body.touching.left,150);
    }

    canPlayerOverlapNpc(player, npc)
    {
        return !player.isDead() &&  !npc.isDead() && !player.isRecovering;
    }
    onPlayerOverlapItems(player,item){
       item.onTouch(player);
    }
    canPlayerOverlapItems(player,item){
        return !player.isDead()
    }
    onPlayerOverlapShip(player,ship){
        player.disableBody(true,false)
        this.time.delayedCall(1000,()=>{
            this.tweens.add({targets:ship,y:-100,duration:4000,delay:1000,onComplete:()=>this.events.emit('levelClear'),onCompleteScope:this}),
            player.setVisible(false)})
        

    }
    canPlayerOverlapShip(player,ship){
        return !player.isDead()
    }
    createUI(){
       this.sceneGameUI = this.scene.add(CST.SCENES.GAME_UI,SceneGameUI,true,{sceneGame:this});
    }
    showDialogue(message){
       this.sceneGameUI.showDialogue(message)
       this.scene.pause()
    }
    startShipAnim(){
            this.cinematicOn = true;
            this.player.setVisible(false)
            const ship = this.add.image(this.player.x + 500, this.player.y - 500, "ship1");
            // ship.setRotation(Math.atan2(ship.y-this.player.y,ship.x-this.player.x)-Math.PI/4-Math.PI/2)
            ship.setAngle(180)
            this.tweens.add({
                    targets: ship,
                    x: this.player.x,
                    y: this.player.y,
                    duration: 6000,
                    onComplete:()=>{
                    ship.destroy();
                    this.cameras.main.shake(400, 0.002, false);
                    const explosion = this.add.image(this.player.x, this.player.y, "explosion").setScale(1);
                    this.time.delayedCall(1500, () => {
                    explosion.destroy();
                    this.player.setVisible(true);
                    this.player.anims.play('Run')
                    this.player.walkOnRight(60)
                    this.time.delayedCall(1500, () => {
                        this.player.anims.play("Idle")
                        this.player.stopWalking()
                        this.showDialogue(
                            'Unfortunately, your spaceship crashed,and you landed on an unknown planet. \n you have to find the back-up spaceship now, try to stay alive! \n press "WASD" in the kayboard to move, "K" to attack and "space" to jump \n "heart" on the top left indicates your health status,and try collect more "diamond" \n good luck and hope you find your way home soon!')
                        this.cinematicOn = false
                    })
                    });
                    },
                    onCompleteScope:this
                    })
    }
    // Update
    ////////////////////////////////////////////////////////////////////////

    update(time, delta)
    {
        super.update(time, delta);
        
        if (this.player)
        {
            if(!this.cinematicOn){
                this.player.update();
            }
            this.bg2.tilePositionX = this.player.x *0.2;
            this.bg3.tilePositionX = this.player.x *0.2;
        }
        if (this.npcs)
       {
        this.npcs.getChildren().forEach((npc) => { npc.update(); }, this);
       }
    }
}