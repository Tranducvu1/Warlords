import * as pc from 'playcanvas';
import { createPlayer } from './player/Player';
import { createZombie } from './zombie/zombie';
import { createMap } from './Map/map';

declare module 'playcanvas' {
    interface Entity {
        health?: number;
    }
}

window.onload = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    if (canvas) {
        const app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
            keyboard: new pc.Keyboard(window)
        });

        app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        app.setCanvasResolution(pc.RESOLUTION_AUTO);
        app.start();

        // Set up scene
        app.scene.ambientLight = new pc.Color(0.5, 0.5, 0.5);

        // Create camera
        const cameraEntity = new pc.Entity('camera');
        cameraEntity.addComponent("camera", {
            clearColor: new pc.Color(0.7, 0.8, 0.9)
        });
        app.root.addChild(cameraEntity);

        // Create light
        const lightEntity = new pc.Entity('light');
        lightEntity.addComponent("light", {
            type: "directional",
            color: new pc.Color(1, 1, 1),
            intensity: 2
        });
        lightEntity.setLocalEulerAngles(45, 0, 0);
        app.root.addChild(lightEntity);

        // Create ground
        const ground = new pc.Entity('ground');
        ground.addComponent("render", {
            type: "box"
        });
        ground.setLocalScale(20, 0.5, 20);
        ground.setPosition(0, -0.25, 0);
        app.root.addChild(ground);

        // Load character model and animations
        const assets = {
            man: new pc.Asset('model_man', 'model', { url: '../model/idle.glb' }),
            idle: new pc.Asset('animation_idle', 'animation', { url: '../model/idle.glb' }),
            zombie: new pc.Asset('zombie', 'model', { url: '../model/zombie.glb' }),
            zombieIdle: new pc.Asset('animation_zombieidle', 'animation', { url: '../animation/zombieidle.glb' }),
            zombierunning: new pc.Asset('animation_zombierunning', 'animation', { url: '../animation/zombierunning.glb' }),
            running: new pc.Asset('animation_running', 'animation', { url: '../animation/running.glb' }),
            shooting: new pc.Asset('animation_shooting', 'animation', { url: '../animation/shooting.glb' }),
            rifleaim: new pc.Asset('animation_rifle', 'animation', { url: '../animation/rifleaim.glb' }),
            riflewalk: new pc.Asset('animation_rifle', 'animation', { url: '../animation/rifle walk.glb' }),
            muzzle_flash: new pc.Asset('muzzle_flash', 'animation', { url: '../animation/muzzle_flash.glb' }),
            weapon: new pc.Asset('model_ak', 'model', { url: '../model/ak.glb' }),
            crosshair: new pc.Asset('aim', 'model', { url: '../model/crosshair.png' }),
            map: new pc.Asset('map', 'model', { url: '../model/map.glb' })
        };

        const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);
        assetListLoader.load(() => {
            createMap(app, assets); 
            createZombie(app, assets);
            createPlayer(app, assets, cameraEntity); 

            
        });
    }
};
