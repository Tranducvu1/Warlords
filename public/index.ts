import * as pc from 'playcanvas';

// Import necessary modules for different game components
import { createZombieEntity } from './zombie/createZombieEntity';
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
import { setupRaycasting } from './player/RaycastingSystem';
import { addBackgroundMusic } from './music/backgroundMusic';

// Set configuration for Wasm module
pc.WasmModule.setConfig("Ammo", {
    fallbackUrl: "./Utils/ammo.js",
    glueUrl: "./Utils/ammo.wasm.js",
    wasmUrl: "./Utils/ammo.wasm.wasm",
});

// Main initialization function
window.onload = async () => {
    // Load the Ammo Wasm module
    await new Promise((resolve) => {
        pc.WasmModule.getInstance("Ammo", resolve);
    });

    // Get the canvas element for rendering
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas) {
        // Create a new application
        const app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
            keyboard: new pc.Keyboard(window)
        });

        // Load game assets
        const assets = await loadAssets(app);
        const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);

        assetListLoader.load(async () => {
            // Initialize game components
            const cameraEntity = createCamera(app);
            let entities = createMap(app);
            createLight(app);
            createGround(app);

            // Create game entities
            const zombieEntity = createZombieEntity(app, assets, 15, 0.5, 0);
            const characterEntity = createCharacterEntity(app, assets, cameraEntity);
            const crosshairEntity = initializeCrosshairEntity(app, assets);
            const playerStateMachine = createplayerstateMachine(characterEntity, assets);

            // Ensure keyboard input is initialized
            if (!app.keyboard) {
                throw new Error("Keyboard not initialized");
            }

            // Set up movement handler
            const { update: movementUpdate, cleanup: movementCleanup } = createMovementHandler(
                app,
                cameraEntity,
                characterEntity,
                app.keyboard,
                assets,
                crosshairEntity,
                playerStateMachine
            );

            // Add background music
            addBackgroundMusic(app);
            setupRaycasting(app, playerStateMachine, cameraEntity, crosshairEntity, assets);

            // Main update loop
            app.on("update", (dt) => {
                updateMap(app, dt, entities);
                movementUpdate(dt);
                handleZombieStates(assets, characterEntity, zombieEntity);
            });
        });

        // Configure physics and rendering settings
        app.systems.rigidbody?.gravity.set(0, -9.81, 0); // Set gravity
        app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW); // Set fill mode
        app.setCanvasResolution(pc.RESOLUTION_AUTO); // Set resolution
        app.scene.ambientLight = new pc.Color(0.5, 0.5, 0.5); // Set ambient light
    }
};
