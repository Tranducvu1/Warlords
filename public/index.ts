import * as pc from 'playcanvas';

// Import necessary modules for different game components
import { createZombieEntity } from './zombie/ZombieController';
import { createCamera } from './Scene/Camera';
import { createLight } from './Scene/Light';
import { createGround } from './Scene/Ground';
import { createMap, updateMap } from './Scene/map';
import { loadAssets } from './Utils/loadAssets';
import { createCharacterEntity } from './player/EntityFactory';
import { createplayerstateMachine } from './player/playerstateMachine';
import { initializeCrosshairEntity } from './player/crosshair';
import { createMovementHandler } from './player/CharacterMovement';

import { handleZombieStates } from './zombie/handleZombieStates';


// Set configuration for Wasm module with fallback options
pc.WasmModule.setConfig("Ammo", {
    fallbackUrl: "./Utils/ammo.js",
    glueUrl: "./Utils/ammo.wasm.js",
    wasmUrl: "./Utils/ammo.wasm.wasm",
});

// Main function to initialize the game, triggered on window load
window.onload = async () => {
    // Wait for Wasm module to be ready before starting game initialization
    await new Promise((resolve) => {
        pc.WasmModule.getInstance("Ammo", resolve);
    });

    // Get canvas element for rendering the game
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas) {
        // Initialize the PlayCanvas application with input devices
        const app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
            keyboard: new pc.Keyboard(window)
        });

        // Load game assets asynchronously
        const assets = await loadAssets(app);
        const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);

        // Load assets and initialize game entities once loading is complete
        assetListLoader.load(async () => {
            // Set up main game components: camera, map, lighting, and ground
            const cameraEntity = createCamera(app);
            let entities = createMap(app);
            createLight(app);
            createGround(app);

            // Initialize the character, zombies, crosshair, and player state machine
            const zombieEntity = createZombieEntity(app, assets, -20, -0.3, -10);
            const characterEntity = createCharacterEntity(app, assets, cameraEntity);
            const crosshairEntity = initializeCrosshairEntity(app, assets);
            const playerStateMachine = createplayerstateMachine(characterEntity, assets);

            // Ensure keyboard is available for movement handling
            if (!app.keyboard) {
                throw new Error("Keyboard not initialized");
            }

            // Set up character movement handler with update and cleanup functions
            const { update: movementUpdate, cleanup: movementCleanup } = createMovementHandler(
                app,
                cameraEntity,
                characterEntity,
                app.keyboard,
                assets,
                crosshairEntity,
                playerStateMachine
            );

            // Main update loop: update map and character movement each frame
            app.on("update", (dt) => {
                
                updateMap(app, dt, entities);
                movementUpdate(dt);
                handleZombieStates(assets, characterEntity,zombieEntity);
                handleZombieStates(assets, characterEntity,zombieEntity);
            });
        });

        // Set up game physics, gravity, canvas behavior, and lighting
        app.systems.rigidbody?.gravity.set(0, -9.81, 0);
        app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        app.setCanvasResolution(pc.RESOLUTION_AUTO);
        app.scene.ambientLight = new pc.Color(0.5, 0.5, 0.5);
    }
};
