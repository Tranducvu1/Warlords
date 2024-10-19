// Assets.ts
import * as pc from 'playcanvas';

export function loadAssets(app: pc.Application): Record<string, pc.Asset> {
    const assets = {
        man: new pc.Asset('model_man', 'model', { url: '../model/idle.glb' }),
        idle: new pc.Asset('animation_idle', 'animation', { url: '../model/idle.glb' }),
        zombie: new pc.Asset('zombie', 'model', { url: '../model/zombie.glb' }),
        zombieIdle: new pc.Asset('animation_zombieidle', 'animation', { url: '../animation/zombieidle.glb' }),
        zombierunning: new pc.Asset('animation_zombierunning', 'animation', { url: '../animation/zombierunning.glb' }),
        running: new pc.Asset('animation_running', 'animation', { url: '../animation/running.glb' }),
        shooting: new pc.Asset('animation_shooting', 'animation', { url: '../animation/shooting.glb' }),
        rifleaim: new pc.Asset('animation_rifle', 'animation', { url: '../animation/rifleaim.glb' }),
        riflewalk: new pc.Asset('animation_riflewalk', 'animation', { url: '../animation/rifle walk.glb' }),
        muzzle_flash: new pc.Asset('muzzle_flash', 'animation', { url: '../animation/muzzle_flash.glb' }),
        zombiedeath: new pc.Asset('muzzle_flash', 'animation', { url: '../animation/zombideath.glb' }),
        zombieattack: new pc.Asset('muzzle_flash', 'animation', { url: '../animation/zombieattack.glb' }),
        weapon: new pc.Asset('model_ak', 'model', { url: '../model/ak.glb' }),
        crosshair: new pc.Asset('aim', 'model', { url: '../model/crosshair.glb' }),
        map: new pc.Asset('map', 'model', { url: '../model/map.glb' })
    };

    const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);
    assetListLoader.load(() => {
        console.log("Assets loaded successfully.");
    });

    return assets;
}
