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
        // Player model and animations
        man: new pc.Asset('model_man', 'model', { url: '../model/idle.glb' }), // Player model in idle stance
        idle: new pc.Asset('animation_idle', 'animation', { url: '../model/idle.glb' }), // Idle animation
        running: new pc.Asset('animation_running', 'animation', { url: '../animation/man/running.glb' }), // Running animation
        reloading: new pc.Asset('animation_reloading', 'animation', { url: '../animation/man/reloading.glb' }), // Reloading animation
        shooting: new pc.Asset('animation_shooting', 'animation', { url: '../animation/man/shooting.glb' }), // Shooting animation
        rifleaim: new pc.Asset('animation_rifle', 'animation', { url: '../animation/man/rifleaim.glb' }), // Rifle aim animation
        riflewalk: new pc.Asset('animation_riflewalk', 'animation', { url: '../animation/man/rifle walk.glb' }), // Walking with rifle animation
        runningshooting: new pc.Asset('animation_runningshooting', 'animation', { url: '../animation/man/runningshooting.glb' }), // Running and shooting animation
        death: new pc.Asset('animation_death', 'animation', { url: '../animation/man/death.glb' }), // Death animation
        
        weapon: new pc.Asset('model_ak', 'model', { url: '../model/ak.glb' }), // Rifle weapon model
        crosshair: new pc.Asset('aim', 'model', { url: '../model/crosshair.glb' }), // Crosshair model for aiming
    
        // Zombie model and animations
        zombie: new pc.Asset('zombie', 'model', { url: '../model/zombie.glb' }), // Zombie model
        zombieIdle: new pc.Asset('animation_zombieidle', 'animation', { url: '../animation/zombie/zombieidle.glb' }), // Zombie idle animation
        zombierunning: new pc.Asset('animation_zombierunning', 'animation', { url: '../animation/zombie/zombierunning.glb' }), // Zombie running animation
        zombiedeath: new pc.Asset('animation_zombiedeath', 'animation', { url: '../animation/zombie/zombiedeath.glb' }), // Zombie death animation
        zombieattack: new pc.Asset('animation_zombieattack', 'animation', { url: '../animation/zombie/zombieattack.glb' }), // Zombie attack animation
    
        // Environment and UI
        healthbar: new pc.Asset('healthbar', 'model', { url: '../model/heathbar/healthbar.glb' }), // Health bar model
        bullet: new pc.Asset('map', 'model', { url: '../model/bullet.glb' }), // bullet model
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
