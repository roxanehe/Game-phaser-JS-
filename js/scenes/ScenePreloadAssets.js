import { CST } from "../CST.js";
import { SceneMainMenu_UI } from "./SceneMainMenu_UI.js";

export class ScenePreloadAssets extends Phaser.Scene
{
    constructor()
    {
        super({key: CST.SCENES.PRELOAD_ASSETS});
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    init()
    {
    }

    // Preload
    ////////////////////////////////////////////////////////////////////////

    preload()
    {
        this.preloadMap();
        this.preloadCharacters();
        this.preloadItems();
        this.preloadBackground();
        this.preloadUI();
        this.preloadPluggins();
        this.preloadAudio()
    }
    preloadBackground(){
        this.load.setPath('./assets/background');
        this.load.image('bg1','background01.png');
        this.load.image('bg2','background02.png');
        this.load.image('bg3','background03.png');
        this.load.image('menubg1','menubackground1.png');
        this.load.image('menubg2','menubackground2.png');
        this.load.image('menubg3','menubackground3.png');
        this.load.image('space','spacebackground.png');

        this.load.image('dialogue','dialogueBackground.png');

    }
    preloadMap()
    {
        this.load.setPath("./assets/images");
        this.load.image("background", "background.jpg");

        this.load.setPath("./assets/maps");
        this.load.image("levelAssets", "./levelAssets_extruded.png");
    }

    preloadCharacters()
    {
        this.load.setPath("./assets/characters");
        this.load.image("ship1", "ship.png");
        this.load.image("ship2", "ship2.png");
        this.load.image("ship3", "ship3.png");
        this.load.image("explosion", "explosion.png");
        this.load.atlas('player','./player/player.png','./player/player.json')
        this.load.atlas('enemy01','./Enemy01/enemy01.png','./Enemy01/enemy01.json')
        this.load.atlas('enemy02','./Enemy02/enemy02.png','./Enemy02/enemy02.json')
        this.load.atlas('enemy03','./Enemy03/enemy03.png','./Enemy03/enemy03.json')
    }

    preloadItems()
    {
        this.load.setPath("./assets/item");
        this.load.image('heart','./heart.png')
        this.load.image('diamondSmall','./diamondSmall.png')
        this.load.image('diamondBig','./diamondBig.png')
    }
    preloadUI(){
        this.load.setPath("./assets/UI");
        this.load.image("heartEmpty", "./heartEmpty.png");
        this.load.image("heartHalf", "./heartHalf.png");
        this.load.image("heartFull", "./heartFull.png");
        this.load.image("playerBackground", "./playerBackground.png");   
    }
    preloadPluggins(){
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }
    preloadAudio() {
        this.load.setPath("./assets/audio");
        this.load.audio("loopMusic","./06 Unholy Illusions (LOOP).wav")
        this.load.audio("shipExplosion","./Boss Kill 2.wav")
        this.load.audio("enemyKill","./Enemy Kill 5.wav")
        this.load.audio("playerHit","./Character Hit 4.wav")
        this.load.audio("enemyHit","./Hit 2.wav")
        this.load.audio("jump","./Jump 1.wav")
        this.load.audio("item","./Item or Coin 1.wav")
        }
    // Create
    ////////////////////////////////////////////////////////////////////////
  
    create()
    {
        this.scene.add(CST.SCENES.MAIN_MENU, SceneMainMenu_UI, true, null);
        this.scene.remove(CST.SCENES.PRELOAD_ASSETS);
    }
}