import * as pc from 'playcanvas';
import { handleWeapon } from '../Weapon/Weapon';
import { createWeapon } from '../Weapon/createWeapon';
import { createplayerstateMachine } from './playerstateMachine';
import { initializeCrosshairEntity } from './crosshair';

/**
 * Creates a character entity and sets up its properties and camera.
 * @param {pc.Application} app - The PlayCanvas application instance.
 * @param {Object} assets - The assets used for the character.
 * @param {pc.Entity} cameraEntity - The camera entity to position and orient.
 * @returns {pc.Entity} The created character entity.
 */
export function createCharacterEntity(app, assets, cameraEntity) {
    // Create a new entity for the character
    const characterEntity = new pc.Entity("character");
    const crosshairEntity = initializeCrosshairEntity(app, assets);
    // Add tags to the character entity
    characterEntity.tags.add('player');
    characterEntity.addComponent("animation", {
        assets: [assets.idle, assets.running, assets.shooting, assets.rifleaim,assets.runningshooting],
        });
    const characterForward = characterEntity.forward;
    const characterRight = characterEntity.right;
    const characterUp = characterEntity.up;
    const crosshairDistance = -2;
    const forwardOffset = new pc.Vec3().copy(characterForward).mulScalar(crosshairDistance);
    const sideOffset = new pc.Vec3().copy(characterRight).mulScalar(-0.5);
    const upOffset = new pc.Vec3().copy(characterUp).mulScalar(1.5);

    const crosshairForward = crosshairEntity.forward.clone();
    const crosshairPosition = new pc.Vec3()
        .add2(characterEntity.getPosition(), forwardOffset)
        .add(sideOffset)
        .add(upOffset);
    crosshairEntity.setPosition(crosshairPosition);
    // Make the crosshair face the camera
    crosshairEntity.lookAt(cameraEntity.getPosition());
    crosshairEntity.rotateLocal(90, 0, 90);
    // Add a model component if not already present
    if (!characterEntity.model) {
        characterEntity.addComponent("model", {
            type: "asset",
            asset: assets.man
        });
    }
    // Set the initial orientation and position of the character
    characterEntity.setLocalEulerAngles(0, 0, 0);
    characterEntity.setLocalPosition(15, 0, -20);
    // Add physics components for dynamics
    characterEntity.addComponent("rigidbody", {
        type: 'dynamic',
        mass: 80,
        linearDamping: 0.9,
        angularDamping: 0.9,
        linearFactor: new pc.Vec3(1, 1, 1),
        angularFactor: new pc.Vec3(0, 1, 0)  
    });


    createplayerstateMachine(characterEntity, assets);
    characterEntity.addComponent("collision", {
        type: 'capsule',
        radius: 0.5,
        height: 1,
    });

    // Add the character entity to the application root
    app.root.addChild(characterEntity);
   

    // Now create the weapon after the camera is set
    handleWeapon(characterEntity, assets, app);
    return characterEntity; // Return the created character entity
}
