import * as pc from 'playcanvas';
import { handleWeapon } from '../Weapon/Weapon';
import { createWeapon } from '../Weapon/createWeapon';
import { createplayerstateMachine } from './playerstateMachine';
import { initializeCrosshairEntity } from './crosshair';

/**
 * Creates a character entity and sets up its properties and camera.
 * 
 * @param {pc.Application} app - The PlayCanvas application instance.
 * @param {Object} assets - The assets used for the character.
 * @param {pc.Entity} cameraEntity - The camera entity to position and orient.
 * @returns {pc.Entity} The created character entity.
 */
export function createCharacterEntity(app, assets, cameraEntity) {
    // Create a new entity for the character
    const characterEntity = new pc.Entity("character");

    // Initialize the crosshair entity for aiming
    const crosshairEntity = initializeCrosshairEntity(app, assets);

    // Add tags to the character entity for identification
    characterEntity.tags.add('player');

    // Add an animation component to the character with various states
    characterEntity.addComponent("animation", {
        assets: [assets.idle, assets.running, assets.shooting, assets.rifleaim, assets.runningshooting],
    });

    // Get the character's forward, right, and up directions
    const characterForward = characterEntity.forward;
    const characterRight = characterEntity.right;
    const characterUp = characterEntity.up;

    // Set the distance for the crosshair from the character
    const crosshairDistance = -2;

    // Calculate the offsets for positioning the crosshair relative to the character
    const forwardOffset = new pc.Vec3().copy(characterForward).mulScalar(crosshairDistance);
    const sideOffset = new pc.Vec3().copy(characterRight).mulScalar(-0.5);
    const upOffset = new pc.Vec3().copy(characterUp).mulScalar(1.5);

    // Calculate the final position for the crosshair entity
    const crosshairPosition = new pc.Vec3()
        .add2(characterEntity.getPosition(), forwardOffset)
        .add(sideOffset)
        .add(upOffset);

    // Set the calculated position for the crosshair entity
    crosshairEntity.setPosition(crosshairPosition);

    // Make the crosshair face the camera
    crosshairEntity.lookAt(cameraEntity.getPosition());
    crosshairEntity.rotateLocal(90, 0, 90); // Rotate to align with camera view

    // Add a model component to the character if it doesn't already have one
    if (!characterEntity.model) {
        characterEntity.addComponent("model", {
            type: "asset",
            asset: assets.man // Set the model asset for the character
        });
    }

    // Set the initial orientation and position of the character
    characterEntity.setLocalEulerAngles(0, 0, 0); // Face forward
    characterEntity.setLocalPosition(15, 0, -20); // Initial position in the scene

    // Add physics components for character dynamics
    characterEntity.addComponent("rigidbody", {
        type: 'dynamic', // The character is affected by physics
        mass: 80, // Set the mass of the character
        linearDamping: 0.9, // Damping to reduce linear motion
        angularDamping: 0.9, // Damping to reduce angular motion
        linearFactor: new pc.Vec3(1, 1, 1), // Allow movement on all axes
        angularFactor: new pc.Vec3(0, 1, 0) // Restrict rotation around the x and z axes
    });

    // Create the player state machine for managing states like idle, running, etc.
    createplayerstateMachine(characterEntity, assets);

    // Add a collision component to define the physical shape of the character
    characterEntity.addComponent("collision", {
        type: 'capsule', // Use a capsule shape for collisions
        radius: 0.5, // Set the radius of the capsule
        height: 1, // Set the height of the capsule
    });

    // Add the character entity to the application's root for rendering
    app.root.addChild(characterEntity);

    // Initialize the weapon handling for the character
    handleWeapon(characterEntity, assets, app);

    // Return the created character entity for further use
    return characterEntity;
}
