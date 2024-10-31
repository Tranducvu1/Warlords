import * as pc from 'playcanvas';
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


// import { setupRaycasting } from './player/RaycastingSystem';

// Set configuration for Wasm module
pc.WasmModule.setConfig("Ammo", {
    fallbackUrl: "./Utils/ammo.js",
    glueUrl: "./Utils/ammo.wasm.js",
    wasmUrl: "./Utils/ammo.wasm.wasm",
});

// Function to generate a random position within a specified range
function getRandomPosition(range) {
    return Math.random() * range - range / 2; // Returns a random position within the specified range
}

// Function to check if a position is at least `minDistance` away from all existing positions
// function isPositionFarEnough(position, existingPositions, minDistance) {
//     return existingPositions.every((pos) => {
//         const dx = position.x - pos.x;
//         const dz = position.z - pos.z;
//         return Math.sqrt(dx * dx + dz * dz) >= minDistance;
//     });
// }
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

            // for (let i = 0; i < zombieCount; i++) { n
            //     let position;
            //     do {
            //         position = {
            //             x: getRandomPosition(spawnRange),
            //             y: 0.5,
            //             z: getRandomPosition(spawnRange),
            //         };
            //     } while (!isPositionFarEnough(position, zombies.map(z => ({ x: z.getPosition().x, z: z.getPosition().z })), minDistance));
            //     const zombieEntity = createZombieEntity(app, assets, position.x, position.y, position.z);
            //     zombies.push(zombieEntity);
            // } O(n) complexity for checking distance between all zombies and new position is not efficient
            // Create zombie entities at random positions within a specified range O(n) complexity   
            const zombieEntity1 = createZombieEntity(app, assets, 0, 0.1, 15);
            const zombieEntity2 =   createZombieEntity(app, assets, 15, 0.1, 30);
            const zombieEntity3 = createZombieEntity(app, assets, 0, 0.1, 0);
            const zombieEntity4 =createZombieEntity(app, assets, 30, 0.1, -25);
            const zombieEntity5 = createZombieEntity(app, assets, 30, 0.1, -45);
            // Create other game entities
            
              
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

          //  setupRaycasting(app, playerStateMachine, cameraEntity, crosshairEntity, assets);

            // Main update loop
            app.on("update", (dt) => {
                updateMap(app, dt, entities);
                movementUpdate(dt);


                // Update zombie states
                handleZombieStates(assets, characterEntity, zombieEntity1);
                handleZombieStates(assets, characterEntity, zombieEntity2);
                handleZombieStates(assets, characterEntity, zombieEntity3);
                handleZombieStates(assets, characterEntity, zombieEntity4);
                handleZombieStates(assets, characterEntity, zombieEntity5);
               
            });
        });

        // Configure physics and rendering settings
        app.systems.rigidbody?.gravity.set(0, -9.81, 0); // Set gravity
        app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW); // Set fill mode
        app.setCanvasResolution(pc.RESOLUTION_AUTO); // Set resolution
        app.scene.ambientLight = new pc.Color(0.5, 0.5, 0.5); // Set ambient light
    }
};
