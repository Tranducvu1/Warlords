import * as pc from 'playcanvas';

import { stateMachine } from '../Utils/StateMachine';
import { EnemyEntity } from './EnemyEntity';

/**
 * Creates a zombie entity with specific properties and animations in the game scene.
 * 
 * @param app - The PlayCanvas application instance.
 * @param assets - The assets required for the zombie, including models and animations.
 * @param x - The initial x-coordinate position for the zombie.
 * @param y - The initial y-coordinate position for the zombie.
 * @param z - The initial z-coordinate position for the zombie.
 * @returns The configured zombie entity added to the scene.
 */
export function createZombieEntity(app, assets, x, y, z) {
    const zombieEntity = new EnemyEntity('Zombie', 100); // Instantiate the zombie entity with a name and health.

    // Tag the entity as an enemy for easier identification and management in the game.
    zombieEntity.tags.add('enemy');

    // Add a model component to the zombie entity, assigning it the zombie asset model.
    zombieEntity.addComponent("model", {
        type: "asset",
        asset: assets.zombie
    });

    // Attach multiple animations to the zombie for different actions (idle, running, attacking, death).
    zombieEntity.addComponent("animation", {
        assets: [assets.zombieIdle, assets.zombierunning, assets.zombieattack, assets.zombiedeath],
    });

    // Set up the rigidbody component to make the zombie interact physically within the game world.
    zombieEntity.addComponent("rigidbody", {
        type: 'dynamic', // Dynamic type allows movement within physics.
        mass: 80,
        linearDamping: 0.9,
        angularDamping: 0.9,
        linearFactor: new pc.Vec3(1, 0, 1), // Lock Y-axis to prevent the zombie from falling.
        angularFactor: new pc.Vec3(0, 1, 0) // Allow rotation only around the Y-axis.
    });

    // Add a collision component to define the zombie's hitbox using a capsule shape.
    zombieEntity.addComponent("collision", {
        type: 'capsule',
        radius: 0.5,
        height: 1.6
    });

    // Set the initial position of the zombie entity in the 3D scene.
    zombieEntity.setLocalPosition(x, y, z);

    // Add the zombie entity to the scene graph.
    app.root.addChild(zombieEntity);

    return zombieEntity; // Return the created zombie entity for additional customization if needed.
}
