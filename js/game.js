import { ScenePreloadAssets } from "./Scenes/ScenePreloadAssets.js";
import { CST } from './CST.js';

new Phaser.Game({
    type: Phaser.AUTO,
    width: CST.GAME.WIDTH,
    height: CST.GAME.HEIGHT,
    backgroundColor: CST.STYLE.COLOR.GAME_BACKGROUND,
    scale: {
        parent: document.body,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    dom: { createContainer: true },
    scene: [ScenePreloadAssets],
    render: { pixelArt: false },
    physics: { 
        default: "arcade",
        arcade: {
            gravity: { y: CST.PHYSIC.GRAVITY },
            debug: false
        }
    
    }
});