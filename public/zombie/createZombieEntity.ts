import * as pc from 'playcanvas';
import { EnemyEntity } from './EnemyEntity';

// zombieEntity.ts
export function createZombieEntity(app: pc.Application, assets: any, x: number, y: number, z: number) {
    // Initialize the zombie as an EnemyEntity with a health of 100
    const zombieEntity = new EnemyEntity('Zombie', 100, app, assets);
    
    // Add enemy tag for easy identification in the game
    zombieEntity.tags.add('enemy');
    
    // Add a model component to the zombie entity
    zombieEntity.addComponent("model", {
        type: "asset",
        asset: assets.zombie, // Reference to the zombie model asset
        castShadows: true     // Enable shadow casting for the zombie
    });
    
    // Add animation component with improved settings
    zombieEntity.addComponent("animation", {
        assets: [
            assets.zombieIdle,    // Idle animation
            assets.zombierunning, // Running animation
            assets.zombieattack,  // Attack animation
            assets.zombiedeath    // Death animation
        ],
        speed: 1,                 // Set default animation speed
        loop: true,               // Enable looping for animations
        activate: true            // Activate the animation on load
    });
    
    // Configure rigidbody with optimized settings for smoother movement
    zombieEntity.addComponent("rigidbody", {
        type: 'dynamic',           // Make the entity dynamic for physics interactions
        mass: 80,                  // Set mass for realistic physics response
        linearDamping: 0.95,       // Adjusted for smooth stop of movement
        angularDamping: 0.95,      // Adjusted for smooth stop of rotation
        linearFactor: new pc.Vec3(1, 0, 1), // Restrict movement on y-axis
        angularFactor: new pc.Vec3(0, 1, 0), // Restrict rotation to y-axis
        friction: 0.8,             // Set friction level for better surface grip
        restitution: 0.2           // Low bounciness on collisions
    });
    
    // Configure capsule collision component for better character fit
    zombieEntity.addComponent("collision", {
        type: 'capsule',           // Use capsule shape for better character-like collision
        radius: 0.5,               // Radius of the capsule
        height: 1.8,               // Height for realistic zombie body coverage
        axis: 1                    // Align capsule on the y-axis
    });
    
    // Set initial position and rotation of the zombie
    zombieEntity.setLocalPosition(x, y, z);
    zombieEntity.setLocalEulerAngles(0, -90, 0); // Rotate to face the desired direction
    
    // Add the zombie to the root of the app scene
    app.root.addChild(zombieEntity);
    
    return zombieEntity;
}
