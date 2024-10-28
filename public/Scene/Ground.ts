import * as pc from 'playcanvas';

/**
 * Creates a ground entity for the PlayCanvas application.
 * 
 * @param {pc.Application} app - The PlayCanvas application instance.
 */
export function createGround(app: pc.Application): void {
    // Create a new entity named 'ground'
    const ground = new pc.Entity('ground');

    // Add a model component to the ground entity with a box shape
    ground.addComponent("model", {
        type: "box" // The ground is represented as a box
    });

    // Scale the ground entity to make it large and flat
    ground.setLocalScale(500, 0.1, 500); // Scale: 200 units wide, 0.1 units high, 200 units deep
    ground.setLocalPosition(0, 0, 0); // Position it at the origin

    // Add a collision component to the ground entity for physics interactions
    ground.addComponent("collision", {
        type: "box",
        halfExtents: new pc.Vec3(100, 0.05, 100) // Half the scale to define the collision bounds
    });

    // Add a rigidbody component to the ground entity to enable physics
    ground.addComponent("rigidbody", {
        type: "static", // Static means it won't move
        friction: 0.5, // Friction for interaction with other entities
        restitution: 0.1 // Bounciness when colliding with other objects
    });

    // Add the ground entity to the application's root entity for it to be part of the scene
    app.root.addChild(ground);
}


