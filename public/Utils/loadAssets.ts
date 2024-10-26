// Assets.ts
import * as pc from 'playcanvas';

/**
 * Loads and registers a collection of assets for the PlayCanvas application.
 * 
 * @param {pc.Application} app - The PlayCanvas application instance.
 * @returns {Record<string, pc.Asset>} - An object containing references to each loaded asset.
 */
export function loadAssets(app: pc.Application): Record<string, pc.Asset> {
    // Define assets for the game. Keys correspond to asset names, making retrieval easier.
    const assets = {
        man: new pc.Asset('model_man', 'model', { url: '../model/idle.glb' }), // Player model in idle stance
        idle: new pc.Asset('animation_idle', 'animation', { url: '../model/idle.glb' }), // Idle animation
        zombie: new pc.Asset('zombie', 'model', { url: '../model/zombie.glb' }), // Zombie model
        zombieIdle: new pc.Asset('animation_zombieidle', 'animation', { url: '../animation/zombieidle.glb' }), // Zombie idle animation
        zombierunning: new pc.Asset('animation_zombierunning', 'animation', { url: '../animation/zombierunning.glb' }), // Zombie running animation
        zombiedeath: new pc.Asset('animation_zombiedeath', 'animation', { url: '../animation/zombiedeath.glb' }), // Zombie death animation
        zombieattack: new pc.Asset('animation_zombieattack', 'animation', { url: '../animation/zombieattack.glb' }), // Zombie attack animation
        running: new pc.Asset('animation_running', 'animation', { url: '../animation/running.glb' }), // Running animation for player
        shooting: new pc.Asset('animation_shooting', 'animation', { url: '../animation/shooting.glb' }), // Shooting animation for player
        rifleaim: new pc.Asset('animation_rifle', 'animation', { url: '../animation/rifleaim.glb' }), // Rifle aim animation
        riflewalk: new pc.Asset('animation_riflewalk', 'animation', { url: '../animation/rifle walk.glb' }), // Walking with rifle animation
        runningshooting: new pc.Asset('animation_runningshooting', 'animation', { url: '../animation/runningshooting.glb' }), // Running and shooting animation
        muzzle_flash: new pc.Asset('muzzle_flash', 'animation', { url: '../animation/muzzle_flash.glb' }), // Muzzle flash effect
        weapon: new pc.Asset('model_ak', 'model', { url: '../model/ak.glb' }), // Rifle weapon model
        crosshair: new pc.Asset('aim', 'model', { url: '../model/crosshair.glb' }), // Crosshair model for aiming
        map: new pc.Asset('map', 'model', { url: '../model/map.glb' }) // Environment map model
    };

    // AssetListLoader manages batch loading, helping optimize loading and handling dependency-related issues.
    const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);

    // Initiate the asset loading process and log a success message once loading completes.
    assetListLoader.load(() => {
        console.log("Assets loaded successfully."); // Helpful for debugging loading issues
    });

    // Return loaded assets as a dictionary for easy access by key.
    return assets;
}
